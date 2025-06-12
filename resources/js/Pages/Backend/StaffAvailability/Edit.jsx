"use client"

import React, { useEffect } from "react"
import { Link, router, useForm, usePage } from "@inertiajs/react"
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from "reactstrap"

import Breadcrumbs from "@/components/common/Breadcrumb"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Edit = ({ staffAvailability, staff, errors = {} }) => {
  document.title = `Edit Availability | Admin Panel`

  const { flash } = usePage().props

  const { data, setData, post, processing } = useForm({
    staff_id: staffAvailability.staff_id || "",
    day_of_week: staffAvailability.day_of_week !== undefined ? staffAvailability.day_of_week : "",
    start_time: staffAvailability.start_time_format || staffAvailability.start_time?.substring(0, 5) || "",
    end_time: staffAvailability.end_time_format || staffAvailability.end_time?.substring(0, 5) || "",
    is_available: staffAvailability.is_available !== undefined ? staffAvailability.is_available : true,
    effective_date: staffAvailability.effective_date || "",
    expiry_date: staffAvailability.expiry_date || "",
    is_recurring: staffAvailability.is_recurring || false,
    recurrence_pattern: staffAvailability.recurrence_pattern || {},
    recurrence_end_date: staffAvailability.recurrence_end_date || "",
    priority: staffAvailability.priority || 0,
    notes: staffAvailability.notes || "",
    _method: "PUT",
  })

  // Handle flash messages
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

    router.post(`/admin/staff_availability/${staffAvailability.id}`, data, {
      onSuccess: () => {
        //toast.success("Staff availability updated successfully!")
      },
      onError: (errors) => {
        console.error("Update errors:", errors)
        if (errors.message) {
          toast.error(errors.message)
        } else {
          toast.error("Failed to update staff availability. Please check the form for errors.")
        }
      },
    })
  }

  const getDayName = (dayNumber) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayNumber] || "Unknown"
  }

  const dayOptions = [
    { value: 0, label: "Sunday" },
    { value: 1, label: "Monday" },
    { value: 2, label: "Tuesday" },
    { value: 3, label: "Wednesday" },
    { value: 4, label: "Thursday" },
    { value: 5, label: "Friday" },
    { value: 6, label: "Saturday" },
  ]

  const formatTime = (timeString) => {
    if (!timeString) return "Not set"
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Staff Availability"
            breadcrumbItem="Edit Availability"
            breadcrumbItems={[
              { title: "Staff Availability", link: route("admin.staff_availability.index") },
              { title: "Edit", active: true },
            ]}
          />

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Label htmlFor="staff-select">
                        Staff Member <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="staff-select"
                        name="staff_id"
                        type="select"
                        value={data.staff_id}
                        onChange={(e) => setData("staff_id", e.target.value)}
                        invalid={!!errors.staff_id}
                      >
                        <option value="">Select Staff Member...</option>
                        {staff &&
                          staff.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                            </option>
                          ))}
                      </Input>
                      {errors.staff_id && <FormFeedback type="invalid">{errors.staff_id}</FormFeedback>}
                    </div>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="day-select">
                            Day of Week <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="day-select"
                            name="day_of_week"
                            type="select"
                            value={data.day_of_week}
                            onChange={(e) => setData("day_of_week", Number.parseInt(e.target.value))}
                            invalid={!!errors.day_of_week}
                          >
                            <option value="">Select Day...</option>
                            {dayOptions.map((day) => (
                              <option key={day.value} value={day.value}>
                                {day.label}
                              </option>
                            ))}
                          </Input>
                          {errors.day_of_week && <FormFeedback type="invalid">{errors.day_of_week}</FormFeedback>}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="effective-date-input">Effective Date</Label>
                          <Input
                            id="effective-date-input"
                            name="effective_date"
                            type="date"
                            value={data.effective_date}
                            onChange={(e) => setData("effective_date", e.target.value)}
                            invalid={!!errors.effective_date}
                          />
                          {errors.effective_date && <FormFeedback type="invalid">{errors.effective_date}</FormFeedback>}
                          <small className="text-muted">Leave empty for immediate effect</small>
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="start-time-input">
                            Start Time <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="start-time-input"
                            name="start_time"
                            type="time"
                            value={data.start_time}
                            onChange={(e) => setData("start_time", e.target.value)}
                            invalid={!!errors.start_time}
                          />
                          {errors.start_time && <FormFeedback type="invalid">{errors.start_time}</FormFeedback>}
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="end-time-input">
                            End Time <span className="text-danger">*</span>
                          </Label>
                          <Input
                            id="end-time-input"
                            name="end_time"
                            type="time"
                            value={data.end_time}
                            onChange={(e) => setData("end_time", e.target.value)}
                            invalid={!!errors.end_time}
                          />
                          {errors.end_time && <FormFeedback type="invalid">{errors.end_time}</FormFeedback>}
                        </div>
                      </Col>
                    </Row>

                    <div className="mb-3">
                      <div className="form-check form-switch form-switch-md">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="is_available"
                          checked={data.is_available}
                          onChange={(e) => setData("is_available", e.target.checked)}
                        />
                        <Label className="form-check-label" htmlFor="is_available">
                          Available for Booking
                        </Label>
                        <small className="text-muted d-block">Enable this time slot for booking appointments</small>
                      </div>
                      {errors.is_available && <div className="text-danger small">{errors.is_available}</div>}
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Availability Settings</h5>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-primary-subtle rounded me-3">
                        <i className="bx bx-user text-primary font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Staff Member</h6>
                        <p className="text-muted mb-0">
                          {data.staff_id ? staff?.find((s) => s.id == data.staff_id)?.name : "Not selected"}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-success-subtle rounded me-3">
                        <i className="bx bx-calendar text-success font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Day</h6>
                        <p className="text-muted mb-0">
                          {data.day_of_week !== "" ? getDayName(data.day_of_week) : "Not selected"}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-info-subtle rounded me-3">
                        <i className="bx bx-time text-info font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Time Slot</h6>
                        <p className="text-muted mb-0">
                          {data.start_time && data.end_time
                            ? `${formatTime(data.start_time)} - ${formatTime(data.end_time)}`
                            : "Not set"}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-warning-subtle rounded me-3">
                        <i className="bx bx-calendar-check text-warning font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Effective Date</h6>
                        <p className="text-muted mb-0">
                          {data.effective_date ? new Date(data.effective_date).toLocaleDateString() : "Immediate"}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center">
                      <div className="avatar-sm bg-secondary-subtle rounded me-3">
                        <i className="bx bx-check-circle text-secondary font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Status</h6>
                        <p className="text-muted mb-0">{data.is_available ? "Available" : "Unavailable"}</p>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Preview</h5>
                    <div className="border rounded p-3">
                      <h6 className="mb-2">
                        {data.staff_id ? staff?.find((s) => s.id == data.staff_id)?.name : "Staff Member"}
                      </h6>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-primary">
                          {data.day_of_week !== "" ? getDayName(data.day_of_week) : "Day"}
                        </span>
                        <span className={`badge ${data.is_available ? "bg-success" : "bg-danger"}`}>
                          {data.is_available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <p className="text-muted small mb-0">
                        {data.start_time && data.end_time
                          ? `${formatTime(data.start_time)} - ${formatTime(data.end_time)}`
                          : "Time not set"}
                      </p>
                      {data.effective_date && (
                        <p className="text-muted small mb-0">
                          Effective: {new Date(data.effective_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Current Info</h5>
                    <div className="border rounded p-3 bg-light">
                      <h6 className="mb-2">Original Schedule</h6>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="badge bg-secondary">{getDayName(staffAvailability.day_of_week)}</span>
                        <span className={`badge ${staffAvailability.is_available ? "bg-success" : "bg-danger"}`}>
                          {staffAvailability.is_available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      <p className="text-muted small mb-0">
                        {formatTime(staffAvailability.start_time)} - {formatTime(staffAvailability.end_time)}
                      </p>
                      {staffAvailability.effective_date && (
                        <p className="text-muted small mb-0">
                          Effective: {new Date(staffAvailability.effective_date).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={12}>
                <div className="text-end mb-4">
                  <Link
                    href={route("admin.staff_availability.show", staffAvailability.id)}
                    className="btn btn-secondary me-2"
                  >
                    Cancel
                  </Link>
                  <Button type="submit" color="primary" disabled={processing}>
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Updating...
                      </>
                    ) : (
                      "Update Availability"
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
