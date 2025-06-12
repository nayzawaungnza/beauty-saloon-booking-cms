"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import TableContainer from "@/components/common/TableContainer"
import Breadcrumbs from "@/components/common/Breadcrumb"
import DeleteModal from "@/components/common/DeleteModal"
import { Col, Row, Card, UncontrolledTooltip, CardBody, Badge, Input, Button, Form, FormGroup, Label } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Index = ({ schedules, staff, filters }) => {
  document.title = "Staff Schedules | Admin Dashboard"

  const { flash } = usePage().props
  const [schedule, setSchedule] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [filterData, setFilterData] = useState({
    staff_id: filters?.staff_id || "",
    day_of_week: filters?.day_of_week !== undefined ? filters.day_of_week : "",
  })

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleDeleteSchedule = () => {
    if (schedule && schedule.id) {
      router.delete(`/admin/staff-schedules/${schedule.id}`, {
        onSuccess: () => {
          setDeleteModal(false)
          setSchedule(null)
          toast.success("Schedule deleted successfully!")
        },
        onError: (errors) => {
          toast.error("Failed to delete schedule")
          console.error(errors)
        },
      })
    }
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    router.get("/admin/staff-schedules", filterData, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const handleClearFilters = () => {
    setFilterData({
      staff_id: "",
      day_of_week: "",
    })
    router.get(
      "/admin/staff-schedules",
      {},
      {
        preserveState: true,
        preserveScroll: true,
      },
    )
  }

  const getDayName = (dayOfWeek) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    return days[dayOfWeek] || "Unknown"
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
        header: "Day",
        accessorKey: "day_of_week",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <Badge color="info">{getDayName(row.original.day_of_week)}</Badge>
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
                href={`/admin/staff-schedules/${row.original.id}`}
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
                href={`/admin/staff-schedules/${row.original.id}/edit`}
                className="btn btn-sm btn-soft-info"
                id={`edittooltip-${row.original.id}`}
              >
                <i className="mdi mdi-pencil-outline" />
                <UncontrolledTooltip
                  placement="top"
                  target={`edittooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  Edit Schedule
                </UncontrolledTooltip>
              </Link>
            </li>

            <li>
              <button
                type="button"
                className="btn btn-sm btn-soft-danger"
                onClick={() => {
                  setSchedule(row.original)
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
                  Delete Schedule
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
        onDeleteClick={handleDeleteSchedule}
        onCloseClick={() => setDeleteModal(false)}
        title="Delete Schedule"
        message={`Are you sure you want to delete this schedule for ${schedule?.staff?.name || "Unknown Staff"} on ${getDayName(schedule?.day_of_week)}? This action cannot be undone.`}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Staff" breadcrumbItem="Staff Schedules" />

          {/* Filters */}
          <Row className="mb-3">
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form onSubmit={handleFilterSubmit}>
                    <Row>
                      <Col md="4">
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
                      <Col md="4">
                        <FormGroup>
                          <Label for="day_of_week">Day of Week</Label>
                          <Input
                            type="select"
                            id="day_of_week"
                            value={filterData.day_of_week}
                            onChange={(e) => setFilterData({ ...filterData, day_of_week: e.target.value })}
                          >
                            <option value="">All Days</option>
                            <option value="0">Sunday</option>
                            <option value="1">Monday</option>
                            <option value="2">Tuesday</option>
                            <option value="3">Wednesday</option>
                            <option value="4">Thursday</option>
                            <option value="5">Friday</option>
                            <option value="6">Saturday</option>
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md="4">
                        <FormGroup>
                          <Label>&nbsp;</Label>
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
                        </FormGroup>
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
                    data={schedules || []}
                    isGlobalFilter={true}
                    isAddUserList={false}
                    customPageSize={10}
                    className="custom-header-css"
                    divClass="table-responsive table-card mb-1"
                    tableClass="align-middle table-nowrap"
                    theadClass="table-light text-muted"
                    SearchPlaceholder="Search schedules..."
                    isScheduleListFilter={false}
                    handleScheduleClick={() => {}}
                    isAddButton={true}
                    addButtonLabel="Add Schedule"
                    addButtonLink="/admin/staff-schedules/create"
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
