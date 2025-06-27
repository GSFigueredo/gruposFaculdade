import React, { createContext, useState, useContext } from 'react';

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
    const [modalState, setModalState] = useState({
        isOpen: false,
        message: '',
        type: 'info',
        onConfirm: null,
    });

    const showAlert = (message, type = 'info') => {
        setModalState({ isOpen: true, message, type, onConfirm: null });
    };
    
    const showConfirm = (message, onConfirmCallback) => {
        setModalState({ 
            isOpen: true, 
            message, 
            type: 'info',
            onConfirm: () => {
                if (onConfirmCallback) onConfirmCallback();
                hideModal();
            }
        });
    };

    const hideModal = () => {
        setModalState({ ...modalState, isOpen: false });
    };

    const value = { modalState, showAlert, showConfirm, hideModal };

    return (
        <ModalContext.Provider value={value}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    return useContext(ModalContext);
};