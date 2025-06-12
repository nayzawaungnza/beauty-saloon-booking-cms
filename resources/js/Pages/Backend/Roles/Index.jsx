"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import { isEmpty } from "lodash"
import TableContainer from "@/components/common/TableContainer"
import Breadcrumbs from "@/components/common/Breadcrumb"
import DeleteModal from "@/components/common/DeleteModal"
import {
  Col,
  Row,
  Card,
  UncontrolledTooltip,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
} from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Index = ({ roles }) => {
  document.title = "Roles Management | Admin Dashboard"

  const { flash } = usePage().props
  const [role, setRole] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleDeleteRole = () => {
    if (role && role.id) {
      router.delete(`/admin/roles/${role.id}`, {
        onSuccess: () => {
          setDeleteModal(false)
          setRole(null)
          toast.success("Role deleted successfully!")
        },
        onError: (errors) => {
          toast.error("Failed to delete role")
          console.error(errors)
        },
      })
    }
  }

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <h6 className="mb-1">
              <Link href={`/admin/roles/${row.original.id}`} className="text-body fw-medium">
                {row.original.name}
              </Link>
            </h6>
          </div>
        ),
      },
      {
        header: "Guard Name",
        accessorKey: "guard_name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <Badge color="info" pill>
              {row.original.guard_name}
            </Badge>
          </div>
        ),
      },
      {
        header: "Permissions",
        accessorKey: "permissions",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            {row.original.permissions && row.original.permissions.length > 0 ? (
              <div className="d-flex flex-wrap gap-1">
                {row.original.permissions.slice(0, 3).map((permission, index) => (
                  <Badge key={index} color="success" className="me-1">
                    {permission.name}
                  </Badge>
                ))}
                {row.original.permissions.length > 3 && (
                  <Badge color="secondary">+{row.original.permissions.length - 3} more</Badge>
                )}
              </div>
            ) : (
              <span className="text-muted">No permissions assigned</span>
            )}
          </div>
        ),
      },
      {
        header: "Created At",
        accessorKey: "created_at",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            {new Date(row.original.created_at).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </div>
        ),
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <ul className="list-unstyled hstack gap-1 mb-0">
            <li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
              <Link
                href={`/admin/roles/${row.original.id}`}
                className="btn btn-sm btn-soft-primary"
                id={`viewtooltip-${row.original.id}`}
              >
                <i className="mdi mdi-eye-outline" />
                <UncontrolledTooltip
                  placement="top"
                  target={`viewtooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  View Details
                </UncontrolledTooltip>
              </Link>
            </li>

            <li>
              <Link
                href={`/admin/roles/${row.original.id}/edit`}
                className="btn btn-sm btn-soft-info"
                id={`edittooltip-${row.original.id}`}
              >
                <i className="mdi mdi-pencil-outline" />
                <UncontrolledTooltip
                  placement="top"
                  target={`edittooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  Edit Role
                </UncontrolledTooltip>
              </Link>
            </li>

            <li>
              <button
                type="button"
                className="btn btn-sm btn-soft-danger"
                onClick={() => {
                  setRole(row.original)
                  setDeleteModal(true)
                }}
                id={`deletetooltip-${row.original.id}`}
                disabled={row.original.name === "admin" || row.original.name === "Super Admin"}
              >
                <i className="mdi mdi-delete-outline" />
                <UncontrolledTooltip
                  placement="top"
                  target={`deletetooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  Delete Role
                </UncontrolledTooltip>
              </button>
            </li>
          </ul>
        ),
      },
    ],
    [],
  )

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteRole}
        onCloseClick={() => setDeleteModal(false)}
        title="Delete Role"
        message={`Are you sure you want to delete the "${role?.name}" role? This action cannot be undone.`}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="User Management" breadcrumbItem="Roles" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">
                      <i className="mdi mdi-shield-account me-2"></i>
                      Roles Management
                    </h5>
                    <div className="flex-shrink-0">
                      <Link href="/admin/roles/create" className="btn btn-primary me-1">
                        <i className="mdi mdi-plus me-1"></i>
                        Add New Role
                      </Link>
                      <button
                        type="button"
                        className="btn btn-light me-1"
                        onClick={() => window.location.reload()}
                        title="Refresh"
                      >
                        <i className="mdi mdi-refresh"></i>
                      </button>
                      <UncontrolledDropdown className="dropdown d-inline-block me-1">
                        <DropdownToggle type="menu" className="btn btn-success" id="dropdownMenuButton1">
                          <i className="mdi mdi-dots-vertical"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <li>
                            <DropdownItem href="#">
                              <i className="mdi mdi-file-excel me-2"></i>
                              Export CSV
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem href="#">
                              <i className="mdi mdi-file-pdf me-2"></i>
                              Export PDF
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem href="#">
                              <i className="mdi mdi-printer me-2"></i>
                              Print
                            </DropdownItem>
                          </li>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </div>
                </CardBody>

                <CardBody>
                  {isEmpty(roles) ? (
                    <div className="text-center py-5">
                      <div className="avatar-lg mx-auto mb-4">
                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
                          <i className="mdi mdi-shield-account display-4"></i>
                        </div>
                      </div>
                      <h5 className="mt-2">No roles found</h5>
                      <p className="text-muted mb-4">Get started by creating your first role.</p>
                      <Link href="/admin/roles/create" className="btn btn-primary">
                        <i className="mdi mdi-plus me-1"></i>
                        Add New Role
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="row mb-3">
                        <div className="col-sm-6">
                          <div className="d-flex align-items-center">
                            <h6 className="mb-0">
                              Total: <span className="fw-bold text-primary">{roles.length}</span> roles
                            </h6>
                          </div>
                        </div>
                      </div>

                      <TableContainer
                        columns={columns}
                        data={roles || []}
                        isCustomPageSize={true}
                        isGlobalFilter={true}
                        isPagination={true}
                        SearchPlaceholder="Search roles..."
                        tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline mt-4 border-top"
                        pagination="pagination"
                        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                      />
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
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

export default Index
