import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can log error info here or send to a service
    console.error('ErrorBoundary caught:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      const name = this.props.componentName || 'this component';
      return <div style={{ color: 'red', padding: 16 }}>Something went wrong in {name}.<br/>{String(this.state.error)}</div>;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
