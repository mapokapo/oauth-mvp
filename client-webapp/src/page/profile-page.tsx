import React, { useEffect, useState } from "react";
import { useUser } from "../lib/hooks/use-user";

const ProfilePage: React.FC = () => {
  const [response, setResponse] = useState<unknown>(null);
  const { user } = useUser();

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    fetch(import.meta.env.VITE_RESOURCE_URL + "/api/private", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.text())
      .then((data) => {
        setResponse(data);
        console.log(data);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-semibold mb-4">Profile</h1>
      <p className="mb-4">Welcome, {user?.email}!</p>
      <pre>Some private data: {JSON.stringify(response)}</pre>
    </div>
  );
};

export default ProfilePage;
