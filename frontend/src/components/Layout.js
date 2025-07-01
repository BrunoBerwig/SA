import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Breadcrumbs from './common/Breadcrumbs';

const Layout = () => {
    return (
        <div className="flex bg-gray-100 dark:bg-slate-900 min-h-screen">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
                <Breadcrumbs />
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;