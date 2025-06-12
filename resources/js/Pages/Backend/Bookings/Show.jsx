"use client"

import React, { useEffect, useState } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Badge,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumbs from "@/components/common/Breadcrumb"

const Show = ({ booking }) => {
  document.title = `Booking Details | Admin Dashboard`

  const { flash } = usePage().props
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [showConfirmModal, setShowConfirmModal] = useState(false)

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleStatusChange = (action) => {
    router.patch(
      `/admin/bookings/${booking.id}/${action}`,
      {},
      {
        onSuccess: () => {
          toast.success(`Booking ${action}ed successfully!`)
          setShowCancelModal(false)
          setShowCompleteModal(false)
          setShowConfirmModal(false)
        },
        onError: (errors) => {
          toast.error(`Failed to ${action} booking`)
          console.error(errors)
        },
      },
    )
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning"
      case "confirmed":
        return "info"
      case "completed":
        return "success"
      case "cancelled":
        return "danger"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        weekday: "long",
      })
    } catch (error) {
      return dateString
    }
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    try {
      const [hours, minutes] = timeString.split(":")
      const date = new Date()
      date.setHours(Number.parseInt(hours, 10))
      date.setMinutes(Number.parseInt(minutes, 10))
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } catch (error) {
      return timeString
    }
  }

  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A"
    try {
      return new Date(dateTimeString).toLocaleString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    } catch (error) {
      return dateTimeString
    }
  }

  const calculateTotalPrice = () => {
    if (!booking.services || booking.services.length === 0) return "0.00"
    return booking.services.reduce((total, service) => total + Number.parseFloat(service.price), 0).toFixed(2)
  }

  const calculateTotalDuration = () => {
    if (!booking.services || booking.services.length === 0) return 0
    return booking.services.reduce((total, service) => total + Number.parseInt(service.duration), 0)
  }

  return (
    <React.Fragment>
      {/* Cancel Modal */}
      <Modal isOpen={showCancelModal} toggle={() => setShowCancelModal(false)}>
        <ModalHeader toggle={() => setShowCancelModal(false)}>Cancel Booking</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to cancel this booking?</p>
          <div className="alert alert-warning">
            <i className="mdi mdi-alert-outline me-2"></i>
            This action will change the booking status to cancelled. The customer will be notified.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowCancelModal(false)}>
            No, Keep Booking
          </Button>
          <Button color="warning" onClick={() => handleStatusChange("cancel")}>
            Yes, Cancel Booking
          </Button>
        </ModalFooter>
      </Modal>

      {/* Complete Modal */}
      <Modal isOpen={showCompleteModal} toggle={() => setShowCompleteModal(false)}>
        <ModalHeader toggle={() => setShowCompleteModal(false)}>Complete Booking</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to mark this booking as completed?</p>
          <div className="alert alert-success">
            <i className="mdi mdi-check-circle-outline me-2"></i>
            This action will mark the booking as completed. The customer will be notified.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowCompleteModal(false)}>
            Cancel
          </Button>
          <Button color="success" onClick={() => handleStatusChange("complete")}>
            Yes, Complete Booking
          </Button>
        </ModalFooter>
      </Modal>

      {/* Confirm Modal */}
      <Modal isOpen={showConfirmModal} toggle={() => setShowConfirmModal(false)}>
        <ModalHeader toggle={() => setShowConfirmModal(false)}>Confirm Booking</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to confirm this booking?</p>
          <div className="alert alert-info">
            <i className="mdi mdi-information-outline me-2"></i>
            This action will confirm the booking. The customer will be notified.
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button color="info" onClick={() => handleStatusChange("confirm")}>
            Yes, Confirm Booking
          </Button>
        </ModalFooter>
      </Modal>

      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Bookings" breadcrumbItem="Booking Details" />

          <Row>
            <Col lg="8">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h4 className="card-title mb-1">Booking Details</h4>
                      <p className="text-muted mb-0">Booking ID: {booking.id}</p>
                    </div>
                    <Badge color={getStatusColor(booking.status)} className="fs-6">
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>

                  {/* Customer Information */}
                  <div className="mb-4">
                    <h5 className="mb-3">
                      <i className="mdi mdi-account me-2 text-primary"></i>
                      Customer Information
                    </h5>
                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <label className="form-label fw-bold">Name</label>
                          <p className="text-muted mb-0">
                            {booking.customer ? booking.customer.name : "Unknown Customer"}
                          </p>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <label className="form-label fw-bold">Email</label>
                          <p className="text-muted mb-0">
                            {booking.customer ? (
                              <a href={`mailto:${booking.customer.email}`} className="text-primary">
                                {booking.customer.email}
                              </a>
                            ) : (
                              "N/A"
                            )}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Appointment Details */}
                  <div className="mb-4">
                    <h5 className="mb-3">
                      <i className="mdi mdi-calendar-clock me-2 text-primary"></i>
                      Appointment Details
                    </h5>
                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <label className="form-label fw-bold">Date</label>
                          <p className="text-muted mb-0">{formatDate(booking.booking_date)}</p>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <label className="form-label fw-bold">Time</label>
                          <p className="text-muted mb-0">
                            {formatTime(booking.start_time)} - {formatTime(booking.end_time)}
                          </p>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <label className="form-label fw-bold">Branch</label>
                          <p className="text-muted mb-0">
                            {booking.branch ? (
                              <>
                                <Link href={`/admin/branches/${booking.branch.slug}`} className="text-primary">
                                  {booking.branch.name}
                                </Link>
                                <br />
                                <small className="text-muted">{booking.branch.address}</small>
                              </>
                            ) : (
                              "Unknown Branch"
                            )}
                          </p>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <label className="form-label fw-bold">Staff Member</label>
                          <p className="text-muted mb-0">
                            {booking.staff ? (
                              <>
                                <Link href={`/admin/staff/${booking.staff.slug}`} className="text-primary">
                                  {booking.staff.name}
                                </Link>
                                <br />
                                <small className="text-muted">{booking.staff.specialization || "General"}</small>
                              </>
                            ) : (
                              "Any Available Staff"
                            )}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Services */}
                  <div className="mb-4">
                    <h5 className="mb-3">
                      <i className="mdi mdi-scissors-cutting me-2 text-primary"></i>
                      Services
                    </h5>
                    {booking.services && booking.services.length > 0 ? (
                      <div className="table-responsive">
                        <table className="table table-nowrap">
                          <thead>
                            <tr>
                              <th>Service</th>
                              <th>Category</th>
                              <th>Duration</th>
                              <th>Price</th>
                            </tr>
                          </thead>
                          <tbody>
                            {booking.services.map((service) => (
                              <tr key={service.id}>
                                <td>
                                  <div>
                                    <h6 className="mb-0">{service.name}</h6>
                                    {service.description && (
                                      <p className="text-muted mb-0 small">{service.description}</p>
                                    )}
                                  </div>
                                </td>
                                <td>
                                  <Badge color="info" className="badge-soft-info">
                                    {service.category || "General"}
                                  </Badge>
                                </td>
                                <td>{service.duration} minutes</td>
                                <td>${Number.parseFloat(service.price).toFixed(2)}</td>
                              </tr>
                            ))}
                          </tbody>
                          <tfoot>
                            <tr className="table-active">
                              <th colSpan="2">Total</th>
                              <th>{calculateTotalDuration()} minutes</th>
                              <th>${calculateTotalPrice()}</th>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    ) : (
                      <div className="alert alert-warning">
                        <i className="mdi mdi-alert-outline me-2"></i>
                        No services selected for this booking.
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {booking.notes && (
                    <div className="mb-4">
                      <h5 className="mb-3">
                        <i className="mdi mdi-note-text me-2 text-primary"></i>
                        Notes
                      </h5>
                      <div className="alert alert-light">
                        <p className="mb-0">{booking.notes}</p>
                      </div>
                    </div>
                  )}

                  {/* Audit Information */}
                  <div className="mb-4">
                    <h5 className="mb-3">
                      <i className="mdi mdi-information me-2 text-primary"></i>
                      Audit Information
                    </h5>
                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <label className="form-label fw-bold">Created</label>
                          <p className="text-muted mb-0">
                            {formatDateTime(booking.created_at)}
                            {booking.created_by && (
                              <>
                                <br />
                                <small>by {booking.created_by.name}</small>
                              </>
                            )}
                          </p>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <label className="form-label fw-bold">Last Updated</label>
                          <p className="text-muted mb-0">
                            {formatDateTime(booking.updated_at)}
                            {booking.updated_by && (
                              <>
                                <br />
                                <small>by {booking.updated_by.name}</small>
                              </>
                            )}
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>

                  {/* Action Buttons */}
                  <div className="d-flex flex-wrap gap-2">
                    <Link href={`/admin/bookings/${booking.id}/edit`} className="btn btn-primary">
                      <i className="mdi mdi-pencil me-1"></i>
                      Edit Booking
                    </Link>

                    {booking.status === "pending" && (
                      <Button color="info" onClick={() => setShowConfirmModal(true)}>
                        <i className="mdi mdi-check me-1"></i>
                        Confirm Booking
                      </Button>
                    )}

                    {booking.status === "confirmed" && (
                      <Button color="success" onClick={() => setShowCompleteModal(true)}>
                        <i className="mdi mdi-check-all me-1"></i>
                        Complete Booking
                      </Button>
                    )}

                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <Button color="warning" onClick={() => setShowCancelModal(true)}>
                        <i className="mdi mdi-close me-1"></i>
                        Cancel Booking
                      </Button>
                    )}

                    <Link href="/admin/bookings" className="btn btn-secondary">
                      <i className="mdi mdi-arrow-left me-1"></i>
                      Back to Bookings
                    </Link>
                  </div>
                </CardBody>
              </Card>
            </Col>

            <Col lg="4">
              <Card>
                <CardBody>
                  <h5 className="card-title mb-3">Quick Actions</h5>

                  <div className="d-grid gap-2">
                    {booking.status === "pending" && (
                      <Button color="info" onClick={() => setShowConfirmModal(true)}>
                        <i className="mdi mdi-check me-2"></i>
                        Confirm Booking
                      </Button>
                    )}

                    {booking.status === "confirmed" && (
                      <Button color="success" onClick={() => setShowCompleteModal(true)}>
                        <i className="mdi mdi-check-all me-2"></i>
                        Complete Booking
                      </Button>
                    )}

                    {(booking.status === "pending" || booking.status === "confirmed") && (
                      <Button color="warning" onClick={() => setShowCancelModal(true)}>
                        <i className="mdi mdi-close me-2"></i>
                        Cancel Booking
                      </Button>
                    )}

                    <Link href={`/admin/bookings/${booking.id}/edit`} className="btn btn-primary">
                      <i className="mdi mdi-pencil me-2"></i>
                      Edit Booking
                    </Link>

                    <hr />

                    <Link href="/admin/bookings/create" className="btn btn-outline-primary">
                      <i className="mdi mdi-plus me-2"></i>
                      Create New Booking
                    </Link>

                    <Link href="/admin/bookings" className="btn btn-outline-secondary">
                      <i className="mdi mdi-view-list me-2"></i>
                      View All Bookings
                    </Link>
                  </div>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <h5 className="card-title mb-3">Booking Summary</h5>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Status:</span>
                      <Badge color={getStatusColor(booking.status)}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Total Duration:</span>
                      <strong>{calculateTotalDuration()} minutes</strong>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Total Price:</span>
                      <strong>${calculateTotalPrice()}</strong>
                    </div>
                  </div>

                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>Services Count:</span>
                      <strong>{booking.services ? booking.services.length : 0}</strong>
                    </div>
                  </div>

                  {booking.timeslot && (
                    <div className="mb-3">
                      <div className="d-flex justify-content-between">
                        <span>Timeslot ID:</span>
                        <strong>{booking.timeslot.id}</strong>
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>

              {booking.customer && (
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Customer Actions</h5>

                    <div className="d-grid gap-2">
                      <a href={`mailto:${booking.customer.email}`} className="btn btn-outline-primary">
                        <i className="mdi mdi-email me-2"></i>
                        Send Email
                      </a>

                      <Link
                        href={`/admin/bookings?customer_id=${booking.customer.id}`}
                        className="btn btn-outline-info"
                      >
                        <i className="mdi mdi-history me-2"></i>
                        View Customer History
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              )}
            </Col>
          </Row>
        </Container>
      </div>

      <ToastContainer closeButton={false} />
    </React.Fragment>
  )
}

export default Show
