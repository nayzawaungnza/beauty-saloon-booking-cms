"use client"

import { useState } from "react"
import { Modal, ModalHeader, ModalBody, Row, Col, Card, CardBody, Button } from "reactstrap"

const ImageModal = ({
  show,
  onCloseClick,
  title = "Images",
  images = [],
  defaultImage = null,
  showImageDetails = true,
  allowFullscreen = true,
}) => {
  const [fullscreenImage, setFullscreenImage] = useState(null)

  const allImages = []

  // Add default image first if it exists
  if (defaultImage) {
    allImages.push({
      ...defaultImage,
      is_default: true,
      display_url: `/storage/${defaultImage.image_url}`,
    })
  }

  // Add gallery images
  if (images && images.length > 0) {
    allImages.push(
      ...images.map((img) => ({
        ...img,
        is_default: false,
        display_url: `/storage/${img.image_url}`,
      })),
    )
  }

  const handleImageClick = (image) => {
    if (allowFullscreen) {
      setFullscreenImage(image)
    }
  }

  const closeFullscreen = () => {
    setFullscreenImage(null)
  }

  return (
    <>
      {/* Main Image Modal */}
      <Modal isOpen={show} toggle={onCloseClick} size="xl" centered>
        <ModalHeader toggle={onCloseClick}>{title}</ModalHeader>
        <ModalBody>
          {allImages.length === 0 ? (
            <div className="text-center py-5">
              <i className="mdi mdi-image-off-outline display-4 text-muted"></i>
              <h5 className="mt-3">No Images Available</h5>
              <p className="text-muted">No images have been uploaded yet.</p>
            </div>
          ) : (
            <Row>
              {allImages.map((image, index) => (
                <Col md={6} lg={4} xl={3} key={image.id || index} className="mb-4">
                  <Card className="border h-100">
                    <div className="position-relative">
                      <img
                        src={image.display_url || "/placeholder.svg"}
                        alt={`Image ${index + 1}`}
                        className="card-img-top"
                        style={{
                          height: "200px",
                          objectFit: "cover",
                          cursor: allowFullscreen ? "pointer" : "default",
                        }}
                        onClick={() => handleImageClick(image)}
                      />
                      {image.is_default && (
                        <span className="position-absolute top-0 start-0 badge bg-primary m-2">
                          <i className="mdi mdi-star me-1"></i>
                          Default
                        </span>
                      )}
                      {image.is_banner && (
                        <span className="position-absolute top-0 end-0 badge bg-info m-2">
                          <i className="mdi mdi-flag me-1"></i>
                          Banner
                        </span>
                      )}
                      {allowFullscreen && (
                        <div className="position-absolute bottom-0 end-0 m-2">
                          <Button size="sm" color="dark" className="btn-sm" onClick={() => handleImageClick(image)}>
                            <i className="mdi mdi-magnify"></i>
                          </Button>
                        </div>
                      )}
                    </div>
                    {showImageDetails && (
                      <CardBody className="p-3">
                        <div className="d-flex justify-content-between align-items-start">
                          <div className="flex-grow-1">
                            <small className="text-muted d-block">
                              Image {index + 1}
                              {image.is_default && " (Default)"}
                              {image.is_banner && " (Banner)"}
                            </small>
                            <small className="text-dark">
                              Created: {new Date(image.created_at).toLocaleDateString()}
                            </small>
                          </div>
                        </div>
                      </CardBody>
                    )}
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </ModalBody>
      </Modal>

      {/* Fullscreen Image Modal */}
      {fullscreenImage && (
        <Modal
          isOpen={!!fullscreenImage}
          toggle={closeFullscreen}
          size="xl"
          centered
          className="modal-fullscreen-md-down"
        >
          <ModalHeader toggle={closeFullscreen} className="border-0">
            <div className="d-flex align-items-center">
              {fullscreenImage.is_default && (
                <span className="badge bg-primary me-2">
                  <i className="mdi mdi-star me-1"></i>
                  Default
                </span>
              )}
              {fullscreenImage.is_banner && (
                <span className="badge bg-info me-2">
                  <i className="mdi mdi-flag me-1"></i>
                  Banner
                </span>
              )}
              <span className="text-muted">Full Size View</span>
            </div>
          </ModalHeader>
          <ModalBody className="text-center p-0">
            <img
              src={fullscreenImage.display_url || "/placeholder.svg"}
              alt="Full size view"
              className="img-fluid"
              style={{ maxHeight: "80vh", objectFit: "contain" }}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  )
}

export default ImageModal
