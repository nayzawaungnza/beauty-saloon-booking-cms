"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import { isEmpty } from "lodash"
import TableContainer from "@/components/common/TableContainer"
import Breadcrumbs from "@/components/common/Breadcrumb"
import DeleteModal from "@/components/common/DeleteModal"
import ActivateModal from "@/components/common/ActivateModal"
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

const Index = ({ staff }) => {
  document.title = "Staff Management | Admin Dashboard"

  const { flash } = usePage().props
  const [staffMember, setStaffMember] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [activateModal, setActivateModal] = useState(false)

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleDeleteStaff = () => {
    if (staffMember && staffMember.id) {
      router.delete(`/admin/staff/${staffMember.slug}`, {
        onSuccess: () => {
          setDeleteModal(false)
          setStaffMember(null)
          toast.success("Staff member deleted successfully!")
        },
        onError: (errors) => {
          toast.error("Failed to delete staff member")
          console.error(errors)
        },
      })
    }
  }

  const handleActivateStaff = () => {
    if (staffMember && staffMember.id) {
      const action = staffMember.is_active ? "deactivate" : "activate"

      router.patch(
        `/admin/staff/${staffMember.slug}/status`,
        { is_active: !staffMember.is_active },
        {
          onSuccess: () => {
            setActivateModal(false)
            setStaffMember(null)
            toast.success(`Staff member ${action}d successfully!`)
          },
          onError: (errors) => {
            toast.error(`Failed to ${action} staff member`)
            console.error(errors)
          },
        },
      )
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
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
              <Link href={`/admin/staff/${row.original.slug}`} className="text-body fw-medium">
                {row.original.name}
              </Link>
            </h6>
            <small className="text-muted">
              <code>{row.original.slug}</code>
            </small>
          </div>
        ),
      },
      {
        header: "Contact",
        accessorKey: "email",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <div className="fw-medium">{row.original.email || "N/A"}</div>
            <small className="text-muted">{row.original.phone || "No phone"}</small>
          </div>
        ),
      },
      {
        header: "Branch",
        accessorKey: "branch",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            {row.original.branch ? (
              <>
                <div className="fw-medium">{row.original.branch.name}</div>
                <small className="text-muted">{row.original.branch.city}</small>
              </>
            ) : (
              <span className="text-muted">
                <i className="mdi mdi-office-building-outline me-1"></i>
                No branch assigned
              </span>
            )}
          </div>
        ),
      },
      {
        header: "Specialization",
        accessorKey: "specialization",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <div className="fw-medium">{row.original.specialization || "General"}</div>
            {row.original.services && row.original.services.length > 0 && (
              <div className="mt-1">
                {row.original.services.slice(0, 2).map((service, index) => (
                  <Badge key={service.id} color="info" className="me-1 mb-1">
                    {service.name}
                  </Badge>
                ))}
                {row.original.services.length > 2 && (
                  <Badge color="secondary" className="mb-1">
                    +{row.original.services.length - 2} more
                  </Badge>
                )}
              </div>
            )}
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "is_active",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <Badge className={row.original.is_active ? "bg-success" : "bg-danger"}>
              {row.original.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>
        ),
      },
      {
        header: "Created",
        accessorKey: "created_at",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <div className="fw-medium">{formatDate(row.original.created_at)}</div>
            {row.original.created_by && <small className="text-muted">by {row.original.created_by.name}</small>}
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
                href={`/admin/staff/${row.original.slug}`}
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
                href={`/admin/staff/${row.original.slug}/edit`}
                className="btn btn-sm btn-soft-info"
                id={`edittooltip-${row.original.id}`}
              >
                <i className="mdi mdi-pencil-outline" />
                <UncontrolledTooltip
                  placement="top"
                  target={`edittooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  Edit Staff
                </UncontrolledTooltip>
              </Link>
            </li>

            <li>
              <button
                type="button"
                className={row.original.is_active ? "btn btn-sm btn-soft-warning" : "btn btn-sm btn-soft-success"}
                onClick={() => {
                  setStaffMember(row.original)
                  setActivateModal(true)
                }}
                id={`activetooltip-${row.original.id}`}
              >
                <i className={row.original.is_active ? "mdi mdi-pause" : "mdi mdi-play"} />
                <UncontrolledTooltip
                  placement="top"
                  target={`activetooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  {row.original.is_active ? "Deactivate" : "Activate"}
                </UncontrolledTooltip>
              </button>
            </li>

            <li>
              <button
                type="button"
                className="btn btn-sm btn-soft-danger"
                onClick={() => {
                  setStaffMember(row.original)
                  setDeleteModal(true)
                }}
                id={`deletetooltip-${row.original.id}`}
              >
                <i className="mdi mdi-delete-outline" />
                <UncontrolledTooltip
                  placement="top"
                  target={`deletetooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  Delete Staff
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
        onDeleteClick={handleDeleteStaff}
        onCloseClick={() => setDeleteModal(false)}
        title="Delete Staff Member"
        message={`Are you sure you want to delete "${staffMember?.name}"? This action cannot be undone.`}
      />

      <ActivateModal
        show={activateModal}
        service={staffMember}
        onActivateClick={handleActivateStaff}
        onCloseClick={() => setActivateModal(false)}
        title={staffMember?.is_active ? "Deactivate Staff Member" : "Activate Staff Member"}
        message={`Are you sure you want to ${staffMember?.is_active ? "deactivate" : "activate"} "${staffMember?.name}"?`}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Staff" breadcrumbItem="Staff Management" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">
                      <i className="mdi mdi-account-group me-2"></i>
                      Staff Management
                    </h5>
                    <div className="flex-shrink-0">
                      <Link href="/admin/staff/create" className="btn btn-primary me-1">
                        <i className="mdi mdi-plus me-1"></i>
                        Add New Staff
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
                  {isEmpty(staff) ? (
                    <div className="text-center py-5">
                      <div className="avatar-lg mx-auto mb-4">
                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
                          <i className="mdi mdi-account-group display-4"></i>
                        </div>
                      </div>
                      <h5 className="mt-2">No staff members found</h5>
                      <p className="text-muted mb-4">Get started by adding your first staff member.</p>
                      <Link href="/admin/staff/create" className="btn btn-primary">
                        <i className="mdi mdi-plus me-1"></i>
                        Add New Staff
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="row mb-3">
                        <div className="col-sm-6">
                          <div className="d-flex align-items-center">
                            <h6 className="mb-0">
                              Total: <span className="fw-bold text-primary">{staff.length}</span> staff members
                            </h6>
                          </div>
                        </div>
                      </div>

                      <TableContainer
                        columns={columns}
                        data={staff || []}
                        isCustomPageSize={true}
                        isGlobalFilter={true}
                        isPagination={true}
                        SearchPlaceholder="Search staff by name, email, or specialization..."
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
