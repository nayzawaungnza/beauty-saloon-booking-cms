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
  document.title = "Staff List | Admin Dashboard"

  const { flash } = usePage().props
  const [selectedStaff, setSelectedStaff] = useState(null)
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
    if (selectedStaff && selectedStaff.id) {
      router.delete(route("admin.staffs.destroy", selectedStaff.id), {
        onSuccess: () => {
          setDeleteModal(false)
          setSelectedStaff(null)
        },
        onError: (errors) => {
          console.error(errors)
        },
      })
    }
  }

  const handleActivateStaff = () => {
    if (selectedStaff && selectedStaff.id) {
      router.patch(
        route("admin.staffs.changeStatus", selectedStaff.id),
        { is_active: !selectedStaff.is_active },
        {
          onSuccess: () => {
            setActivateModal(false)
            setSelectedStaff(null)
          },
          onError: (errors) => {
            console.error(errors)
          },
        },
      )
    }
  }

  const columns = useMemo(
    () => [
      {
        header: "Name",
        accessorKey: "name",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Email",
        accessorKey: "email",
        enableColumnFilter: false,
        enableSorting: true,
      },
      {
        header: "Phone",
        accessorKey: "phone",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => row.original.phone || "N/A",
      },
      {
        header: "Services",
        accessorKey: "services",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            {row.original.services?.length > 0 ? (
              <Badge color="info">{row.original.services.length} services</Badge>
            ) : (
              <Badge color="secondary">No services</Badge>
            )}
          </div>
        ),
      },
      {
        header: "Availability",
        accessorKey: "availability",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            {row.original.availability?.length > 0 ? (
              <Badge color="success">{row.original.availability.length} schedules</Badge>
            ) : (
              <Badge color="warning">No schedule</Badge>
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
          <Badge className={row.original.is_active ? "bg-success" : "bg-danger"}>
            {row.original.is_active ? "Active" : "Inactive"}
          </Badge>
        ),
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <ul className="list-unstyled hstack gap-1 mb-0">
            <li>
              <Link
                href={route("admin.staffs.show", row.original.id)}
                className="btn btn-sm btn-soft-primary"
                id={`viewtooltip-${row.original.id}`}
              >
                <i className="mdi mdi-eye-outline" />
                <UncontrolledTooltip
                  placement="top"
                  target={`viewtooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  View
                </UncontrolledTooltip>
              </Link>
            </li>

            <li>
              <Link
                href={route("admin.staffs.edit", row.original.id)}
                className="btn btn-sm btn-soft-info"
                id={`edittooltip-${row.original.id}`}
              >
                <i className="mdi mdi-pencil-outline" />
                <UncontrolledTooltip
                  placement="top"
                  target={`edittooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  Edit
                </UncontrolledTooltip>
              </Link>
            </li>

            <li>
              <button
                type="button"
                className={row.original.is_active ? "btn btn-sm btn-soft-danger" : "btn btn-sm btn-soft-success"}
                onClick={() => {
                  setSelectedStaff(row.original)
                  setActivateModal(true)
                }}
                id={`activetooltip-${row.original.id}`}
              >
                <i className={row.original.is_active ? "mdi mdi-cancel" : "mdi mdi-check-circle"} />
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
                  setSelectedStaff(row.original)
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
                  Delete
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
        message="Are you sure you want to delete this staff member? This action cannot be undone."
      />

      <ActivateModal
        show={activateModal}
        service={selectedStaff}
        onActivateClick={handleActivateStaff}
        onCloseClick={() => setActivateModal(false)}
        title={selectedStaff?.is_active ? "Deactivate Staff" : "Activate Staff"}
        message={`Are you sure you want to ${selectedStaff?.is_active ? "deactivate" : "activate"} this staff member?`}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Staff" breadcrumbItem="Staff List" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">Staff Members</h5>
                    <div className="flex-shrink-0">
                      <Link href={route("admin.staffs.create")} className="btn btn-primary me-1">
                        Add New Staff
                      </Link>
                      <button type="button" className="btn btn-light me-1" onClick={() => window.location.reload()}>
                        <i className="mdi mdi-refresh"></i>
                      </button>
                      <UncontrolledDropdown className="dropdown d-inline-block me-1">
                        <DropdownToggle type="menu" className="btn btn-success" id="dropdownMenuButton1">
                          <i className="mdi mdi-dots-vertical"></i>
                        </DropdownToggle>
                        <DropdownMenu>
                          <li>
                            <DropdownItem href="#">Export CSV</DropdownItem>
                          </li>
                          <li>
                            <DropdownItem href="#">Export PDF</DropdownItem>
                          </li>
                          <li>
                            <DropdownItem href="#">Print</DropdownItem>
                          </li>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </div>
                </CardBody>
                <CardBody>
                  {isEmpty(staff) ? (
                    <div className="text-center py-4">
                      <i className="mdi mdi-account-multiple-outline display-4 text-muted"></i>
                      <h5 className="mt-2">No staff members found</h5>
                      <p className="text-muted">Get started by adding your first staff member.</p>
                      <Link href={route("admin.staffs.create")} className="btn btn-primary">
                        Add New Staff
                      </Link>
                    </div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={staff || []}
                      isCustomPageSize={true}
                      isGlobalFilter={true}
                      isPagination={true}
                      SearchPlaceholder="Search for staff members..."
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline mt-4 border-top"
                      pagination="pagination"
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                    />
                  )}
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

export default Index
