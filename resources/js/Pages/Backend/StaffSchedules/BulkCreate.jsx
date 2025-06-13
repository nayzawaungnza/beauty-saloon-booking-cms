"use client"

import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row, Button, FormFeedback, Table } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumbs from '@/components/common/Breadcrumb';
import axios from 'axios';

const BulkCreate = ({ staff, days }) => {
  document.title = 'Bulk Create Staff Schedules | Admin Dashboard';

  const { flash, errors } = usePage().props;
  const [formData, setFormData] = useState({
    staff_id: '',
    schedules: days.map(day => ({
      day_of_week: day.value,
      start_time: '',
      end_time: '',
      is_available: false
    }))
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
    }
    if (flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const handleInputChange = (e, index) => {
    const { name, value, type, checked } = e.target;
    const newSchedules = [...formData.schedules];
    newSchedules[index][name] = type === 'checkbox' ? checked : value;
    setFormData(prev => ({
      ...prev,
      schedules: newSchedules
    }));
  };

  const handleStaffChange = (e) => {
    setFormData(prev => ({
      ...prev,
      staff_id: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const schedulesToSubmit = formData.schedules
      .filter(schedule => schedule.is_available)
      .map(schedule => ({
        ...schedule,
        staff_id: formData.staff_id
      }));

    router.post('/admin/staff-schedules/bulk', {
      schedules: schedulesToSubmit
    }, {
      onSuccess: () => {
        //toast.success('Schedules created successfully!');
        setIsSubmitting(false);
      },
      onError: (errors) => {
        toast.error('Please check the form for errors');
        setIsSubmitting(false);
      },
    });
  };

  return (
    <React.Fragment>
      <div className="page-content">
        <Container fluid>
          <Breadcrumbs title="Staff Schedules" breadcrumbItem="Bulk Create Schedules" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h5 className="card-title">Bulk Generate Staff Schedules</h5>
                  <p className="card-title-desc">Select a staff member and define their weekly schedule.</p>

                  <Form onSubmit={handleSubmit}>
                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="staff_id">
                            Staff Member <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            id="staff_id"
                            name="staff_id"
                            value={formData.staff_id}
                            onChange={handleStaffChange}
                            invalid={!!errors.staff_id}
                          >
                            <option value="">Select Staff Member</option>
                            {staff.map((staffMember) => (
                              <option key={staffMember.id} value={staffMember.id}>
                                {staffMember.name} - {staffMember.email}
                              </option>
                            ))}
                          </Input>
                          {errors.staff_id && <FormFeedback>{errors.staff_id}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Day</th>
                          <th>Available</th>
                          <th>Start Time</th>
                          <th>End Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.schedules.map((schedule, index) => (
                          <tr key={schedule.day_of_week}>
                            <td>{days.find(d => d.value === schedule.day_of_week).label}</td>
                            <td>
                              <Input
                                type="checkbox"
                                name="is_available"
                                checked={schedule.is_available}
                                onChange={(e) => handleInputChange(e, index)}
                              />
                            </td>
                            <td>
                              <Input
                                type="time"
                                name="start_time"
                                value={schedule.start_time}
                                onChange={(e) => handleInputChange(e, index)}
                                disabled={!schedule.is_available}
                              />
                            </td>
                            <td>
                              <Input
                                type="time"
                                name="end_time"
                                value={schedule.end_time}
                                onChange={(e) => handleInputChange(e, index)}
                                disabled={!schedule.is_available}
                              />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary" disabled={isSubmitting}>
                        {isSubmitting ? 'Creating...' : 'Generate Schedules'}
                      </Button>
                      <Link href="/admin/staff-schedules" className="btn btn-secondary">
                        Cancel
                      </Link>
                    </div>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <ToastContainer closeButton={false} />
    </React.Fragment>
  );
};

export default BulkCreate;