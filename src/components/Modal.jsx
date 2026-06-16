export default function Modal({ open, title, text, onCancel, onConfirm }) {
  return (
    <div className={`modal-bg ${open ? "open" : ""}`}>
      <div className="modal">
        <div className="modal-icon">!</div>
        <div className="modal-title">{title}</div>
        <div className="modal-text">{text}</div>
        <div className="modal-btns">
          <button className="btn btn-ghost" type="button" onClick={onCancel}>Keep Going</button>
          <button className="btn btn-danger" type="button" onClick={onConfirm}>Yes, Quit</button>
        </div>
      </div>
    </div>
  );
}
