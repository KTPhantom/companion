import { Component, type ReactNode } from "react";

type Props = { children: ReactNode };
type State = { error: Error | null };

/**
 * Last line of defence.
 *
 * Without this, a single render-time throw anywhere unmounts the whole app
 * and the user sees an empty page with no explanation — which is exactly
 * what a validation error used to do.
 */
export default class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, info: unknown) {
    console.error("Unhandled UI error", error, info);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div className="min-h-screen bg-[#070712] text-white flex items-center justify-center p-8">
        <div className="bg-[#0c0d1a]/80 border border-white/5 rounded-[24px] p-10 max-w-md w-full">
          <h1 className="text-xl font-bold mb-2">Something broke on this screen</h1>
          <p className="text-sm text-gray-400 leading-relaxed mb-6">
            The rest of your data is safe. Reloading usually clears it.
          </p>
          <pre className="text-[11px] text-gray-500 bg-black/30 rounded-xl p-3 mb-6 overflow-x-auto">
            {error.message}
          </pre>
          <button
            onClick={() => window.location.reload()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition"
          >
            Reload
          </button>
        </div>
      </div>
    );
  }
}
