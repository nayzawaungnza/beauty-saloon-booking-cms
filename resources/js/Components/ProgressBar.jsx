import React from 'react';
import { Progress } from 'reactstrap';

const ProgressBar = ({ currentStep, totalSteps }) => {
    const value = (currentStep / totalSteps) * 100;
    return <Progress value={value} className="mb-4" />;
};

export default ProgressBar;