import React from 'react';
import SafeIcon from '../common/SafeIcon';
import * as FiIcons from 'react-icons/fi';

const { FiAlertTriangle, FiRefreshCw, FiHome } = FiIcons;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Game Error:', error, errorInfo);
    // Log error details for debugging
    console.error('Error Stack:', error.stack);
    console.error('Component Stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-ios-bg flex items-center justify-center p-6">
          <div className="bg-white p-8 rounded-2xl shadow-ios-lg text-center max-w-md w-full">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SafeIcon icon={FiAlertTriangle} className="text-2xl text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Game Error</h2>
            <p className="text-gray-600 mb-6">
              Something went wrong. Don't worry - your progress is saved!
            </p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.reload()}
                className="w-full bg-ios-blue text-white px-6 py-3 rounded-xl font-semibold hover:shadow-ios transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiRefreshCw} />
                <span>Restart Game</span>
              </button>
              <button 
                onClick={() => window.location.hash = '#/menu'}
                className="w-full bg-ios-gray5 text-gray-700 px-6 py-3 rounded-xl font-semibold hover:shadow-ios transition-all active:scale-95 flex items-center justify-center space-x-2"
              >
                <SafeIcon icon={FiHome} />
                <span>Back to Menu</span>
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;