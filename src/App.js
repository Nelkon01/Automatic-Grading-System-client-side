import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import Assignment from "./components/Assignment";
import Logout from "./components/Logout";

import { Routes, Route } from "react-router-dom";

/** A function that renders the HTML code for the app. */
function App() {
  return (
    <div className="App">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/assignment" element={<Assignment />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
