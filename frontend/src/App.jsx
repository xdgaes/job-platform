import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import JobList from "./pages/JobList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";

function App() {
  return (
    <div className="min-h-screen w-full flex flex-col bg-gray-50">
      {/* Navbar tetap di atas */}
      <Navbar />

      {/* Wrapper untuk isi halaman */}
      <main className="flex-1 w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<JobList />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
