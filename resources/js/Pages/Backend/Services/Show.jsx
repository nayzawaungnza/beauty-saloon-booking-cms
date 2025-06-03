"use client"

import React, { useState } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import Breadcrumbs from "@/components/common/Breadcrumb"
import DeleteModal from "@/components/common/DeleteModal"
import ActivateModal from "@/components/common/ActivateModal"
import ImageGallery from "@/components/common/ImageGallery"
import { Col, Row, Card, CardBody, CardHeader, Badge, Button, UncontrolledTooltip, Table } from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

const Show = ({ service }) => {
  document.title = `${service.name} | Service Details`

  const { flash } = usePage().props
  const [deleteModal, setDeleteModal] = useState(false)
  const [activateModal, setActivateModal] = useState(false)

  React.useEffect(() => {
    if (flash.success) {
      toast.success(flash.success)
    }
    if (flash.error) {
      toast.error(flash.error)
    }
  }, [flash])

  const handleDeleteService = () => {
    if (service && service.id) {
      router.delete(route("admin.services.destroy", service.id), {
        onSuccess: () => {
          setDeleteModal(false)
          router.visit(route("admin.services.index"))
        },
        onError: (errors) => {
          toast.error("Failed to delete service")
          console.error(errors)
        },
      })
    }
  }

  const handleActivateService = () => {
    if (service && service.id) {
      const action = service.is_active ? "deactivate" : "activate"

      router.patch(
        route("admin.services.changeStatus", service.id),
        { is_active: !service.is_active },
        {
          onSuccess: () => {
            setActivateModal(false)
            toast.success(`Service ${action}d successfully`)
          },
          onError: (errors) => {
            toast.error(`Failed to ${action} service`)
            console.error(errors)
          },
        },
      )
    }
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price / 100) // Assuming price is stored in cents
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <React.Fragment>
      <DeleteModal show={deleteModal} onDeleteClick={handleDeleteService} onCloseClick={() => setDeleteModal(false)} />

      <ActivateModal
        show={activateModal}
        service={service}
        onActivateClick={handleActivateService}
        onCloseClick={() => setActivateModal(false)}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs
            title="Services"
            breadcrumbItem="Service Details"
            // breadcrumbItems={[
            //   { title: "Services", link: route("admin.services.index") },
            //   { title: service.name, active: true },
            // ]}
          />

          {/* Header Section */}
          <Row>
            <Col lg="12">
              <Card>
                <CardHeader className="border-bottom">
                  <div className="d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center">
                      <div className="flex-shrink-0 me-3">
                        {service.default_image ? (
                          <img
                            src={`/storage/${service.default_image.image_url}`}
                            alt={service.name}
                            className="rounded"
                            style={{ width: "60px", height: "60px", objectFit: "cover" }}
                          />
                        ) : (
                          <div
                            className="bg-light rounded d-flex align-items-center justify-content-center"
                            style={{ width: "60px", height: "60px" }}
                          >
                            <i className="mdi mdi-scissors-cutting text-muted fs-4"></i>
                          </div>
                        )}
                      </div>
                      <div className="flex-grow-1">
                        <h4 className="mb-1">{service.name}</h4>
                        <div className="d-flex align-items-center gap-2">
                          <Badge className={service.is_active ? "bg-success" : "bg-danger"}>
                            {service.is_active ? "Active" : "Inactive"}
                          </Badge>
                          {service.is_promotion && (
                            <Badge className="bg-warning">
                              <i className="mdi mdi-tag me-1"></i>
                              Promotion
                            </Badge>
                          )}
                          {service.requires_buffer && (
                            <Badge className="bg-info">
                              <i className="mdi mdi-clock-outline me-1"></i>
                              Buffer Required
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="d-flex gap-2">
                        <Link
                          href={route("admin.services.edit", service.id)}
                          className="btn btn-primary"
                          id="edit-service"
                        >
                          <i className="mdi mdi-pencil-outline me-1"></i>
                          Edit Service
                        </Link>
                        <UncontrolledTooltip placement="top" target="edit-service">
                          Edit this service
                        </UncontrolledTooltip>

                        <Button
                          color={service.is_active ? "warning" : "success"}
                          onClick={() => setActivateModal(true)}
                          id="toggle-status"
                        >
                          <i className={`mdi ${service.is_active ? "mdi-pause" : "mdi-play"} me-1`}></i>
                          {service.is_active ? "Deactivate" : "Activate"}
                        </Button>
                        <UncontrolledTooltip placement="top" target="toggle-status">
                          {service.is_active ? "Deactivate" : "Activate"} this service
                        </UncontrolledTooltip>

                        <Button color="danger" onClick={() => setDeleteModal(true)} id="delete-service">
                          <i className="mdi mdi-delete-outline me-1"></i>
                          Delete
                        </Button>
                        <UncontrolledTooltip placement="top" target="delete-service">
                          Delete this service
                        </UncontrolledTooltip>
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Service Details */}
            <Col lg="8">
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-information-outline me-2"></i>
                    Service Information
                  </h5>
                </CardHeader>
                <CardBody>
                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Service Name</label>
                        <p className="text-muted mb-0">{service.name}</p>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Slug</label>
                        <p className="text-muted mb-0">
                          <code>{service.slug}</code>
                        </p>
                      </div>
                    </Col>
                  </Row>

                  <Row>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Duration</label>
                        <p className="text-muted mb-0">
                          {service.duration ? `${service.duration} minutes` : "Not specified"}
                        </p>
                      </div>
                    </Col>
                    <Col md="6">
                      <div className="mb-3">
                        <label className="form-label fw-bold">Price</label>
                        <p className="text-muted mb-0 fs-5 fw-semibold text-primary">
                          {formatPrice(service.price)}
                          {service.discount_price && (
                            <span className="ms-2">
                              <del className="text-muted fs-6">{formatPrice(service.discount_price)}</del>
                            </span>
                          )}
                        </p>
                      </div>
                    </Col>
                  </Row>

                  {service.excerpt && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Excerpt</label>
                      <p className="text-muted mb-0">{service.excerpt}</p>
                    </div>
                  )}

                  {service.description && (
                    <div className="mb-3">
                      <label className="form-label fw-bold">Description</label>
                      <div className="text-muted" dangerouslySetInnerHTML={{ __html: service.description }} />
                    </div>
                  )}
                </CardBody>
              </Card>

              {/* Service Images */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-image-multiple-outline me-2"></i>
                    Service Images
                  </h5>
                </CardHeader>
                <CardBody>
                  <ImageGallery
                    defaultImage={service.default_image}
                    galleryImages={service.gallery_images}
                    title=""
                    showTitle={false}
                    maxPreviewImages={8}
                    imageHeight="180px"
                  />
                </CardBody>
              </Card>
            </Col>

            {/* Sidebar */}
            <Col lg="4">
              {/* Service Settings */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-cog-outline me-2"></i>
                    Service Settings
                  </h5>
                </CardHeader>
                <CardBody>
                  <Table className="table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Status:</td>
                        <td>
                          <Badge className={service.is_active ? "bg-success" : "bg-danger"}>
                            {service.is_active ? "Active" : "Inactive"}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Promotion:</td>
                        <td>
                          <Badge className={service.is_promotion ? "bg-warning" : "bg-secondary"}>
                            {service.is_promotion ? "Yes" : "No"}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Buffer Required:</td>
                        <td>
                          <Badge className={service.requires_buffer ? "bg-info" : "bg-secondary"}>
                            {service.requires_buffer ? "Yes" : "No"}
                          </Badge>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Images:</td>
                        <td>
                          <span className="text-muted">
                            {service.default_image ? 1 : 0} default, {service.gallery_images?.length || 0} gallery
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </Table>
                </CardBody>
              </Card>

              {/* Metadata */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-clock-outline me-2"></i>
                    Metadata
                  </h5>
                </CardHeader>
                <CardBody>
                  <Table className="table-borderless mb-0">
                    <tbody>
                      <tr>
                        <td className="fw-bold">Created:</td>
                        <td>
                          <small className="text-muted">{formatDate(service.created_at)}</small>
                        </td>
                      </tr>
                      <tr>
                        <td className="fw-bold">Updated:</td>
                        <td>
                          <small className="text-muted">{formatDate(service.updated_at)}</small>
                        </td>
                      </tr>
                      {service.created_by && (
                        <tr>
                          <td className="fw-bold">Created By:</td>
                          <td>
                            <small className="text-muted">{service.created_by.name || service.created_by.email}</small>
                          </td>
                        </tr>
                      )}
                      {service.updated_by && (
                        <tr>
                          <td className="fw-bold">Updated By:</td>
                          <td>
                            <small className="text-muted">{service.updated_by.name || service.updated_by.email}</small>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </Table>
                </CardBody>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <h5 className="card-title mb-0">
                    <i className="mdi mdi-lightning-bolt-outline me-2"></i>
                    Quick Actions
                  </h5>
                </CardHeader>
                <CardBody>
                  <div className="d-grid gap-2">
                    <Link href={route("admin.services.edit", service.id)} className="btn btn-outline-primary">
                      <i className="mdi mdi-pencil-outline me-2"></i>
                      Edit Service
                    </Link>

                    <Button color="outline-secondary" onClick={() => navigator.clipboard.writeText(service.slug)}>
                      <i className="mdi mdi-content-copy me-2"></i>
                      Copy Slug
                    </Button>

                    <Link href={route("admin.services.index")} className="btn btn-outline-info">
                      <i className="mdi mdi-arrow-left me-2"></i>
                      Back to List
                    </Link>

                    <hr />

                    <Button
                      color={service.is_active ? "outline-warning" : "outline-success"}
                      onClick={() => setActivateModal(true)}
                    >
                      <i className={`mdi ${service.is_active ? "mdi-pause" : "mdi-play"} me-2`}></i>
                      {service.is_active ? "Deactivate" : "Activate"}
                    </Button>

                    <Button color="outline-danger" onClick={() => setDeleteModal(true)}>
                      <i className="mdi mdi-delete-outline me-2"></i>
                      Delete Service
                    </Button>
                  </div>
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

export default Show
