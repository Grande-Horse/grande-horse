import { Component, ErrorInfo, ReactNode } from 'react';

interface ErrorBoundaryProps {
  renderFallback: (error: Error | null) => ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    // console.error('Error caught by ErrorBoundary:', error);
    // console.error('Error info:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return this.props.renderFallback(this.state.error);
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
