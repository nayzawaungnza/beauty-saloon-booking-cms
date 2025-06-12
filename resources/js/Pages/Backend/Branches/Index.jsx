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

const Index = ({ branches, pagination }) => {
  document.title = "Branches List | Admin Dashboard"

  const { flash } = usePage().props
  const [branch, setBranch] = useState(null)
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

  const handleDeleteBranch = () => {
    if (branch && branch.id) {
      router.delete(`/admin/branches/${branch.slug}`, {
        onSuccess: () => {
          setDeleteModal(false)
          setBranch(null)
          toast.success("Branch deleted successfully!")
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
        `/admin/branches/${branch.slug}/status`,
        { is_active: !branch.is_active },
        {
          onSuccess: () => {
            setActivateModal(false)
            setBranch(null)
            toast.success(`Branch ${action}d successfully!`)
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
              <Link href={`/admin/branches/${row.original.id}`} className="text-body fw-medium">
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
        header: "Location",
        accessorKey: "city",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <div className="fw-medium">{row.original.city || "N/A"}</div>
            <small className="text-muted">{row.original.state}</small>
            {row.original.latitude && row.original.longitude && (
              <div>
                <Badge className="bg-warning-subtle text-warning mt-1">
                  <i className="mdi mdi-map-marker me-1"></i>
                  GPS Located
                </Badge>
              </div>
            )}
          </div>
        ),
      },
      {
        header: "Manager",
        accessorKey: "manager",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            {row.original.manager ? (
              <>
                <div className="fw-medium">{row.original.manager.name}</div>
                <small className="text-muted">{row.original.manager.email}</small>
              </>
            ) : (
              <span className="text-muted">
                <i className="mdi mdi-account-off me-1"></i>
                No manager assigned
              </span>
            )}
          </div>
        ),
      },
      {
        header: "Contact",
        accessorKey: "phone",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            <div className="fw-medium">{row.original.phone || "N/A"}</div>
            {row.original.address && (
              <small className="text-muted" title={row.original.address}>
                {row.original.address.length > 30
                  ? `${row.original.address.substring(0, 30)}...`
                  : row.original.address}
              </small>
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
                href={`/admin/branches/${row.original.id}`}
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
                href={`/admin/branches/${row.original.id}/edit`}
                className="btn btn-sm btn-soft-info"
                id={`edittooltip-${row.original.id}`}
              >
                <i className="mdi mdi-pencil-outline" />
                <UncontrolledTooltip
                  placement="top"
                  target={`edittooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  Edit Branch
                </UncontrolledTooltip>
              </Link>
            </li>

            <li>
              <button
                type="button"
                className={row.original.is_active ? "btn btn-sm btn-soft-warning" : "btn btn-sm btn-soft-success"}
                onClick={() => {
                  setBranch(row.original)
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
                  setBranch(row.original)
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
                  Delete Branch
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
        onDeleteClick={handleDeleteBranch}
        onCloseClick={() => setDeleteModal(false)}
        title="Delete Branch"
        message={`Are you sure you want to delete "${branch?.name}"? This action cannot be undone.`}
      />

      <ActivateModal
        show={activateModal}
        service={branch}
        onActivateClick={handleActivateBranch}
        onCloseClick={() => setActivateModal(false)}
        title={branch?.is_active ? "Deactivate Branch" : "Activate Branch"}
        message={`Are you sure you want to ${branch?.is_active ? "deactivate" : "activate"} "${branch?.name}"?`}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Branches" breadcrumbItem="Branches List" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">
                      <i className="mdi mdi-office-building me-2"></i>
                      Branches Management
                    </h5>
                    <div className="flex-shrink-0">
                      <Link href="/admin/branches/create" className="btn btn-primary me-1">
                        <i className="mdi mdi-plus me-1"></i>
                        Add New Branch
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
                  {isEmpty(branches) ? (
                    <div className="text-center py-5">
                      <div className="avatar-lg mx-auto mb-4">
                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
                          <i className="mdi mdi-office-building display-4"></i>
                        </div>
                      </div>
                      <h5 className="mt-2">No branches found</h5>
                      <p className="text-muted mb-4">Get started by creating your first branch location.</p>
                      <Link href="/admin/branches/create" className="btn btn-primary">
                        <i className="mdi mdi-plus me-1"></i>
                        Add New Branch
                      </Link>
                    </div>
                  ) : (
                    <>
                      <div className="row mb-3">
                        <div className="col-sm-6">
                          <div className="d-flex align-items-center">
                            <h6 className="mb-0">
                              Total: <span className="fw-bold text-primary">{branches.length}</span> branches
                            </h6>
                          </div>
                        </div>
                      </div>

                      <TableContainer
                        columns={columns}
                        data={branches || []}
                        isCustomPageSize={true}
                        isGlobalFilter={true}
                        isPagination={true}
                        SearchPlaceholder="Search branches by name, city, or state..."
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
