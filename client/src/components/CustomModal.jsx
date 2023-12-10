import React from 'react'
import Modal from 'react-modal';


export const CustomModal = ({ isOpen, closeModal, message, customStyles }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      contentLabel="Alert"
      style={customStyles} // Apply the styles here
    >
      <div>
        <p>{message}</p>
        <button onClick={closeModal}>OK</button>
      </div>
    </Modal>
  );
}
