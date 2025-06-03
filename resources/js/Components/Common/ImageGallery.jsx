"use client"

import { useState } from "react"
import { Row, Col, Card, Button } from "reactstrap"
import ImageModal from "./ImageModal"

const ImageGallery = ({
  defaultImage = null,
  galleryImages = [],
  title = "Images",
  showTitle = true,
  maxPreviewImages = 6,
  imageHeight = "150px",
}) => {
  const [showModal, setShowModal] = useState(false)

  const allImages = []

  if (defaultImage) {
    allImages.push(defaultImage)
  }

  if (galleryImages && galleryImages.length > 0) {
    allImages.push(...galleryImages)
  }

  const previewImages = allImages.slice(0, maxPreviewImages)
  const remainingCount = allImages.length - maxPreviewImages

  if (allImages.length === 0) {
    return (
      <div className="text-center py-4 border rounded">
        <i className="mdi mdi-image-off-outline display-4 text-muted"></i>
        <h6 className="mt-2 text-muted">No Images Available</h6>
      </div>
    )
  }

  return (
    <>
      {showTitle && <h6 className="mb-3">{title}</h6>}

      <Row>
        {previewImages.map((image, index) => (
          <Col xs={6} md={4} lg={3} key={image.id || index} className="mb-3">
            <Card className="border">
              <div className="position-relative">
                <img
                  src={`/storage/${image.image_url}`}
                  alt={`Image ${index + 1}`}
                  className="card-img-top"
                  style={{
                    height: imageHeight,
                    objectFit: "cover",
                    cursor: "pointer",
                  }}
                  onClick={() => setShowModal(true)}
                />
                {image.is_default && (
                  <span className="position-absolute top-0 start-0 badge bg-primary m-1 small">Default</span>
                )}
                {image.is_banner && (
                  <span className="position-absolute top-0 end-0 badge bg-info m-1 small">Banner</span>
                )}
              </div>
            </Card>
          </Col>
        ))}

        {remainingCount > 0 && (
          <Col xs={6} md={4} lg={3} className="mb-3">
            <Card
              className="border h-100 d-flex align-items-center justify-content-center"
              style={{ cursor: "pointer", minHeight: imageHeight }}
              onClick={() => setShowModal(true)}
            >
              <div className="text-center p-3">
                <i className="mdi mdi-plus-circle-outline display-4 text-muted"></i>
                <div className="mt-2">
                  <small className="text-muted">+{remainingCount} more</small>
                </div>
              </div>
            </Card>
          </Col>
        )}
      </Row>

      {allImages.length > 0 && (
        <div className="text-center mt-3">
          <Button color="outline-primary" size="sm" onClick={() => setShowModal(true)}>
            <i className="mdi mdi-eye-outline me-1"></i>
            View All Images ({allImages.length})
          </Button>
        </div>
      )}

      <ImageModal
        show={showModal}
        title={title}
        defaultImage={defaultImage}
        images={galleryImages}
        onCloseClick={() => setShowModal(false)}
      />
    </>
  )
}

export default ImageGallery
