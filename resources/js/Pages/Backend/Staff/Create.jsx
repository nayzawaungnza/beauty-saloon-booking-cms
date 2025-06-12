"use client"

import React, { useEffect, useState } from "react"
import { Link, useForm, usePage } from "@inertiajs/react"
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from "reactstrap"

import Breadcrumbs from "@/components/common/Breadcrumb"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Create = ({ branches = [], services = [], errors = {} }) => {
  document.title = "Create New Staff Member | Admin Panel"

  const { flash } = usePage().props
  const [selectedServices, setSelectedServices] = useState([])

  const { data, setData, post, processing } = useForm({
    name: "",
    email: "",
    phone: "",
    branch_id: "",
    specialization: "",
    description: "",
    excerpt: "",
    is_active: true,
    services: [],
  })

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleSubmit = (e) => {
    e.preventDefault()
    data.services = selectedServices

    post("/admin/staff", {
      onSuccess: () => {
        toast.success("Staff member created successfully!")
      },
      onError: (errors) => {
        console.error("Create errors:", errors)
        if (errors.message) {
          toast.error(errors.message)
        } else {
          toast.error("Failed to create staff member. Please check the form for errors.")
        }
      },
    })
  }

  const handleServiceChange = (e, serviceId) => {
    if (e.target.checked) {
      setSelectedServices([...selectedServices, serviceId])
    } else {
      setSelectedServices(selectedServices.filter((id) => id !== serviceId))
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Staff" breadcrumbItem="Create Staff Member" />

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
                          <Label htmlFor="email-input">Email Address</Label>
                          <Input
                            id="email-input"
                            name="email"
                            type="email"
                            placeholder="Enter email address..."
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
                            placeholder="Enter phone number..."
                            value={data.phone}
                            onChange={(e) => setData("phone", e.target.value)}
                            invalid={!!errors.phone}
                          />
                          {errors.phone && <FormFeedback type="invalid">{errors.phone}</FormFeedback>}
                        </div>
                      </Col>
                    </Row>

                    <div className="mb-3">
                      <Label htmlFor="specialization-input">Specialization</Label>
                      <Input
                        id="specialization-input"
                        name="specialization"
                        type="text"
                        placeholder="Enter specialization..."
                        value={data.specialization}
                        onChange={(e) => setData("specialization", e.target.value)}
                        invalid={!!errors.specialization}
                      />
                      {errors.specialization && <FormFeedback type="invalid">{errors.specialization}</FormFeedback>}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="excerpt-input">Short Description</Label>
                      <Input
                        id="excerpt-input"
                        name="excerpt"
                        type="textarea"
                        rows="3"
                        placeholder="Enter short description..."
                        value={data.excerpt}
                        onChange={(e) => setData("excerpt", e.target.value)}
                        invalid={!!errors.excerpt}
                      />
                      {errors.excerpt && <FormFeedback type="invalid">{errors.excerpt}</FormFeedback>}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="description-input">Full Description</Label>
                      <Input
                        id="description-input"
                        name="description"
                        type="textarea"
                        rows="6"
                        placeholder="Enter full description..."
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        invalid={!!errors.description}
                      />
                      {errors.description && <FormFeedback type="invalid">{errors.description}</FormFeedback>}
                    </div>

                    {services.length > 0 && (
                      <div className="mb-3">
                        <Label className="d-block mb-3">Services</Label>
                        {errors.services && <div className="text-danger mb-3">{errors.services}</div>}

                        <Row>
                          {services.map((service) => (
                            <Col md={4} key={service.id} className="mb-2">
                              <div className="form-check">
                                <Input
                                  type="checkbox"
                                  className="form-check-input"
                                  id={`service-${service.id}`}
                                  checked={selectedServices.includes(service.id)}
                                  onChange={(e) => handleServiceChange(e, service.id)}
                                />
                                <Label className="form-check-label" htmlFor={`service-${service.id}`}>
                                  {service.name}
                                </Label>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Staff Settings</h5>

                    <div className="mb-3">
                      <Label htmlFor="branch-select">Branch Assignment</Label>
                      <Input
                        id="branch-select"
                        name="branch_id"
                        type="select"
                        value={data.branch_id}
                        onChange={(e) => setData("branch_id", e.target.value)}
                        invalid={!!errors.branch_id}
                      >
                        <option value="">Select Branch</option>
                        {branches.map((branch) => (
                          <option key={branch.id} value={branch.id}>
                            {branch.name} ({branch.city})
                          </option>
                        ))}
                      </Input>
                      {errors.branch_id && <FormFeedback type="invalid">{errors.branch_id}</FormFeedback>}
                    </div>

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
                        <i className="mdi mdi-account text-primary font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Staff Name</h6>
                        <p className="text-muted mb-0">{data.name || "Not set"}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-success-subtle rounded me-3">
                        <i className="mdi mdi-email text-success font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Email</h6>
                        <p className="text-muted mb-0">{data.email || "Not set"}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-info-subtle rounded me-3">
                        <i className="mdi mdi-phone text-info font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Phone</h6>
                        <p className="text-muted mb-0">{data.phone || "Not set"}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="avatar-sm bg-warning-subtle rounded me-3">
                        <i className="mdi mdi-office-building text-warning font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Branch</h6>
                        <p className="text-muted mb-0">
                          {data.branch_id
                            ? branches.find((b) => b.id === data.branch_id)?.name || "Selected"
                            : "Not assigned"}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={12}>
                <div className="text-end mb-4">
                  <Link href="/admin/staff" className="btn btn-secondary me-2">
                    Cancel
                  </Link>
                  <Button type="submit" color="primary" disabled={processing}>
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      "Create Staff Member"
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
