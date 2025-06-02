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
  Badge, Button
} from "reactstrap"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
//import { route } from "inertiajs"


const Index = ({ users }) => {
  document.title = "Users List | Admin Dashboard"

  const { flash } = usePage().props
  const [user, setUser] = useState(null)
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

  const handleDeleteUser = () => {
    if (user && user.id) {
      router.delete(route("admin.users.destroy", user.id), {
        onSuccess: () => {
          setDeleteModal(false)
          setUser(null)

          //toast.success(flash.success)
        },
        onError: () => {
          //toast.error(flash.error)
        },
      })
    }
  }

  const handleActivateUser = () => {
    if (user && user.id) {
      const action = user.is_active ? "deactivate" : "activate"

      router.patch(
        route("admin.users.changeStatus", user.id),
        {},
        {
          onSuccess: () => {
            setActivateModal(false)
            setUser(null)
            toast.success(`User ${action}d successfully`)
          },
          onError: () => {
            toast.error(`Failed to ${action} user`)
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
        header: "Mobile",
        accessorKey: "mobile",
        enableColumnFilter: false,
        enableSorting: true,
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
        header: "Role",
        accessorKey: "roles",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <span>
            {row.original.roles && row.original.roles.length > 0
              ? row.original.roles.map((role) => role.name).join(", ")
              : "None"}
          </span>
        ),
      },
      // {
      //   header: "BLK",
      //   accessorKey: "is_blocked",
      //   enableColumnFilter: false,
      //   enableSorting: true,
      //   cell: ({ row }) => (
      //     <Button className={row.original.is_blocked ? "btn btn-sm btn-soft-danger" : "btn btn-sm btn-soft-success"} >
      //       <i className={row.original.is_blocked ? "mdi mdi-account-check" : "mdi mdi-account-cancel"}>
              
      //       </i>
      //       {/* {row.original.is_blocked ? "Blocked" : "Unblocked"} */}
      //     </Button>
      //   ),
      // },
      {
        header: "SUB",
        accessorKey: "is_subscribed",
        enableColumnFilter: false,
        enableSorting: true,
        cell: ({ row }) => (
          <Button className={row.original.is_subscribed ? "btn btn-sm btn-soft-success" : "btn btn-sm btn-soft-danger"}>
            <i className={row.original.is_subscribed ? "mdi mdi-bell-check" : "mdi mr-1 mdi-bell-cancel"}>
              
            </i>
            {/* {row.original.is_subscribed ? "Subscribed" : "Unsubscribed"} */}
          </Button>
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
                href={route("admin.users.show", row.original.id)}
                className="btn btn-sm btn-soft-primary"
                id={`viewtooltip-${row.original.id}`}
              >
                <i className="mdi mdi-eye-outline" />
                <UncontrolledTooltip placement="top" target={`viewtooltip-${row.original.id}`} transition={{ timeout: 0 }}>
                  View
                </UncontrolledTooltip>
              </Link>
            </li>

            <li>
              <Link
                href={route("admin.users.edit", row.original.id)}
                className="btn btn-sm btn-soft-info"
                id={`edittooltip-${row.original.id}`}
              >
                <i className="mdi mdi-pencil-outline" />
                <UncontrolledTooltip placement="top" target={`edittooltip-${row.original.id}`} transition={{ timeout: 0 }}>
                  Edit
                </UncontrolledTooltip>
              </Link>
            </li>

            <li>
              <button
                type="button"
                className={row.original.is_active ? "btn btn-sm btn-soft-danger" : "btn btn-sm btn-soft-success"}
                onClick={() => {
                  setUser(row.original)
                  setActivateModal(true)
                }}
                id={`activetooltip-${row.original.id}`}
              >
                <i className={row.original.is_active ? "mdi mdi-cancel" : "mdi mdi-check-circle"} />
                <UncontrolledTooltip placement="top" target={`activetooltip-${row.original.id}`} transition={{ timeout: 0 }}>
                  {row.original.is_active ? "Deactivate" : "Activate"}
                </UncontrolledTooltip>
              </button>
            </li>

            <li>
              <button
                type="button"
                className="btn btn-sm btn-soft-danger"
                onClick={() => {
                  setUser(row.original)
                  setDeleteModal(true)
                }}
                id={`deletetooltip-${row.original.id}`}
              >
                <i className="mdi mdi-delete-outline" />
                <UncontrolledTooltip placement="top" target={`deletetooltip-${row.original.id}`} transition={{ timeout: 0 }}>
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

      <DeleteModal show={deleteModal} onDeleteClick={handleDeleteUser} onCloseClick={() => setDeleteModal(false)} />

      <ActivateModal
        show={activateModal}
        user={user}
        onActivateClick={handleActivateUser}
        onCloseClick={() => setActivateModal(false)}
      />

      <div className="page-content">
        <div className="container-fluid">
          <Breadcrumbs title="Users" breadcrumbItem="Users List" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody className="border-bottom">
                  <div className="d-flex align-items-center">
                    <h5 className="mb-0 card-title flex-grow-1">Users List</h5>
                    <div className="flex-shrink-0">
                      <Link href={route("admin.users.create")} className="btn btn-primary me-1">
                        Add New User
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
                            <DropdownItem href="#">Action</DropdownItem>
                          </li>
                          <li>
                            <DropdownItem href="#">Another action</DropdownItem>
                          </li>
                          <li>
                            <DropdownItem href="#">Something else here</DropdownItem>
                          </li>
                        </DropdownMenu>
                      </UncontrolledDropdown>
                    </div>
                  </div>
                </CardBody>
                <CardBody>
                  {isEmpty(users) ? (
                    <p>No users found.</p>
                  ) : (
                    <TableContainer
                      columns={columns}
                      data={users || []}
                      isCustomPageSize={true}
                      isGlobalFilter={true}
                      isPagination={true}
                      SearchPlaceholder="Search for users..."
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
