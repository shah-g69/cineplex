import { X } from "lucide-react";

function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <div
      className="confirm-overlay"
      onClick={onCancel}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="confirm-dialog"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          className="confirm-close"
          onClick={onCancel}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <p>{message}</p>

        <div className="confirm-actions">

          <button
            className="confirm-cancel"
            onClick={onCancel}
          >
            Cancel
          </button>

          <button
            className="confirm-yes"
            onClick={onConfirm}
          >
            Yes, Add
          </button>

        </div>
      </div>
    </div>
  );
}

export default ConfirmDialog;
