const Modal = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal container">
                <button className="modal-close btn btn-light" onClick={onClose}>
                    Close
                </button>
                <div className="modal-content">{children}</div>
            </div>
        </div>
    );
};

export default Modal;