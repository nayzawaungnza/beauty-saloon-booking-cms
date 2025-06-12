"use client"

import React, { useEffect, useMemo, useState, useCallback } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import { isEmpty } from "lodash"
import TableContainer from "@/components/common/TableContainer"
import Breadcrumbs from "@/components/common/Breadcrumb"
import {
  Col,
  Row,
  Card,
  CardBody,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Badge,
  Button,
  Input,
  Label,
  Form,
  FormGroup,
  UncontrolledTooltip,
} from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Index = ({ activityLogs, filters, currentFilters }) => {
  document.title = "Activity Logs | Admin Dashboard"

  const { flash } = usePage().props
  const [filterData, setFilterData] = useState({
    event: currentFilters?.event || "",
    causer_type: currentFilters?.causer_type || "",
    causer_name: currentFilters?.causer_name || "",
    activity_log_startDate: currentFilters?.activity_log_startDate || "",
    activity_log_endDate: currentFilters?.activity_log_endDate || "",
  })

  // Remove the tableKey state as it's causing remounts
  const [isFiltering, setIsFiltering] = useState(false)

  // Add pagination state to persist across filters
  const [paginationState, setPaginationState] = useState({
    pageIndex: 0,
    pageSize: 10,
  })

  // Flatten the data for TableContainer
  const tableData = useMemo(() => {
    return activityLogs.data || []
  }, [activityLogs.data])

  useEffect(() => {
    if (flash?.success) {
      toast.success(flash.success)
    }
    if (flash?.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleFilterSubmit = useCallback(
    (e) => {
      e.preventDefault()
      setIsFiltering(true)

      router.get("/admin/activity-logs", filterData, {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => {
          setIsFiltering(false)
          // Only reset pagination to first page when filtering
          setPaginationState((prev) => ({ ...prev, pageIndex: 0 }))
        },
      })
    },
    [filterData],
  )

  const handleClearFilters = useCallback(() => {
    const clearedFilters = {
      event: "",
      causer_type: "",
      causer_name: "",
      activity_log_startDate: "",
      activity_log_endDate: "",
    }
    setFilterData(clearedFilters)
    setIsFiltering(true)

    router.get(
      "/admin/activity-logs",
      {},
      {
        preserveState: true,
        preserveScroll: true,
        onFinish: () => {
          setIsFiltering(false)
          // Reset pagination when clearing filters
          setPaginationState({ pageIndex: 0, pageSize: 10 })
        },
      },
    )
  }, [])

  const getEventBadgeColor = (event) => {
    switch (event) {
      case "created":
        return "success"
      case "updated":
        return "warning"
      case "deleted":
        return "danger"
      default:
        return "info"
    }
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getModelTypeForActivity = (type) => {
    if (!type) return "Unknown"
    return type.replace("App\\Models\\", "")
  }

  const columns = useMemo(
    () => [
      {
        header: "Event",
        accessorKey: "event",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <Badge color={getEventBadgeColor(row.original.event)} className="text-capitalize">
            {row.original.event}
          </Badge>
        ),
      },
      {
        header: "Description",
        accessorKey: "description",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            <div className="fw-medium">{row.original.description}</div>
            {row.original.subject_type && (
              <small className="text-muted">
                Subject: {getModelTypeForActivity(row.original.subject_type)}
                {row.original.subject_id && ` (ID: ${row.original.subject_id})`}
              </small>
            )}
          </div>
        ),
      },
      {
        header: "User",
        accessorKey: "causer",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            {row.original.causer ? (
              <>
                <div className="fw-medium">{row.original.causer.name}</div>
                <small className="text-muted">{row.original.causer.email}</small>
              </>
            ) : (
              <span className="text-muted">System</span>
            )}
          </div>
        ),
      },
      {
        header: "User Type",
        accessorKey: "causer_type",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            {row.original.causer_type ? (
              <Badge color="info" pill>
                {getModelTypeForActivity(row.original.causer_type)}
              </Badge>
            ) : (
              <Badge color="secondary" pill>
                System
              </Badge>
            )}
          </div>
        ),
      },
      {
        header: "IP Address",
        accessorKey: "properties",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div>
            <code className="text-muted">{row.original.properties?.ip || "N/A"}</code>
          </div>
        ),
      },
      {
        header: "Date & Time",
        accessorKey: "created_at",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <div>
            <div className="fw-medium">{formatDate(row.original.created_at)}</div>
          </div>
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
                href={`/admin/activity-logs/${row.original.id}`}
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
          </ul>
        ),
      },
    ],
    [],
  )

  return (
    <React.Fragment>
      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="System" breadcrumbItem="Activity Logs" />

          {/* Filters */}
          <Row className="mb-3">
            <Col lg="12">
              <Card>
                <CardBody>
                  <Form onSubmit={handleFilterSubmit}>
                    <Row>
                      <Col md="2">
                        <FormGroup>
                          <Label for="event">Event</Label>
                          <Input
                            type="select"
                            id="event"
                            value={filterData.event}
                            onChange={(e) => setFilterData({ ...filterData, event: e.target.value })}
                            disabled={isFiltering}
                          >
                            <option value="">All Events</option>
                            {filters.events.map((event) => (
                              <option key={event} value={event}>
                                {event}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="causer_type">User Type</Label>
                          <Input
                            type="select"
                            id="causer_type"
                            value={filterData.causer_type}
                            onChange={(e) => setFilterData({ ...filterData, causer_type: e.target.value })}
                            disabled={isFiltering}
                          >
                            <option value="">All Types</option>
                            {filters.causerTypes.map((type) => (
                              <option key={type} value={type}>
                                {type}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="causer_name">User Name</Label>
                          <Input
                            type="text"
                            id="causer_name"
                            placeholder="Search by name..."
                            value={filterData.causer_name}
                            onChange={(e) => setFilterData({ ...filterData, causer_name: e.target.value })}
                            disabled={isFiltering}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="start_date">Start Date</Label>
                          <Input
                            type="date"
                            id="start_date"
                            value={filterData.activity_log_startDate}
                            onChange={(e) => setFilterData({ ...filterData, activity_log_startDate: e.target.value })}
                            disabled={isFiltering}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label for="end_date">End Date</Label>
                          <Input
                            type="date"
                            id="end_date"
                            value={filterData.activity_log_endDate}
                            onChange={(e) => setFilterData({ ...filterData, activity_log_endDate: e.target.value })}
                            disabled={isFiltering}
                          />
                        </FormGroup>
                      </Col>
                      <Col md="2">
                        <FormGroup>
                          <Label>&nbsp;</Label>
                          <div className="d-grid gap-2">
                            <Button type="submit" color="primary" size="sm" disabled={isFiltering}>
                              {isFiltering ? (
                                <>
                                  <span
                                    className="spinner-border spinner-border-sm me-1"
                                    role="status"
                                    aria-hidden="true"
                                  ></span>
                                  Filtering...
                                </>
                              ) : (
                                <>
                                  <i className="mdi mdi-filter me-1"></i>
                                  Filter
                                </>
                              )}
                            </Button>
                            <Button
                              type="button"
                              color="secondary"
                              size="sm"
                              onClick={handleClearFilters}
                              disabled={isFiltering}
                            >
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
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">
                      <i className="mdi mdi-history me-2"></i>
                      Activity Logs
                    </h5>
                    <div className="flex-shrink-0">
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
                            <DropdownItem
                              href="#"
                              onClick={() => router.get("/admin/activity-logs/export", filterData)}
                            >
                              <i className="mdi mdi-file-excel me-2"></i>
                              Export CSV
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem
                              href="#"
                              onClick={() =>
                                router.get("/admin/activity-logs/export", { ...filterData, format: "pdf" })
                              }
                            >
                              <i className="mdi mdi-file-pdf me-2"></i>
                              Export PDF
                            </DropdownItem>
                          </li>
                          <li>
                            <DropdownItem href="#" onClick={() => window.print()}>
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
                  {isEmpty(tableData) ? (
                    <div className="text-center py-5">
                      <div className="avatar-lg mx-auto mb-4">
                        <div className="avatar-title bg-primary-subtle text-primary rounded-circle">
                          <i className="mdi mdi-history display-4"></i>
                        </div>
                      </div>
                      <h5 className="mt-2">No activity logs found</h5>
                      <p className="text-muted mb-4">
                        No activities have been recorded yet or match your current filters.
                      </p>
                      <Button color="secondary" onClick={handleClearFilters}>
                        <i className="mdi mdi-filter-remove me-1"></i>
                        Clear Filters
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div className="row mb-3">
                        <div className="col-sm-6">
                          <div className="d-flex align-items-center">
                            <h6 className="mb-0">
                              Total: <span className="fw-bold text-primary">{activityLogs.total}</span> activity logs
                            </h6>
                          </div>
                        </div>
                        <div className="col-sm-6">
                          <div className="text-sm-end">
                            <small className="text-muted">
                              Showing {activityLogs.from || 0} to {activityLogs.to || 0} of {activityLogs.total} entries
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Remove the key prop that was causing remounts */}
                      <TableContainer
                        columns={columns}
                        data={tableData}
                        isCustomPageSize={true}
                        isGlobalFilter={true}
                        isPagination={true}
                        SearchPlaceholder="Search activity logs by description, event, or user..."
                        tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline mt-4 border-top"
                        pagination="pagination"
                        paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded"
                        initialPageIndex={paginationState.pageIndex}
                        initialPageSize={paginationState.pageSize}
                        onPaginationChange={setPaginationState}
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
