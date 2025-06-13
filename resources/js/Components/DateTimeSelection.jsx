import React, { useState, useEffect } from 'react';
import { useBooking } from './BookingContext';
import { Button, Row, Col, FormGroup, Label, Input } from 'reactstrap';
import axios from 'axios';

const DateTimeSelection = () => {
  const { state, dispatch } = useBooking();
  const [timeSlots, setTimeSlots] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [specialRequirements, setSpecialRequirements] = useState(state.specialRequirements);

  useEffect(() => {
    if (state.selectedBranch) {
        axios.get(route('booking.available-timeslots', {
            branch_id: state.selectedBranch.id,
            date: selectedDate.toISOString().split('T')[0],
            staff_id: state.selectedStaff?.id,
        })).then(response => {
            setTimeSlots(response.data);
        });
    }
  }, [selectedDate, state.selectedBranch, state.selectedStaff]);

  const handleDateSelect = (date) => {
    const newDate = new Date(date);
    setSelectedDate(newDate);
    dispatch({ type: 'SET_DATE', payload: newDate });
  };

  const handleTimeSelect = (slot) => {
    dispatch({ type: 'SET_TIME_SLOT', payload: slot });
  };

  const handleContinue = () => {
    if (state.selectedDate && state.selectedTimeSlot) {
      dispatch({ type: 'SET_SPECIAL_REQUIREMENTS', payload: specialRequirements });
      dispatch({ type: 'NEXT_STEP' });
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-rose-900 mb-4">Select Date & Time</h2>
      <p className="text-gray-600 mb-6">Choose your preferred appointment date and time</p>
      
      <Row>
        <Col md="6">
          <FormGroup>
            <Label for="booking_date">Date</Label>
            <Input
              type="date"
              name="booking_date"
              id="booking_date"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={e => handleDateSelect(e.target.value)}
            />
          </FormGroup>
        </Col>
      </Row>

      <h3 className="text-lg font-medium text-rose-900 my-3">Available Timeslots</h3>
      <Row>
        {timeSlots.map((slot) => (
          <Col md="3" key={slot.id} className="mb-2">
            <Button
              outline
              color="primary"
              active={state.selectedTimeSlot?.id === slot.id}
              onClick={() => handleTimeSelect(slot)}
              className="w-100"
              disabled={!slot.is_available}
            >
              {slot.start_time} - {slot.end_time}
            </Button>
          </Col>
        ))}
      </Row>

      <FormGroup className="mt-4">
        <Label for="special_requirements">Special Requirements (Optional)</Label>
        <Input
          type="textarea"
          name="special_requirements"
          id="special_requirements"
          value={specialRequirements}
          onChange={(e) => setSpecialRequirements(e.target.value)}
        />
      </FormGroup>

      <div className="d-flex justify-content-between mt-4">
        <Button color="secondary" onClick={() => dispatch({ type: 'PREV_STEP' })}>Back</Button>
        <Button color="primary" onClick={handleContinue} disabled={!state.selectedDate || !state.selectedTimeSlot}>Next</Button>
      </div>
    </div>
  );
};

export default DateTimeSelection;