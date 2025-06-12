"use client"

import React, { useState, useEffect } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  Button,
  FormFeedback,
  Badge,
} from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumbs from "@/components/common/Breadcrumb"

const Edit = ({ booking, staff, branches, customers, services }) => {
  document.title = `Edit Booking | Admin Dashboard`

  const { flash, errors } = usePage().props
  const [formData, setFormData] = useState({
    customer_id: booking.customer_id || "",
    staff_id: booking.staff_id || "",
    branch_id: booking.branch_id || "",
    timeslot_id: booking.timeslot_id || "",
    status: booking.status || "",
    booking_date: booking.booking_date || "",
    start_time: booking.start_time || "",
    end_time: booking.end_time || "",
    notes: booking.notes || "",
    services: booking.services ? booking.services.map((s) => s.id) : [],
  })
  const [availableTimeslots, setAvailableTimeslots] = useState([])
  const [selectedServices, setSelectedServices] = useState(booking.services ? booking.services.map((s) => s.id) : [])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCheckingAvailability, setIsCheckingAvailability] = useState(false)

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  useEffect(() => {
    if (formData.branch_id && formData.booking_date) {
      fetchAvailableTimeslots()
    }
  }, [formData.branch_id, formData.booking_date, formData.staff_id])

  const fetchAvailableTimeslots = async () => {
    try {
      const response = await fetch(
        `/admin/bookings/available-timeslots?branch_id=${formData.branch_id}&date=${formData.booking_date}&staff_id=${formData.staff_id || ""}`,
      )
      const data = await response.json()
      setAvailableTimeslots(data.timeslots || [])
    } catch (error) {
      console.error("Error fetching timeslots:", error)
      setAvailableTimeslots([])
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleServiceChange = (e, serviceId) => {
    let updatedServices
    if (e.target.checked) {
      updatedServices = [...selectedServices, serviceId]
    } else {
      updatedServices = selectedServices.filter((id) => id !== serviceId)
    }
    setSelectedServices(updatedServices)
    setFormData((prev) => ({
      ...prev,
      services: updatedServices,
    }))
  }

  const handleTimeslotChange = (e) => {
    const timeslotId = e.target.value
    const selectedTimeslot = availableTimeslots.find((t) => t.id === timeslotId)

    setFormData((prev) => ({
      ...prev,
      timeslot_id: timeslotId,
      start_time: selectedTimeslot ? selectedTimeslot.start_time : prev.start_time,
      end_time: selectedTimeslot ? selectedTimeslot.end_time : prev.end_time,
    }))
  }

  const checkAvailability = async () => {
    if (!formData.branch_id || !formData.booking_date || !formData.start_time || !formData.end_time) {
      toast.error("Please fill in all required fields first")
      return
    }

    setIsCheckingAvailability(true)
    try {
      const response = await fetch("/admin/bookings/check-availability", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": document.querySelector('meta[name="csrf-token"]').getAttribute("content"),
        },
        body: JSON.stringify({
          branch_id: formData.branch_id,
          date: formData.booking_date,
          start_time: formData.start_time,
          end_time: formData.end_time,
          staff_id: formData.staff_id || null,
          exclude_booking_id: booking.id,
        }),
      })

      const data = await response.json()

      if (data.available) {
        toast.success("Time slot is available!")
      } else {
        toast.error("Time slot is not available. Please choose a different time.")
      }
    } catch (error) {
      console.error("Error checking availability:", error)
      toast.error("Error checking availability")
    } finally {
      setIsCheckingAvailability(false)
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    router.put(`/admin/bookings/${booking.id}`, formData, {
      onSuccess: () => {
        toast.success("Booking updated successfully!")
        setIsSubmitting(false)
      },
      onError: (errors) => {
        toast.error("Please check the form for errors")
        setIsSubmitting(false)
      },
    })
  }

  const calculateTotalPrice = () => {
    return selectedServices
      .reduce((total, serviceId) => {
        const service = services.find((s) => s.id === serviceId)
        return total + (service ? Number.parseFloat(service.price) : 0)
      }, 0)
      .toFixed(2)
  }

  const calculateTotalDuration = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      return total + (service ? Number.parseInt(service.duration) : 0)
    }, 0)
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
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (timeString) => {
    if (!timeString) return ""
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Bookings" breadcrumbItem="Edit Booking" />

          <Row>
            <Col lg="8">
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <h5 className="card-title">Edit Booking</h5>
                        <p className="card-title-desc">Update the booking information below.</p>
                      </div>
                      <Badge color={getStatusColor(booking.status)} className="fs-6">
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="customer_id">
                            Customer <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            id="customer_id"
                            name="customer_id"
                            value={formData.customer_id}
                            onChange={handleInputChange}
                            invalid={!!errors.customer_id}
                          >
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                              <option key={customer.id} value={customer.id}>
                                {customer.name} - {customer.email}
                              </option>
                            ))}
                          </Input>
                          {errors.customer_id && <FormFeedback>{errors.customer_id}</FormFeedback>}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="branch_id">
                            Branch <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            id="branch_id"
                            name="branch_id"
                            value={formData.branch_id}
                            onChange={handleInputChange}
                            invalid={!!errors.branch_id}
                          >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name} - {branch.city}
                              </option>
                            ))}
                          </Input>
                          {errors.branch_id && <FormFeedback>{errors.branch_id}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="staff_id">Staff Member (Optional)</Label>
                          <Input
                            type="select"
                            id="staff_id"
                            name="staff_id"
                            value={formData.staff_id}
                            onChange={handleInputChange}
                            invalid={!!errors.staff_id}
                          >
                            <option value="">Any Available Staff</option>
                            {staff.map((staffMember) => (
                              <option key={staffMember.id} value={staffMember.id}>
                                {staffMember.name} - {staffMember.specialization || "General"}
                              </option>
                            ))}
                          </Input>
                          {errors.staff_id && <FormFeedback>{errors.staff_id}</FormFeedback>}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="status">Status</Label>
                          <Input
                            type="select"
                            id="status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                            invalid={!!errors.status}
                          >
                            <option value="pending">Pending</option>
                            <option value="confirmed">Confirmed</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </Input>
                          {errors.status && <FormFeedback>{errors.status}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="booking_date">
                            Booking Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            id="booking_date"
                            name="booking_date"
                            value={formData.booking_date}
                            onChange={handleInputChange}
                            invalid={!!errors.booking_date}
                          />
                          {errors.booking_date && <FormFeedback>{errors.booking_date}</FormFeedback>}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        {availableTimeslots.length > 0 && (
                          <FormGroup className="mb-3">
                            <Label htmlFor="timeslot_id">Available Time Slots</Label>
                            <Input
                              type="select"
                              id="timeslot_id"
                              name="timeslot_id"
                              value={formData.timeslot_id}
                              onChange={handleTimeslotChange}
                              invalid={!!errors.timeslot_id}
                            >
                              <option value="">Keep Current Time or Select New</option>
                              {availableTimeslots.map((timeslot) => (
                                <option key={timeslot.id} value={timeslot.id}>
                                  {timeslot.start_time} - {timeslot.end_time}
                                  {timeslot.staff && ` (${timeslot.staff.name})`}
                                </option>
                              ))}
                            </Input>
                            {errors.timeslot_id && <FormFeedback>{errors.timeslot_id}</FormFeedback>}
                          </FormGroup>
                        )}
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="start_time">
                            Start Time <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="time"
                            id="start_time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleInputChange}
                            invalid={!!errors.start_time}
                          />
                          {errors.start_time && <FormFeedback>{errors.start_time}</FormFeedback>}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="end_time">
                            End Time <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="time"
                            id="end_time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleInputChange}
                            invalid={!!errors.end_time}
                          />
                          {errors.end_time && <FormFeedback>{errors.end_time}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label className="d-block mb-3">
                            Services <span className="text-danger">*</span>
                          </Label>
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
                                    <div>
                                      <strong>{service.name}</strong>
                                      <div className="text-muted small">
                                        {service.duration}min - ${service.price}
                                      </div>
                                    </div>
                                  </Label>
                                </div>
                              </Col>
                            ))}
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="notes">Notes (Optional)</Label>
                          <Input
                            type="textarea"
                            id="notes"
                            name="notes"
                            rows="3"
                            value={formData.notes}
                            onChange={handleInputChange}
                            invalid={!!errors.notes}
                            placeholder="Any special requirements or notes..."
                          />
                          {errors.notes && <FormFeedback>{errors.notes}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="button" color="info" onClick={checkAvailability} disabled={isCheckingAvailability}>
                        {isCheckingAvailability ? (
                          <>
                            <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                            Checking...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-check font-size-16 align-middle me-2"></i>
                            Check Availability
                          </>
                        )}
                      </Button>
                      <Button type="submit" color="primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
                            Update Booking
                          </>
                        )}
                      </Button>
                      <Link href={`/admin/bookings/${booking.id}`} className="btn btn-info">
                        <i className="bx bx-show font-size-16 align-middle me-2"></i>
                        View Details
                      </Link>
                      <Link href="/admin/bookings" className="btn btn-secondary">
                        <i className="bx bx-x font-size-16 align-middle me-2"></i>
                        Cancel
                      </Link>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>

            <Col lg="4">
              <Card>
                <CardBody>
                  <h5 className="card-title mb-3">Booking Summary</h5>

                  <div className="mb-3">
                    <h6 className="mb-2">Current Booking:</h6>
                    <div className="text-muted">
                      <div>
                        <strong>ID:</strong> {booking.id}
                      </div>
                      <div>
                        <strong>Created:</strong> {formatDate(booking.created_at)}
                      </div>
                      <div>
                        <strong>Status:</strong>
                        <Badge color={getStatusColor(booking.status)} className="ms-1">
                          {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {selectedServices.length > 0 && (
                    <div className="mb-3">
                      <h6 className="mb-2">Selected Services:</h6>
                      {selectedServices.map((serviceId) => {
                        const service = services.find((s) => s.id === serviceId)
                        return service ? (
                          <div key={service.id} className="d-flex justify-content-between mb-1">
                            <span className="text-muted">{service.name}</span>
                            <span>${service.price}</span>
                          </div>
                        ) : null
                      })}
                      <hr />
                      <div className="d-flex justify-content-between">
                        <strong>Total Duration:</strong>
                        <strong>{calculateTotalDuration()} minutes</strong>
                      </div>
                      <div className="d-flex justify-content-between">
                        <strong>Total Price:</strong>
                        <strong>${calculateTotalPrice()}</strong>
                      </div>
                    </div>
                  )}

                  <div className="mb-3">
                    <h6 className="mb-2">Booking Details:</h6>
                    <div className="text-muted">
                      <div>
                        <strong>Customer:</strong>{" "}
                        {formData.customer_id
                          ? customers.find((c) => c.id === formData.customer_id)?.name || "Selected"
                          : "Not selected"}
                      </div>
                      <div>
                        <strong>Branch:</strong>{" "}
                        {formData.branch_id
                          ? branches.find((b) => b.id === formData.branch_id)?.name || "Selected"
                          : "Not selected"}
                      </div>
                      <div>
                        <strong>Staff:</strong>{" "}
                        {formData.staff_id
                          ? staff.find((s) => s.id === formData.staff_id)?.name || "Selected"
                          : "Any available"}
                      </div>
                      <div>
                        <strong>Date:</strong>{" "}
                        {formData.booking_date ? formatDate(formData.booking_date) : "Not selected"}
                      </div>
                      <div>
                        <strong>Time:</strong>{" "}
                        {formData.start_time && formData.end_time
                          ? `${formatTime(formData.start_time)} - ${formatTime(formData.end_time)}`
                          : "Not selected"}
                      </div>
                    </div>
                  </div>

                  {availableTimeslots.length === 0 && formData.branch_id && formData.booking_date && (
                    <div className="alert alert-warning">
                      <i className="mdi mdi-alert-outline me-2"></i>
                      No available timeslots found for the selected date and branch.
                    </div>
                  )}

                  {booking.created_by && (
                    <div className="mb-3">
                      <h6 className="mb-2">Audit Information:</h6>
                      <div className="text-muted small">
                        <div>
                          <strong>Created by:</strong> {booking.created_by.name}
                        </div>
                        {booking.updated_by && (
                          <div>
                            <strong>Last updated by:</strong> {booking.updated_by.name}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <ToastContainer closeButton={false} />
    </React.Fragment>
  )
}

export default Edit
