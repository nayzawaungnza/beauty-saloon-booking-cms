"use client"

import React, { useEffect } from "react"
import { Link, usePage } from "@inertiajs/react"
import { Card, CardBody, Col, Container, Row, Badge, Table } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumbs from "@/components/common/Breadcrumb"

const Show = ({ schedule }) => {
  document.title = `Schedule Details - ${schedule.staff?.name || "Unknown"} | Admin Dashboard`

  const { flash } = usePage().props

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const getDayName = (dayOfWeek) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayOfWeek] || "Unknown"
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

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Staff Schedules" breadcrumbItem="Schedule Details" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="card-title mb-1">Schedule Details - {schedule.staff?.name || "Unknown Staff"}</h5>
                      <p className="text-muted mb-0">{getDayName(schedule.day_of_week)} Schedule</p>
                    </div>
                    <div className="d-flex gap-2">
                      <Link href={`/admin/staff-schedules/${schedule.id}/edit`} className="btn btn-primary">
                        <i className="bx bx-edit-alt me-1"></i>
                        Edit Schedule
                      </Link>
                      <Link href="/admin/staff-schedules" className="btn btn-secondary">
                        <i className="bx bx-arrow-back me-1"></i>
                        Back to List
                      </Link>
                    </div>
                  </div>

                  <Row>
                    <Col lg="8">
                      <Card className="border">
                        <CardBody>
                          <h6 className="card-title">Schedule Information</h6>
                          <Table className="table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td className="fw-medium" style={{ width: "30%" }}>
                                  Staff Member:
                                </td>
                                <td>
                                  {schedule.staff ? (
                                    <div>
                                      <div className="fw-medium">
                                        <Link href={`/admin/staff/${schedule.staff.slug}`} className="text-primary">
                                          {schedule.staff.name}
                                        </Link>
                                      </div>
                                      <small className="text-muted">
                                        {schedule.staff.email} | {schedule.staff.phone}
                                      </small>
                                    </div>
                                  ) : (
                                    <span className="text-muted">Unknown Staff</span>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Day of Week:</td>
                                <td>
                                  <Badge color="info" className="fs-6">
                                    {getDayName(schedule.day_of_week)}
                                  </Badge>
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Time Slot:</td>
                                <td>
                                  <div className="fw-medium">
                                    {formatTime(schedule.start_time)} - {formatTime(schedule.end_time)}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Availability Status:</td>
                                <td>
                                  <Badge className={schedule.is_available ? "bg-success fs-6" : "bg-danger fs-6"}>
                                    {schedule.is_available ? "Available" : "Unavailable"}
                                  </Badge>
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </CardBody>
                      </Card>
                    </Col>

                    <Col lg="4">
                      <Card className="border">
                        <CardBody>
                          <h6 className="card-title">Audit Information</h6>
                          <Table className="table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td className="fw-medium">Created:</td>
                                <td>
                                  <div>{formatDateTime(schedule.created_at)}</div>
                                  {schedule.created_by && (
                                    <small className="text-muted">by {schedule.created_by.name}</small>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Last Updated:</td>
                                <td>
                                  <div>{formatDateTime(schedule.updated_at)}</div>
                                  {schedule.updated_by && (
                                    <small className="text-muted">by {schedule.updated_by.name}</small>
                                  )}
                                </td>
                              </tr>
                            </tbody>
                          </Table>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
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

export default Show
