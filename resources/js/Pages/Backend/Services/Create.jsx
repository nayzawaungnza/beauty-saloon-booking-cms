"use client"

import React, { useState, useEffect, useRef } from "react"
import { Link, useForm, usePage } from "@inertiajs/react"
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormFeedback,
  Input,
  Label,
  Row,
  UncontrolledTooltip,
} from "reactstrap"

// CKEditor React Integration
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

import Breadcrumbs from "@/Components/Common/Breadcrumb"
import "flatpickr/dist/themes/material_blue.css"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Create = ({ errors = {} }) => {
  document.title = "Create New Service | Admin Panel"

  const editorRef = useRef(null)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [selectedImage, setSelectedImage] = useState(null)
  const [galleryImages, setGalleryImages] = useState([])
  const [editorContent, setEditorContent] = useState("")
  const { flash } = usePage().props

  const { data, setData, post, processing } = useForm({
    name: "",
    description: "",
    excerpt: "",
    duration: "",
    price: "",
    is_promotion: false,
    discount_price: "",
    requires_buffer: true,
    is_active: true,
    service_image: null,
    gallery_images: [],
  })

  // Enhanced CKEditor configuration with all requested features
  const editorConfiguration = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "strikethrough",
        "|",
        "fontSize",
        "fontFamily",
        "fontColor",
        "fontBackgroundColor",
        "|",
        "alignment",
        "|",
        "bulletedList",
        "numberedList",
        "outdent",
        "indent",
        "|",
        "link",
        "blockQuote",
        "|",
        "imageInsert",
        "imageUpload",
        "mediaEmbed",
        "|",
        "insertTable",
        "|",
        "htmlEmbed",
        "sourceEditing",
        "|",
        "undo",
        "redo",
      ],
      shouldNotGroupWhenFull: true,
    },
    heading: {
      options: [
        { model: "paragraph", title: "Paragraph", class: "ck-heading_paragraph" },
        { model: "heading1", view: "h1", title: "Heading 1", class: "ck-heading_heading1" },
        { model: "heading2", view: "h2", title: "Heading 2", class: "ck-heading_heading2" },
        { model: "heading3", view: "h3", title: "Heading 3", class: "ck-heading_heading3" },
        { model: "heading4", view: "h4", title: "Heading 4", class: "ck-heading_heading4" },
        { model: "heading5", view: "h5", title: "Heading 5", class: "ck-heading_heading5" },
        { model: "heading6", view: "h6", title: "Heading 6", class: "ck-heading_heading6" },
      ],
    },
    fontSize: {
      options: [9, 10, 11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28, 30, 32, 34, 36],
      supportAllValues: true,
    },
    fontFamily: {
      options: [
        "default",
        "Arial, Helvetica, sans-serif",
        "Courier New, Courier, monospace",
        "Georgia, serif",
        "Lucida Sans Unicode, Lucida Grande, sans-serif",
        "Tahoma, Geneva, sans-serif",
        "Times New Roman, Times, serif",
        "Trebuchet MS, Helvetica, sans-serif",
        "Verdana, Geneva, sans-serif",
      ],
      supportAllValues: true,
    },
    fontColor: {
      colors: [
        {
          color: "hsl(0, 0%, 0%)",
          label: "Black",
        },
        {
          color: "hsl(0, 0%, 30%)",
          label: "Dim grey",
        },
        {
          color: "hsl(0, 0%, 60%)",
          label: "Grey",
        },
        {
          color: "hsl(0, 0%, 90%)",
          label: "Light grey",
        },
        {
          color: "hsl(0, 0%, 100%)",
          label: "White",
          hasBorder: true,
        },
        {
          color: "hsl(0, 75%, 60%)",
          label: "Red",
        },
        {
          color: "hsl(30, 75%, 60%)",
          label: "Orange",
        },
        {
          color: "hsl(60, 75%, 60%)",
          label: "Yellow",
        },
        {
          color: "hsl(90, 75%, 60%)",
          label: "Light green",
        },
        {
          color: "hsl(120, 75%, 60%)",
          label: "Green",
        },
        {
          color: "hsl(150, 75%, 60%)",
          label: "Aquamarine",
        },
        {
          color: "hsl(180, 75%, 60%)",
          label: "Turquoise",
        },
        {
          color: "hsl(210, 75%, 60%)",
          label: "Light blue",
        },
        {
          color: "hsl(240, 75%, 60%)",
          label: "Blue",
        },
        {
          color: "hsl(270, 75%, 60%)",
          label: "Purple",
        },
      ],
      columns: 5,
      documentColors: 10,
    },
    fontBackgroundColor: {
      colors: [
        {
          color: "hsl(0, 0%, 100%)",
          label: "White",
          hasBorder: true,
        },
        {
          color: "hsl(0, 0%, 90%)",
          label: "Light grey",
        },
        {
          color: "hsl(0, 0%, 60%)",
          label: "Grey",
        },
        {
          color: "hsl(0, 0%, 30%)",
          label: "Dim grey",
        },
        {
          color: "hsl(0, 0%, 0%)",
          label: "Black",
        },
        {
          color: "hsl(0, 75%, 60%)",
          label: "Red",
        },
        {
          color: "hsl(30, 75%, 60%)",
          label: "Orange",
        },
        {
          color: "hsl(60, 75%, 60%)",
          label: "Yellow",
        },
        {
          color: "hsl(90, 75%, 60%)",
          label: "Light green",
        },
        {
          color: "hsl(120, 75%, 60%)",
          label: "Green",
        },
        {
          color: "hsl(150, 75%, 60%)",
          label: "Aquamarine",
        },
        {
          color: "hsl(180, 75%, 60%)",
          label: "Turquoise",
        },
        {
          color: "hsl(210, 75%, 60%)",
          label: "Light blue",
        },
        {
          color: "hsl(240, 75%, 60%)",
          label: "Blue",
        },
        {
          color: "hsl(270, 75%, 60%)",
          label: "Purple",
        },
      ],
      columns: 5,
      documentColors: 10,
    },
    alignment: {
      options: ["left", "center", "right", "justify"],
    },
    link: {
      decorators: {
        addTargetToExternalLinks: true,
        defaultProtocol: "https://",
        toggleDownloadable: {
          mode: "manual",
          label: "Downloadable",
          attributes: {
            download: "file",
          },
        },
      },
    },
    image: {
      toolbar: [
        "imageTextAlternative",
        "toggleImageCaption",
        "imageStyle:inline",
        "imageStyle:block",
        "imageStyle:side",
        "linkImage",
      ],
      upload: {
        types: ["jpeg", "png", "gif", "bmp", "webp", "tiff"],
      },
    },
    table: {
      contentToolbar: ["tableColumn", "tableRow", "mergeTableCells", "tableCellProperties", "tableProperties"],
      tableProperties: {
        borderColors: [
          {
            color: "hsl(0, 0%, 0%)",
            label: "Black",
          },
          {
            color: "hsl(0, 0%, 30%)",
            label: "Dim grey",
          },
          {
            color: "hsl(0, 0%, 60%)",
            label: "Grey",
          },
          {
            color: "hsl(0, 0%, 90%)",
            label: "Light grey",
          },
          {
            color: "hsl(0, 0%, 100%)",
            label: "White",
            hasBorder: true,
          },
          {
            color: "hsl(0, 75%, 60%)",
            label: "Red",
          },
          {
            color: "hsl(30, 75%, 60%)",
            label: "Orange",
          },
          {
            color: "hsl(60, 75%, 60%)",
            label: "Yellow",
          },
          {
            color: "hsl(90, 75%, 60%)",
            label: "Light green",
          },
          {
            color: "hsl(120, 75%, 60%)",
            label: "Green",
          },
          {
            color: "hsl(150, 75%, 60%)",
            label: "Aquamarine",
          },
          {
            color: "hsl(180, 75%, 60%)",
            label: "Turquoise",
          },
          {
            color: "hsl(210, 75%, 60%)",
            label: "Light blue",
          },
          {
            color: "hsl(240, 75%, 60%)",
            label: "Blue",
          },
          {
            color: "hsl(270, 75%, 60%)",
            label: "Purple",
          },
        ],
        backgroundColors: [
          {
            color: "hsl(0, 0%, 100%)",
            label: "White",
            hasBorder: true,
          },
          {
            color: "hsl(0, 0%, 90%)",
            label: "Light grey",
          },
          {
            color: "hsl(0, 0%, 60%)",
            label: "Grey",
          },
          {
            color: "hsl(0, 0%, 30%)",
            label: "Dim grey",
          },
          {
            color: "hsl(0, 0%, 0%)",
            label: "Black",
          },
          {
            color: "hsl(0, 75%, 60%)",
            label: "Red",
          },
          {
            color: "hsl(30, 75%, 60%)",
            label: "Orange",
          },
          {
            color: "hsl(60, 75%, 60%)",
            label: "Yellow",
          },
          {
            color: "hsl(90, 75%, 60%)",
            label: "Light green",
          },
          {
            color: "hsl(120, 75%, 60%)",
            label: "Green",
          },
          {
            color: "hsl(150, 75%, 60%)",
            label: "Aquamarine",
          },
          {
            color: "hsl(180, 75%, 60%)",
            label: "Turquoise",
          },
          {
            color: "hsl(210, 75%, 60%)",
            label: "Light blue",
          },
          {
            color: "hsl(240, 75%, 60%)",
            label: "Blue",
          },
          {
            color: "hsl(270, 75%, 60%)",
            label: "Purple",
          },
        ],
      },
      tableCellProperties: {
        borderColors: [
          {
            color: "hsl(0, 0%, 0%)",
            label: "Black",
          },
          {
            color: "hsl(0, 0%, 30%)",
            label: "Dim grey",
          },
          {
            color: "hsl(0, 0%, 60%)",
            label: "Grey",
          },
          {
            color: "hsl(0, 0%, 90%)",
            label: "Light grey",
          },
          {
            color: "hsl(0, 0%, 100%)",
            label: "White",
            hasBorder: true,
          },
          {
            color: "hsl(0, 75%, 60%)",
            label: "Red",
          },
          {
            color: "hsl(30, 75%, 60%)",
            label: "Orange",
          },
          {
            color: "hsl(60, 75%, 60%)",
            label: "Yellow",
          },
          {
            color: "hsl(90, 75%, 60%)",
            label: "Light green",
          },
          {
            color: "hsl(120, 75%, 60%)",
            label: "Green",
          },
          {
            color: "hsl(150, 75%, 60%)",
            label: "Aquamarine",
          },
          {
            color: "hsl(180, 75%, 60%)",
            label: "Turquoise",
          },
          {
            color: "hsl(210, 75%, 60%)",
            label: "Light blue",
          },
          {
            color: "hsl(240, 75%, 60%)",
            label: "Blue",
          },
          {
            color: "hsl(270, 75%, 60%)",
            label: "Purple",
          },
        ],
        backgroundColors: [
          {
            color: "hsl(0, 0%, 100%)",
            label: "White",
            hasBorder: true,
          },
          {
            color: "hsl(0, 0%, 90%)",
            label: "Light grey",
          },
          {
            color: "hsl(0, 0%, 60%)",
            label: "Grey",
          },
          {
            color: "hsl(0, 0%, 30%)",
            label: "Dim grey",
          },
          {
            color: "hsl(0, 0%, 0%)",
            label: "Black",
          },
          {
            color: "hsl(0, 75%, 60%)",
            label: "Red",
          },
          {
            color: "hsl(30, 75%, 60%)",
            label: "Orange",
          },
          {
            color: "hsl(60, 75%, 60%)",
            label: "Yellow",
          },
          {
            color: "hsl(90, 75%, 60%)",
            label: "Light green",
          },
          {
            color: "hsl(120, 75%, 60%)",
            label: "Green",
          },
          {
            color: "hsl(150, 75%, 60%)",
            label: "Aquamarine",
          },
          {
            color: "hsl(180, 75%, 60%)",
            label: "Turquoise",
          },
          {
            color: "hsl(210, 75%, 60%)",
            label: "Light blue",
          },
          {
            color: "hsl(240, 75%, 60%)",
            label: "Blue",
          },
          {
            color: "hsl(270, 75%, 60%)",
            label: "Purple",
          },
        ],
      },
    },
    mediaEmbed: {
      previewsInData: true,
    },
    htmlEmbed: {
      showPreviews: true,
    },
    placeholder: "Enter detailed service description...",
    // Base64 upload adapter for images
    simpleUpload: {
      uploadUrl: "/admin/upload-image", // You can change this to your upload endpoint
      withCredentials: true,
      headers: {
        "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]')?.getAttribute("content"),
      },
    },
  }

  // Handle flash messages
  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  // Handle main service image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Validate file size (2MB max)
      if (file.size > 2048 * 1024) {
        toast.error("Image size should be less than 2MB")
        return
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPEG, PNG, JPG, GIF)")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target.result)
      }
      reader.readAsDataURL(file)
      setData("service_image", file)
    }
  }

  // Handle gallery images upload
  const handleGalleryChange = (event) => {
    const files = Array.from(event.target.files)

    if (files.length === 0) return

    // Validate total number of images (max 10)
    if (galleryImages.length + files.length > 10) {
      toast.error("Maximum 10 gallery images allowed")
      return
    }

    const validFiles = []
    const newGalleryImages = []

    files.forEach((file) => {
      // Validate file size (2MB max)
      if (file.size > 2048 * 1024) {
        toast.error(`${file.name} is too large. Maximum size is 2MB`)
        return
      }

      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/gif", "image/webp"]
      if (!allowedTypes.includes(file.type)) {
        toast.error(`${file.name} is not a valid image file`)
        return
      }

      validFiles.push(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        newGalleryImages.push({
          id: Date.now() + Math.random(),
          file: file,
          preview: e.target.result,
          name: file.name,
        })

        if (newGalleryImages.length === validFiles.length) {
          setGalleryImages((prev) => [...prev, ...newGalleryImages])
          setData("gallery_images", [...data.gallery_images, ...validFiles])
        }
      }
      reader.readAsDataURL(file)
    })
  }

  // Remove gallery image
  const removeGalleryImage = (imageId) => {
    const updatedGallery = galleryImages.filter((img) => img.id !== imageId)
    setGalleryImages(updatedGallery)

    const updatedFiles = updatedGallery.map((img) => img.file)
    setData("gallery_images", updatedFiles)
  }

  // Remove main image
  const removeMainImage = () => {
    setSelectedImage(null)
    setData("service_image", null)
    // Reset the file input
    const fileInput = document.getElementById("service-image-input")
    if (fileInput) {
      fileInput.value = ""
    }
  }

  // Handle CKEditor change
  const handleEditorChange = (event, editor) => {
    const content = editor.getData()
    setData("description", content)
    setEditorContent(content)
  }

  // Create a simple placeholder image as data URL
  const createPlaceholderImage = (width = 80, height = 80) => {
    const canvas = document.createElement("canvas")
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext("2d")

    // Fill with light gray background
    ctx.fillStyle = "#f8f9fa"
    ctx.fillRect(0, 0, width, height)

    // Add border
    ctx.strokeStyle = "#dee2e6"
    ctx.lineWidth = 1
    ctx.strokeRect(0, 0, width, height)

    // Add icon (simple camera icon)
    ctx.fillStyle = "#6c757d"
    ctx.font = `${Math.min(width, height) * 0.3}px Arial`
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("📷", width / 2, height / 2)

    return canvas.toDataURL()
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    // Create FormData for file upload
    const formData = new FormData()

    // Add all form fields to FormData
    Object.keys(data).forEach((key) => {
      if (key === "gallery_images") {
        data[key].forEach((file, index) => {
          formData.append(`gallery_images[${index}]`, file)
        })
      } else if (key === "service_image" && data[key]) {
        formData.append(key, data[key])
      } else if (key === "requires_buffer" || key === "is_active" || key === "is_promotion") {
        // Convert boolean to string representation that Laravel expects
        formData.append(key, data[key] ? "1" : "0")
      } else if (data[key] !== null && data[key] !== "" && key !== "service_image" && key !== "gallery_images") {
        formData.append(key, data[key])
      }
    })

    post("/admin/services", {
      data: formData,
      forceFormData: true,
      onSuccess: () => {
        toast.success("Service created successfully!")
      },
      onError: (errors) => {
        console.error("Create errors:", errors)
        if (errors.message) {
          toast.error(errors.message)
        } else {
          toast.error("Failed to create service. Please check the form for errors.")
        }
      },
    })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Services"
            breadcrumbItem="Create Service"
          />

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Label htmlFor="name-input">
                        Service Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="name-input"
                        name="name"
                        type="text"
                        placeholder="Enter Service Name..."
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        invalid={!!errors.name}
                      />
                      {errors.name && <FormFeedback type="invalid">{errors.name}</FormFeedback>}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="excerpt-input">
                        Service Excerpt
                      </Label>
                      <Input
                        id="excerpt-input"
                        name="excerpt"
                        type="textarea"
                        rows="3"
                        placeholder="Enter a brief excerpt or summary..."
                        value={data.excerpt}
                        onChange={(e) => setData("excerpt", e.target.value)}
                        invalid={!!errors.excerpt}
                      />
                      {errors.excerpt && <FormFeedback type="invalid">{errors.excerpt}</FormFeedback>}
                      <small className="text-muted">
                        A brief summary that will be displayed in service listings.
                      </small>
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="description-editor">Service Description</Label>
                      <div className="border rounded" style={{ minHeight: "400px" }}>
                        <CKEditor
                          editor={ClassicEditor}
                          data={data.description}
                          config={editorConfiguration}
                          onReady={(editor) => {
                            // Store the editor instance
                            editorRef.current = editor
                            console.log("CKEditor is ready to use!", editor)
                          }}
                          onChange={handleEditorChange}
                          onBlur={(event, editor) => {
                            console.log("Blur.", editor)
                          }}
                          onFocus={(event, editor) => {
                            console.log("Focus.", editor)
                          }}
                        />
                      </div>
                      {errors.description && (
                        <FormFeedback type="invalid" className="d-block">
                          {errors.description}
                        </FormFeedback>
                      )}
                      <small className="text-muted">
                        Use the editor to format your service description with rich text, images, tables, media embeds,
                        and more.
                      </small>
                    </div>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="duration-input">
                            Duration (minutes) <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="duration-input"
                            name="duration"
                            type="number"
                            min="1"
                            placeholder="Enter duration in minutes"
                            value={data.duration}
                            onChange={(e) => setData("duration", e.target.value)}
                            invalid={!!errors.duration}
                          />
                          {errors.duration && <FormFeedback type="invalid">{errors.duration}</FormFeedback>}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="price-input">
                            Price <span className="text-danger">*</span>
                          </Label>
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <Input
                              id="price-input"
                              name="price"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={data.price}
                              onChange={(e) => setData("price", e.target.value)}
                              invalid={!!errors.price}
                            />
                          </div>
                          {errors.price && <FormFeedback type="invalid">{errors.price}</FormFeedback>}
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <div className="form-check form-switch form-switch-md">
                            <Input
                              type="checkbox"
                              className="form-check-input"
                              id="is_promotion"
                              checked={data.is_promotion}
                              onChange={(e) => setData("is_promotion", e.target.checked)}
                            />
                            <Label className="form-check-label" htmlFor="is_promotion">
                              Promotional Service
                            </Label>
                            <small className="text-muted d-block">Mark this service as a promotion</small>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="discount-price-input">
                            Discount Price
                          </Label>
                          <div className="input-group">
                            <span className="input-group-text">$</span>
                            <Input
                              id="discount-price-input"
                              name="discount_price"
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={data.discount_price}
                              onChange={(e) => setData("discount_price", e.target.value)}
                              invalid={!!errors.discount_price}
                              disabled={!data.is_promotion}
                            />
                          </div>
                          {errors.discount_price && <FormFeedback type="invalid">{errors.discount_price}</FormFeedback>}
                          <small className="text-muted">Only available when service is marked as promotional</small>
                        </div>
                      </Col>
                    </Row>

                    <div className="mb-3">
                      <Label className="form-label">Service Image</Label>
                      <div className="text-center">
                        <div className="position-relative d-inline-block">
                          <div className="position-absolute bottom-0 end-0">
                            <Label htmlFor="service-image-input" className="mb-0" id="serviceImageInput">
                              <div className="avatar-xs">
                                <div className="avatar-title bg-light border rounded-circle text-muted cursor-pointer shadow font-size-16">
                                  <i className="bx bxs-image-alt"></i>
                                </div>
                              </div>
                            </Label>
                            <UncontrolledTooltip
                              placement="right"
                              target="serviceImageInput"
                              transition={{ timeout: 0 }}
                            >
                              Select Image
                            </UncontrolledTooltip>
                            <input
                              className="form-control d-none"
                              id="service-image-input"
                              name="service_image"
                              type="file"
                              accept="image/png,image/gif,image/jpeg,image/jpg,image/webp"
                              onChange={handleImageChange}
                            />
                          </div>
                          <div className="avatar-lg">
                            <div className="avatar-title bg-light rounded-circle position-relative">
                              <img
                                src={selectedImage || createPlaceholderImage(80, 80)}
                                id="service-img"
                                alt="Service"
                                className="avatar-md h-auto rounded-circle"
                                onError={(e) => {
                                  e.target.src = createPlaceholderImage(80, 80)
                                }}
                              />
                              {selectedImage && (
                                <button
                                  type="button"
                                  className="btn btn-danger btn-xs position-absolute top-0 start-100 translate-middle rounded-circle"
                                  onClick={removeMainImage}
                                  style={{ zIndex: 1 }}
                                >
                                  <i className="bx bx-x"></i>
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                        {errors.service_image && (
                          <FormFeedback type="invalid" className="d-block">
                            {errors.service_image}
                          </FormFeedback>
                        )}
                      </div>
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Gallery Images (Max 10)</Label>
                      <div className="border rounded p-3">
                        <div className="text-center">
                          <Label htmlFor="gallery-input" className="btn btn-outline-primary">
                            <i className="bx bx-images me-2"></i>
                            Select Gallery Images
                          </Label>
                          <input
                            className="form-control d-none"
                            id="gallery-input"
                            name="gallery_images"
                            type="file"
                            multiple
                            accept="image/png,image/gif,image/jpeg,image/jpg,image/webp"
                            onChange={handleGalleryChange}
                          />
                          <p className="text-muted mt-2 mb-0">
                            Select multiple images for the service gallery. Maximum 10 images, 2MB each.
                          </p>
                        </div>

                        {galleryImages.length > 0 && (
                          <div className="mt-3">
                            <h6 className="mb-3">Gallery Preview ({galleryImages.length}/10)</h6>
                            <Row>
                              {galleryImages.map((image) => (
                                <Col md={3} key={image.id} className="mb-3">
                                  <div className="border rounded position-relative">
                                    <img
                                      src={image.preview || createPlaceholderImage(200, 120)}
                                      alt={image.name}
                                      className="img-fluid rounded"
                                      style={{ height: "120px", width: "100%", objectFit: "cover" }}
                                    />
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1"
                                      onClick={() => removeGalleryImage(image.id)}
                                    >
                                      <i className="bx bx-x"></i>
                                    </button>
                                    <div className="p-2">
                                      <small className="text-muted">{image.name}</small>
                                    </div>
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        )}
                      </div>
                      {errors.gallery_images && (
                        <FormFeedback type="invalid" className="d-block">
                          {errors.gallery_images}
                        </FormFeedback>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Service Settings</h5>

                    <div className="mb-3">
                      <div className="form-check form-switch form-switch-md">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="is_active"
                          checked={data.is_active}
                          onChange={(e) => setData("is_active", e.target.checked)}
                        />
                        <Label className="form-check-label" htmlFor="is_active">
                          Active Service
                        </Label>
                        <small className="text-muted d-block">Enable this service for booking</small>
                      </div>
                    </div>

                    <div className="mb-3">
                      <div className="form-check form-switch form-switch-md">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="requires_buffer"
                          checked={data.requires_buffer}
                          onChange={(e) => setData("requires_buffer", e.target.checked)}
                        />
                        <Label className="form-check-label" htmlFor="requires_buffer">
                          Requires Buffer Time
                        </Label>
                        <small className="text-muted d-block">Add buffer time between appointments</small>
                      </div>
                    </div>

                    {errors.is_active && <div className="text-danger small">{errors.is_active}</div>}
                    {errors.requires_buffer && <div className="text-danger small">{errors.requires_buffer}</div>}
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Quick Info</h5>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-primary-subtle rounded me-3">
                        <i className="bx bx-time text-primary font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Duration</h6>
                        <p className="text-muted mb-0">{data.duration ? `${data.duration} minutes` : "Not set"}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-success-subtle rounded me-3">
                        <i className="bx bx-dollar text-success font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Price</h6>
                        <p className="text-muted mb-0">{data.price ? `$${data.price}` : "Not set"}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-info-subtle rounded me-3">
                        <i className="bx bx-images text-info font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Gallery</h6>
                        <p className="text-muted mb-0">{galleryImages.length} images</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-secondary-subtle rounded me-3">
                        <i className="bx bx-text text-secondary font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Excerpt</h6>
                        <p className="text-muted mb-0">{data.excerpt ? `${data.excerpt.substring(0, 30)}...` : "Not set"}</p>
                      </div>
                    </div>

                    {data.is_promotion && (
                      <div className="d-flex align-items-center mb-3">
                        <div className="avatar-sm bg-danger-subtle rounded me-3">
                          <i className="bx bx-purchase-tag text-danger font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">Promotion</h6>
                          <p className="text-muted mb-0">{data.discount_price ? `$${data.discount_price}` : "No discount price"}</p>
                        </div>
                      </div>
                    )}

                    <div className="d-flex align-items-center">
                      <div className="avatar-sm bg-warning-subtle rounded me-3">
                        <i className="bx bx-edit text-warning font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Description</h6>
                        <p className="text-muted mb-0">
                          {editorContent ? `${editorContent.replace(/<[^>]*>/g, "").substring(0, 30)}...` : "Not set"}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Preview</h5>
                    <div className="border rounded p-3">
                      <h6 className="mb-2">{data.name || "Service Name"}</h6>
                      <div
                        className="text-muted small mb-2"
                        dangerouslySetInnerHTML={{
                          __html: editorContent
                            ? editorContent.substring(0, 100) + (editorContent.length > 100 ? "..." : "")
                            : "Service description will appear here...",
                        }}
                      ></div>
                      <div className="d-flex justify-content-between">
                        <span className="badge bg-primary">{data.duration ? `${data.duration} min` : "Duration"}</span>
                        <div>
                          {data.is_promotion && data.discount_price ? (
                            <>
                              <span className="badge bg-danger me-1">${data.discount_price}</span>
                              <span className="badge bg-secondary text-decoration-line-through">${data.price || "Price"}</span>
                            </>
                          ) : (
                            <span className="badge bg-success">{data.price ? `$${data.price}` : "Price"}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={12}>
                <div className="text-end mb-4">
                  <Link href="/admin/services" className="btn btn-secondary me-2">
                    Cancel
                  </Link>
                  <Button type="submit" color="primary" disabled={processing}>
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      "Create Service"
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.Fragment>
  )
}

export default Create