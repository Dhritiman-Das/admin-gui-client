import { AxiosError } from "axios";
import React from "react";

type CustomError = Error & {
  response?: {
    data?: {
      message?: string;
    };
  };
};

interface ErrorScreenProps {
  error: CustomError;
}

const ErrorScreen: React.FC<ErrorScreenProps> = ({ error }) => {
  console.log({ error });

  return (
    <div className="error-screen">
      <h1>Something went wrong...</h1>
      <p>
        {error?.response?.data?.message ||
          error?.message ||
          "Error occured. Please try again after sometime."}
      </p>
    </div>
  );
};

export default ErrorScreen;
