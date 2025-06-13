import React from 'react';
import { useBooking } from './BookingContext';
import BranchSelection from './BranchSelection';
import ServiceSelection from './ServiceSelection';
import StaffSelection from './StaffSelection';
import DateTimeSelection from './DateTimeSelection';
import BookingSummary from './BookingSummary';
import ProgressBar from './ProgressBar';

const BookingFlow = () => {
  const { state } = useBooking();
  
  const renderStep = () => {
    switch (state.step) {
      case 0:
        return <BranchSelection />;
      case 1:
        return <ServiceSelection />;
      case 2:
        return <StaffSelection />;
      case 3:
        return <DateTimeSelection />;
      case 4:
        return <BookingSummary />;
      default:
        return <BranchSelection />;
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <ProgressBar />
      <div className="p-6">
        {renderStep()}
      </div>
    </div>
  );
};

export default BookingFlow;