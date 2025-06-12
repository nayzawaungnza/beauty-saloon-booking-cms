"use client"

import React, { useState } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import Breadcrumbs from "@/components/common/Breadcrumb"
import DeleteModal from "@/components/common/DeleteModal"
import ActivateModal from "@/components/common/ActivateModal"
import { Col, Row, Card, CardBody, CardHeader, Badge, Button, UncontrolledTooltip, Table } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Show = ({ branch }) => {
  document.title = `${branch.name} | Branch Details`

  const { flash } = usePage().props
  const [deleteModal, setDeleteModal] = useState(false)
  const [activateModal, setActivateModal] = useState(false)

  React.useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleDeleteBranch = () => {
    if (branch && branch.id) {
      router.delete(route("admin.branches.destroy", branch.id), {
        onSuccess: () => {
          setDeleteModal(false)
          router.visit(route("admin.branches.index"))
        },
        onError: (errors) => {
          toast.error("Failed to delete branch")
          console.error(errors)
        },
      })
    }
  }

  const handleActivateBranch = () => {
    if (branch && branch.id) {
      const action = branch.is_active ? "deactivate" : "activate"

      router.patch(
        route("admin.branches.changeStatus", branch.id),
        { is_active: !branch.is_active },
        {
          onSuccess: () => {
            setActivateModal(false)
            toast.success(`Branch ${action}d successfully`)
          },
          onError: (errors) => {
            toast.error(`Failed to ${action} branch`)
            console.error(errors)
          },
        },
      )
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <React.Fragment>
      <DeleteModal show={deleteModal} onDeleteClick={handleDeleteBranch} onCloseClick={() => setDeleteModal(false)} />

      <ActivateModal
        show={activateModal}
        service={branch}
        onActivateClick={handleActivateBranch}
        onCloseClick={() => setActivateModal(false)}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Branches" breadcrumbItem="Branch Details" />

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
                          <i className="mdi mdi-office-building text-muted fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h4 className="mb-1">{branch.name}</h4>
                        <div className="d-flex align-items-center gap-2">
                          <Badge className={branch.is_active ? "bg-success" : "bg-danger"}>
                            {branch.is_active ? "Active" : "Inactive"}
                          </Badge>
                          {branch.manager && (
                            <Badge className="bg-info">
                              <i className="mdi mdi-account-tie me-1"></i>
                              Managed
                            </Badge>
                          )}
                          {branch.latitude && branch.longitude && (
                            <Badge className="bg-warning">
                              <i className="mdi mdi-map-marker me-1"></i>
                              GPS Located
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2">
                        <Link
                          href={route("admin.branches.edit", branch.id)}
                          className="btn btn-primary"
                          id="edit-branch"
                        >
                          <i className="mdi mdi-pencil-outline me-1"></i>
                          Edit Branch
                        </Link>
                        <UncontrolledTooltip placement="top" target="edit-branch">
                          Edit this branch
                        </UncontrolledTooltip>

                        <Button
                          color={branch.is_active ? "warning" : "success"}
                          onClick={() => setActivateModal(true)}
                          id="toggle-status"
                        >
                          <i className={`mdi ${branch.is_active ? "mdi-pause" : "mdi-play"} me-1`}></i>
                          {branch.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <UncontrolledTooltip placement="top" target="toggle-status">
                          {branch.is_active ? "Deactivate" : "Activate"} this branch
                        </UncontrolledTooltip>

                        <Button color="danger" onClick={() => setDeleteModal(true)} id="delete-branch">
                          <i className="mdi mdi-delete-outline me-1"></i>
                          Delete
                        </Button>
                        <UncontrolledTooltip placement="top" target="delete-branch">
                          Delete this branch
                        </UncontrolledTooltip>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Branch Details */}
            <Col lg="8">
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-information-outline me-2"></i>
                    Branch Information
                  </h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Branch Name</label>
                        <p className="text-muted mb-0">{branch.name}</p>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Slug</label>
                        <p className="text-muted mb-0">
                          <code>{branch.slug}</code>
                        </p>
                      </div>
                    </Col>
                  </Row>

                  {branch.description && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Description</label>
                      <p className="text-muted mb-0">{branch.description}</p>
                    </div>
                  )}

                  <Row>
                    <Col md="12">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Address</label>
                        <p className="text-muted mb-0">{branch.address || "No address provided"}</p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="4">
                      <div className="mb-3">
                        <label className="form-label fw-bold">City</label>
                        <p className="text-muted mb-0">{branch.city || "Not specified"}</p>
                      </div>
                    </Col>
                    <Col md="4">
                      <div className="mb-3">
                        <label className="form-label fw-bold">State</label>
                        <p className="text-muted mb-0">{branch.state || "Not specified"}</p>
                      </div>
                    </Col>
                    <Col md="4">
                      <div className="mb-3">
                        <label className="form-label fw-bold">ZIP Code</label>
                        <p className="text-muted mb-0">{branch.zip || "Not specified"}</p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Phone Number</label>
                        <p className="text-muted mb-0">{branch.phone || "Not provided"}</p>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Manager</label>
                        <p className="text-muted mb-0">
                          {branch.manager ? (
                            <>
                              {branch.manager.name}
                              <br />
                              <small className="text-muted">{branch.manager.email}</small>
                            </>
                          ) : (
                            "No manager assigned"
                          )}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  {(branch.latitude || branch.longitude) && (
                    <Row>
                      <Col md="6">
                        <div className="mb-3">
                          <label className="form-label fw-bold">Latitude</label>
                          <p className="text-muted mb-0">{branch.latitude || "Not set"}</p>
                        </div>
                      </Col>
                      <Col md="6">
                        <div className="mb-3">
                          <label className="form-label fw-bold">Longitude</label>
                          <p className="text-muted mb-0">{branch.longitude || "Not set"}</p>
                        </div>
                      </Col>
                    </Row>
                  )}
                </CardBody>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col lg="4">
              {/* Branch Settings */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-cog-outline me-2"></i>
                    Branch Settings
                  </h5>
                </CardHeader>
                <CardBody>
                  <Table className="table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Status:</td>
                        <td>
                          <Badge className={branch.is_active ? "bg-success" : "bg-danger"}>
                            {branch.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Manager:</td>
                        <td>
                          <Badge className={branch.manager ? "bg-info" : "bg-secondary"}>
                            {branch.manager ? "Assigned" : "Unassigned"}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">GPS Location:</td>
                        <td>
                          <Badge className={branch.latitude && branch.longitude ? "bg-warning" : "bg-secondary"}>
                            {branch.latitude && branch.longitude ? "Available" : "Not Set"}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Contact:</td>
                        <td>
                          <Badge className={branch.phone ? "bg-success" : "bg-secondary"}>
                            {branch.phone ? "Available" : "Not Set"}
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-clock-outline me-2"></i>
                    Metadata
                  </h5>
                </CardHeader>
                <CardBody>
                  <Table className="table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Created:</td>
                        <td>
                          <small className="text-muted">{formatDate(branch.created_at)}</small>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Updated:</td>
                        <td>
                          <small className="text-muted">{formatDate(branch.updated_at)}</small>
                        </td>
                      </tr>
                      {branch.created_by && (
                        <tr>
                          <td className="fw-bold">Created By:</td>
                          <td>
                            <small className="text-muted">{branch.created_by.name || branch.created_by.email}</small>
                          </td>
                        </tr>
                      )}
                      {branch.updated_by && (
                        <tr>
                          <td className="fw-bold">Updated By:</td>
                          <td>
                            <small className="text-muted">{branch.updated_by.name || branch.updated_by.email}</small>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>

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
                    <Link href={route("admin.branches.edit", branch.id)} className="btn btn-outline-primary">
                      <i className="mdi mdi-pencil-outline me-2"></i>
                      Edit Branch
                    </Link>

                    <Button color="outline-secondary" onClick={() => navigator.clipboard.writeText(branch.slug)}>
                      <i className="mdi mdi-content-copy me-2"></i>
                      Copy Slug
                    </Button>

                    {branch.latitude && branch.longitude && (
                      <Button
                        color="outline-info"
                        onClick={() =>
                          window.open(`https://maps.google.com/?q=${branch.latitude},${branch.longitude}`, "_blank")
                        }
                      >
                        <i className="mdi mdi-map me-2"></i>
                        View on Map
                      </Button>
                    )}

                    <Link href={route("admin.branches.index")} className="btn btn-outline-info">
                      <i className="mdi mdi-arrow-left me-2"></i>
                      Back to List
                    </Link>

                    <hr />

                    <Button
                      color={branch.is_active ? "outline-warning" : "outline-success"}
                      onClick={() => setActivateModal(true)}
                    >
                      <i className={`mdi ${branch.is_active ? "mdi-pause" : "mdi-play"} me-2`}></i>
                      {branch.is_active ? "Deactivate" : "Activate"}
                    </Button>

                    <Button color="outline-danger" onClick={() => setDeleteModal(true)}>
                      <i className="mdi mdi-delete-outline me-2"></i>
                      Delete Branch
                    </Button>
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
