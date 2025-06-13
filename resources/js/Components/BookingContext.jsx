import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  selectedBranch: null,
  selectedServices: [],
  selectedStaff: null,
  selectedDate: null,
  selectedTimeSlot: null,
  specialRequirements: '',
  step: 0,
};

const BookingContext = createContext({
  state: initialState,
  dispatch: () => null,
});

const bookingReducer = (state, action) => {
  switch (action.type) {
    case 'SET_BRANCH':
      return { ...state, selectedBranch: action.payload };
    case 'ADD_SERVICE':
      return {
        ...state,
        selectedServices: [...state.selectedServices, action.payload],
      };
    case 'REMOVE_SERVICE':
      return {
        ...state,
        selectedServices: state.selectedServices.filter(
          (service) => service.id !== action.payload
        ),
      };
    case 'SET_STAFF':
      return { ...state, selectedStaff: action.payload };
    case 'SET_DATE':
      return { ...state, selectedDate: action.payload };
    case 'SET_TIME_SLOT':
      return { ...state, selectedTimeSlot: action.payload };
    case 'SET_SPECIAL_REQUIREMENTS':
      return { ...state, specialRequirements: action.payload };
    case 'NEXT_STEP':
      return { ...state, step: state.step + 1 };
    case 'PREV_STEP':
      return { ...state, step: Math.max(0, state.step - 1) };
    case 'GO_TO_STEP':
      return { ...state, step: action.payload };
    case 'RESET_BOOKING':
      return initialState;
    default:
      return state;
  }
};

export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  return (
    <BookingContext.Provider value={{ state, dispatch }}>
      {children}
    </BookingContext.Provider>
  );
};

export const useBooking = () => useContext(BookingContext);