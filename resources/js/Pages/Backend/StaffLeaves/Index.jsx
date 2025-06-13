"use client"

import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Card, CardBody, Col, Container, Row, Button } from 'reactstrap';
import Breadcrumbs from '@/components/common/Breadcrumb';
import TableContainer from '@/components/common/TableContainer';

const Index = ({ leaves, staff, filters }) => {
  document.title = 'Staff Leaves | Admin Dashboard';

  const { url } = usePage();

  const columns = [
    {
      Header: 'Staff',
      accessor: 'staff.name',
      id: 'staff', // Added id
    },
    {
      Header: 'Start Date',
      accessor: 'start_date',
      id: 'start_date', // Added id
    },
    {
      Header: 'End Date',
      accessor: 'end_date',
      id: 'end_date', // Added id
    },
    {
      Header: 'Reason',
      accessor: 'reason',
      id: 'reason', // Added id
    },
    {
      Header: 'Status',
      accessor: 'status',
      id: 'status', // Added id
    },
    {
      Header: 'Action',
      accessor: 'action',
      id: 'action', // Added id
      disableFilters: true,
      Cell: ({ row }) => {
        return (
          <div className="d-flex gap-3">
            <Link href={`/admin/staff-leaves/${row.original.id}`} className="text-primary">
              <i className="mdi mdi-eye font-size-18"></i>
            </Link>
            <Link href={`/admin/staff-leaves/${row.original.id}/edit`} className="text-success">
              <i className="mdi mdi-pencil font-size-18"></i>
            </Link>
          </div>
        );
      },
    },
  ];

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Staff Leaves" breadcrumbItem="All Staff Leaves" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="card-title">Staff Leaves</h5>
                    <Link href="/admin/staff-leaves/create" className="btn btn-primary">
                      Add New Leave
                    </Link>
                  </div>
                  <TableContainer
                    columns={columns}
                    data={leaves}
                    isGlobalFilter={true}
                    isAddUserList={false}
                    customPageSize={10}
                    className="custom-header-css"
                  />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Index;