import React from "react";
import { Link } from "react-router";
import { useUser } from "../lib/hooks/use-user";

const Navbar: React.FC = () => {
  const { user } = useUser();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-lg font-bold">MyApp</div>
        <ul className="flex space-x-4">
          {user === null && (
            <>
              <li>
                <Link to="/login" className="hover:text-gray-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-gray-300">
                  Register
                </Link>
              </li>
            </>
          )}
          {user !== null && (
            <>
              <li>
                <Link to="/profile" className="hover:text-gray-300">
                  Profile
                </Link>
              </li>
              <li>
                <Link
                  to="/public-note?note=<button style='background-color: blue; border: 1px solid black; padding: 0.5rem 1rem; border-radius: 0.5rem; color: white; font-weight: bold; cursor: pointer;'>This is a button from the public note</button>"
                  className="hover:text-gray-300"
                >
                  Visit sample public note
                </Link>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
