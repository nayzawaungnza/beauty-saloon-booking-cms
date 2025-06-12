"use client"

import React from "react"
import { Link, usePage } from "@inertiajs/react"
import Breadcrumbs from "@/components/common/Breadcrumb"
import { Col, Row, Card, CardBody, CardHeader, Badge, Table } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Show = ({ activityLog }) => {
  document.title = `Activity Log Details | Admin Dashboard`

  const { flash } = usePage().props

  React.useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    })
  }

  const getEventBadgeColor = (event) => {
    switch (event) {
      case "created":
        return "success"
      case "updated":
        return "warning"
      case "deleted":
        return "danger"
      default:
        return "info"
    }
  }

  const getModelTypeForActivity = (type) => {
    if (!type) return "Unknown"
    return type.replace("App\\Models\\", "")
  }

  const renderJsonData = (data) => {
    if (!data) return "N/A"

    try {
      const parsed = typeof data === "string" ? JSON.parse(data) : data
      return (
        <pre className="bg-light p-2 rounded" style={{ fontSize: "12px", maxHeight: "200px", overflow: "auto" }}>
          {JSON.stringify(parsed, null, 2)}
        </pre>
      )
    } catch (e) {
      return <span className="text-muted">Invalid JSON data</span>
    }
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Activity Logs"
            breadcrumbItem="Activity Details"
            breadcrumbItems={[
              { title: "Activity Logs", link: "/admin/activity-logs" },
              { title: "Details", active: true },
            ]}
          />

          {/* Header Section */}
          <Row>
            <Col lg="12">
              <Card>
                <CardHeader className="border-bottom">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-3">
                        <div
                          className="bg-light rounded d-flex align-items-center justify-content-center"
                          style={{ width: "60px", height: "60px" }}
                        >
                          <i className="mdi mdi-history text-primary fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h4 className="mb-1">Activity Log Details</h4>
                        <div className="d-flex align-items-center gap-2">
                          <Badge color={getEventBadgeColor(activityLog.event)} className="text-capitalize">
                            {activityLog.event}
                          </Badge>
                          <Badge color="info">ID: {activityLog.id}</Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <Link href="/admin/activity-logs" className="btn btn-secondary">
                        <i className="mdi mdi-arrow-left me-1"></i>
                        Back to Logs
                      </Link>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Activity Details */}
            <Col lg="8">
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-information-outline me-2"></i>
                    Activity Information
                  </h5>
                </CardHeader>
                <CardBody>
                  <Table className="table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold" style={{ width: "200px" }}>
                          Event:
                        </td>
                        <td>
                          <Badge color={getEventBadgeColor(activityLog.event)} className="text-capitalize">
                            {activityLog.event}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Description:</td>
                        <td>{activityLog.description || "N/A"}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Subject Type:</td>
                        <td>
                          {activityLog.subject_type ? (
                            <Badge color="info" pill>
                              {getModelTypeForActivity(activityLog.subject_type)}
                            </Badge>
                          ) : (
                            "N/A"
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Subject ID:</td>
                        <td>
                          <code>{activityLog.subject_id || "N/A"}</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">User:</td>
                        <td>
                          {activityLog.causer ? (
                            <div>
                              <div className="fw-medium">{activityLog.causer.name}</div>
                              <small className="text-muted">{activityLog.causer.email}</small>
                            </div>
                          ) : (
                            <span className="text-muted">System</span>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">User Type:</td>
                        <td>
                          {activityLog.causer_type ? (
                            <Badge color="info" pill>
                              {getModelTypeForActivity(activityLog.causer_type)}
                            </Badge>
                          ) : (
                            <Badge color="secondary" pill>
                              System
                            </Badge>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">User ID:</td>
                        <td>
                          <code>{activityLog.causer_id || "N/A"}</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Date & Time:</td>
                        <td>{formatDate(activityLog.created_at)}</td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>

              {/* Properties */}
              {activityLog.properties && (
                <Card>
                  <CardHeader>
                    <h5 className="card-title mb-0">
                      <i className="mdi mdi-code-json me-2"></i>
                      Properties
                    </h5>
                  </CardHeader>
                  <CardBody>{renderJsonData(activityLog.properties)}</CardBody>
                </Card>
              )}
            </Col>

            {/* Sidebar */}
            <Col lg="4">
              {/* Technical Details */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-cog-outline me-2"></i>
                    Technical Details
                  </h5>
                </CardHeader>
                <CardBody>
                  <Table className="table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Log Name:</td>
                        <td>
                          <Badge color="secondary">{activityLog.log_name || "default"}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Batch UUID:</td>
                        <td>
                          <small className="text-muted font-monospace">{activityLog.batch_uuid || "N/A"}</small>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">IP Address:</td>
                        <td>
                          <code>{activityLog.properties?.ip || "N/A"}</code>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">User Agent:</td>
                        <td>
                          <small className="text-muted">{activityLog.properties?.user_agent || "N/A"}</small>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>

              {/* Subject Details */}
              {activityLog.subject && (
                <Card>
                  <CardHeader>
                    <h5 className="card-title mb-0">
                      <i className="mdi mdi-target me-2"></i>
                      Subject Details
                    </h5>
                  </CardHeader>
                  <CardBody>{renderJsonData(activityLog.subject)}</CardBody>
                </Card>
              )}

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-lightning-bolt-outline me-2"></i>
                    Quick Actions
                  </h5>
                </CardHeader>
                <CardBody>
                  <div className="d-grid gap-2">
                    <Link href="/admin/activity-logs" className="btn btn-outline-info">
                      <i className="mdi mdi-arrow-left me-2"></i>
                      Back to Activity Logs
                    </Link>

                    <button
                      className="btn btn-outline-secondary"
                      onClick={() => navigator.clipboard.writeText(JSON.stringify(activityLog, null, 2))}
                    >
                      <i className="mdi mdi-content-copy me-2"></i>
                      Copy JSON Data
                    </button>

                    <button className="btn btn-outline-primary" onClick={() => window.print()}>
                      <i className="mdi mdi-printer me-2"></i>
                      Print Details
                    </button>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
      <ToastContainer />
    </React.Fragment>
  )
}

export default Show
