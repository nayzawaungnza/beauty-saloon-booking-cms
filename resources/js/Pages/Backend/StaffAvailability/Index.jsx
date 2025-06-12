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

const Index = ({ staffAvailabilities }) => {
  document.title = "Staff Availability | Admin Dashboard"

  const { flash } = usePage().props
  const [selectedAvailability, setSelectedAvailability] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleDeleteAvailability = () => {
    if (selectedAvailability && selectedAvailability.id) {
      router.delete(route("admin.staff_availability.destroy", selectedAvailability.id), {
        onSuccess: () => {
          setDeleteModal(false)
          setSelectedAvailability(null)
        },
        onError: (errors) => {
          console.error(errors)
        },
      })
    }
  }

  const getDayName = (dayNumber) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayNumber] || "Unknown"
  }

  const formatTime = (timeString) => {
    if (!timeString) return "N/A"
    return new Date(`2000-01-01T${timeString}`).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })
  }

  const columns = useMemo(
    () => [
      {
        header: "Staff Member",
        accessorKey: "staff.name",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => row.original.staff?.name || "N/A",
      },
      {
        header: "Day",
        accessorKey: "day_of_week",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => <Badge color="primary">{getDayName(row.original.day_of_week)}</Badge>,
      },
      {
        header: "Time",
        accessorKey: "start_time",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <span>
            {formatTime(row.original.start_time)} - {formatTime(row.original.end_time)}
          </span>
        ),
      },
      {
        header: "Status",
        accessorKey: "is_available",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <Badge className={row.original.is_available ? "bg-success" : "bg-danger"}>
            {row.original.is_available ? "Available" : "Unavailable"}
          </Badge>
        ),
      },
      {
        header: "Effective Date",
        accessorKey: "effective_date",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => {
          if (!row.original.effective_date) return "No date set"
          return new Date(row.original.effective_date).toLocaleDateString()
        },
      },
      {
        header: "Action",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <ul className="list-unstyled hstack gap-1 mb-0">
            <li>
              <Link
                href={route("admin.staff_availability.show", row.original.id)}
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
                href={route("admin.staff_availability.edit", row.original.id)}
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
                className="btn btn-sm btn-soft-danger"
                onClick={() => {
                  setSelectedAvailability(row.original)
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
        onDeleteClick={handleDeleteAvailability}
        onCloseClick={() => setDeleteModal(false)}
        title="Delete Availability"
        message="Are you sure you want to delete this availability schedule? This action cannot be undone."
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Staff Availability" breadcrumbItem="Availability List" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">Staff Availability</h5>
                    <div className="flex-shrink-0">
                      <Link href={route("admin.staff_availability.create")} className="btn btn-primary me-1">
                        Add New Availability
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
                  {isEmpty(staffAvailabilities) ? (
                    <div className="text-center py-4">
                      <i className="mdi mdi-calendar-clock display-4 text-muted"></i>
                      <h5 className="mt-2">No availability schedules found</h5>
                      <p className="text-muted">Get started by creating your first availability schedule.</p>
                      <Link href={route("admin.staff_availability.create")} className="btn btn-primary">
                        Add New Availability
                      </Link>
                    </div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={staffAvailabilities || []}
                      isCustomPageSize={true}
                      isGlobalFilter={true}
                      isPagination={true}
                      SearchPlaceholder="Search for availability..."
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
