"use client"

import React, { useEffect, useState } from "react"
import { Link, router, usePage } from "@inertiajs/react"
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  Label,
  Row,
  Table,
  Badge,
  UncontrolledTooltip,
} from "reactstrap"

import Breadcrumbs from "@/components/common/Breadcrumb"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Calendar = ({ staff, selectedStaffId, startDate, endDate, availabilityData }) => {
  document.title = "Staff Availability Calendar | Admin Panel"

  const { flash } = usePage().props
  const [currentStaffId, setCurrentStaffId] = useState(selectedStaffId || "")
  const [currentStartDate, setCurrentStartDate] = useState(startDate)
  const [currentEndDate, setCurrentEndDate] = useState(endDate)

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleFilterChange = () => {
    const params = new URLSearchParams()
    if (currentStaffId) params.append("staff_id", currentStaffId)
    if (currentStartDate) params.append("start_date", currentStartDate)
    if (currentEndDate) params.append("end_date", currentEndDate)

    router.get(route("admin.staff_availability.calendar") + "?" + params.toString())
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const getDayName = (dayNumber) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayNumber] || "Unknown"
  }

  const generateDateRange = () => {
    const dates = []
    const start = new Date(currentStartDate)
    const end = new Date(currentEndDate)

    for (let date = new Date(start); date <= end; date.setDate(date.getDate() + 1)) {
      dates.push(new Date(date))
    }

    return dates
  }

  const getAvailabilityForDate = (date) => {
    const dateStr = date.toISOString().split("T")[0]
    return availabilityData[dateStr] || []
  }

  const selectedStaff = staff.find((s) => s.id == currentStaffId)

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs
            title="Staff Availability"
            breadcrumbItem="Calendar View"
            breadcrumbItems={[
              { title: "Staff Availability", link: route("admin.staff_availability.index") },
              { title: "Calendar", active: true },
            ]}
          />

          {/* Filters */}
          <Row className="mb-4">
            <Col lg="12">
              <Card>
                <CardBody>
                  <h5 className="card-title mb-3">Filters</h5>
                  <Row>
                    <Col md={4}>
                      <div className="mb-3">
                        <Label htmlFor="staff-select">Staff Member</Label>
                        <Input
                          id="staff-select"
                          type="select"
                          value={currentStaffId}
                          onChange={(e) => setCurrentStaffId(e.target.value)}
                        >
                          <option value="">Select Staff Member...</option>
                          {staff.map((member) => (
                            <option key={member.id} value={member.id}>
                              {member.name}
                            </option>
                          ))}
                        </Input>
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input
                          id="start-date"
                          type="date"
                          value={currentStartDate}
                          onChange={(e) => setCurrentStartDate(e.target.value)}
                        />
                      </div>
                    </Col>
                    <Col md={3}>
                      <div className="mb-3">
                        <Label htmlFor="end-date">End Date</Label>
                        <Input
                          id="end-date"
                          type="date"
                          value={currentEndDate}
                          onChange={(e) => setCurrentEndDate(e.target.value)}
                        />
                      </div>
                    </Col>
                    <Col md={2}>
                      <div className="mb-3">
                        <Label>&nbsp;</Label>
                        <div>
                          <Button color="primary" onClick={handleFilterChange}>
                            Apply Filters
                          </Button>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>
          </Row>

          {/* Calendar */}
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title mb-0">
                      {selectedStaff ? `${selectedStaff.name}'s Availability` : "Staff Availability Calendar"}
                    </h5>
                    <div className="d-flex gap-2">
                      <Link href={route("admin.staff_availability.create")} className="btn btn-primary btn-sm">
                        <i className="mdi mdi-plus me-1"></i>
                        Add Availability
                      </Link>
                      <Link href={route("admin.staff_availability.create-batch")} className="btn btn-success btn-sm">
                        <i className="mdi mdi-calendar-plus me-1"></i>
                        Batch Create
                      </Link>
                    </div>
                  </div>

                  {currentStaffId ? (
                    <div className="table-responsive">
                      <Table className="table-bordered">
                        <thead className="table-light">
                          <tr>
                            <th>Date</th>
                            <th>Day</th>
                            <th>Availability</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {generateDateRange().map((date) => {
                            const availabilities = getAvailabilityForDate(date)
                            const dayName = getDayName(date.getDay())

                            return (
                              <tr key={date.toISOString()}>
                                <td>
                                  <div className="fw-bold">{date.toLocaleDateString()}</div>
                                </td>
                                <td>
                                  <Badge color="primary">{dayName}</Badge>
                                </td>
                                <td>
                                  {availabilities.length > 0 ? (
                                    <div className="d-flex flex-wrap gap-1">
                                      {availabilities.map((availability) => (
                                        <div key={availability.id} className="border rounded p-2 mb-1 w-100">
                                          <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                              <span className="fw-bold">
                                                {formatTime(availability.start_time)} -{" "}
                                                {formatTime(availability.end_time)}
                                              </span>
                                              <div className="d-flex gap-1 mt-1">
                                                <Badge
                                                  className={availability.is_available ? "bg-success" : "bg-danger"}
                                                >
                                                  {availability.is_available ? "Available" : "Unavailable"}
                                                </Badge>
                                                {availability.is_recurring && <Badge color="info">Recurring</Badge>}
                                                {availability.priority > 0 && (
                                                  <Badge color="warning">Priority: {availability.priority}</Badge>
                                                )}
                                              </div>
                                            </div>
                                            <div className="d-flex gap-1">
                                              <Link
                                                href={route("admin.staff_availability.edit", availability.id)}
                                                className="btn btn-sm btn-outline-primary"
                                                id={`edit-${availability.id}`}
                                              >
                                                <i className="mdi mdi-pencil"></i>
                                              </Link>
                                              <UncontrolledTooltip placement="top" target={`edit-${availability.id}`}>
                                                Edit
                                              </UncontrolledTooltip>
                                            </div>
                                          </div>
                                          {availability.notes && (
                                            <div className="text-muted small mt-1">{availability.notes}</div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <div className="text-center text-muted py-2">
                                      <i className="mdi mdi-calendar-remove"></i>
                                      <div>No availability</div>
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <div className="d-flex gap-1">
                                    <Link
                                      href={`${route("admin.staff_availability.create")}?staff_id=${currentStaffId}&day_of_week=${date.getDay()}`}
                                      className="btn btn-sm btn-outline-success"
                                      id={`add-${date.toISOString().split("T")[0].replace(/-/g, "")}`}
                                    >
                                      <i className="mdi mdi-plus"></i>
                                    </Link>
                                    <UncontrolledTooltip
                                      placement="top"
                                      target={`add-${date.toISOString().split("T")[0].replace(/-/g, "")}`}
                                    >
                                      Add availability for this day
                                    </UncontrolledTooltip>
                                  </div>
                                </td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </Table>
                    </div>
                  ) : (
                    <div className="text-center py-5">
                      <i className="mdi mdi-calendar-outline display-4 text-muted"></i>
                      <h5 className="mt-3">Select a Staff Member</h5>
                      <p className="text-muted">
                        Choose a staff member from the dropdown above to view their availability calendar.
                      </p>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default Calendar
