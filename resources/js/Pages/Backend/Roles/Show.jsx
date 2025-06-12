"use client"

import React, { useState } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import Breadcrumbs from "@/components/common/Breadcrumb"
import DeleteModal from "@/components/common/DeleteModal"
import { Col, Row, Card, CardBody, CardHeader, Badge, Button, UncontrolledTooltip, Table } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Show = ({ role, rolePermissions }) => {
  document.title = `${role.name} | Role Details`

  const { flash } = usePage().props
  const [deleteModal, setDeleteModal] = useState(false)

  React.useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleDeleteRole = () => {
    if (role && role.id) {
      router.delete(`/admin/roles/${role.id}`, {
        onSuccess: () => {
          setDeleteModal(false)
          router.visit("/admin/roles")
        },
        onError: (errors) => {
          toast.error("Failed to delete role")
          console.error(errors)
        },
      })
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

  // Group permissions by their prefix (before the first dot)
  const groupedPermissions = rolePermissions.reduce((acc, permission) => {
    const [group] = permission.name.split(".")
    if (!acc[group]) {
      acc[group] = []
    }
    acc[group].push(permission)
    return acc
  }, {})

  const isSystemRole = role.name === "admin" || role.name === "Super Admin"

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteRole}
        onCloseClick={() => setDeleteModal(false)}
        title="Delete Role"
        message={`Are you sure you want to delete the "${role.name}" role? This action cannot be undone.`}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Roles"
            breadcrumbItem="Role Details"
            breadcrumbItems={[
              { title: "Roles", link: "/admin/roles" },
              { title: role.name, active: true },
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
                          <i className="mdi mdi-shield-account text-primary fs-4"></i>
                        </div>
                      </div>
                      <div className="flex-grow-1">
                        <h4 className="mb-1">{role.name}</h4>
                        <div className="d-flex align-items-center gap-2">
                          <Badge color="info">Guard: {role.guard_name}</Badge>
                          <Badge color="success">{rolePermissions.length} Permissions</Badge>
                          {isSystemRole && <Badge color="warning">System Role</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2">
                        <Link
                          href={`/admin/roles/${role.id}/edit`}
                          className="btn btn-primary"
                          id="edit-role"
                          disabled={isSystemRole}
                        >
                          <i className="mdi mdi-pencil-outline me-1"></i>
                          Edit Role
                        </Link>
                        <UncontrolledTooltip placement="top" target="edit-role">
                          Edit this role
                        </UncontrolledTooltip>

                        <Button
                          color="danger"
                          onClick={() => setDeleteModal(true)}
                          id="delete-role"
                          disabled={isSystemRole}
                        >
                          <i className="mdi mdi-delete-outline me-1"></i>
                          Delete
                        </Button>
                        <UncontrolledTooltip placement="top" target="delete-role">
                          Delete this role
                        </UncontrolledTooltip>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Role Details */}
            <Col lg="8">
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-key-variant me-2"></i>
                    Role Permissions
                  </h5>
                </CardHeader>
                <CardBody>
                  {isSystemRole && (
                    <div className="alert alert-warning mb-4">
                      <i className="mdi mdi-alert-circle me-2"></i>
                      System roles have all permissions by default. Modifying permissions for system roles is not
                      recommended.
                    </div>
                  )}

                  {Object.entries(groupedPermissions).length === 0 ? (
                    <div className="text-center py-4">
                      <div className="avatar-lg mx-auto mb-3">
                        <div className="avatar-title bg-light text-primary rounded-circle">
                          <i className="mdi mdi-key-remove fs-1"></i>
                        </div>
                      </div>
                      <h5>No permissions assigned</h5>
                      <p className="text-muted">This role doesn't have any permissions assigned to it.</p>
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <Table className="table-borderless mb-0">
                        <thead className="table-light">
                          <tr>
                            <th>Module</th>
                            <th>Permissions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {Object.entries(groupedPermissions).map(([group, permissions]) => (
                            <tr key={group}>
                              <td className="fw-medium text-capitalize" style={{ width: "200px" }}>
                                {group}
                              </td>
                              <td>
                                <div className="d-flex flex-wrap gap-1">
                                  {permissions.map((permission) => (
                                    <Badge key={permission.id} color="primary" className="me-1 mb-1">
                                      {permission.name.split(".")[1]}
                                    </Badge>
                                  ))}
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col lg="4">
              {/* Role Information */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-information-outline me-2"></i>
                    Role Information
                  </h5>
                </CardHeader>
                <CardBody>
                  <Table className="table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Name:</td>
                        <td>{role.name}</td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Guard:</td>
                        <td>
                          <Badge color="info">{role.guard_name}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Permissions:</td>
                        <td>
                          <Badge color="success">{rolePermissions.length}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Created:</td>
                        <td>
                          <small className="text-muted">{formatDate(role.created_at)}</small>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Updated:</td>
                        <td>
                          <small className="text-muted">{formatDate(role.updated_at)}</small>
                        </td>
                      </tr>
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
                    <Link
                      href={`/admin/roles/${role.id}/edit`}
                      className="btn btn-outline-primary"
                      disabled={isSystemRole}
                    >
                      <i className="mdi mdi-pencil-outline me-2"></i>
                      Edit Role
                    </Link>

                    <Button color="outline-danger" onClick={() => setDeleteModal(true)} disabled={isSystemRole}>
                      <i className="mdi mdi-delete-outline me-2"></i>
                      Delete Role
                    </Button>

                    <Link href="/admin/roles" className="btn btn-outline-info">
                      <i className="mdi mdi-arrow-left me-2"></i>
                      Back to Roles
                    </Link>
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
