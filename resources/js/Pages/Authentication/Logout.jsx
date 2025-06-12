import React, { useEffect } from "react";
import { Inertia } from "@inertiajs/inertia";

const Logout = () => {
  useEffect(() => {
    // Perform logout by making a POST request to Laravel's logout route
    Inertia.post("/logout", null, {
      onSuccess: () => {
        // Redirect is handled server-side by Laravel (e.g., to /login)
      },
      onError: (errors) => {
        console.error("Logout failed:", errors);
      },
    });
  }, []);

  return null; // Render nothing while logging out
};

export default Logout;