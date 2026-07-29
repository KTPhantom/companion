// Consecutive-day streak, not lifetime active days. Habit research (Lally 2010)
// shows automaticity comes from unbroken daily repetition — see
// docs/research-foundation.md #1. A day without a session breaks the streak,
// but today doesn't count against you until it's over.
export const calculateStreak = (
  sessions: any[]
) => {

  if (!sessions.length) return 0;

  const activeDays = new Set(
    sessions
      .filter((session) => session.started_at)
      .map((session) =>
        new Date(session.started_at).toDateString()
      )
  );

  const day = new Date();

  // Streak may start today or, if today has no session yet, yesterday.
  if (!activeDays.has(day.toDateString())) {
    day.setDate(day.getDate() - 1);
  }

  let streak = 0;

  while (activeDays.has(day.toDateString())) {
    streak += 1;
    day.setDate(day.getDate() - 1);
  }

  return streak;
};

// Prefer the measured focus score (interruption-based, recorded per session);
// fall back to completion rate for legacy sessions recorded without one.
export const calculateFocusScore = (
  sessions: any[]
) => {

  if (!sessions.length) return 0;

  const scored = sessions.filter(
    (s) => typeof s.focus_score === "number" && s.focus_score > 0
  );

  if (scored.length) {
    return Math.round(
      scored.reduce((acc, s) => acc + s.focus_score, 0) / scored.length
    );
  }

  const completed =
    sessions.filter(
      (s) => s.completed
    ).length;

  return Math.round(

    (completed / sessions.length) * 100
  );
};

export const getTopSubject = (
  sessions: any[]
) => {

  if (!sessions.length)
    return "No Data";

  const counts: any = {};

  sessions.forEach((session) => {

    counts[session.subject] =
      (counts[session.subject] || 0) + 1;
  });

  let topSubject = "";
  let max = 0;

  for (const subject in counts) {

    if (counts[subject] > max) {

      max = counts[subject];

      topSubject = subject;
    }
  }

  return topSubject;
};