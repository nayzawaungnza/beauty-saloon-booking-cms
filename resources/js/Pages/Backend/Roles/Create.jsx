"use client"

import React, { useEffect, useState } from "react"
import { Link, useForm, usePage } from "@inertiajs/react"
import { Button, Card, CardBody, Col, Container, Form, FormFeedback, Input, Label, Row } from "reactstrap"

import Breadcrumbs from "@/components/common/Breadcrumb"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Create = ({ permissions = [] }) => {
  document.title = "Create New Role | Admin Panel"

  const { flash } = usePage().props
  const [selectedPermissions, setSelectedPermissions] = useState([])
  const [groupedPermissions, setGroupedPermissions] = useState({})

  const { data, setData, post, processing, errors } = useForm({
    name: "",
    permission: [],
  })

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  useEffect(() => {
    // Group permissions by their prefix (before the first dot)
    const grouped = permissions.reduce((acc, permission) => {
      const [group] = permission.name.split(".")
      if (!acc[group]) {
        acc[group] = []
      }
      acc[group].push(permission)
      return acc
    }, {})
    setGroupedPermissions(grouped)
  }, [permissions])

  const handleSubmit = (e) => {
    e.preventDefault()
    data.permission = selectedPermissions

    post("/admin/roles", {
      onSuccess: () => {
        toast.success("Role created successfully!")
      },
      onError: (errors) => {
        console.error("Create errors:", errors)
        if (errors.message) {
          toast.error(errors.message)
        } else {
          toast.error("Failed to create role. Please check the form for errors.")
        }
      },
    })
  }

  const handlePermissionChange = (e, permissionId) => {
    if (e.target.checked) {
      setSelectedPermissions([...selectedPermissions, permissionId])
    } else {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId))
    }
  }

  const handleSelectAllInGroup = (e, groupPermissions) => {
    const permissionIds = groupPermissions.map((p) => p.id)

    if (e.target.checked) {
      // Add all permissions from this group that aren't already selected
      const newSelected = [...new Set([...selectedPermissions, ...permissionIds])]
      setSelectedPermissions(newSelected)
    } else {
      // Remove all permissions from this group
      setSelectedPermissions(selectedPermissions.filter((id) => !permissionIds.includes(id)))
    }
  }

  const isGroupFullySelected = (groupPermissions) => {
    const permissionIds = groupPermissions.map((p) => p.id)
    return permissionIds.every((id) => selectedPermissions.includes(id))
  }

  const isGroupPartiallySelected = (groupPermissions) => {
    const permissionIds = groupPermissions.map((p) => p.id)
    return (
      permissionIds.some((id) => selectedPermissions.includes(id)) &&
      !permissionIds.every((id) => selectedPermissions.includes(id))
    )
  }

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Roles" breadcrumbItem="Create Role" />

          <Form onSubmit={handleSubmit}>
            <Row>
              <Col lg={8}>
                <Card>
                  <CardBody>
                    <div className="mb-3">
                      <Label htmlFor="name-input">
                        Role Name <span className="text-danger">*</span>
                      </Label>
                      <Input
                        id="name-input"
                        name="name"
                        type="text"
                        placeholder="Enter Role Name..."
                        value={data.name}
                        onChange={(e) => setData("name", e.target.value)}
                        invalid={!!errors.name}
                      />
                      {errors.name && <FormFeedback type="invalid">{errors.name}</FormFeedback>}
                    </div>

                    <div className="mb-3">
                      <Label className="d-block mb-3">
                        Permissions <span className="text-danger">*</span>
                      </Label>

                      {errors.permission && <div className="text-danger mb-3">{errors.permission}</div>}

                      {Object.entries(groupedPermissions).map(([group, groupPermissions]) => (
                        <div key={group} className="mb-4">
                          <div className="d-flex align-items-center mb-2">
                            <div className="form-check">
                              <Input
                                type="checkbox"
                                className="form-check-input"
                                id={`group-${group}`}
                                checked={isGroupFullySelected(groupPermissions)}
                                onChange={(e) => handleSelectAllInGroup(e, groupPermissions)}
                                indeterminate={isGroupPartiallySelected(groupPermissions)}
                              />
                              <Label className="form-check-label fw-bold text-capitalize" htmlFor={`group-${group}`}>
                                {group}
                              </Label>
                            </div>
                          </div>

                          <div className="ms-4">
                            <Row>
                              {groupPermissions.map((permission) => (
                                <Col md={3} key={permission.id} className="mb-2">
                                  <div className="form-check">
                                    <Input
                                      type="checkbox"
                                      className="form-check-input"
                                      id={`permission-${permission.id}`}
                                      checked={selectedPermissions.includes(permission.id)}
                                      onChange={(e) => handlePermissionChange(e, permission.id)}
                                    />
                                    <Label className="form-check-label" htmlFor={`permission-${permission.id}`}>
                                      {permission.name.split(".")[1]}
                                    </Label>
                                  </div>
                                </Col>
                              ))}
                            </Row>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </Col>

              <Col lg={4}>
                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Role Summary</h5>

                    <div className="mb-3">
                      <div className="d-flex align-items-center mb-3">
                        <div className="avatar-sm bg-primary-subtle rounded me-3">
                          <i className="mdi mdi-shield-account text-primary font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">Role Name</h6>
                          <p className="text-muted mb-0">{data.name || "Not set"}</p>
                        </div>
                      </div>

                      <div className="d-flex align-items-center mb-3">
                        <div className="avatar-sm bg-success-subtle rounded me-3">
                          <i className="mdi mdi-key-variant text-success font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">Permissions</h6>
                          <p className="text-muted mb-0">{selectedPermissions.length} permissions selected</p>
                        </div>
                      </div>

                      <div className="d-flex align-items-center">
                        <div className="avatar-sm bg-info-subtle rounded me-3">
                          <i className="mdi mdi-shield-check text-info font-size-18 d-flex align-items-center justify-content-center h-100"></i>
                        </div>
                        <div>
                          <h6 className="mb-1">Guard</h6>
                          <p className="text-muted mb-0">web</p>
                        </div>
                      </div>
                    </div>
                  </CardBody>
                </Card>

                <Card>
                  <CardBody>
                    <h5 className="card-title mb-3">Quick Actions</h5>

                    <div className="d-grid gap-2">
                      <Button type="submit" color="primary" disabled={processing}>
                        {processing ? (
                          <>
                            <span
                              className="spinner-border spinner-border-sm me-1"
                              role="status"
                              aria-hidden="true"
                            ></span>
                            Creating...
                          </>
                        ) : (
                          <>
                            <i className="mdi mdi-content-save me-1"></i>
                            Create Role
                          </>
                        )}
                      </Button>

                      <Link href="/admin/roles" className="btn btn-secondary">
                        <i className="mdi mdi-arrow-left me-1"></i>
                        Back to Roles
                      </Link>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </React.Fragment>
  )
}

export default Create
