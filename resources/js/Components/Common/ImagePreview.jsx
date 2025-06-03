"use client"

const ImagePreview = ({
  image,
  alt = "Image",
  width = "100px",
  height = "100px",
  className = "",
  showBadges = true,
  onClick = null,
}) => {
  if (!image || !image.image_url) {
    return (
      <div
        className={`bg-light rounded d-flex align-items-center justify-content-center ${className}`}
        style={{ width, height }}
      >
        <i className="mdi mdi-image-outline text-muted"></i>
      </div>
    )
  }

  return (
    <div className={`position-relative ${className}`} style={{ width, height }}>
      <img
        src={`/storage/${image.image_url}`}
        alt={alt}
        className="rounded"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          cursor: onClick ? "pointer" : "default",
        }}
        onClick={onClick}
      />
      {showBadges && (
        <>
          {image.is_default && (
            <span className="position-absolute top-0 start-0 badge bg-primary m-1" style={{ fontSize: "0.6rem" }}>
              Default
            </span>
          )}
          {image.is_banner && (
            <span className="position-absolute top-0 end-0 badge bg-info m-1" style={{ fontSize: "0.6rem" }}>
              Banner
            </span>
          )}
        </>
      )}
    </div>
  )
}

export default ImagePreview
