import React from 'react';
import { useSelector } from 'react-redux';
import VerticalLayout from '@/Components/VerticalLayout';
import HorizontalLayout from '@/Components/HorizontalLayout';
import GuestLayout from '@/Layouts/GuestLayout';

const LayoutSelector = ({ children, layoutType: propLayoutType }) => {
    const { layoutType: reduxLayoutType } = useSelector((state) => state.Layout);
    const layoutType = propLayoutType || reduxLayoutType;

    // Log layoutType for debugging
    console.log('LayoutSelector layoutType:', layoutType);

    // Determine which layout to use
    const getLayout = () => {
        switch (layoutType) {
            case 'horizontal':
                return HorizontalLayout;
            case 'non-auth':
                return GuestLayout;
            case 'vertical':
            default:
                return VerticalLayout;
        }
    };

    const Layout = getLayout();
    return <Layout>{children}</Layout>;
};

export default LayoutSelector;