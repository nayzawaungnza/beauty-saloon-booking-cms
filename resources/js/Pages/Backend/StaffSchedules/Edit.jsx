"use client"

import React, { useState, useEffect } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import { Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row, Button, FormFeedback } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumbs from "@/components/common/Breadcrumb"

const Edit = ({ schedule, staff, days }) => {
  document.title = `Edit Schedule - ${schedule.staff?.name || "Unknown"} | Admin Dashboard`

  const { flash, errors } = usePage().props
  const [formData, setFormData] = useState({
    staff_id: schedule.staff_id || "",
    day_of_week: schedule.day_of_week !== undefined ? schedule.day_of_week : "",
    start_time: schedule.start_time || "",
    end_time: schedule.end_time || "",
    is_available: schedule.is_available !== undefined ? schedule.is_available : true,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    router.patch(`/admin/staff-schedules/${schedule.id}`, formData, {
      onSuccess: () => {
        toast.success("Staff schedule updated successfully!")
        setIsSubmitting(false)
      },
      onError: (errors) => {
        toast.error("Please check the form for errors")
        setIsSubmitting(false)
      },
    })
  }

  const getDayName = (dayOfWeek) => {
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return dayNames[dayOfWeek] || "Unknown"
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Staff Schedules" breadcrumbItem="Edit Schedule" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="mb-3">
                    <h5 className="card-title">
                      Edit Schedule - {schedule.staff?.name || "Unknown Staff"} ({getDayName(schedule.day_of_week)})
                    </h5>
                    <p className="card-title-desc">Update the staff schedule information below.</p>
                  </div>

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="staff_id">
                            Staff Member <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            id="staff_id"
                            name="staff_id"
                            value={formData.staff_id}
                            onChange={handleInputChange}
                            invalid={!!errors.staff_id}
                          >
                            <option value="">Select Staff Member</option>
                            {staff.map((staffMember) => (
                              <option key={staffMember.id} value={staffMember.id}>
                                {staffMember.name} - {staffMember.email}
                              </option>
                            ))}
                          </Input>
                          {errors.staff_id && <FormFeedback>{errors.staff_id}</FormFeedback>}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="day_of_week">
                            Day of Week <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            id="day_of_week"
                            name="day_of_week"
                            value={formData.day_of_week}
                            onChange={handleInputChange}
                            invalid={!!errors.day_of_week}
                          >
                            <option value="">Select Day</option>
                            {days.map((day) => (
                              <option key={day.value} value={day.value}>
                                {day.label}
                              </option>
                            ))}
                          </Input>
                          {errors.day_of_week && <FormFeedback>{errors.day_of_week}</FormFeedback>}
                        </FormGroup>
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
                          <div className="form-check">
                            <Input
                              type="checkbox"
                              id="is_available"
                              name="is_available"
                              checked={formData.is_available}
                              onChange={handleInputChange}
                              className="form-check-input"
                            />
                            <Label htmlFor="is_available" className="form-check-label">
                              Available for booking
                            </Label>
                          </div>
                          <small className="text-muted">
                            Check this if the staff member is available for bookings during this time slot.
                          </small>
                        </FormGroup>
                      </Col>
                    </Row>

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary" disabled={isSubmitting}>
                        {isSubmitting ? (
                          <>
                            <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
                            Update Schedule
                          </>
                        )}
                      </Button>
                      <Link href={`/admin/staff-schedules/${schedule.id}`} className="btn btn-secondary">
                        <i className="bx bx-x font-size-16 align-middle me-2"></i>
                        Cancel
                      </Link>
                    </div>
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

export default Edit
