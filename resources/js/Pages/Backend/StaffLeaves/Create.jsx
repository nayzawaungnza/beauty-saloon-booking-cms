"use client"

import React, { useState } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row, Button, FormFeedback } from 'reactstrap';
import Breadcrumbs from '@/components/common/Breadcrumb';

const Create = ({ staff }) => {
  document.title = 'Create Staff Leave | Admin Dashboard';

  const { errors } = usePage().props;
  const [formData, setFormData] = useState({
    staff_id: '',
    start_date: '',
    end_date: '',
    reason: '',
    status: 'pending',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    router.post('/admin/staff-leaves', formData);
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Staff Leaves" breadcrumbItem="Create Staff Leave" />
          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h5 className="card-title">Create Staff Leave</h5>
                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="staff_id">Staff Member</Label>
                          <Input
                            type="select"
                            id="staff_id"
                            name="staff_id"
                            value={formData.staff_id}
                            onChange={handleInputChange}
                            invalid={!!errors.staff_id}
                          >
                            <option value="">Select Staff Member</option>
                            {staff.map((staffMember) => (
                              <option key={staffMember.id} value={staffMember.id}>
                                {staffMember.name}
                              </option>
                            ))}
                          </Input>
                          {errors.staff_id && <FormFeedback>{errors.staff_id}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="start_date">Start Date</Label>
                          <Input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            invalid={!!errors.start_date}
                          />
                          {errors.start_date && <FormFeedback>{errors.start_date}</FormFeedback>}
                        </FormGroup>
                      </Col>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="end_date">End Date</Label>
                          <Input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            invalid={!!errors.end_date}
                          />
                          {errors.end_date && <FormFeedback>{errors.end_date}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col md="12">
                        <FormGroup className="mb-3">
                          <Label htmlFor="reason">Reason</Label>
                          <Input
                            type="textarea"
                            id="reason"
                            name="reason"
                            value={formData.reason}
                            onChange={handleInputChange}
                            invalid={!!errors.reason}
                          />
                          {errors.reason && <FormFeedback>{errors.reason}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>
                    <Button type="submit" color="primary">
                      Submit
                    </Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </React.Fragment>
  );
};

export default Create;