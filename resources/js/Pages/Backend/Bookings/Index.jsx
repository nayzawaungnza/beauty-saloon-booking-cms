"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import TableContainer from "@/components/common/TableContainer"
import Breadcrumbs from "@/components/common/Breadcrumb"
import DeleteModal from "@/components/common/DeleteModal"
import { Col, Row, Card, UncontrolledTooltip, CardBody, Badge, Input, Button, Form, FormGroup, Label } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Index = ({ bookings, staff, branches, customers, statuses, filters }) => {
  document.title = "Bookings | Admin Dashboard"

  const { flash } = usePage().props
  const [booking, setBooking] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [filterData, setFilterData] = useState({
    customer_id: filters?.customer_id || "",
    staff_id: filters?.staff_id || "",
    branch_id: filters?.branch_id || "",
    status: filters?.status || "",
    date: filters?.date || "",
    start_date: filters?.start_date || "",
    end_date: filters?.end_date || "",
  })

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleDeleteBooking = () => {
    if (booking && booking.id) {
      router.delete(`/admin/bookings/${booking.id}`, {
        onSuccess: () => {
          setDeleteModal(false)
          setBooking(null)
          toast.success("Booking deleted successfully!")
        },
        onError: (errors) => {
          toast.error("Failed to delete booking")
          console.error(errors)
        },
      })
    }
  }

  const handleStatusChange = (bookingId, action) => {
    router.patch(
      `/admin/bookings/${bookingId}/${action}`,
      {},
      {
        onSuccess: () => {
          toast.success(`Booking ${action}ed successfully!`)
        },
        onError: (errors) => {
          toast.error(`Failed to ${action} booking`)
          console.error(errors)
        },
      },
    )
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    router.get("/admin/bookings", filterData, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const handleClearFilters = () => {
    setFilterData({
      customer_id: "",
      staff_id: "",
      branch_id: "",
      status: "",
      date: "",
      start_date: "",
      end_date: "",
    })
    router.get(
      "/admin/bookings",
      {},
      {
        preserveState: true,
        preserveScroll: true,
      },
    )
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"

    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    } catch (error) {
      return dateString
    }
  }

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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "warning"
      case "confirmed":
        return "info"
      case "completed":
        return "success"
      case "cancelled":
        return "danger"
      default:
        return "secondary"
    }
  }

  const columns = useMemo(
    () => [
      {
        header: "Customer",
        accessorKey: "customer",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            {row.original.customer ? (
              <>
                <div className="fw-medium">{row.original.customer.name}</div>
                <small className="text-muted">{row.original.customer.email}</small>
              </>
            ) : (
              <span className="text-muted">Unknown Customer</span>
            )}
          </div>
        ),
      },
      {
        header: "Services",
        accessorKey: "services",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            {row.original.services && row.original.services.length > 0 ? (
              <>
                <div className="fw-medium">
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
                <small className="text-muted">
                  $
                  {row.original.services
                    .reduce((total, service) => total + Number.parseFloat(service.price), 0)
                    .toFixed(2)}
                </small>
              </>
            ) : (
              <span className="text-muted">No services</span>
            )}
          </div>
        ),
      },
      {
        header: "Staff",
        accessorKey: "staff",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            {row.original.staff ? (
              <>
                <div className="fw-medium">
                  <Link href={`/admin/staff/${row.original.staff.slug}`} className="text-body">
                    {row.original.staff.name}
                  </Link>
                </div>
                <small className="text-muted">{row.original.staff.specialization || "General"}</small>
              </>
            ) : (
              <span className="text-muted">Any Available</span>
            )}
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
                <div className="fw-medium">
                  <Link href={`/admin/branches/${row.original.branch.slug}`} className="text-body">
                    {row.original.branch.name}
                  </Link>
                </div>
                <small className="text-muted">{row.original.branch.city}</small>
              </>
            ) : (
              <span className="text-muted">Unknown Branch</span>
            )}
          </div>
        ),
      },
      {
        header: "Date & Time",
        accessorKey: "booking_date",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <div className="fw-medium">{formatDate(row.original.booking_date)}</div>
            <small className="text-muted">
              {formatTime(row.original.start_time)} - {formatTime(row.original.end_time)}
            </small>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <Badge className={`bg-${getStatusColor(row.original.status)}`}>
              {statuses[row.original.status] || row.original.status}
            </Badge>
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
                href={`/admin/bookings/${row.original.id}`}
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
                href={`/admin/bookings/${row.original.id}/edit`}
                className="btn btn-sm btn-soft-info"
                id={`edittooltip-${row.original.id}`}
              >
                <i className="mdi mdi-pencil-outline" />
                <UncontrolledTooltip
                  placement="top"
                  target={`edittooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  Edit Booking
                </UncontrolledTooltip>
              </Link>
            </li>

            {row.original.status === "pending" && (
              <li>
                <button
                  type="button"
                  className="btn btn-sm btn-soft-success"
                  onClick={() => handleStatusChange(row.original.id, "confirm")}
                  id={`confirmtooltip-${row.original.id}`}
                >
                  <i className="mdi mdi-check" />
                  <UncontrolledTooltip
                    placement="top"
                    target={`confirmtooltip-${row.original.id}`}
                    transition={{ timeout: 0 }}
                  >
                    Confirm Booking
                  </UncontrolledTooltip>
                </button>
              </li>
            )}

            {row.original.status === "confirmed" && (
              <li>
                <button
                  type="button"
                  className="btn btn-sm btn-soft-success"
                  onClick={() => handleStatusChange(row.original.id, "complete")}
                  id={`completetooltip-${row.original.id}`}
                >
                  <i className="mdi mdi-check-all" />
                  <UncontrolledTooltip
                    placement="top"
                    target={`completetooltip-${row.original.id}`}
                    transition={{ timeout: 0 }}
                  >
                    Complete Booking
                  </UncontrolledTooltip>
                </button>
              </li>
            )}

            {(row.original.status === "pending" || row.original.status === "confirmed") && (
              <li>
                <button
                  type="button"
                  className="btn btn-sm btn-soft-warning"
                  onClick={() => handleStatusChange(row.original.id, "cancel")}
                  id={`canceltooltip-${row.original.id}`}
                >
                  <i className="mdi mdi-close" />
                  <UncontrolledTooltip
                    placement="top"
                    target={`canceltooltip-${row.original.id}`}
                    transition={{ timeout: 0 }}
                  >
                    Cancel Booking
                  </UncontrolledTooltip>
                </button>
              </li>
            )}

            <li>
              <button
                type="button"
                className="btn btn-sm btn-soft-danger"
                onClick={() => {
                  setBooking(row.original)
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
                  Delete Booking
                </UncontrolledTooltip>
              </button>
            </li>
          </ul>
        ),
      },
    ],
    [statuses],
  )

  return (
    <React.Fragment>
      <DeleteModal
        show={deleteModal}
        onDeleteClick={handleDeleteBooking}
        onCloseClick={() => setDeleteModal(false)}
        title="Delete Booking"
        message={`Are you sure you want to delete this booking for ${booking?.customer?.name || "Unknown Customer"}? This action cannot be undone.`}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Bookings" breadcrumbItem="Booking Management" />

          {/* Filters */}
          <Row className="mb-3">
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form onSubmit={handleFilterSubmit}>
                    <Row>
                      <Col md="2">
                        <FormGroup>
                          <Label for="customer_id">Customer</Label>
                          <Input
                            type="select"
                            id="customer_id"
                            value={filterData.customer_id}
                            onChange={(e) => setFilterData({ ...filterData, customer_id: e.target.value })}
                          >
                            <option value="">All Customers</option>
                            {customers.map((customer) => (
                              <option key={customer.id} value={customer.id}>
                                {customer.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="staff_id">Staff</Label>
                          <Input
                            type="select"
                            id="staff_id"
                            value={filterData.staff_id}
                            onChange={(e) => setFilterData({ ...filterData, staff_id: e.target.value })}
                          >
                            <option value="">All Staff</option>
                            {staff.map((staffMember) => (
                              <option key={staffMember.id} value={staffMember.id}>
                                {staffMember.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="branch_id">Branch</Label>
                          <Input
                            type="select"
                            id="branch_id"
                            value={filterData.branch_id}
                            onChange={(e) => setFilterData({ ...filterData, branch_id: e.target.value })}
                          >
                            <option value="">All Branches</option>
                            {branches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="status">Status</Label>
                          <Input
                            type="select"
                            id="status"
                            value={filterData.status}
                            onChange={(e) => setFilterData({ ...filterData, status: e.target.value })}
                          >
                            <option value="">All Statuses</option>
                            {Object.entries(statuses).map(([key, value]) => (
                              <option key={key} value={key}>
                                {value}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="date">Specific Date</Label>
                          <Input
                            type="date"
                            id="date"
                            value={filterData.date}
                            onChange={(e) => setFilterData({ ...filterData, date: e.target.value })}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="start_date">Start Date</Label>
                          <Input
                            type="date"
                            id="start_date"
                            value={filterData.start_date}
                            onChange={(e) => setFilterData({ ...filterData, start_date: e.target.value })}
                          />
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="2">
                        <FormGroup>
                          <Label for="end_date">End Date</Label>
                          <Input
                            type="date"
                            id="end_date"
                            value={filterData.end_date}
                            onChange={(e) => setFilterData({ ...filterData, end_date: e.target.value })}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="10">
                        <div className="d-flex gap-2 align-items-end" style={{ height: "100%" }}>
                          <Button type="submit" color="primary">
                            <i className="mdi mdi-filter me-1"></i>
                            Filter
                          </Button>
                          <Button type="button" color="secondary" onClick={handleClearFilters}>
                            <i className="mdi mdi-filter-remove me-1"></i>
                            Clear
                          </Button>
                        </div>
                      </Col>
                    </Row>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <TableContainer
                    columns={columns}
                    data={bookings || []}
                    isGlobalFilter={true}
                    isAddUserList={false}
                    customPageSize={10}
                    className="custom-header-css"
                    divClass="table-responsive table-card mb-1"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light text-muted"
                    SearchPlaceholder="Search bookings..."
                    isBookingListFilter={false}
                    handleBookingClick={() => {}}
                    isAddButton={true}
                    addButtonLabel="Add Booking"
                    addButtonLink="/admin/bookings/create"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </div>
      </div>

      <ToastContainer closeButton={false} />
    </React.Fragment>
  )
}

export default Index
