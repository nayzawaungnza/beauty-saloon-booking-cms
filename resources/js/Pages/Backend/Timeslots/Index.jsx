"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import TableContainer from "@/components/common/TableContainer"
import Breadcrumbs from "@/components/common/Breadcrumb"
import DeleteModal from "@/components/common/DeleteModal"
import { Col, Row, Card, UncontrolledTooltip, CardBody, Badge, Input, Button, Form, FormGroup, Label, UncontrolledDropdown,
DropdownToggle,DropdownMenu, DropdownItem } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Index = ({ timeslots, staff, branches, filters }) => {
  document.title = "Timeslots | Admin Dashboard"

  const { flash } = usePage().props
  const [timeslot, setTimeslot] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [filterData, setFilterData] = useState({
    staff_id: filters?.staff_id || "",
    branch_id: filters?.branch_id || "",
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

  const handleDeleteTimeslot = () => {
    if (timeslot && timeslot.id) {
      router.delete(`/admin/timeslots/${timeslot.id}`, {
        onSuccess: () => {
          setDeleteModal(false)
          setTimeslot(null)
          toast.success("Timeslot deleted successfully!")
        },
        onError: (errors) => {
          toast.error("Failed to delete timeslot")
          console.error(errors)
        },
      })
    }
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    router.get("/admin/timeslots", filterData, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const handleClearFilters = () => {
    setFilterData({
      staff_id: "",
      branch_id: "",
      date: "",
      start_date: "",
      end_date: "",
    })
    router.get(
      "/admin/timeslots",
      {},
      {
        preserveState: true,
        preserveScroll: true,
      },
    )
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

  const columns = useMemo(
    () => [
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
                <small className="text-muted">{row.original.staff.email || row.original.staff.phone || ""}</small>
              </>
            ) : (
              <span className="text-muted">Unknown Staff</span>
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
        header: "Date",
        accessorKey: "date",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <div className="fw-medium">{formatDate(row.original.date)}</div>
          </div>
        ),
      },
      {
        header: "Time",
        accessorKey: "start_time",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <div className="fw-medium">
              {formatTime(row.original.start_time)} - {formatTime(row.original.end_time)}
            </div>
          </div>
        ),
      },
      {
        header: "Status",
        accessorKey: "is_available",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <Badge className={row.original.is_available ? "bg-success" : "bg-danger"}>
              {row.original.is_available ? "Available" : "Unavailable"}
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
            <div className="fw-medium">
              {new Date(row.original.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </div>
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
                href={`/admin/timeslots/${row.original.id}`}
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
                href={`/admin/timeslots/${row.original.id}/edit`}
                className="btn btn-sm btn-soft-info"
                id={`edittooltip-${row.original.id}`}
              >
                <i className="mdi mdi-pencil-outline" />
                <UncontrolledTooltip
                  placement="top"
                  target={`edittooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  Edit Timeslot
                </UncontrolledTooltip>
              </Link>
            </li>

            <li>
              <button
                type="button"
                className="btn btn-sm btn-soft-danger"
                onClick={() => {
                  setTimeslot(row.original)
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
                  Delete Timeslot
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
        onDeleteClick={handleDeleteTimeslot}
        onCloseClick={() => setDeleteModal(false)}
        title="Delete Timeslot"
        message={`Are you sure you want to delete this timeslot for ${timeslot?.staff?.name || "Unknown Staff"} on ${formatDate(timeslot?.date)}? This action cannot be undone.`}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Staff" breadcrumbItem="Timeslots" />

          {/* Filters */}
          <Row className="mb-3">
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form onSubmit={handleFilterSubmit}>
                    <Row>
                      <Col md="3">
                        <FormGroup>
                          <Label for="staff_id">Staff Member</Label>
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
                      <Col md="3">
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
                    </Row>
                    <Row>
                      <Col md="12">
                        <div className="d-flex gap-2">
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
              <CardBody className="border-bottom">
                                                <div className="d-flex align-items-center">
                                                  <h5 className="mb-0 card-title flex-grow-1">
                                                    <i className="mdi mdi-clock me-2"></i>
                                                    Timeslot Management
                                                  </h5>
                                                  <div className="flex-shrink-0">
                                                    <Link href="/admin/timeslots/create" className="btn btn-primary me-1">
                                                      <i className="mdi mdi-plus me-1"></i>
                                                      Add New Timeslot
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
                  <TableContainer
                    columns={columns}
                    data={timeslots || []}
                    isGlobalFilter={true}
                    isAddUserList={false}
                    customPageSize={10}
                    className="custom-header-css"
                    divClass="table-responsive table-card mb-1"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light text-muted"
                    SearchPlaceholder="Search timeslots..."
                    isTimeslotListFilter={false}
                    handleTimeslotClick={() => {}}
                    addButtonLabel="Add Timeslot"
                    addButtonLink="/admin/timeslots/create"
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
