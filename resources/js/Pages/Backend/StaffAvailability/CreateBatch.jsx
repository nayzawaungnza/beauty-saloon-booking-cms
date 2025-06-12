"use client"

import React, { useEffect, useState } from "react"
import { Link, useForm, usePage } from "@inertiajs/react"
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row, Badge } from "reactstrap"

import Breadcrumbs from "@/components/common/Breadcrumb"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const CreateBatch = ({ staff, errors = {} }) => {
  document.title = "Create Batch Staff Availability | Admin Panel"

  const { flash } = usePage().props
  const [selectedDays, setSelectedDays] = useState([])
  const [isRecurring, setIsRecurring] = useState(false)
  const [showRecurrenceOptions, setShowRecurrenceOptions] = useState(false)

  const { data, setData, post, processing } = useForm({
    staff_id: "",
    days_of_week: [],
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

  // Update form data when days are selected
  useEffect(() => {
    setData("days_of_week", selectedDays)
  }, [selectedDays])

  // Update form data when recurring option changes
  useEffect(() => {
    setData("is_recurring", isRecurring)
    setShowRecurrenceOptions(isRecurring)
  }, [isRecurring])

  const handleDayToggle = (dayNumber) => {
    if (selectedDays.includes(dayNumber)) {
      setSelectedDays(selectedDays.filter((day) => day !== dayNumber))
    } else {
      setSelectedDays([...selectedDays, dayNumber])
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    post(route("admin.staff_availability.store-batch"), {
      onSuccess: () => {
        //toast.success("Staff availabilities created successfully!")
      },
      onError: (errors) => {
        console.error("Create errors:", errors)
        if (errors.message) {
          toast.error(errors.message)
        } else {
          toast.error("Failed to create staff availabilities. Please check the form for errors.")
        }
      },
    })
  }

  const getDayName = (dayNumber) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayNumber] || "Unknown"
  }

  const formatTime = (timeString) => {
    if (!timeString) return "Not set"
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const handleSelectWeekdays = () => {
    setSelectedDays([1, 2, 3, 4, 5]) // Monday to Friday
  }

  const handleSelectWeekend = () => {
    setSelectedDays([0, 6]) // Sunday and Saturday
  }

  const handleSelectAllDays = () => {
    setSelectedDays([0, 1, 2, 3, 4, 5, 6]) // All days
  }

  const handleClearDays = () => {
    setSelectedDays([])
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Staff Availability"
            breadcrumbItem="Create Batch Availability"
            breadcrumbItems={[
              { title: "Staff Availability", link: route("admin.staff_availability.index") },
              { title: "Create Batch", active: true },
            ]}
          />

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-4">Batch Availability Settings</h5>

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

                    <div className="mb-4">
                      <Label className="form-label">
                        Days of Week <span className="text-danger">*</span>
                      </Label>
                      <div className="d-flex flex-wrap gap-2 mb-2">
                        <Button type="button" color="outline-primary" size="sm" onClick={handleSelectWeekdays}>
                          Select Weekdays
                        </Button>
                        <Button type="button" color="outline-primary" size="sm" onClick={handleSelectWeekend}>
                          Select Weekend
                        </Button>
                        <Button type="button" color="outline-primary" size="sm" onClick={handleSelectAllDays}>
                          Select All
                        </Button>
                        <Button type="button" color="outline-secondary" size="sm" onClick={handleClearDays}>
                          Clear All
                        </Button>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                          <Button
                            key={day}
                            type="button"
                            color={selectedDays.includes(day) ? "primary" : "light"}
                            onClick={() => handleDayToggle(day)}
                            className="mb-2"
                          >
                            {getDayName(day)}
                          </Button>
                        ))}
                      </div>
                      {errors.days_of_week && <div className="text-danger small mt-1">{errors.days_of_week}</div>}
                    </div>

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
                          id="is_available"
                          checked={data.is_available}
                          onChange={(e) => setData("is_available", e.target.checked)}
                        />
                        <Label className="form-check-label" htmlFor="is_available">
                          Available for Booking
                        </Label>
                        <small className="text-muted d-block">Enable these time slots for booking appointments</small>
                      </div>
                      {errors.is_available && <div className="text-danger small">{errors.is_available}</div>}
                    </div>

                    <div className="mb-3">
                      <div className="form-check form-switch form-switch-md">
                        <Input
                          type="checkbox"
                          className="form-check-input"
                          id="is_recurring"
                          checked={isRecurring}
                          onChange={(e) => setIsRecurring(e.target.checked)}
                        />
                        <Label className="form-check-label" htmlFor="is_recurring">
                          Recurring Schedule
                        </Label>
                        <small className="text-muted d-block">Enable for recurring availability patterns</small>
                      </div>
                      {errors.is_recurring && <div className="text-danger small">{errors.is_recurring}</div>}
                    </div>

                    {showRecurrenceOptions && (
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
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Summary</h5>

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
                        <h6 className="mb-1">Selected Days</h6>
                        <div className="d-flex flex-wrap gap-1">
                          {selectedDays.length > 0 ? (
                            selectedDays.map((day) => (
                              <Badge key={day} color="primary" className="me-1">
                                {getDayName(day)}
                              </Badge>
                            ))
                          ) : (
                            <span className="text-muted">No days selected</span>
                          )}
                        </div>
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
                        <h6 className="mb-1">Date Range</h6>
                        <p className="text-muted mb-0">
                          {data.effective_date
                            ? `From: ${new Date(data.effective_date).toLocaleDateString()}`
                            : "From: Immediate"}
                          {data.expiry_date && (
                            <span className="d-block">{`To: ${new Date(data.expiry_date).toLocaleDateString()}`}</span>
                          )}
                          {!data.expiry_date && <span className="d-block">To: No expiry</span>}
                        </p>
                      </div>
                    </div>

                    <div className="d-flex align-items-center mb-3">
                      <div className="avatar-sm bg-secondary-subtle rounded me-3">
                        <i className="bx bx-check-circle text-secondary font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                      </div>
                      <div>
                        <h6 className="mb-1">Status</h6>
                        <p className="text-muted mb-0">{data.is_available ? "Available" : "Unavailable"}</p>
                      </div>
                    </div>

                    {isRecurring && (
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm bg-danger-subtle rounded me-3">
                          <i className="bx bx-repeat text-danger font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">Recurrence</h6>
                          <p className="text-muted mb-0">
                            Recurring
                            {data.recurrence_end_date && (
                              <span className="d-block">
                                Until: {new Date(data.recurrence_end_date).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    )}
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Preview</h5>
                    <div className="border rounded p-3">
                      <h6 className="mb-2">
                        {data.staff_id ? staff?.find((s) => s.id == data.staff_id)?.name : "Staff Member"}
                      </h6>
                      <div className="mb-2">
                        {selectedDays.length > 0 ? (
                          <div className="d-flex flex-wrap gap-1 mb-2">
                            {selectedDays.map((day) => (
                              <Badge key={day} color="primary" className="me-1">
                                {getDayName(day)}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <Badge color="secondary">No days selected</Badge>
                        )}
                      </div>
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className="text-muted small">
                          {data.start_time && data.end_time
                            ? `${formatTime(data.start_time)} - ${formatTime(data.end_time)}`
                            : "Time not set"}
                        </span>
                        <span className={`badge ${data.is_available ? "bg-success" : "bg-danger"}`}>
                          {data.is_available ? "Available" : "Unavailable"}
                        </span>
                      </div>
                      {(data.effective_date || data.expiry_date) && (
                        <div className="text-muted small">
                          {data.effective_date && (
                            <span className="d-block">From: {new Date(data.effective_date).toLocaleDateString()}</span>
                          )}
                          {data.expiry_date && (
                            <span className="d-block">To: {new Date(data.expiry_date).toLocaleDateString()}</span>
                          )}
                        </div>
                      )}
                      {isRecurring && (
                        <div className="mt-2">
                          <Badge color="info">Recurring</Badge>
                          {data.recurrence_end_date && (
                            <small className="text-muted d-block mt-1">
                              Until {new Date(data.recurrence_end_date).toLocaleDateString()}
                            </small>
                          )}
                        </div>
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
                  <Button type="submit" color="primary" disabled={processing || selectedDays.length === 0}>
                    {processing ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-1" role="status" aria-hidden="true"></span>
                        Creating...
                      </>
                    ) : (
                      `Create ${selectedDays.length} Availability Schedule${selectedDays.length !== 1 ? "s" : ""}`
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

export default CreateBatch
