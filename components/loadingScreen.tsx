import React from "react";
import AppLogo from "./essentials/app-logo";

export default function LoadingScreen() {
  return (
    <div className="fixed z-50 h-screen w-screen flex justify-center items-center animate-pulse">
      <AppLogo />
    </div>
  );
}
