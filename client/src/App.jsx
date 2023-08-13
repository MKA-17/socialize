import { useEffect, useState } from "react";
import "./App.css";
import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Layout from "./components/Layout";
import { useAuth } from "./context/auth";
import Profile from "./pages/Profile";
import { Modal } from "antd";
import OtherProfile from "./pages/OtherProfile";
import LikedPost from "./pages/LikedPost";
import SavedPost from "./pages/SavedPost";
import UnAuthorizedPage from "./pages/UnAuthorizedPage";

function App() {
  const [auth, setAuth, isTokenModal, setIsTokenModal] = useAuth();

  return (
    <>
      <Modal
        title="Token Expired."
        open={isTokenModal}
        footer={null}
        onCancel={() => {
          setIsTokenModal(false);
        }}
      >
        Your session has been expired. <a href="/login">Login Here.</a>
      </Modal>
      <Layout>
        <Routes>
          {auth.token && (
            <>
              <Route path="/" exact element={<Home />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/user-profile/:userId" element={<OtherProfile />} />
              <Route path="/liked-posts" element={<LikedPost />} />
              <Route path="/saved-posts" element={<SavedPost />} />
            </>
          )}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<UnAuthorizedPage />} />
        </Routes>
      </Layout>
    </>
  );
}

export default App;
