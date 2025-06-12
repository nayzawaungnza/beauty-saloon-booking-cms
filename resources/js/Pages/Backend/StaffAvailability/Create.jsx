"use client"

import React, { useEffect } from "react"
import { Link, useForm, usePage } from "@inertiajs/react"
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from "reactstrap"

import Breadcrumbs from "@/components/common/Breadcrumb"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Create = ({ staff, errors = {} }) => {
  document.title = "Create Staff Availability | Admin Panel"

  const { flash } = usePage().props

  const { data, setData, post, processing } = useForm({
    staff_id: "",
    day_of_week: "",
    start_time: "",
    end_time: "",
    is_available: true,
    effective_date: "",
    expiry_date: "",
    is_recurring: false,
    recurrence_pattern: {},
    recurrence_end_date: "",
    priority: 0,
    notes: "",
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

    post("/admin/staff_availability", {
      
      onError: (errors) => {
        console.error("Create errors:", errors)
        if (errors.time_conflict) {
          toast.error(errors.time_conflict);
        } else {
          toast.error('Something went wrong.');
        }
        if (errors.message) {
          toast.error(errors.message)
        } else {
          toast.error("Failed to create staff availability. Please check the form for errors.")
        }
      },
      onSuccess: () => {
        //toast.success("Staff availability created successfully!")
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
            breadcrumbItem="Create Availability"
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

                    <Row>
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
                      <Col md={6}>
                        <div className="mb-3">
                          <Label htmlFor="expiry-date-input">Expiry Date</Label>
                          <Input
                            id="expiry-date-input"
                            name="expiry_date"
                            type="date"
                            value={data.expiry_date}
                            onChange={(e) => setData("expiry_date", e.target.value)}
                            invalid={!!errors.expiry_date}
                          />
                          {errors.expiry_date && <FormFeedback type="invalid">{errors.expiry_date}</FormFeedback>}
                          <small className="text-muted">Leave empty for no expiry</small>
                        </div>
                      </Col>
                    </Row>

                    <div className="mb-3">
                      <div className="form-check form-switch form-switch-md">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="is_recurring"
                          checked={data.is_recurring}
                          onChange={(e) => setData("is_recurring", e.target.checked)}
                        />
                        <Label className="form-check-label" htmlFor="is_recurring">
                          Recurring Schedule
                        </Label>
                        <small className="text-muted d-block">Enable for recurring availability patterns</small>
                      </div>
                      {errors.is_recurring && <div className="text-danger small">{errors.is_recurring}</div>}
                    </div>

                    {data.is_recurring && (
                      <div className="mb-3 border rounded p-3 bg-light">
                        <h6 className="mb-3">Recurrence Options</h6>
                        <Row>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label htmlFor="recurrence-end-date-input">Recurrence End Date</Label>
                              <Input
                                id="recurrence-end-date-input"
                                name="recurrence_end_date"
                                type="date"
                                value={data.recurrence_end_date}
                                onChange={(e) => setData("recurrence_end_date", e.target.value)}
                                invalid={!!errors.recurrence_end_date}
                              />
                              {errors.recurrence_end_date && (
                                <FormFeedback type="invalid">{errors.recurrence_end_date}</FormFeedback>
                              )}
                              <small className="text-muted">Leave empty for no end date</small>
                            </div>
                          </Col>
                          <Col md={6}>
                            <div className="mb-3">
                              <Label htmlFor="priority-input">Priority</Label>
                              <Input
                                id="priority-input"
                                name="priority"
                                type="number"
                                min="0"
                                value={data.priority}
                                onChange={(e) => setData("priority", e.target.value)}
                                invalid={!!errors.priority}
                              />
                              {errors.priority && <FormFeedback type="invalid">{errors.priority}</FormFeedback>}
                              <small className="text-muted">Higher priority overrides lower priority</small>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    )}

                    <div className="mb-3">
                      <Label htmlFor="notes-input">Notes</Label>
                      <Input
                        id="notes-input"
                        name="notes"
                        type="textarea"
                        rows="3"
                        placeholder="Add any notes about this availability..."
                        value={data.notes}
                        onChange={(e) => setData("notes", e.target.value)}
                        invalid={!!errors.notes}
                      />
                      {errors.notes && <FormFeedback type="invalid">{errors.notes}</FormFeedback>}
                    </div>

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
              </Col>

              <Col lg={12}>
                <div className="text-end mb-4">
                  <Link href={route("admin.staff_availability.index")} className="btn btn-secondary me-2">
                    Cancel
                  </Link>
                  <Button type="submit" color="primary" disabled={processing}>
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      "Create Availability"
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

export default Create
