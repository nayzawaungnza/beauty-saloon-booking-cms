import React from 'react';
import { BookingProvider } from '@/Components/BookingContext';
import BookingFlow from '@/Components/BookingFlow';

const Booking = () => {
  return (
    <BookingProvider>
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <header className="mb-8 text-center">
                <h1 className="text-3xl md:text-4xl font-serif text-rose-900 mb-2">Book Your Appointment</h1>
                <p className="text-rose-700">Experience luxury and relaxation</p>
            </header>
            <BookingFlow />
        </div>
    </BookingProvider>
  );
};

export default Booking;