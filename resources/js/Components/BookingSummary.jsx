import React from 'react';
import { useBooking } from './BookingContext';
import { Button, Card, CardBody, CardTitle, ListGroup, ListGroupItem } from 'reactstrap';
import { useForm } from '@inertiajs/react';

const BookingSummary = () => {
  const { state, dispatch } = useBooking();
  const { post, processing } = useForm();

  const totalDuration = state.selectedServices.reduce((total, service) => total + service.duration, 0);
  const totalPrice = state.selectedServices.reduce((total, service) => total + service.price, 0);

  const handleConfirm = () => {
    const bookingData = {
      branch_id: state.selectedBranch.id,
      service_id: state.selectedServices.map(s => s.id),
      staff_id: state.selectedStaff?.id,
      booking_date: state.selectedDate.toISOString().split('T')[0],
      timeslot_id: state.selectedTimeSlot.id,
      start_time: state.selectedTimeSlot.start_time,
      end_time: state.selectedTimeSlot.end_time,
      notes: state.specialRequirements,
    };

    post(route('booking.store'), {
        data: bookingData,
        onSuccess: () => {
            dispatch({ type: 'RESET_BOOKING' });
        }
    });
  };

  return (
    <div>
      <h2 className="text-2xl font-serif text-rose-900 mb-4">Booking Summary</h2>
      <p className="text-gray-600 mb-6">Review your booking details before confirming</p>
      
      <Card>
        <CardBody>
            <CardTitle tag="h5">Booking Details</CardTitle>
            <ListGroup flush>
                <ListGroupItem>
                    <strong>Branch:</strong> {state.selectedBranch?.name}
                </ListGroupItem>
                <ListGroupItem>
                    <strong>Services:</strong>
                    <ul>
                        {state.selectedServices.map(service => (
                            <li key={service.id}>{service.name}</li>
                        ))}
                    </ul>
                </ListGroupItem>
                <ListGroupItem>
                    <strong>Staff:</strong> {state.selectedStaff?.name || 'Any'}
                </ListGroupItem>
                <ListGroupItem>
                    <strong>Date:</strong> {state.selectedDate?.toLocaleDateString()}
                </ListGroupItem>
                <ListGroupItem>
                    <strong>Time:</strong> {state.selectedTimeSlot?.start_time} - {state.selectedTimeSlot?.end_time}
                </ListGroupItem>
                <ListGroupItem>
                    <strong>Total Duration:</strong> {totalDuration} min
                </ListGroupItem>
                <ListGroupItem>
                    <strong>Total Price:</strong> ${totalPrice}
                </ListGroupItem>
                {state.specialRequirements && (
                    <ListGroupItem>
                        <strong>Special Requirements:</strong> {state.specialRequirements}
                    </ListGroupItem>
                )}
            </ListGroup>
        </CardBody>
      </Card>

      <div className="d-flex justify-content-between mt-4">
        <Button color="secondary" onClick={() => dispatch({ type: 'PREV_STEP' })}>Back</Button>
        <Button color="success" onClick={handleConfirm} disabled={processing}>
            {processing ? 'Booking...' : 'Confirm Booking'}
        </Button>
      </div>
    </div>
  );
};

export default BookingSummary;