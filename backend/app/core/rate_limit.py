"""In-process rate limiting.

Deliberately simple: a fixed window per key held in memory. That is enough
for a single-instance deployment and closes the open door on password
guessing and magic-link spam. Multi-instance deployments need this moved to
Redis — the interface is the same either way.
"""

import threading
import time
from collections import defaultdict

from fastapi import HTTPException, Request, status

_hits: dict[str, list[float]] = defaultdict(list)
_lock = threading.Lock()


def _client_key(request: Request, scope: str) -> str:
    client = request.client.host if request.client else "unknown"
    # Honour a proxy header when present, but never trust it blindly for
    # anything but bucketing.
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        client = forwarded.split(",")[0].strip()
    return f"{scope}:{client}"


def rate_limit(scope: str, limit: int, window_seconds: int):
    """FastAPI dependency enforcing `limit` requests per `window_seconds`."""

    def dependency(request: Request):
        key = _client_key(request, scope)
        now = time.time()
        cutoff = now - window_seconds

        with _lock:
            recent = [t for t in _hits[key] if t > cutoff]
            if len(recent) >= limit:
                retry_after = int(recent[0] + window_seconds - now) + 1
                _hits[key] = recent
                raise HTTPException(
                    status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                    detail=f"Too many attempts. Try again in {retry_after}s.",
                    headers={"Retry-After": str(retry_after)},
                )
            recent.append(now)
            _hits[key] = recent

    return dependency


def reset_rate_limits():
    """Test seam."""
    with _lock:
        _hits.clear()
