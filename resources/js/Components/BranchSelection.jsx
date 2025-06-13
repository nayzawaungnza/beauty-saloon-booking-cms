import React, { useEffect, useState } from 'react';
import { useBooking } from './BookingContext';
import { Card, CardBody, CardTitle, CardText, Row, Col, CardImg } from 'reactstrap';
import axios from 'axios';

const BranchSelection = () => {
  const { state, dispatch } = useBooking();
  const [branches, setBranches] = useState([]);

  useEffect(() => {
    axios.get(route('admin.branches.index')).then(response => {
        setBranches(response.data.data);
    });
  }, []);

  const handleSelectBranch = (branch) => {
    dispatch({ type: 'SET_BRANCH', payload: branch });
    dispatch({ type: 'NEXT_STEP' });
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-rose-900 mb-4">Select a Branch</h2>
      <p className="text-gray-600 mb-6">Choose the salon location most convenient for you</p>
      
      <Row>
        {branches.map((branch) => (
          <Col md="4" key={branch.id} className="mb-4">
            <Card 
              onClick={() => handleSelectBranch(branch)}
              className={`cursor-pointer ${state.selectedBranch?.id === branch.id ? 'border-primary' : ''}`}
            >
              <CardImg top width="100%" src={branch.image_url} alt={branch.name} />
              <CardBody>
                <CardTitle tag="h5">{branch.name}</CardTitle>
                <CardText>{branch.address}</CardText>
              </CardBody>
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default BranchSelection;