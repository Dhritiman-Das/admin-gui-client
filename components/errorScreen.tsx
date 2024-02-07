import React from 'react';

interface ErrorScreenProps {
  errorMessage: string;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ errorMessage }) => {
  return (
    <div className="error-screen">
      <h1>Something went wrong...</h1>
      <p>{errorMessage}</p>
    </div>
  );
};

export default ErrorScreen;