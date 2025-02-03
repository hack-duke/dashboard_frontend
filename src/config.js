const API_URL = process.env.NODE_ENV === 'local' 
  ? "http://localhost:5000"
  : "https://dashboard-backend-e2bs.onrender.com";

export default API_URL; 