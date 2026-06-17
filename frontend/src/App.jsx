import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import CreatePaste from "./pages/CreatePaste";
import MyPastes from "./pages/MyPastes";
import ViewPaste from "./pages/ViewPaste";
import Navbar from"./components/Navbar";
import { useNavigate } from "react-router-dom";
import ProtectedRoutes from "./components/ProtectedRoutes";

<components />
function App() {
  
  return (


    <>
    <h1>Hello</h1>
    <BrowserRouter>
    <Navbar/>

      <Routes>

        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />


        <Route path="/register" element={<Register />} />

        <Route path="/create" element={<ProtectedRoutes><CreatePaste /></ProtectedRoutes>} />

        <Route path="/my-pastes" element={<ProtectedRoutes><MyPastes /></ProtectedRoutes>} />

        <Route path="/paste/:id" element={<ViewPaste />} />

        

      </Routes>

    </BrowserRouter>

    </>
  );
}

export default App;