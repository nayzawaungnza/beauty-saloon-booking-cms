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
import ImageModal from "@/components/common/ImageModal"

const Index = ({ services }) => {
  document.title = "Services List | Admin Dashboard"

  const { flash } = usePage().props
  const [service, setService] = useState(null)
  const [deleteModal, setDeleteModal] = useState(false)
  const [activateModal, setActivateModal] = useState(false)
  const [imageModal, setImageModal] = useState(false)
  const [selectedServiceImages, setSelectedServiceImages] = useState(null)

  useEffect(() => {
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
          setService(null)
          //toast.success("Service deleted successfully")
        },
        onError: (errors) => {
          //toast.error("Failed to delete service")
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
            setService(null)
            //toast.success(`Service ${action}d successfully`)
          },
          onError: (errors) => {
            //toast.error(`Failed to ${action} service`)
            console.error(errors)
          },
        },
      )
    }
  }

  const handleViewImages = (service) => {
    setSelectedServiceImages(service)
    setImageModal(true)
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
        header: "Image",
        accessorKey: "default_image",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <div className="d-flex align-items-center">
            <div className="flex-shrink-0 me-2">
              {row.original.default_image ? (
                <img
                  src={`/storage/${row.original.default_image.image_url}`}
                  alt={row.original.name}
                  className="rounded"
                  style={{ width: "40px", height: "40px", objectFit: "cover" }}
                />
              ) : (
                <div
                  className="bg-light rounded d-flex align-items-center justify-content-center"
                  style={{ width: "40px", height: "40px" }}
                >
                  <i className="mdi mdi-image-outline text-muted"></i>
                </div>
              )}
            </div>
            <div className="flex-grow-1">
              {row.original.gallery_images && row.original.gallery_images.length > 0 && (
                <small className="text-muted">+{row.original.gallery_images.length} more</small>
              )}
            </div>
          </div>
        ),
      },
      // {
      //   header: "Description",
      //   accessorKey: "description",
      //   enableColumnFilter: false,
      //   enableSorting: false,
      //   cell: ({ row }) => (
      //     <div className="text-truncate" style={{ maxWidth: "200px" }}>
      //       {row.original.description || "No description"}
      //     </div>
      //   ),
      // },
      {
        header: "Price",
        accessorKey: "price",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => <span>${Number.parseFloat(row.original.price || 0).toFixed(2)}</span>,
      },
      {
        header: "Duration",
        accessorKey: "duration",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => <span>{row.original.duration ? `${row.original.duration} min` : "N/A"}</span>,
      },
      {
        header: "Buffer Required",
        accessorKey: "requires_buffer",
        enableColumnFilter: false,
        enableSorting: false,
        cell: ({ row }) => (
          <Badge className={row.original.requires_buffer ? "bg-info" : "bg-secondary"}>
            {row.original.requires_buffer ? "Yes" : "No"}
          </Badge>
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
            <li data-bs-toggle="tooltip" data-bs-placement="top" title="View">
              <Link
                href={route("admin.services.show", row.original.id)}
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
              <button
                type="button"
                className="btn btn-sm btn-soft-secondary"
                onClick={() => handleViewImages(row.original)}
                id={`imagestooltip-${row.original.id}`}
              >
                <i className="mdi mdi-image-multiple-outline" />
                <UncontrolledTooltip
                  placement="top"
                  target={`imagestooltip-${row.original.id}`}
                  transition={{ timeout: 0 }}
                >
                  View Images ({row.original.gallery_images?.length || 0})
                </UncontrolledTooltip>
              </button>
            </li>

            <li>
              <Link
                href={route("admin.services.edit", row.original.id)}
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
                  setService(row.original)
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
                  setService(row.original)
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
      <DeleteModal show={deleteModal} onDeleteClick={handleDeleteService} onCloseClick={() => setDeleteModal(false)} />

      <ActivateModal
        show={activateModal}
        service={service}
        onActivateClick={handleActivateService}
        onCloseClick={() => setActivateModal(false)}
      />

      <ImageModal
        show={imageModal}
        title={`Service Images - ${selectedServiceImages?.name || ""}`}
        defaultImage={selectedServiceImages?.default_image}
        images={selectedServiceImages?.gallery_images || []}
        onCloseClick={() => {
          setImageModal(false)
          setSelectedServiceImages(null)
        }}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Services" breadcrumbItem="Services List" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">Services List</h5>
                    <div className="flex-shrink-0">
                      <Link href={route("admin.services.create")} className="btn btn-primary me-1">
                        Add New Service
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
                  {isEmpty(services) ? (
                    <div className="text-center py-4">
                      <i className="mdi mdi-information-outline display-4 text-muted"></i>
                      <h5 className="mt-2">No services found</h5>
                      <p className="text-muted">Get started by creating your first service.</p>
                      <Link href={route("admin.services.create")} className="btn btn-primary">
                        Add New Service
                      </Link>
                    </div>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={services || []}
                      isCustomPageSize={true}
                      isGlobalFilter={true}
                      isPagination={true}
                      SearchPlaceholder="Search for services..."
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
