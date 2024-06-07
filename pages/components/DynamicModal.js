// DynamicModal.js
import React from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button as ModalButton,
} from "@nextui-org/react";

const DynamicModal = ({ isOpen, onClose, children }) => {
  return (
    <Modal
      className="my-auto mx-auto"
      isOpen={isOpen}
      onClose={onClose}
      size="md"
    >
      <ModalContent className="text-black pt-8 pb-4">
        <ModalBody>{children}</ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default DynamicModal;
