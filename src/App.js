import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import Reset from "./pages/auth/reset";
import Home from "./pages/home";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset" element={<Reset />} />
    </Routes>
  );
}

export default App;
