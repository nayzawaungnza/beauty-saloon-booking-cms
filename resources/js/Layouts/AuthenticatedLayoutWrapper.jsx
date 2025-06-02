import React from 'react';
import { useSelector } from 'react-redux';
import { createSelector } from 'reselect';
import BaseAuthenticatedLayout from '@/Layouts/BaseAuthenticatedLayout';
import LayoutSelector from '@/Layouts/LayoutSelector';

const LayoutProperties = createSelector(
    (state) => state.Layout,
    (layout) => ({ layoutType: layout.layoutType })
);

const AuthenticatedLayoutWrapper = ({ children, header }) => {
    const { layoutType } = useSelector(LayoutProperties);
    // Only allow vertical or horizontal for authenticated pages
    const layoutTypeForAuth = layoutType === 'horizontal' ? 'horizontal' : 'vertical';

    return (
        // <BaseAuthenticatedLayout header={header}>
            <LayoutSelector layoutType={layoutTypeForAuth}>
                {children}
            </LayoutSelector>
        //</BaseAuthenticatedLayout>
    );
};

export default AuthenticatedLayoutWrapper;