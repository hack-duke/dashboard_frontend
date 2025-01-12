import React, { useState } from "react";
import axios from "axios";
import API_URL from '../config';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/auth/login`, { username, password });
      onLogin(res.data.token);
    } catch (err) {
      alert("Login failed!");
    }
  };

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f5f5f5'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '40px',
        borderRadius: '8px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        width: '100%',
        maxWidth: '400px'
      }}>
        <h1 style={{
          textAlign: 'center',
          marginBottom: '30px',
          color: '#333',
          fontSize: '24px'
        }}>
          HackDuke Dashboard
        </h1>
        <form onSubmit={handleSubmit} style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              padding: '12px',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '16px'
            }}
          />
          <button 
            type="submit"
            style={{
              padding: '12px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.2s'
            }}
            onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
            onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;

//     <form onSubmit={handleSubmit}>
//       <input
//         type="text"
//         placeholder="Username"
//         value={username}
//         onChange={(e) => setUsername(e.target.value)}
//       />
//       <input
//         type="password"
//         placeholder="Password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//       />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default LoginForm;
