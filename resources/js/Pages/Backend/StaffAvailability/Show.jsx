"use client"

import React, { useState } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import Breadcrumbs from "@/components/common/Breadcrumb"
import DeleteModal from "@/components/common/DeleteModal"
import { Col, Row, Card, CardBody, CardHeader, Badge, Button, UncontrolledTooltip, Table } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Show = ({ staffAvailability }) => {
  document.title = `Availability Details | Admin Panel`

  const { flash } = usePage().props
  const [deleteModal, setDeleteModal] = useState(false)

  React.useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleDeleteAvailability = () => {
    if (staffAvailability && staffAvailability.id) {
      router.delete(route("admin.staff_availability.destroy", staffAvailability.id), {
        onSuccess: () => {
          setDeleteModal(false)
          router.visit(route("admin.staff_availability.index"))
        },
        onError: (errors) => {
          toast.error("Failed to delete availability")
          console.error(errors)
        },
      })
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

  const calculateDuration = (startTime, endTime) => {
    if (!startTime || !endTime) return "N/A"

    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)
    const diffMs = end - start
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`
    }
    return `${diffMinutes}m`
  }

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteAvailability}
        onCloseClick={() => setDeleteModal(false)}
        title="Delete Availability"
        message="Are you sure you want to delete this availability schedule? This action cannot be undone."
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Staff Availability"
            breadcrumbItem="Availability Details"
            breadcrumbItems={[
              { title: "Staff Availability", link: route("admin.staff_availability.index") },
              { title: "Details", active: true },
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
                          <i className="mdi mdi-calendar-clock fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h4 className="mb-1">
                          {staffAvailability.staff?.name} - {getDayName(staffAvailability.day_of_week)}
                        </h4>
                        <div className="d-flex align-items-center gap-2">
                          <Badge className={staffAvailability.is_available ? "bg-success" : "bg-danger"}>
                            {staffAvailability.is_available ? "Available" : "Unavailable"}
                          </Badge>
                          <Badge className="bg-info">
                            <i className="mdi mdi-clock-outline me-1"></i>
                            {formatTime(staffAvailability.start_time)} - {formatTime(staffAvailability.end_time)}
                          </Badge>
                          {staffAvailability.effective_date && (
                            <Badge className="bg-warning">
                              <i className="mdi mdi-calendar me-1"></i>
                              Effective: {new Date(staffAvailability.effective_date).toLocaleDateString()}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2">
                        <Link
                          href={route("admin.staff_availability.edit", staffAvailability.id)}
                          className="btn btn-primary"
                          id="edit-availability"
                        >
                          <i className="mdi mdi-pencil-outline me-1"></i>
                          Edit Availability
                        </Link>
                        <UncontrolledTooltip placement="top" target="edit-availability">
                          Edit this availability schedule
                        </UncontrolledTooltip>

                        <Button color="danger" onClick={() => setDeleteModal(true)} id="delete-availability">
                          <i className="mdi mdi-delete-outline me-1"></i>
                          Delete
                        </Button>
                        <UncontrolledTooltip placement="top" target="delete-availability">
                          Delete this availability schedule
                        </UncontrolledTooltip>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Availability Details */}
            <Col lg="8">
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-information-outline me-2"></i>
                    Availability Information
                  </h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Staff Member</label>
                        <p className="text-muted mb-0">
                          {staffAvailability.staff?.name || "N/A"}
                          {staffAvailability.staff?.email && (
                            <small className="d-block text-muted">{staffAvailability.staff.email}</small>
                          )}
                        </p>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Day of Week</label>
                        <p className="text-muted mb-0">
                          <Badge color="primary" className="fs-6">
                            {getDayName(staffAvailability.day_of_week)}
                          </Badge>
                        </p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="4">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Start Time</label>
                        <p className="text-muted mb-0 fs-5">{formatTime(staffAvailability.start_time)}</p>
                      </div>
                    </Col>
                    <Col md="4">
                      <div className="mb-3">
                        <label className="form-label fw-bold">End Time</label>
                        <p className="text-muted mb-0 fs-5">{formatTime(staffAvailability.end_time)}</p>
                      </div>
                    </Col>
                    <Col md="4">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Duration</label>
                        <p className="text-muted mb-0 fs-5">
                          {calculateDuration(staffAvailability.start_time, staffAvailability.end_time)}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Availability Status</label>
                        <p className="text-muted mb-0">
                          <Badge className={staffAvailability.is_available ? "bg-success fs-6" : "bg-danger fs-6"}>
                            {staffAvailability.is_available ? "Available for Booking" : "Not Available"}
                          </Badge>
                        </p>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Effective Date</label>
                        <p className="text-muted mb-0">
                          {staffAvailability.effective_date
                            ? new Date(staffAvailability.effective_date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })
                            : "Immediate Effect"}
                        </p>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>

              {/* Schedule Summary */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-calendar-week me-2"></i>
                    Schedule Summary
                  </h5>
                </CardHeader>
                <CardBody>
                  <div className="border rounded p-4 text-center">
                    <div className="mb-3">
                      <i className="mdi mdi-calendar-clock display-4 text-primary"></i>
                    </div>
                    <h4 className="mb-2">{staffAvailability.staff?.name}</h4>
                    <h5 className="text-primary mb-3">{getDayName(staffAvailability.day_of_week)}</h5>
                    <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
                      <div className="text-center">
                        <h6 className="mb-1">Start</h6>
                        <p className="text-muted mb-0 fs-5">{formatTime(staffAvailability.start_time)}</p>
                      </div>
                      <div className="text-center">
                        <i className="mdi mdi-arrow-right fs-4 text-muted"></i>
                      </div>
                      <div className="text-center">
                        <h6 className="mb-1">End</h6>
                        <p className="text-muted mb-0 fs-5">{formatTime(staffAvailability.end_time)}</p>
                      </div>
                    </div>
                    <Badge className={staffAvailability.is_available ? "bg-success fs-6" : "bg-danger fs-6"}>
                      {staffAvailability.is_available ? "Available for Booking" : "Not Available"}
                    </Badge>
                  </div>
                </CardBody>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col lg="4">
              {/* Quick Stats */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-chart-line me-2"></i>
                    Quick Stats
                  </h5>
                </CardHeader>
                <CardBody>
                  <Table className="table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Status:</td>
                        <td>
                          <Badge className={staffAvailability.is_available ? "bg-success" : "bg-danger"}>
                            {staffAvailability.is_available ? "Available" : "Unavailable"}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Duration:</td>
                        <td>
                          <span className="text-muted">
                            {calculateDuration(staffAvailability.start_time, staffAvailability.end_time)}
                          </span>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Day:</td>
                        <td>
                          <Badge color="primary">{getDayName(staffAvailability.day_of_week)}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Effective:</td>
                        <td>
                          <span className="text-muted">
                            {staffAvailability.effective_date
                              ? new Date(staffAvailability.effective_date).toLocaleDateString()
                              : "Immediate"}
                          </span>
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
                          <small className="text-muted">{formatDate(staffAvailability.created_at)}</small>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Updated:</td>
                        <td>
                          <small className="text-muted">{formatDate(staffAvailability.updated_at)}</small>
                        </td>
                      </tr>
                      {staffAvailability.created_by && (
                        <tr>
                          <td className="fw-bold">Created By:</td>
                          <td>
                            <small className="text-muted">
                              {staffAvailability.created_by.name || staffAvailability.created_by.email}
                            </small>
                          </td>
                        </tr>
                      )}
                      {staffAvailability.updated_by && (
                        <tr>
                          <td className="fw-bold">Updated By:</td>
                          <td>
                            <small className="text-muted">
                              {staffAvailability.updated_by.name || staffAvailability.updated_by.email}
                            </small>
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
                    <Link
                      href={route("admin.staff_availability.edit", staffAvailability.id)}
                      className="btn btn-outline-primary"
                    >
                      <i className="mdi mdi-pencil-outline me-2"></i>
                      Edit Availability
                    </Link>

                    <Link
                      href={route("admin.staff.show", staffAvailability.staff?.id)}
                      className="btn btn-outline-info"
                    >
                      <i className="mdi mdi-account-outline me-2"></i>
                      View Staff Member
                    </Link>

                    <Link href={route("admin.staff_availability.create")} className="btn btn-outline-success">
                      <i className="mdi mdi-plus me-2"></i>
                      Add New Availability
                    </Link>

                    <Link href={route("admin.staff_availability.index")} className="btn btn-outline-secondary">
                      <i className="mdi mdi-arrow-left me-2"></i>
                      Back to List
                    </Link>

                    <hr />

                    <Button color="outline-danger" onClick={() => setDeleteModal(true)}>
                      <i className="mdi mdi-delete-outline me-2"></i>
                      Delete Availability
                    </Button>
                  </div>
                </CardBody>
              </Card>

              {/* Staff Info */}
              {staffAvailability.staff && (
                <Card>
                  <CardHeader>
                    <h5 className="card-title mb-0">
                      <i className="mdi mdi-account-outline me-2"></i>
                      Staff Information
                    </h5>
                  </CardHeader>
                  <CardBody>
                    <div className="text-center">
                      <div className="mb-3">
                        <div
                          className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center text-white"
                          style={{ width: "50px", height: "50px" }}
                        >
                          <i className="mdi mdi-account fs-4"></i>
                        </div>
                      </div>
                      <h6 className="mb-1">{staffAvailability.staff.name}</h6>
                      <p className="text-muted mb-2">{staffAvailability.staff.email}</p>
                      <Link
                        href={route("admin.staff.show", staffAvailability.staff.id)}
                        className="btn btn-sm btn-outline-primary"
                      >
                        View Profile
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default Show
