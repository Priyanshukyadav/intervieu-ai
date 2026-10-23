import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth' 

export const ServerUrl = "http://localhost:8000"

function App() {
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(ServerUrl + "/api/user/current-user", { withCredentials: true });
        console.log(response.data);
      } catch (error) {
        console.error(error);
      }
    }

    getUser();
  },[])
  return (
    <Routes>
      <Routes path="/" element={<Home />} />
      <Routes path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default App