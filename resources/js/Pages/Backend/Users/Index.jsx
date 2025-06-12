"use client"

import React, { useEffect, useMemo, useState } from "react"
import { Link, usePage, router } from "@inertiajs/react"
import { isEmpty } from "lodash"
import TableContainer from "@/components/common/TableContainer" // Index.jsx
import Breadcrumbs from "@/components/common/Breadcrumb" // Index.jsx
import DeleteModal from "@/components/common/DeleteModal" // Index.jsx
import ActivateModal from "@/components/common/ActivateModal" // Index.jsx
import {
  Col,
  Row,
  Card,
  UncontrolledTooltip,
  CardBody,
  Badge, Button // Index.jsx
} from "reactstrap"
import { toast, ToastContainer } from "react-toastify" // Index.jsx
import "react-toastify/dist/ReactToastify.css" // Index.jsx


const Index = ({ users }) => { // Index.jsx
  document.title = "Users List | Admin Dashboard" // Index.jsx

  const { flash } = usePage().props // Index.jsx
  const [user, setUser] = useState(null) // Index.jsx
  const [deleteModal, setDeleteModal] = useState(false) // Index.jsx
  const [activateModal, setActivateModal] = useState(false) // Index.jsx

  useEffect(() => { // Index.jsx
    if (flash.success) { // Index.jsx
      toast.success(flash.success) // Index.jsx
    }
    if (flash.error) { // Index.jsx
      toast.error(flash.error) // Index.jsx
    }
  }, [flash]) // Index.jsx

  const handleDeleteUser = () => { // Index.jsx
    if (user && user.id) { // Index.jsx
      // Backend check is primary, this proceeds if modal was shown
      router.delete(route("admin.users.destroy", user.id), { // Index.jsx
        onSuccess: () => { // Index.jsx
          setDeleteModal(false) // Index.jsx
          setUser(null) // Index.jsx
        },
      }) // Index.jsx
    }
  }

  const handleActivateUser = () => { // Index.jsx
    if (user && user.id) { // Index.jsx
      // Backend check is primary
      router.patch( // Index.jsx
        route("admin.users.changeStatus", user.id), // Index.jsx
        {}, // Index.jsx
        {
          onSuccess: () => { // Index.jsx
            setActivateModal(false) // Index.jsx
            setUser(null) // Index.jsx
            // Flash message from backend will be displayed by useEffect
          },
        },
      ) // Index.jsx
    }
  }

  const columns = useMemo( // Index.jsx
    () => [
      {
        header: "Name", // Index.jsx
        accessorKey: "name", // Index.jsx
        enableColumnFilter: false, // Index.jsx
        enableSorting: true, // Index.jsx
      },
      {
        header: "Email", // Index.jsx
        accessorKey: "email", // Index.jsx
        enableColumnFilter: false, // Index.jsx
        enableSorting: true, // Index.jsx
      },
      {
        header: "Mobile", // Index.jsx
        accessorKey: "mobile", // Index.jsx
        enableColumnFilter: false, // Index.jsx
        enableSorting: true, // Index.jsx
      },
      {
        header: "Status", // Index.jsx
        accessorKey: "is_active", // Index.jsx
        enableColumnFilter: false, // Index.jsx
        enableSorting: true, // Index.jsx
        cell: ({ row }) => ( // Index.jsx
          <Badge className={row.original.is_active ? "bg-success" : "bg-danger"}> 
            {row.original.is_active ? "Active" : "Inactive"} 
          </Badge>
        ),
      },
      {
        header: "Role", // Index.jsx
        accessorKey: "roles", // Index.jsx
        enableColumnFilter: false, // Index.jsx
        enableSorting: true, // Index.jsx
        cell: ({ row }) => ( // Index.jsx
          <span>
            {row.original.roles && row.original.roles.length > 0 // Index.jsx
              ? row.original.roles.map((role) => role.name).join(", ") // Index.jsx
              : "None"} 
          </span>
        ),
      },
      {
        header: "SUB", // Index.jsx
        accessorKey: "is_subscribed", // Index.jsx
        enableColumnFilter: false, // Index.jsx
        enableSorting: true, // Index.jsx
        cell: ({ row }) => ( // Index.jsx
          <Button className={row.original.is_subscribed ? "btn btn-sm btn-soft-success" : "btn btn-sm btn-soft-danger"}> 
            <i className={row.original.is_subscribed ? "mdi mdi-bell-check" : "mdi mr-1 mdi-bell-cancel"}> 
            </i>
          </Button>
        ),
      },
      {
        header: "Action", // Index.jsx
        enableColumnFilter: false, // Index.jsx
        enableSorting: false, // Index.jsx
        cell: ({ row }) => {
          const userRoles = row.original.roles ? row.original.roles.map(role => role.name) : []; // Extract role names // Index.jsx
          const isSuperAdmin = userRoles.includes('Super Admin'); // Index.jsx

          return (
            <ul className="list-unstyled hstack gap-1 mb-0"> 
              <li data-bs-toggle="tooltip" data-bs-placement="top" title="View"> 
                <Link
                  href={route("admin.users.show", row.original.id)} // Index.jsx
                  className="btn btn-sm btn-soft-primary" // Index.jsx
                  id={`viewtooltip-${row.original.id}`} // Index.jsx
                >
                  <i className="mdi mdi-eye-outline" /> 
                  <UncontrolledTooltip placement="top" target={`viewtooltip-${row.original.id}`} transition={{ timeout: 0 }}> 
                    View
                  </UncontrolledTooltip>
                </Link>
              </li>

              <li>
                {isSuperAdmin ? (
                  <Button
                    size="sm"
                    color="soft-info"
                    disabled
                    className="btn btn-sm btn-soft-info"
                    id={`edittooltip-disabled-${row.original.id}`}
                  >
                    <i className="mdi mdi-pencil-outline" />
                     <UncontrolledTooltip placement="top" target={`edittooltip-disabled-${row.original.id}`} transition={{ timeout: 0 }}>
                      Cannot Edit Super Admin
                    </UncontrolledTooltip>
                  </Button>
                ) : (
                  <Link
                    href={route("admin.users.edit", row.original.id)} // Index.jsx
                    className="btn btn-sm btn-soft-info" // Index.jsx
                    id={`edittooltip-${row.original.id}`} // Index.jsx
                  >
                    <i className="mdi mdi-pencil-outline" /> 
                    <UncontrolledTooltip placement="top" target={`edittooltip-${row.original.id}`} transition={{ timeout: 0 }}> 
                      Edit
                    </UncontrolledTooltip>
                  </Link>
                )}
              </li>

              <li>
                <button
                  type="button"
                  className={row.original.is_active ? "btn btn-sm btn-soft-danger" : "btn btn-sm btn-soft-success"} // Index.jsx
                  onClick={() => { // Index.jsx
                    if (!isSuperAdmin) { // Index.jsx
                      setUser(row.original) // Index.jsx
                      setActivateModal(true) // Index.jsx
                    }
                  }}
                  disabled={isSuperAdmin} // Index.jsx
                  id={`activetooltip-${row.original.id}`} // Index.jsx
                >
                  <i className={row.original.is_active ? "mdi mdi-cancel" : "mdi mdi-check-circle"} /> 
                  <UncontrolledTooltip placement="top" target={`activetooltip-${row.original.id}`} transition={{ timeout: 0 }}> 
                    {isSuperAdmin ? "Cannot change status" : (row.original.is_active ? "Deactivate" : "Activate")} 
                  </UncontrolledTooltip>
                </button>
              </li>

              <li>
                <button
                  type="button"
                  className="btn btn-sm btn-soft-danger" // Index.jsx
                  onClick={() => { // Index.jsx
                    if (!isSuperAdmin) { // Index.jsx
                      setUser(row.original) // Index.jsx
                      setDeleteModal(true) // Index.jsx
                    }
                  }}
                  disabled={isSuperAdmin} // Index.jsx
                  id={`deletetooltip-${row.original.id}`} // Index.jsx
                >
                  <i className="mdi mdi-delete-outline" /> 
                  <UncontrolledTooltip placement="top" target={`deletetooltip-${row.original.id}`} transition={{ timeout: 0 }}> 
                    {isSuperAdmin ? "Cannot Delete Super Admin" : "Delete"} 
                  </UncontrolledTooltip>
                </button>
              </li>
            </ul>
          );
        },
      },
    ],
    [], // Index.jsx
  ) // Index.jsx

  return (
    <React.Fragment>

      <DeleteModal show={deleteModal} onDeleteClick={handleDeleteUser} onCloseClick={() => setDeleteModal(false)} /> 

      <ActivateModal // Index.jsx
        show={activateModal} // Index.jsx
        user={user} // Index.jsx
        onActivateClick={handleActivateUser} // Index.jsx
        onCloseClick={() => setActivateModal(false)} // Index.jsx
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
                      {/* ... other buttons ... */}
                    </div>
                  </div>
                </CardBody>
                <CardBody> 
                  {isEmpty(users) ? ( // Index.jsx
                    <p>No users found.</p> // Index.jsx
                  ) : (
                    <TableContainer // Index.jsx
                      columns={columns} // Index.jsx
                      data={users || []} // Index.jsx
                      isCustomPageSize={true} // Index.jsx
                      isGlobalFilter={true} // Index.jsx
                      isPagination={true} // Index.jsx
                      SearchPlaceholder="Search for users..." // Index.jsx
                      tableClass="align-middle table-nowrap dt-responsive nowrap w-100 table-check dataTable no-footer dtr-inline mt-4 border-top" // Index.jsx
                      pagination="pagination" // Index.jsx
                      paginationWrapper="dataTables_paginate paging_simple_numbers pagination-rounded" // Index.jsx
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

export default Index // Index.jsx