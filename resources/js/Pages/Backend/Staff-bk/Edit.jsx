"use client"

import React, { useState, useEffect, useRef } from "react"
import { Link, router, useForm, usePage } from "@inertiajs/react"
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from "reactstrap"

// CKEditor React Integration
import { CKEditor } from "@ckeditor/ckeditor5-react"
import ClassicEditor from "@ckeditor/ckeditor5-build-classic"

import Breadcrumbs from "@/components/common/Breadcrumb"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Edit = ({ staff, services, errors = {} }) => {
  document.title = `Edit ${staff.name} | Admin Panel`

  const editorRef = useRef(null)
  const [editorContent, setEditorContent] = useState(staff.description || "")
  const { flash } = usePage().props

  const { data, setData, post, processing } = useForm({
    name: staff.name || "",
    email: staff.email || "",
    phone: staff.phone || "",
    description: staff.description || "",
    excerpt: staff.excerpt || "",
    is_active: staff.is_active !== undefined ? staff.is_active : true,
    services: staff.services ? staff.services.map((service) => service.id) : [],
    _method: "PUT",
  })

  // Enhanced CKEditor configuration
  const editorConfiguration = {
    toolbar: {
      items: [
        "heading",
        "|",
        "bold",
        "italic",
        "underline",
        "|",
        "bulletedList",
        "numberedList",
        "|",
        "link",
        "blockQuote",
        "|",
        "undo",
        "redo",
      ],
      shouldNotGroupWhenFull: true,
    },
    placeholder: "Enter staff member description...",
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

  // Handle CKEditor change
  const handleEditorChange = (event, editor) => {
    const content = editor.getData()
    setData("description", content)
    setEditorContent(content)
  }

  // Handle service selection
  const handleServiceChange = (serviceId, checked) => {
    if (checked) {
      setData("services", [...data.services, serviceId])
    } else {
      setData(
        "services",
        data.services.filter((id) => id !== serviceId),
      )
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    router.post(`/admin/staffs/${staff.id}`, data, {
      onSuccess: () => {
        toast.success("Staff member updated successfully!")
      },
      onError: (errors) => {
        console.error("Update errors:", errors)
        if (errors.message) {
          toast.error(errors.message)
        } else {
          toast.error("Failed to update staff member. Please check the form for errors.")
        }
      },
    })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Staff"
            breadcrumbItem="Edit Staff Member"
            
          />

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Label htmlFor="name-input">
                        Staff Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="name-input"
                        name="name"
                        type="text"
                        placeholder="Enter Staff Name..."
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        invalid={!!errors.name}
                      />
                      {errors.name && <FormFeedback type="invalid">{errors.name}</FormFeedback>}
                    </div>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="email-input">
                            Email Address <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="email-input"
                            name="email"
                            type="email"
                            placeholder="Enter Email Address..."
                            value={data.email}
                            onChange={(e) => setData("email", e.target.value)}
                            invalid={!!errors.email}
                          />
                          {errors.email && <FormFeedback type="invalid">{errors.email}</FormFeedback>}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="phone-input">Phone Number</Label>
                          <Input
                            id="phone-input"
                            name="phone"
                            type="text"
                            placeholder="Enter Phone Number..."
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            invalid={!!errors.phone}
                          />
                          {errors.phone && <FormFeedback type="invalid">{errors.phone}</FormFeedback>}
                        </div>
                      </Col>
                    </Row>

                    <div className="mb-3">
                      <Label htmlFor="excerpt-input">Staff Excerpt</Label>
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
                      <small className="text-muted">A brief summary that will be displayed in staff listings.</small>
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="description-editor">Staff Description</Label>
                      <div className="border rounded" style={{ minHeight: "300px" }}>
                        <CKEditor
                          editor={ClassicEditor}
                          data={data.description}
                          config={editorConfiguration}
                          onReady={(editor) => {
                            editorRef.current = editor
                          }}
                          onChange={handleEditorChange}
                        />
                      </div>
                      {errors.description && (
                        <FormFeedback type="invalid" className="d-block">
                          {errors.description}
                        </FormFeedback>
                      )}
                    </div>

                    <div className="mb-3">
                      <Label className="form-label">Services</Label>
                      <div className="border rounded p-3">
                        {services && services.length > 0 ? (
                          <Row>
                            {services.map((service) => (
                              <Col md={6} key={service.id} className="mb-2">
                                <div className="form-check">
                                  <Input
                                    type="checkbox"
                                    className="form-check-input"
                                    id={`service-${service.id}`}
                                    checked={data.services.includes(service.id)}
                                    onChange={(e) => handleServiceChange(service.id, e.target.checked)}
                                  />
                                  <Label className="form-check-label" htmlFor={`service-${service.id}`}>
                                    {service.name}
                                  </Label>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        ) : (
                          <p className="text-muted mb-0">No services available. Please create services first.</p>
                        )}
                      </div>
                      {errors.services && (
                        <FormFeedback type="invalid" className="d-block">
                          {errors.services}
                        </FormFeedback>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Staff Settings</h5>

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
                          Active Staff Member
                        </Label>
                        <small className="text-muted d-block">Enable this staff member for scheduling</small>
                      </div>
                    </div>

                    {errors.is_active && <div className="text-danger small">{errors.is_active}</div>}
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Quick Info</h5>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-primary-subtle rounded me-3">
                        <i className="bx bx-user text-primary font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Name</h6>
                        <p className="text-muted mb-0">{data.name || "Not set"}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-success-subtle rounded me-3">
                        <i className="bx bx-envelope text-success font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Email</h6>
                        <p className="text-muted mb-0">{data.email || "Not set"}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-info-subtle rounded me-3">
                        <i className="bx bx-phone text-info font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Phone</h6>
                        <p className="text-muted mb-0">{data.phone || "Not set"}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="avatar-sm bg-warning-subtle rounded me-3">
                        <i className="bx bx-briefcase text-warning font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Services</h6>
                        <p className="text-muted mb-0">{data.services.length} selected</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Preview</h5>
                    <div className="border rounded p-3">
                      <h6 className="mb-2">{data.name || "Staff Name"}</h6>
                      <p className="text-muted small mb-2">{data.email || "Email not set"}</p>
                      <div
                        className="text-muted small mb-2"
                        dangerouslySetInnerHTML={{
                          __html: editorContent
                            ? editorContent.substring(0, 100) + (editorContent.length > 100 ? "..." : "")
                            : "Staff description will appear here...",
                        }}
                      ></div>
                      <div className="d-flex justify-content-between">
                        <span className="badge bg-success">{data.is_active ? "Active" : "Inactive"}</span>
                        <span className="badge bg-info">{data.services.length} services</span>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={12}>
                <div className="text-end mb-4">
                  <Link href={route("admin.staffs.show", staff.id)} className="btn btn-secondary me-2">
                    Cancel
                  </Link>
                  <Button type="submit" color="primary" disabled={processing}>
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      "Update Staff Member"
                    )}
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default Edit
