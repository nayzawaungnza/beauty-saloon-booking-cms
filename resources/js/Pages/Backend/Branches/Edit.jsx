"use client"

import React, { useEffect } from "react"
import { Link, useForm, usePage } from "@inertiajs/react"
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from "reactstrap"

import Breadcrumbs from "@/components/common/Breadcrumb"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Edit = ({ branch, managers = [], errors = {} }) => {
  document.title = `Edit ${branch.name} | Admin Panel`

  const { flash } = usePage().props

  const { data, setData, patch, processing } = useForm({
    name: branch.name || "",
    description: branch.description || "",
    address: branch.address || "",
    phone: branch.phone || "",
    city: branch.city || "",
    state: branch.state || "",
    zip: branch.zip || "",
    manager_id: branch.manager_id || "",
    latitude: branch.latitude || "",
    longitude: branch.longitude || "",
    is_active: branch.is_active !== undefined ? branch.is_active : true,
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

    patch(`/admin/branches/${branch.id}`, {
      onSuccess: () => {
        toast.success("Branch updated successfully!")
      },
      onError: (errors) => {
        console.error("Update errors:", errors)
        if (errors.message) {
          toast.error(errors.message)
        } else {
          toast.error("Failed to update branch. Please check the form for errors.")
        }
      },
    })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Branches"
            breadcrumbItem="Edit Branch"
            breadcrumbItems={[
              { title: "Branches", link: route("admin.branches.index") },
              { title: branch.name, link: route("admin.branches.show", branch.id) },
              { title: "Edit", active: true },
            ]}
          />

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Label htmlFor="name-input">
                        Branch Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="name-input"
                        name="name"
                        type="text"
                        placeholder="Enter Branch Name..."
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        invalid={!!errors.name}
                      />
                      {errors.name && <FormFeedback type="invalid">{errors.name}</FormFeedback>}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="description-input">Description</Label>
                      <Input
                        id="description-input"
                        name="description"
                        type="textarea"
                        rows="4"
                        placeholder="Enter branch description..."
                        value={data.description}
                        onChange={(e) => setData("description", e.target.value)}
                        invalid={!!errors.description}
                      />
                      {errors.description && <FormFeedback type="invalid">{errors.description}</FormFeedback>}
                    </div>

                    <div className="mb-3">
                      <Label htmlFor="address-input">Address</Label>
                      <Input
                        id="address-input"
                        name="address"
                        type="textarea"
                        rows="3"
                        placeholder="Enter full address..."
                        value={data.address}
                        onChange={(e) => setData("address", e.target.value)}
                        invalid={!!errors.address}
                      />
                      {errors.address && <FormFeedback type="invalid">{errors.address}</FormFeedback>}
                    </div>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="city-input">City</Label>
                          <Input
                            id="city-input"
                            name="city"
                            type="text"
                            placeholder="Enter city..."
                            value={data.city}
                            onChange={(e) => setData("city", e.target.value)}
                            invalid={!!errors.city}
                          />
                          {errors.city && <FormFeedback type="invalid">{errors.city}</FormFeedback>}
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="mb-3">
                          <Label htmlFor="state-input">State</Label>
                          <Input
                            id="state-input"
                            name="state"
                            type="text"
                            placeholder="Enter state..."
                            value={data.state}
                            onChange={(e) => setData("state", e.target.value)}
                            invalid={!!errors.state}
                          />
                          {errors.state && <FormFeedback type="invalid">{errors.state}</FormFeedback>}
                        </div>
                      </Col>
                      <Col md={3}>
                        <div className="mb-3">
                          <Label htmlFor="zip-input">ZIP Code</Label>
                          <Input
                            id="zip-input"
                            name="zip"
                            type="text"
                            placeholder="Enter ZIP..."
                            value={data.zip}
                            onChange={(e) => setData("zip", e.target.value)}
                            invalid={!!errors.zip}
                          />
                          {errors.zip && <FormFeedback type="invalid">{errors.zip}</FormFeedback>}
                        </div>
                      </Col>
                    </Row>

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

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="latitude-input">Latitude</Label>
                          <Input
                            id="latitude-input"
                            name="latitude"
                            type="number"
                            step="any"
                            placeholder="Enter latitude..."
                            value={data.latitude}
                            onChange={(e) => setData("latitude", e.target.value)}
                            invalid={!!errors.latitude}
                          />
                          {errors.latitude && <FormFeedback type="invalid">{errors.latitude}</FormFeedback>}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="longitude-input">Longitude</Label>
                          <Input
                            id="longitude-input"
                            name="longitude"
                            type="number"
                            step="any"
                            placeholder="Enter longitude..."
                            value={data.longitude}
                            onChange={(e) => setData("longitude", e.target.value)}
                            invalid={!!errors.longitude}
                          />
                          {errors.longitude && <FormFeedback type="invalid">{errors.longitude}</FormFeedback>}
                        </div>
                      </Col>
                    </Row>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Branch Settings</h5>

                    <div className="mb-3">
                      <Label htmlFor="manager-select">Branch Manager</Label>
                      <Input
                        id="manager-select"
                        name="manager_id"
                        type="select"
                        value={data.manager_id}
                        onChange={(e) => setData("manager_id", e.target.value)}
                        invalid={!!errors.manager_id}
                      >
                        <option value="">Select Manager</option>
                        {managers.map((manager) => (
                          <option key={manager.id} value={manager.id} disabled={manager.id === data.manager_id}>
                            {manager.name} ({manager.email})
                          </option>
                        ))}
                      </Input>
                      {errors.manager_id && <FormFeedback type="invalid">{errors.manager_id}</FormFeedback>}
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
                          Active Branch
                        </Label>
                        <small className="text-muted d-block">Enable this branch for operations</small>
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
                        <i className="bx bx-buildings text-primary font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Branch Name</h6>
                        <p className="text-muted mb-0">{data.name || "Not set"}</p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-success-subtle rounded me-3">
                        <i className="bx bx-map text-success font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Location</h6>
                        <p className="text-muted mb-0">
                          {data.city && data.state ? `${data.city}, ${data.state}` : "Not set"}
                        </p>
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
                        <i className="bx bx-user text-warning font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Manager</h6>
                        <p className="text-muted mb-0">
                          {data.manager_id
                            ? managers.find((m) => m.id === data.manager_id)?.name || "Selected"
                            : "Not assigned"}
                        </p>
                      </div>
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={12}>
                <div className="text-end mb-4">
                  <Link href={route("admin.branches.show", branch.id)} className="btn btn-secondary me-2">
                    Cancel
                  </Link>
                  <Button type="submit" color="primary" disabled={processing}>
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      "Update Branch"
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

export default Edit
