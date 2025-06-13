import React, { useEffect } from 'react';
import { usePage, Head } from '@inertiajs/react';
import { useEcho } from '@/hooks/useEcho';
import { Alert, Card, CardBody, ListGroup, ListGroupItem } from 'reactstrap';

const BookingConfirmation = () => {
    const { props } = usePage();
    const { booking } = props;
    const echo = useEcho();

    useEffect(() => {
        if (!booking.customer_id) return;

        // Listen for booking status updates
        const channel = echo.private(`user.${booking.customer_id}`);

        channel.listen('.booking.status.updated', (data) => {
            if (data.booking.id === booking.id) {
                // Update UI or show notification
                console.log('Status updated:', data.booking.status);
            }
        });

        return () => {
            channel.stopListening('.booking.status.updated');
        };
    }, [booking, echo]);

    return (
        <>
            <Head title="Booking Confirmation" />
            
            <div className="container py-5">
                <h1 className="mb-4">Booking Confirmation</h1>
                
                <Card className="mb-4">
                    <CardBody>
                        <h2 className="h4 mb-3">Your Booking Details</h2>
                        <ListGroup flush>
                            <ListGroupItem>
                                <strong>Reference #:</strong> {booking.id}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Status:</strong> 
                                <span className={`badge ms-2 bg-${getStatusBadgeColor(booking.status)}`}>
                                    {booking.status}
                                </span>
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Date:</strong> {new Date(booking.booking_date).toLocaleDateString()}
                            </ListGroupItem>
                            <ListGroupItem>
                                <strong>Time:</strong> {booking.start_time} - {booking.end_time}
                            </ListGroupItem>
                            {/* Add more booking details as needed */}
                        </ListGroup>
                    </CardBody>
                </Card>

                {!booking.customer_id && (
                    <Alert color="info">
                        An account has been created for you. Check your email for login details.
                    </Alert>
                )}
            </div>
        </>
    );
};

function getStatusBadgeColor(status) {
    switch (status.toLowerCase()) {
        case 'confirmed': return 'success';
        case 'pending': return 'warning';
        case 'cancelled': return 'danger';
        default: return 'primary';
    }
}

BookingConfirmation.layout = null; // Uses layout defined in app.jsx

export default BookingConfirmation;