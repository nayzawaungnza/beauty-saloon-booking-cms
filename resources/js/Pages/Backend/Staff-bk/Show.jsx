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
      router.delete(route("admin.staffs.destroy", staff.id), {
        onSuccess: () => {
          setDeleteModal(false)
          router.visit(route("admin.staffs.index"))
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
        route("admin.staffs.changeStatus", staff.id),
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

  const getDayName = (dayNumber) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayNumber] || "Unknown"
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteStaff}
        onCloseClick={() => setDeleteModal(false)}
        title="Delete Staff Member"
        message="Are you sure you want to delete this staff member? This action cannot be undone."
      />

      <ActivateModal
        show={activateModal}
        service={staff}
        onActivateClick={handleActivateStaff}
        onCloseClick={() => setActivateModal(false)}
        title={staff?.is_active ? "Deactivate Staff" : "Activate Staff"}
        message={`Are you sure you want to ${staff?.is_active ? "deactivate" : "activate"} this staff member?`}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Staff"
            breadcrumbItem="Staff Details"
            breadcrumbItems={[
              { title: "Staff", link: route("admin.staffs.index") },
              { title: staff.name, active: true },
            ]}
          />

          {/* Header Section */}
          <Row>
            <Col lg="12">
              <Card>
                <CardHeader className="border-bottom">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-3">
                        <div
                          className="bg-primary rounded d-flex align-items-center justify-content-center text-white"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <i className="mdi mdi-account fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h4 className="mb-1">{staff.name}</h4>
                        <div className="d-flex align-items-center gap-2">
                          <Badge className={staff.is_active ? "bg-success" : "bg-danger"}>
                            {staff.is_active ? "Active" : "Inactive"}
                          </Badge>
                          {staff.services?.length > 0 && (
                            <Badge className="bg-info">
                              <i className="mdi mdi-briefcase me-1"></i>
                              {staff.services.length} Services
                            </Badge>
                          )}
                          {staff.availability?.length > 0 && (
                            <Badge className="bg-warning">
                              <i className="mdi mdi-calendar-clock me-1"></i>
                              {staff.availability.length} Schedules
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2">
                        <Link href={route("admin.staffs.edit", staff.id)} className="btn btn-primary" id="edit-staff">
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
                        <label className="form-label fw-bold">Email Address</label>
                        <p className="text-muted mb-0">{staff.email}</p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Phone Number</label>
                        <p className="text-muted mb-0">{staff.phone || "Not provided"}</p>
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

                  {staff.excerpt && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Excerpt</label>
                      <p className="text-muted mb-0">{staff.excerpt}</p>
                    </div>
                  )}

                  {staff.description && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Description</label>
                      <div className="text-muted" dangerouslySetInnerHTML={{ __html: staff.description }} />
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Services */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-briefcase-outline me-2"></i>
                    Services ({staff.services?.length || 0})
                  </h5>
                </CardHeader>
                <CardBody>
                  {staff.services && staff.services.length > 0 ? (
                    <Row>
                      {staff.services.map((service) => (
                        <Col md={6} key={service.id} className="mb-3">
                          <div className="border rounded p-3">
                            <h6 className="mb-1">{service.name}</h6>
                            <div className="d-flex justify-content-between">
                              <small className="text-muted">
                                {service.duration ? `${service.duration} min` : "Duration not set"}
                              </small>
                              <small className="text-success fw-bold">
                                ${Number.parseFloat(service.price || 0).toFixed(2)}
                              </small>
                            </div>
                          </div>
                        </Col>
                      ))}
                    </Row>
                  ) : (
                    <div className="text-center py-4">
                      <i className="mdi mdi-briefcase-outline display-4 text-muted"></i>
                      <h6 className="mt-2">No Services Assigned</h6>
                      <p className="text-muted">This staff member has no services assigned yet.</p>
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Availability */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-calendar-clock me-2"></i>
                    Availability ({staff.availability?.length || 0})
                  </h5>
                </CardHeader>
                <CardBody>
                  {staff.availability && staff.availability.length > 0 ? (
                    <Table className="table-borderless">
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Time</th>
                          <th>Status</th>
                          <th>Effective Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {staff.availability.map((schedule) => (
                          <tr key={schedule.id}>
                            <td>
                              <Badge color="primary">{getDayName(schedule.day_of_week)}</Badge>
                            </td>
                            <td>
                              {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                            </td>
                            <td>
                              <Badge className={schedule.is_available ? "bg-success" : "bg-danger"}>
                                {schedule.is_available ? "Available" : "Unavailable"}
                              </Badge>
                            </td>
                            <td>
                              <small className="text-muted">
                                {schedule.effective_date ? formatDate(schedule.effective_date) : "No date set"}
                              </small>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  ) : (
                    <div className="text-center py-4">
                      <i className="mdi mdi-calendar-outline display-4 text-muted"></i>
                      <h6 className="mt-2">No Availability Set</h6>
                      <p className="text-muted">This staff member has no availability schedule set yet.</p>
                      <Link href={route("admin.staffs-availability.create")} className="btn btn-primary">
                        Add Availability
                      </Link>
                    </div>
                  )}
                </CardBody>
              </Card>
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
                        <td className="fw-bold">Services:</td>
                        <td>
                          <span className="text-muted">{staff.services?.length || 0} assigned</span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Availability:</td>
                        <td>
                          <span className="text-muted">{staff.availability?.length || 0} schedules</span>
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
                    <Link href={route("admin.staffs.edit", staff.id)} className="btn btn-outline-primary">
                      <i className="mdi mdi-pencil-outline me-2"></i>
                      Edit Staff
                    </Link>

                    <Link href={route("admin.staffs-availability.create")} className="btn btn-outline-info">
                      <i className="mdi mdi-calendar-plus me-2"></i>
                      Add Availability
                    </Link>

                    <Link href={route("admin.staffs.index")} className="btn btn-outline-secondary">
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
