"use client"

import React, { useState, useEffect, useRef } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import {
  Card,
  CardBody,
  Col,
  Container,
  Row,
  Button,
  Input,
  Label,
  FormGroup,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
} from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import Breadcrumbs from "@/components/common/Breadcrumb"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import listPlugin from "@fullcalendar/list"
import axios from "axios"

const Index = ({ branches, staff, initialDate, initialView, filters }) => {
  document.title = "Booking Calendar | Admin Dashboard"

  const { flash } = usePage().props
  const calendarRef = useRef(null)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showEventModal, setShowEventModal] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [filterData, setFilterData] = useState({
    branch_id: filters?.branch_id || "",
    staff_id: filters?.staff_id || "",
  })
  const [newBookingDate, setNewBookingDate] = useState("")
  const [newBookingTime, setNewBookingTime] = useState("")

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleFilterChange = (e) => {
    const { name, value } = e.target
    setFilterData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleFilterSubmit = (e) => {
    e.preventDefault()
    router.get("/admin/calendar", filterData, {
      preserveState: true,
      preserveScroll: true,
    })
  }

  const handleClearFilters = () => {
    setFilterData({
      branch_id: "",
      staff_id: "",
    })
    router.get(
      "/admin/calendar",
      {},
      {
        preserveState: true,
        preserveScroll: true,
      },
    )
  }

  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      ...info.event.extendedProps,
    })
    setShowEventModal(true)
  }

  const handleDateClick = (info) => {
    setNewBookingDate(info.dateStr)

    // Set default time to current hour rounded up to nearest half hour
    const now = new Date()
    let hours = now.getHours()
    let minutes = now.getMinutes() >= 30 ? 30 : 0

    // If we're past 30 minutes, move to the next hour
    if (now.getMinutes() > 30) {
      hours += 1
      minutes = 0
    }

    const timeStr = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`
    setNewBookingTime(timeStr)

    setShowCreateModal(true)
  }

  const handleCreateBooking = () => {
    router.visit(`/admin/bookings/create?date=${newBookingDate}&time=${newBookingTime}`)
  }

  const handleViewBooking = () => {
    if (selectedEvent) {
      router.visit(`/admin/bookings/${selectedEvent.booking_id}`)
    }
  }

  const handleEditBooking = () => {
    if (selectedEvent) {
      router.visit(`/admin/bookings/${selectedEvent.booking_id}/edit`)
    }
  }

  const handleStatusChange = (action) => {
    if (selectedEvent) {
      router.patch(
        `/admin/bookings/${selectedEvent.booking_id}/${action}`,
        {},
        {
          onSuccess: () => {
            toast.success(`Booking ${action}ed successfully!`)
            setShowEventModal(false)
            // Refresh calendar events
            if (calendarRef.current) {
              calendarRef.current.getApi().refetchEvents()
            }
          },
          onError: (errors) => {
            toast.error(`Failed to ${action} booking`)
            console.error(errors)
          },
        },
      )
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

  const formatDateTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A"
    const date = new Date(dateTimeStr)
    return date.toLocaleString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return "N/A"
    const date = new Date(dateStr)
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const formatTime = (dateTimeStr) => {
    if (!dateTimeStr) return "N/A"
    const date = new Date(dateTimeStr)
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    })
  }

  const fetchEvents = (info, successCallback, failureCallback) => {
    const { startStr, endStr } = info

    axios
      .get("/admin/calendar/bookings", {
        params: {
          start: startStr,
          end: endStr,
          branch_id: filterData.branch_id,
          staff_id: filterData.staff_id,
        },
      })
      .then((response) => {
        successCallback(response.data)
      })
      .catch((error) => {
        console.error("Error fetching calendar events:", error)
        toast.error("Failed to load calendar events")
        failureCallback(error)
      })
  }

  return (
    <React.Fragment>
      {/* Event Details Modal */}
      <Modal isOpen={showEventModal} toggle={() => setShowEventModal(false)} size="lg">
        <ModalHeader toggle={() => setShowEventModal(false)}>
          Booking Details
          {selectedEvent && (
            <Badge color={getStatusColor(selectedEvent.status)} className="ms-2">
              {selectedEvent.status.charAt(0).toUpperCase() + selectedEvent.status.slice(1)}
            </Badge>
          )}
        </ModalHeader>
        <ModalBody>
          {selectedEvent && (
            <div>
              <Row>
                <Col md="6">
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Customer</h6>
                    <h5>{selectedEvent.customer_name}</h5>
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Staff</h6>
                    <h5>{selectedEvent.staff_name}</h5>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Branch</h6>
                    <h5>{selectedEvent.branch_name}</h5>
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Services</h6>
                    <h5>{selectedEvent.services}</h5>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md="6">
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Date</h6>
                    <h5>{formatDate(selectedEvent.start)}</h5>
                  </div>
                </Col>
                <Col md="6">
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Time</h6>
                    <h5>
                      {formatTime(selectedEvent.start)} - {formatTime(selectedEvent.end)}
                    </h5>
                  </div>
                </Col>
              </Row>

              <Row>
                <Col md="12">
                  <div className="mb-3">
                    <h6 className="text-muted mb-1">Total Price</h6>
                    <h5>${Number.parseFloat(selectedEvent.total_price).toFixed(2)}</h5>
                  </div>
                </Col>
              </Row>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleViewBooking}>
            <i className="mdi mdi-eye me-1"></i> View Details
          </Button>
          <Button color="info" onClick={handleEditBooking}>
            <i className="mdi mdi-pencil me-1"></i> Edit
          </Button>

          {selectedEvent && selectedEvent.status === "pending" && (
            <Button color="success" onClick={() => handleStatusChange("confirm")}>
              <i className="mdi mdi-check me-1"></i> Confirm
            </Button>
          )}

          {selectedEvent && selectedEvent.status === "confirmed" && (
            <Button color="success" onClick={() => handleStatusChange("complete")}>
              <i className="mdi mdi-check-all me-1"></i> Complete
            </Button>
          )}

          {selectedEvent && (selectedEvent.status === "pending" || selectedEvent.status === "confirmed") && (
            <Button color="danger" onClick={() => handleStatusChange("cancel")}>
              <i className="mdi mdi-close me-1"></i> Cancel
            </Button>
          )}

          <Button color="secondary" onClick={() => setShowEventModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>

      {/* Create Booking Modal */}
      <Modal isOpen={showCreateModal} toggle={() => setShowCreateModal(false)}>
        <ModalHeader toggle={() => setShowCreateModal(false)}>Create New Booking</ModalHeader>
        <ModalBody>
          <div className="mb-3">
            <h6>Selected Date: {formatDate(newBookingDate)}</h6>
          </div>
          <FormGroup>
            <Label for="bookingTime">Select Time</Label>
            <Input
              type="time"
              id="bookingTime"
              value={newBookingTime}
              onChange={(e) => setNewBookingTime(e.target.value)}
            />
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={handleCreateBooking}>
            <i className="mdi mdi-plus me-1"></i> Create Booking
          </Button>
          <Button color="secondary" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
        </ModalFooter>
      </Modal>

      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Calendar" breadcrumbItem="Booking Calendar" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <Row className="mb-4">
                    <Col md="8">
                      <div className="d-flex gap-2">
                        <FormGroup className="mb-0">
                          <Label for="branch_id" className="me-2">
                            Branch
                          </Label>
                          <Input
                            type="select"
                            id="branch_id"
                            name="branch_id"
                            value={filterData.branch_id}
                            onChange={handleFilterChange}
                            style={{ width: "200px" }}
                          >
                            <option value="">All Branches</option>
                            {branches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>

                        <FormGroup className="mb-0">
                          <Label for="staff_id" className="me-2">
                            Staff
                          </Label>
                          <Input
                            type="select"
                            id="staff_id"
                            name="staff_id"
                            value={filterData.staff_id}
                            onChange={handleFilterChange}
                            style={{ width: "200px" }}
                          >
                            <option value="">All Staff</option>
                            {staff.map((staffMember) => (
                              <option key={staffMember.id} value={staffMember.id}>
                                {staffMember.name}
                              </option>
                            ))}
                          </Input>
                        </FormGroup>

                        <div className="d-flex align-items-end">
                          <Button color="primary" onClick={handleFilterSubmit} className="me-2">
                            <i className="mdi mdi-filter me-1"></i> Filter
                          </Button>
                          <Button color="secondary" onClick={handleClearFilters}>
                            <i className="mdi mdi-refresh me-1"></i> Reset
                          </Button>
                        </div>
                      </div>
                    </Col>
                    <Col md="4" className="text-end">
                      <Link href="/admin/bookings/create" className="btn btn-success">
                        <i className="mdi mdi-plus me-1"></i> New Booking
                      </Link>
                    </Col>
                  </Row>

                  <div className="calendar-wrapper">
                    <FullCalendar
                      ref={calendarRef}
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]}
                      initialView={initialView}
                      initialDate={initialDate}
                      headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek",
                      }}
                      events={fetchEvents}
                      eventClick={handleEventClick}
                      dateClick={handleDateClick}
                      editable={false}
                      selectable={true}
                      selectMirror={true}
                      dayMaxEvents={true}
                      weekends={true}
                      height="auto"
                      slotDuration="00:15:00"
                      slotLabelInterval="01:00"
                      slotLabelFormat={{
                        hour: "numeric",
                        minute: "2-digit",
                        omitZeroMinute: false,
                        meridiem: "short",
                      }}
                      allDaySlot={false}
                      nowIndicator={true}
                      eventTimeFormat={{
                        hour: "numeric",
                        minute: "2-digit",
                        meridiem: "short",
                      }}
                    />
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h5 className="card-title mb-3">Calendar Legend</h5>
                  <div className="d-flex flex-wrap gap-3">
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: "#f1b44c",
                          borderRadius: "4px",
                          marginRight: "8px",
                        }}
                      ></div>
                      <span>Pending</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: "#50a5f1",
                          borderRadius: "4px",
                          marginRight: "8px",
                        }}
                      ></div>
                      <span>Confirmed</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: "#34c38f",
                          borderRadius: "4px",
                          marginRight: "8px",
                        }}
                      ></div>
                      <span>Completed</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          backgroundColor: "#f46a6a",
                          borderRadius: "4px",
                          marginRight: "8px",
                        }}
                      ></div>
                      <span>Cancelled</span>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <ToastContainer closeButton={false} />
    </React.Fragment>
  )
}

export default Index
