"use client"

import React, { useState, useEffect } from 'react';
import { Link, usePage, router } from '@inertiajs/react';
import { Card, CardBody, Col, Container, Form, FormGroup, Input, Label, Row, Button, FormFeedback, Table } from 'reactstrap';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Breadcrumbs from '@/components/common/Breadcrumb';
import axios from 'axios';

const BulkCreate = ({ staff, branches }) => {
  document.title = 'Bulk Create Timeslots | Admin Dashboard';

  const { flash, errors } = usePage().props;
  const [formData, setFormData] = useState({
    staff_id: '',
    //branch_id: '',
    start_date: '',
    end_date: '',
    interval: '30', // Default interval (minutes)
    is_available: true,
  });
  const [generatedSlots, setGeneratedSlots] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (flash.success) {
      toast.success(flash.success);
    }
    if (flash.error) {
      toast.error(flash.error);
    }
  }, [flash]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      if (formData.staff_id && formData.start_date && formData.end_date && formData.interval) {
        generatePreviewSlots();
      } else {
        setGeneratedSlots([]);
      }
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [formData.staff_id, formData.start_date, formData.end_date, formData.interval]);

  const generatePreviewSlots = async () => {
    if (!formData.staff_id || !formData.start_date || !formData.end_date || !formData.interval) {
      setGeneratedSlots([]);
      return;
    }

    try {
      const response = await axios.post('/admin/bulk-timeslots/preview', {
        staff_id: formData.staff_id,
        start_date: formData.start_date,
        end_date: formData.end_date,
        interval: parseInt(formData.interval),
      });
      setGeneratedSlots(response.data);
      console.log(response.data);
    } catch (error) {
      toast.error('Error generating preview: ' + (error.response?.data?.error || error.message));
      setGeneratedSlots([]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    router.post('/admin/bulk-timeslots', {
      timeslots: generatedSlots.map((slot) => ({
        staff_id: formData.staff_id,
        //branch_id: formData.branch_id,
        date: slot.date,
        start_time: slot.start_time,
        end_time: slot.end_time,
        is_available: formData.is_available,
      })),
    }, {
      onSuccess: () => {
        toast.success('Timeslots created successfully!');
        setIsSubmitting(false);
        setGeneratedSlots([]);
        setFormData({
          staff_id: '',
          branch_id: '',
          start_date: '',
          end_date: '',
          interval: '30',
          is_available: true,
        });
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
          <Breadcrumbs title="Timeslots" breadcrumbItem="Bulk Create Timeslots" />

          <Row>
            <Col lg="12">
              <Card>
                <CardBody>
                  <h5 className="card-title">Bulk Generate Timeslots</h5>
                  <p className="card-title-desc">Select staff, branch, date range, and interval to generate timeslots.</p>

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
                            onChange={handleInputChange}
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

                      {/* <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="branch_id">
                            Branch <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            id="branch_id"
                            name="branch_id"
                            value={formData.branch_id}
                            onChange={handleInputChange}
                            invalid={!!errors.branch_id}
                          >
                            <option value="">Select Branch</option>
                            {branches.map((branch) => (
                              <option key={branch.id} value={branch.id}>
                                {branch.name} - {branch.city}
                              </option>
                            ))}
                          </Input>
                          {errors.branch_id && <FormFeedback>{errors.branch_id}</FormFeedback>}
                        </FormGroup>
                      </Col> */}
                    </Row>

                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="start_date">
                            Start Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            id="start_date"
                            name="start_date"
                            value={formData.start_date}
                            onChange={handleInputChange}
                            invalid={!!errors.start_date}
                            min={new Date().toISOString().split('T')[0]}
                          />
                          {errors.start_date && <FormFeedback>{errors.start_date}</FormFeedback>}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="end_date">
                            End Date <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="date"
                            id="end_date"
                            name="end_date"
                            value={formData.end_date}
                            onChange={handleInputChange}
                            invalid={!!errors.end_date}
                            min={formData.start_date || new Date().toISOString().split('T')[0]}
                          />
                          {errors.end_date && <FormFeedback>{errors.end_date}</FormFeedback>}
                        </FormGroup>
                      </Col>
                    </Row>

                    <Row>
                      <Col md="6">
                        <FormGroup className="mb-3">
                          <Label htmlFor="interval">
                            Interval (Minutes) <span className="text-danger">*</span>
                          </Label>
                          <Input
                            type="select"
                            id="interval"
                            name="interval"
                            value={formData.interval}
                            onChange={handleInputChange}
                            invalid={!!errors.interval}
                          >
                            <option value="15">15 Minutes</option>
                            <option value="30">30 Minutes</option>
                            <option value="45">45 Minutes</option>
                            <option value="60">60 Minutes</option>
                          </Input>
                          {errors.interval && <FormFeedback>{errors.interval}</FormFeedback>}
                        </FormGroup>
                      </Col>

                      <Col md="6">
                        <FormGroup className="mb-3">
                          <div className="form-check">
                            <Input
                              type="checkbox"
                              id="is_available"
                              name="is_available"
                              checked={formData.is_available}
                              onChange={handleInputChange}
                              className="form-check-input"
                            />
                            <Label htmlFor="is_available" className="form-check-label">
                              Available for booking
                            </Label>
                          </div>
                          <small className="text-muted">Check this if the timeslots are available for bookings.</small>
                        </FormGroup>
                      </Col>
                    </Row>

                    {generatedSlots.length > 0 && (
                      <Row>
                        <Col md="12">
                          <h6>Preview Timeslots</h6>
                          <Table striped bordered hover>
                            <thead>
                              <tr>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                              </tr>
                            </thead>
                            <tbody>
                              {generatedSlots.map((slot, index) => (
                                <tr key={index}>
                                  <td>{slot.date}</td>
                                  <td>{slot.start_time}</td>
                                  <td>{slot.end_time}</td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </Col>
                      </Row>
                    )}

                    <div className="d-flex flex-wrap gap-2">
                      <Button type="submit" color="primary" disabled={isSubmitting || generatedSlots.length === 0}>
                        {isSubmitting ? (
                          <>
                            <i className="bx bx-loader bx-spin font-size-16 align-middle me-2"></i>
                            Creating...
                          </>
                        ) : (
                          <>
                            <i className="bx bx-check-double font-size-16 align-middle me-2"></i>
                            Generate Timeslots
                          </>
                        )}
                      </Button>
                      <Link href="/admin/timeslots" className="btn btn-secondary">
                        <i className="bx bx-x font-size-16 align-middle me-2"></i>
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
