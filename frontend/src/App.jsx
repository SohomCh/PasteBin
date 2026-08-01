import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePaste from "./pages/CreatePaste";
import MyPastes from "./pages/MyPastes";
import ViewPaste from "./pages/ViewPaste";
import EditPaste from "./pages/EditPaste";
import Navbar from "./components/Navbar";
import ProtectedRoutes from "./components/ProtectedRoutes";

function App() {
  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)]">
      <BrowserRouter>
        <Navbar />

        <main className="container py-10">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/create" element={<ProtectedRoutes><CreatePaste /></ProtectedRoutes>} />
            <Route path="/my-pastes" element={<ProtectedRoutes><MyPastes /></ProtectedRoutes>} />
            <Route path="/paste/:id" element={<ViewPaste />} />
            <Route path="/edit/:id" element={<EditPaste />} />
          </Routes>
        </main>
      </BrowserRouter>
    </div>
  );
}

export default App;