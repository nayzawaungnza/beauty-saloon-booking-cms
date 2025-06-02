import React from 'react';
import { Link, usePage } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import Dropdown from '@/Components/Dropdown';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import ApplicationLogo from '@/Components/ApplicationLogo';

const BaseAuthenticatedLayout = ({ children, header }) => {
    const { auth } = usePage().props;

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-white border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="h-10 w-10 fill-current text-gray-500 dark:text-gray-400" />
                                </Link>
                            </div>

                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink href={route('dashboard')} active={route().current('dashboard')}>
                                    Dashboard
                                </NavLink>
                               
                                <NavLink href={route('profile.edit')} active={route().current('profile.*')}>
                                    Profile
                                </NavLink>
                            </div>
                        </div>

                        <div className="hidden sm:flex sm:items-center sm:ms-6">
                            
                        </div>

                        
                    </div>
                </div>

                <div className="hidden sm:hidden">
                    

                    
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">{header}</div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
};

export default BaseAuthenticatedLayout;