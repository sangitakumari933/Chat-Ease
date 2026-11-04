import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import ChatList from "./pages/ChatList";
import { Navigate } from "react-router-dom";
import Profile from "./pages/Profile";
import { Toaster } from "react-hot-toast";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

function App() {
  const { authUser } = useContext(AuthContext);
  return (
    <>
      <Toaster />
      <Routes>
        <Route
          path="/"
          element={authUser ? <ChatList /> : <Navigate to="/login" />}
        />
        <Route
          path="/login"
          element={!authUser ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/profile"
          element={authUser ? <Profile /> : <Navigate to="/login" />}
        />
      </Routes>
    </>
  );
}

export default App;
