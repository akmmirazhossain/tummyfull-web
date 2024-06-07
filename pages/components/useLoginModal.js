// useLoginModal.js
import { useState } from "react";
import LoginForm from "./LoginForm";

const useLoginModal = () => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [modalTitle, setModalTitle] = useState("");

  const handleLogin = () => {
    setIsLoggedIn(true);
    setIsLoginModalOpen(false);
  };

  const openLoginModal = () => {
    setModalTitle("Log in");
    setModalContent(<LoginForm onLogin={handleLogin} />);
    setIsLoginModalOpen(true);
  };

  const closeModal = () => {
    setIsLoginModalOpen(false);
    setModalContent(null);
    setModalTitle("");
  };

  return {
    isLoginModalOpen,
    isLoggedIn,
    openLoginModal,
    closeModal,
    modalContent,
    setModalContent, // Include setModalContent in the return value
    modalTitle,
  };
};

export default useLoginModal;
