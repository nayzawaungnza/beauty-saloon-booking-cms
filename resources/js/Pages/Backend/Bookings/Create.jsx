"use client"

import React, { useState, useEffect } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import { Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row, Button, FormFeedback } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumbs from "@/components/common/Breadcrumb"

const Create = ({ staff, branches, customers, services, preselectedDate, preselectedTime }) => {
  document.title = "Create Booking | Admin Dashboard"

  const { flash, errors } = usePage().props
  const [formData, setFormData] = useState({
    customer_id: "",
    staff_id: "",
    branch_id: "",
    timeslot_id: "",
    booking_date: preselectedDate || "",
    start_time: preselectedTime || "",
    end_time: "",
    notes: "",
    services: [],
  })
  const [availableTimeslots, setAvailableTimeslots] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
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

  // Calculate end time based on selected services and start time
  useEffect(() => {
    if (formData.start_time && selectedServices.length > 0) {
      const totalDuration = calculateTotalDuration()
      const [hours, minutes] = formData.start_time.split(":").map(Number)

      const startDate = new Date()
      startDate.setHours(hours, minutes, 0)

      const endDate = new Date(startDate.getTime() + totalDuration * 60000)
      const endHours = endDate.getHours().toString().padStart(2, "0")
      const endMinutes = endDate.getMinutes().toString().padStart(2, "0")

      setFormData((prev) => ({
        ...prev,
        end_time: `${endHours}:${endMinutes}`,
      }))
    }
  }, [formData.start_time, selectedServices])

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
    const selectedTimeslot = availableTimeslots.find((ts) => ts.id == timeslotId)

    setFormData((prev) => ({
      ...prev,
      timeslot_id: timeslotId,
      start_time: selectedTimeslot ? selectedTimeslot.start_time : "",
      end_time: selectedTimeslot ? selectedTimeslot.end_time : "",
    }))
  }

  const calculateTotalDuration = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      return total + (service ? service.duration : 0)
    }, 0)
  }

  const calculateTotalPrice = () => {
    return selectedServices.reduce((total, serviceId) => {
      const service = services.find((s) => s.id === serviceId)
      return total + (service ? Number.parseFloat(service.price) : 0)
    }, 0)
  }

  const checkAvailability = async () => {
    if (!formData.branch_id || !formData.booking_date || !formData.start_time || !formData.end_time) {
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
        }),
      })

      const data = await response.json()
      if (data.available) {
        toast.success("Time slot is available!")
      } else {
        toast.warning("Time slot is not available. Please select a different time.")
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

    router.post("/admin/bookings", formData, {
      onSuccess: () => {
        toast.success("Booking created successfully!")
      },
      onError: (errors) => {
        console.error("Validation errors:", errors)
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key])
        })
      },
      onFinish: () => {
        setIsSubmitting(false)
      },
    })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Bookings" breadcrumbItem="Create Booking" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label for="customer_id">
                            Customer <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            id="customer_id"
                            name="customer_id"
                            value={formData.customer_id}
                            onChange={handleInputChange}
                            invalid={!!errors.customer_id}
                            required
                          >
                            <option value="">Select Customer</option>
                            {customers.map((customer) => (
                              <option key={customer.id} value={customer.id}>
                                {customer.name} ({customer.email})
                              </option>
                            ))}
                          </Input>
                          {errors.customer_id && <FormFeedback>{errors.customer_id}</FormFeedback>}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label for="branch_id">
                            Branch <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            id="branch_id"
                            name="branch_id"
                            value={formData.branch_id}
                            onChange={handleInputChange}
                            invalid={!!errors.branch_id}
                            required
                          >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name}
                              </option>
                            ))}
                          </Input>
                          {errors.branch_id && <FormFeedback>{errors.branch_id}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label for="staff_id">Staff (Optional)</Label>
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
                                {staffMember.name}
                              </option>
                            ))}
                          </Input>
                          {errors.staff_id && <FormFeedback>{errors.staff_id}</FormFeedback>}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label for="booking_date">
                            Booking Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            id="booking_date"
                            name="booking_date"
                            value={formData.booking_date}
                            onChange={handleInputChange}
                            invalid={!!errors.booking_date}
                            min={new Date().toISOString().split("T")[0]}
                            required
                          />
                          {errors.booking_date && <FormFeedback>{errors.booking_date}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>

                    {availableTimeslots.length > 0 && (
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <Label for="timeslot_id">Available Time Slots</Label>
                            <Input
                              type="select"
                              id="timeslot_id"
                              name="timeslot_id"
                              value={formData.timeslot_id}
                              onChange={handleTimeslotChange}
                              invalid={!!errors.timeslot_id}
                            >
                              <option value="">Select Time Slot</option>
                              {availableTimeslots.map((timeslot) => (
                                <option key={timeslot.id} value={timeslot.id}>
                                  {timeslot.start_time} - {timeslot.end_time}
                                </option>
                              ))}
                            </Input>
                            {errors.timeslot_id && <FormFeedback>{errors.timeslot_id}</FormFeedback>}
                          </FormGroup>
                        </Col>
                      </Row>
                    )}

                    <Row>
                      <Col md="6">
                        <FormGroup>
                          <Label for="start_time">
                            Start Time <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="time"
                            id="start_time"
                            name="start_time"
                            value={formData.start_time}
                            onChange={handleInputChange}
                            invalid={!!errors.start_time}
                            required
                          />
                          {errors.start_time && <FormFeedback>{errors.start_time}</FormFeedback>}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup>
                          <Label for="end_time">
                            End Time <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="time"
                            id="end_time"
                            name="end_time"
                            value={formData.end_time}
                            onChange={handleInputChange}
                            invalid={!!errors.end_time}
                            required
                          />
                          {errors.end_time && <FormFeedback>{errors.end_time}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Label>
                            Services <span className="text-danger">*</span>
                          </Label>
                          <div className="mt-2">
                            {services.map((service) => (
                              <div key={service.id} className="form-check form-check-inline">
                                <Input
                                  type="checkbox"
                                  id={`service_${service.id}`}
                                  checked={selectedServices.includes(service.id)}
                                  onChange={(e) => handleServiceChange(e, service.id)}
                                  className="form-check-input"
                                />
                                <Label for={`service_${service.id}`} className="form-check-label">
                                  {service.name} (${service.price} - {service.duration}min)
                                </Label>
                              </div>
                            ))}
                          </div>
                          {errors.services && <div className="text-danger">{errors.services}</div>}
                        </FormGroup>
                      </Col>
                    </Row>

                    {selectedServices.length > 0 && (
                      <Row>
                        <Col md="12">
                          <div className="alert alert-info">
                            <strong>Summary:</strong>
                            <br />
                            Total Duration: {calculateTotalDuration()} minutes
                            <br />
                            Total Price: ${calculateTotalPrice().toFixed(2)}
                          </div>
                        </Col>
                      </Row>
                    )}

                    <Row>
                      <Col md="12">
                        <FormGroup>
                          <Label for="notes">Notes</Label>
                          <Input
                            type="textarea"
                            id="notes"
                            name="notes"
                            value={formData.notes}
                            onChange={handleInputChange}
                            rows="3"
                            placeholder="Additional notes or special requests..."
                            invalid={!!errors.notes}
                          />
                          {errors.notes && <FormFeedback>{errors.notes}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="12">
                        <div className="d-flex gap-2">
                          <Button
                            type="button"
                            color="info"
                            onClick={checkAvailability}
                            disabled={isCheckingAvailability}
                          >
                            {isCheckingAvailability ? (
                              <>
                                <i className="mdi mdi-spin mdi-loading me-1"></i> Checking...
                              </>
                            ) : (
                              <>
                                <i className="mdi mdi-calendar-check me-1"></i> Check Availability
                              </>
                            )}
                          </Button>

                          <Button type="submit" color="primary" disabled={isSubmitting}>
                            {isSubmitting ? (
                              <>
                                <i className="mdi mdi-spin mdi-loading me-1"></i> Creating...
                              </>
                            ) : (
                              <>
                                <i className="mdi mdi-content-save me-1"></i> Create Booking
                              </>
                            )}
                          </Button>

                          <Link href="/admin/bookings" className="btn btn-secondary">
                            <i className="mdi mdi-arrow-left me-1"></i> Back to List
                          </Link>
                        </div>
                      </Col>
                    </Row>
                  </Form>
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

export default Create
