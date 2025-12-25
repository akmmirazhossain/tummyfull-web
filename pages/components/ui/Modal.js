import { useState, createContext, useContext } from "react";

const ModalContext = createContext();

export function ModalProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [modalData, setModalData] = useState({
    title: "",
    content: "",
    onConfirm: null,
    confirmText: "OK",
    cancelText: "Cancel",
  });

  const openModal = (options) => {
    setModalData({
      title: options.title || "",
      content: options.content || "",
      onConfirm: options.onConfirm || null,
      confirmText: options.confirmText || "OK",
      cancelText: options.cancelText || "Cancel",
    });
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    <ModalContext.Provider value={{ openModal, closeModal }}>
      {children}
      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalContent className="text_black">
          {(onClose) => (
            <>
              {modalData.title && <ModalHeader>{modalData.title}</ModalHeader>}
              <ModalBody>{modalData.content}</ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  {modalData.cancelText}
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    if (modalData.onConfirm) modalData.onConfirm();
                    onClose();
                  }}
                >
                  {modalData.confirmText}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </ModalContext.Provider>
  );
}

export function useGlobalModal() {
  return useContext(ModalContext);
}
