"use client"

import PropTypes from "prop-types"
import { Modal, ModalBody } from "reactstrap"

const ActivateModal = ({ show, onActivateClick, onCloseClick, user }) => {
  const isActive = user?.is_active
  const actionText = isActive ? "deactivate" : "activate"
  const actionTextCapitalized = isActive ? "Deactivate" : "Activate"

  return (
    <Modal size="md" isOpen={show} toggle={onCloseClick} centered={true}>
      <div className="modal-content">
        <ModalBody className="px-4 py-5 text-center">
          <button type="button" onClick={onCloseClick} className="btn-close position-absolute end-0 top-0 m-3"></button>
          <div className="avatar-sm mb-4 mx-auto">
            <div
              className={`avatar-title ${isActive ? "bg-danger text-danger" : "bg-success text-success"} bg-opacity-10 font-size-20 rounded-3`}
            >
              <i className={`mdi ${isActive ? "mdi-cancel" : "mdi-check-circle"}`}></i>
            </div>
          </div>
          <p className="text-muted font-size-16 mb-4">
            Are you sure you want to {actionText} the user "{user?.name}"?
          </p>

          <div className="hstack gap-2 justify-content-center mb-0">
            <button
              type="button"
              className={`btn ${isActive ? "btn-danger" : "btn-success"}`}
              onClick={onActivateClick}
            >
              {actionTextCapitalized} Now
            </button>
            <button type="button" className="btn btn-secondary" onClick={onCloseClick}>
              Cancel
            </button>
          </div>
        </ModalBody>
      </div>
    </Modal>
  )
}

ActivateModal.propTypes = {
  onCloseClick: PropTypes.func,
  onActivateClick: PropTypes.func,
  show: PropTypes.bool,
  user: PropTypes.object,
}

export default ActivateModal
