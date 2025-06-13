import React, { useEffect, useState } from 'react';
import { useBooking } from './BookingContext';
import { Button, Row, Col, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import axios from 'axios';

const ServiceSelection = () => {
  const { state, dispatch } = useBooking();
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get(route('admin.services.index')).then(response => {
        setServices(response.data.data);
    });
  }, []);

  const handleServiceToggle = (service) => {
    const isSelected = state.selectedServices.some(s => s.id === service.id);
    if (isSelected) {
      dispatch({ type: 'REMOVE_SERVICE', payload: service.id });
    } else {
      dispatch({ type: 'ADD_SERVICE', payload: service });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-rose-900 mb-4">Select Services</h2>
      <p className="text-gray-600 mb-6">Choose one or more services</p>
      
      <Row>
        {services.map((service) => (
          <Col md="4" key={service.id} className="mb-4">
            <Card 
              onClick={() => handleServiceToggle(service)}
              className={`cursor-pointer ${state.selectedServices.some(s => s.id === service.id) ? 'border-primary' : ''}`}
            >
              <CardBody>
                <CardTitle tag="h5">{service.name}</CardTitle>
                <CardText>{service.duration} min - ${service.price}</CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-between mt-4">
        <Button color="secondary" onClick={() => dispatch({ type: 'PREV_STEP' })}>Back</Button>
        <Button color="primary" onClick={() => dispatch({ type: 'NEXT_STEP' })} disabled={state.selectedServices.length === 0}>Next</Button>
      </div>
    </div>
  );
};

export default ServiceSelection;