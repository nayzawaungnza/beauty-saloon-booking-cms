"use client"

import React, { useEffect } from "react"
import { Link, usePage } from "@inertiajs/react"
import { Card, CardBody, Col, Container, Row, Badge, Table } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumbs from "@/components/common/Breadcrumb"

const Show = ({ timeslot }) => {
  document.title = `Timeslot Details - ${timeslot.staff?.name || "Unknown"} | Admin Dashboard`

  const { flash } = usePage().props

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

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

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    } catch (error) {
      return dateString
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
          <Breadcrumbs title="Timeslots" breadcrumbItem="Timeslot Details" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <div>
                      <h5 className="card-title mb-1">Timeslot Details - {timeslot.staff?.name || "Unknown Staff"}</h5>
                      <p className="text-muted mb-0">
                        {formatDate(timeslot.date)} | {formatTime(timeslot.start_time)} -{" "}
                        {formatTime(timeslot.end_time)}
                      </p>
                    </div>
                    <div className="d-flex gap-2">
                      <Link href={`/admin/timeslots/${timeslot.id}/edit`} className="btn btn-primary">
                        <i className="bx bx-edit-alt me-1"></i>
                        Edit Timeslot
                      </Link>
                      <Link href="/admin/timeslots" className="btn btn-secondary">
                        <i className="bx bx-arrow-back me-1"></i>
                        Back to List
                      </Link>
                    </div>
                  </div>

                  <Row>
                    <Col lg="8">
                      <Card className="border">
                        <CardBody>
                          <h6 className="card-title">Timeslot Information</h6>
                          <Table className="table-borderless mb-0">
                            <tbody>
                              <tr>
                                <td className="fw-medium" style={{ width: "30%" }}>
                                  Staff Member:
                                </td>
                                <td>
                                  {timeslot.staff ? (
                                    <div>
                                      <div className="fw-medium">
                                        <Link href={`/admin/staff/${timeslot.staff.slug}`} className="text-primary">
                                          {timeslot.staff.name}
                                        </Link>
                                      </div>
                                      <small className="text-muted">
                                        {timeslot.staff.email} | {timeslot.staff.phone}
                                      </small>
                                    </div>
                                  ) : (
                                    <span className="text-muted">Unknown Staff</span>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Branch:</td>
                                <td>
                                  {timeslot.branch ? (
                                    <div>
                                      <div className="fw-medium">
                                        <Link href={`/admin/branches/${timeslot.branch.slug}`} className="text-primary">
                                          {timeslot.branch.name}
                                        </Link>
                                      </div>
                                      <small className="text-muted">
                                        {timeslot.branch.address}, {timeslot.branch.city}
                                      </small>
                                    </div>
                                  ) : (
                                    <span className="text-muted">Unknown Branch</span>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Date:</td>
                                <td>
                                  <div className="fw-medium">{formatDate(timeslot.date)}</div>
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Time Slot:</td>
                                <td>
                                  <div className="fw-medium">
                                    {formatTime(timeslot.start_time)} - {formatTime(timeslot.end_time)}
                                  </div>
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Availability Status:</td>
                                <td>
                                  <Badge className={timeslot.is_available ? "bg-success fs-6" : "bg-danger fs-6"}>
                                    {timeslot.is_available ? "Available" : "Unavailable"}
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
                                  <div>{formatDateTime(timeslot.created_at)}</div>
                                  {timeslot.created_by && (
                                    <small className="text-muted">by {timeslot.created_by.name}</small>
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td className="fw-medium">Last Updated:</td>
                                <td>
                                  <div>{formatDateTime(timeslot.updated_at)}</div>
                                  {timeslot.updated_by && (
                                    <small className="text-muted">by {timeslot.updated_by.name}</small>
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
