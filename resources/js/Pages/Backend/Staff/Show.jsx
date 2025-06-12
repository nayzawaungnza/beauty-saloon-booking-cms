"use client"

import React, { useState } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import Breadcrumbs from "@/components/common/Breadcrumb"
import DeleteModal from "@/components/common/DeleteModal"
import ActivateModal from "@/components/common/ActivateModal"
import { Col, Row, Card, CardBody, CardHeader, Badge, Button, UncontrolledTooltip, Table } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Show = ({ staff }) => {
  document.title = `${staff.name} | Staff Details`

  const { flash } = usePage().props
  const [deleteModal, setDeleteModal] = useState(false)
  const [activateModal, setActivateModal] = useState(false)

  React.useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleDeleteStaff = () => {
    if (staff && staff.id) {
      router.delete(`/admin/staff/${staff.slug}`, {
        onSuccess: () => {
          setDeleteModal(false)
          router.visit("/admin/staff")
        },
        onError: (errors) => {
          toast.error("Failed to delete staff member")
          console.error(errors)
        },
      })
    }
  }

  const handleActivateStaff = () => {
    if (staff && staff.id) {
      const action = staff.is_active ? "deactivate" : "activate"

      router.patch(
        `/admin/staff/${staff.slug}/status`,
        { is_active: !staff.is_active },
        {
          onSuccess: () => {
            setActivateModal(false)
            toast.success(`Staff member ${action}d successfully`)
          },
          onError: (errors) => {
            toast.error(`Failed to ${action} staff member`)
            console.error(errors)
          },
        },
      )
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <React.Fragment>
      <DeleteModal show={deleteModal} onDeleteClick={handleDeleteStaff} onCloseClick={() => setDeleteModal(false)} />

      <ActivateModal
        show={activateModal}
        service={staff}
        onActivateClick={handleActivateStaff}
        onCloseClick={() => setActivateModal(false)}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Staff" breadcrumbItem="Staff Details" />

          {/* Header Section */}
          <Row>
            <Col lg="12">
              <Card>
                <CardHeader className="border-bottom">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-3">
                        <div
                          className="bg-light rounded d-flex align-items-center justify-content-center"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <i className="mdi mdi-account text-muted fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h4 className="mb-1">{staff.name}</h4>
                        <div className="d-flex align-items-center gap-2">
                          <Badge className={staff.is_active ? "bg-success" : "bg-danger"}>
                            {staff.is_active ? "Active" : "Inactive"}
                          </Badge>
                          {staff.branch && (
                            <Badge className="bg-info">
                              <i className="mdi mdi-office-building me-1"></i>
                              {staff.branch.name}
                            </Badge>
                          )}
                          {staff.specialization && (
                            <Badge className="bg-warning">
                              <i className="mdi mdi-star me-1"></i>
                              {staff.specialization}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2">
                        <Link href={`/admin/staff/${staff.slug}/edit`} className="btn btn-primary" id="edit-staff">
                          <i className="mdi mdi-pencil-outline me-1"></i>
                          Edit Staff
                        </Link>
                        <UncontrolledTooltip placement="top" target="edit-staff">
                          Edit this staff member
                        </UncontrolledTooltip>

                        <Button
                          color={staff.is_active ? "warning" : "success"}
                          onClick={() => setActivateModal(true)}
                          id="toggle-status"
                        >
                          <i className={`mdi ${staff.is_active ? "mdi-pause" : "mdi-play"} me-1`}></i>
                          {staff.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <UncontrolledTooltip placement="top" target="toggle-status">
                          {staff.is_active ? "Deactivate" : "Activate"} this staff member
                        </UncontrolledTooltip>

                        <Button color="danger" onClick={() => setDeleteModal(true)} id="delete-staff">
                          <i className="mdi mdi-delete-outline me-1"></i>
                          Delete
                        </Button>
                        <UncontrolledTooltip placement="top" target="delete-staff">
                          Delete this staff member
                        </UncontrolledTooltip>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Staff Details */}
            <Col lg="8">
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-information-outline me-2"></i>
                    Staff Information
                  </h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Full Name</label>
                        <p className="text-muted mb-0">{staff.name}</p>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Slug</label>
                        <p className="text-muted mb-0">
                          <code>{staff.slug}</code>
                        </p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Email Address</label>
                        <p className="text-muted mb-0">{staff.email || "Not provided"}</p>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Phone Number</label>
                        <p className="text-muted mb-0">{staff.phone || "Not provided"}</p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Specialization</label>
                        <p className="text-muted mb-0">{staff.specialization || "General"}</p>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Branch</label>
                        <p className="text-muted mb-0">
                          {staff.branch ? (
                            <>
                              {staff.branch.name}
                              <br />
                              <small className="text-muted">{staff.branch.city}</small>
                            </>
                          ) : (
                            "No branch assigned"
                          )}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  {staff.excerpt && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Short Description</label>
                      <p className="text-muted mb-0">{staff.excerpt}</p>
                    </div>
                  )}

                  {staff.description && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Full Description</label>
                      <p className="text-muted mb-0">{staff.description}</p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Services */}
              {staff.services && staff.services.length > 0 && (
                <Card>
                  <CardHeader>
                    <h5 className="card-title mb-0">
                      <i className="mdi mdi-cog-outline me-2"></i>
                      Services
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <div className="d-flex flex-wrap gap-2">
                      {staff.services.map((service) => (
                        <Badge key={service.id} color="primary" className="me-1 mb-1">
                          {service.name}
                        </Badge>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              )}
            </Col>

            {/* Sidebar */}
            <Col lg="4">
              {/* Staff Settings */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-cog-outline me-2"></i>
                    Staff Settings
                  </h5>
                </CardHeader>
                <CardBody>
                  <Table className="table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Status:</td>
                        <td>
                          <Badge className={staff.is_active ? "bg-success" : "bg-danger"}>
                            {staff.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Branch:</td>
                        <td>
                          <Badge className={staff.branch ? "bg-info" : "bg-secondary"}>
                            {staff.branch ? "Assigned" : "Unassigned"}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Services:</td>
                        <td>
                          <Badge
                            className={staff.services && staff.services.length > 0 ? "bg-success" : "bg-secondary"}
                          >
                            {staff.services ? staff.services.length : 0} Services
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Contact:</td>
                        <td>
                          <Badge className={staff.email || staff.phone ? "bg-success" : "bg-secondary"}>
                            {staff.email || staff.phone ? "Available" : "Not Set"}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-clock-outline me-2"></i>
                    Metadata
                  </h5>
                </CardHeader>
                <CardBody>
                  <Table className="table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Created:</td>
                        <td>
                          <small className="text-muted">{formatDate(staff.created_at)}</small>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Updated:</td>
                        <td>
                          <small className="text-muted">{formatDate(staff.updated_at)}</small>
                        </td>
                      </tr>
                      {staff.created_by && (
                        <tr>
                          <td className="fw-bold">Created By:</td>
                          <td>
                            <small className="text-muted">{staff.created_by.name || staff.created_by.email}</small>
                          </td>
                        </tr>
                      )}
                      {staff.updated_by && (
                        <tr>
                          <td className="fw-bold">Updated By:</td>
                          <td>
                            <small className="text-muted">{staff.updated_by.name || staff.updated_by.email}</small>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-lightning-bolt-outline me-2"></i>
                    Quick Actions
                  </h5>
                </CardHeader>
                <CardBody>
                  <div className="d-grid gap-2">
                    <Link href={`/admin/staff/${staff.slug}/edit`} className="btn btn-outline-primary">
                      <i className="mdi mdi-pencil-outline me-2"></i>
                      Edit Staff
                    </Link>

                    <Button color="outline-secondary" onClick={() => navigator.clipboard.writeText(staff.slug)}>
                      <i className="mdi mdi-content-copy me-2"></i>
                      Copy Slug
                    </Button>

                    {staff.email && (
                      <Button color="outline-info" onClick={() => window.open(`mailto:${staff.email}`, "_blank")}>
                        <i className="mdi mdi-email me-2"></i>
                        Send Email
                      </Button>
                    )}

                    <Link href="/admin/staff" className="btn btn-outline-info">
                      <i className="mdi mdi-arrow-left me-2"></i>
                      Back to List
                    </Link>

                    <hr />

                    <Button
                      color={staff.is_active ? "outline-warning" : "outline-success"}
                      onClick={() => setActivateModal(true)}
                    >
                      <i className={`mdi ${staff.is_active ? "mdi-pause" : "mdi-play"} me-2`}></i>
                      {staff.is_active ? "Deactivate" : "Activate"}
                    </Button>

                    <Button color="outline-danger" onClick={() => setDeleteModal(true)}>
                      <i className="mdi mdi-delete-outline me-2"></i>
                      Delete Staff
                    </Button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default Show
