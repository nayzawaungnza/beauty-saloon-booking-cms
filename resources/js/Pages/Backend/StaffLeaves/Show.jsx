"use client"

import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import { Card, CardBody, Col, Container, Row, Button } from 'reactstrap';
import Breadcrumbs from '@/components/common/Breadcrumb';

const Show = ({ leave }) => {
  document.title = 'View Staff Leave | Admin Dashboard';

  const { auth } = usePage().props;

  const handleApprove = () => {
    router.patch(`/admin/staff-leaves/${leave.id}/approve`);
  };

  const handleReject = () => {
    router.patch(`/admin/staff-leaves/${leave.id}/reject`);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Staff Leaves" breadcrumbItem="View Staff Leave" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h5 className="card-title">View Staff Leave</h5>
                  <table className="table table-bordered">
                    <tbody>
                      <tr>
                        <th>Staff Member</th>
                        <td>{leave.staff.name}</td>
                      </tr>
                      <tr>
                        <th>Start Date</th>
                        <td>{leave.start_date}</td>
                      </tr>
                      <tr>
                        <th>End Date</th>
                        <td>{leave.end_date}</td>
                      </tr>
                      <tr>
                        <th>Reason</th>
                        <td>{leave.reason}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <td>{leave.status}</td>
                      </tr>
                      <tr>
                        <th>Approved By</th>
                        <td>{leave.approved_by ? leave.approved_by.name : 'N/A'}</td>
                      </tr>
                    </tbody>
                  </table>
                  {auth.user.can['leave.approve'] && leave.status === 'pending' && (
                    <div className="d-flex gap-2">
                      <Button color="success" onClick={handleApprove}>
                        Approve
                      </Button>
                      <Button color="danger" onClick={handleReject}>
                        Reject
                      </Button>
                    </div>
                  )}
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Show;