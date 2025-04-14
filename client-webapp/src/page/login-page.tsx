import React from "react";
import { redirectToAuth } from "../lib/oauthClient";

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={() => redirectToAuth()}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Log in with Email
      </button>
    </div>
  );
};

export default LoginPage;
