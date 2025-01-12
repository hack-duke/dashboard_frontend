import React, { useState, useEffect } from "react";
import axios from "axios";
import ApplicantCard from "./components/ApplicantCard";
import LoginForm from "./components/LoginForm";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = (token) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  return (
    <div>
      {!isAuthenticated ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <ApplicantCard />
      )}
    </div>
  );
}

export default App;
