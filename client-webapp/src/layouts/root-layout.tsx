import React from "react";
import { Outlet } from "react-router";
import UserProvider from "../components/providers/user-provider";
import Navbar from "../components/navbar";

const RootLayout: React.FC = () => {
  return (
    <UserProvider>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow p-4">
          <Outlet />
        </main>
        <footer className="bg-gray-800 text-white p-4">
          <p>&copy; 2023 My App</p>
        </footer>
      </div>
    </UserProvider>
  );
};

export default RootLayout;
