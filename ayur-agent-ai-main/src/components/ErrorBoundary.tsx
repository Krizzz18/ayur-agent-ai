import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCcw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console for debugging
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-accent/20">
          <Card className="max-w-2xl w-full p-8 space-y-6 text-center">
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-destructive/20 blur-xl rounded-full"></div>
                <div className="relative bg-destructive/10 p-6 rounded-full">
                  <AlertTriangle className="w-16 h-16 text-destructive" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">
                Oops! Something went wrong
              </h1>
              <p className="text-muted-foreground">
                We apologize for the inconvenience. The application encountered an unexpected error.
              </p>
            </div>

            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Card className="bg-destructive/5 border-destructive/20 p-4 text-left">
                <p className="font-mono text-sm text-destructive font-semibold mb-2">
                  {this.state.error.toString()}
                </p>
                {this.state.errorInfo && (
                  <details className="mt-2">
                    <summary className="cursor-pointer text-xs text-muted-foreground hover:text-foreground">
                      View stack trace
                    </summary>
                    <pre className="mt-2 text-xs overflow-auto max-h-64 text-muted-foreground">
                      {this.state.errorInfo.componentStack}
                    </pre>
                  </details>
                )}
              </Card>
            )}

            <div className="flex gap-3 justify-center pt-4">
              <Button 
                onClick={this.handleReset}
                variant="outline"
                className="gap-2"
              >
                <RefreshCcw className="w-4 h-4" />
                Try Again
              </Button>
              <Button 
                onClick={this.handleGoHome}
                className="gap-2"
              >
                <Home className="w-4 h-4" />
                Go to Home
              </Button>
            </div>

            <p className="text-xs text-muted-foreground">
              If this problem persists, please contact support with the error details above.
            </p>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;