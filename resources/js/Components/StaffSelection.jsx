import React, { useEffect, useState } from 'react';
import { useBooking } from './BookingContext';
import { Button, Row, Col, Card, CardBody, CardTitle, CardText, CardImg } from 'reactstrap';
import axios from 'axios';

const StaffSelection = () => {
  const { state, dispatch } = useBooking();
  const [staff, setStaff] = useState([]);

  useEffect(() => {
    if (state.selectedBranch) {
        axios.get(route('admin.staff.byBranch', { branch: state.selectedBranch.id })).then(response => {
            setStaff(response.data);
        });
    }
  }, [state.selectedBranch]);

  const handleStaffSelect = (person) => {
    dispatch({ type: 'SET_STAFF', payload: person });
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-rose-900 mb-4">Select Staff (Optional)</h2>
      <p className="text-gray-600 mb-6">Choose your preferred stylist or leave unselected for any available staff</p>
      
      <Row>
        <Col md="4" className="mb-4">
            <Card 
              onClick={() => handleStaffSelect(null)}
              className={`cursor-pointer ${state.selectedStaff === null ? 'border-primary' : ''}`}
            >
              <CardBody>
                <CardTitle tag="h5">Any Available Staff</CardTitle>
                <CardText>We'll assign the best available professional</CardText>
              </CardBody>
            </Card>
        </Col>
        {staff.map((person) => (
          <Col md="4" key={person.id} className="mb-4">
            <Card 
              onClick={() => handleStaffSelect(person)}
              className={`cursor-pointer ${state.selectedStaff?.id === person.id ? 'border-primary' : ''}`}
            >
              <CardImg top width="100%" src={person.image_url} alt={person.name} />
              <CardBody>
                <CardTitle tag="h5">{person.name}</CardTitle>
                <CardText>{person.position}</CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="d-flex justify-content-between mt-4">
        <Button color="secondary" onClick={() => dispatch({ type: 'PREV_STEP' })}>Back</Button>
        <Button color="primary" onClick={() => dispatch({ type: 'NEXT_STEP' })}>Next</Button>
      </div>
    </div>
  );
};

export default StaffSelection;