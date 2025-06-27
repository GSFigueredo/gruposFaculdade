import React from 'react';
import ReactDOM from 'react-dom';
import { useModal } from '../context/ModalContext';

const Modal = () => {
    const { modalState, hideModal } = useModal();

    if (!modalState.isOpen) {
        return null;
    }

    const getIcon = () => {
        switch(modalState.type) {
            case 'success': return <span className="icon success">✓</span>;
            case 'error': return <span className="icon error">✗</span>;
            default: return <span className="icon info">ℹ</span>;
        }
    };

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={hideModal}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">{getIcon()}</div>
                <div className="modal-body"><p>{modalState.message}</p></div>
                <div className="modal-footer">
                    {modalState.onConfirm ? (
                        <div style={{display: 'flex', gap: '15px', justifyContent: 'center'}}>
                            <button onClick={hideModal} className="btn" style={{background: '#777'}}>Cancelar</button>
                            <button onClick={modalState.onConfirm} className="btn btn-principal">Confirmar</button>
                        </div>
                    ) : (
                        <button onClick={hideModal} className="btn btn-principal">OK</button>
                    )}
                </div>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal;