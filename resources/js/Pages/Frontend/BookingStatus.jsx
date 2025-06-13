import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Alert } from 'reactstrap';

const BookingStatus = ({ booking }) => {
    const [currentStatus, setCurrentStatus] = useState(booking.status);
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');

    useEffect(() => {
        if (!booking.customer_id) return;

        // Listen for status updates
        window.Echo.private(`user.${booking.customer_id}`)
            .listen('.booking.status.updated', (data) => {
                if (data.booking.id === booking.id) {
                    setAlertMessage(
                        `Booking status changed from ${data.previousStatus} to ${data.booking.status}`
                    );
                    setCurrentStatus(data.booking.status);
                    setShowAlert(true);
                    setTimeout(() => setShowAlert(false), 5000);
                }
            });

        return () => {
            window.Echo.leave(`user.${booking.customer_id}`);
        };
    }, [booking]);

    return (
        <div className="mb-4">
            <h4>Booking Status: <span className="badge bg-primary">{currentStatus}</span></h4>
            
            {showAlert && (
                <Alert color="info" toggle={() => setShowAlert(false)}>
                    {alertMessage}
                </Alert>
            )}
        </div>
    );
};

export default BookingStatus;