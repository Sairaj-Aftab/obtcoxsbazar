import { Modal } from "@rakan/bootstrap4rtl";

// eslint-disable-next-line react/prop-types
const ModalPopup = ({ size, title, target, children }) => {
  return (
    <div className="modal fade" id={target} aria-hidden="true" role="dialog">
      <div
        className={`modal-dialog modal-dialog-centered ${size && size}`}
        role="document"
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
            <button
              type="button"
              className="close"
              data-dismiss="modal"
              aria-label="Close"
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default ModalPopup;
