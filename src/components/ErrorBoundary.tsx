import { Component, type ReactNode } from 'react';
import { Link } from 'react-router';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-neutral-950 text-red-400">
          <h1 className="text-3xl font-bold mb-4">⚠️ Temporal Anomaly Detected</h1>
          <p className="mb-6">Something went wrong.</p>
          <Link
            to="/"
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Return to Safety
          </Link>
        </div>
      );
    }
    return this.props.children;
  }
}
