import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function Layout() {
    return (
        <div className="flex min-h-screen bg-gray-100 dark:bg-slate-900">
            <div className="fixed top-0 left-0 h-full">
                <Sidebar />
            </div>
            <main className="flex-1 p-8 ml-64">
                <Outlet />
            </main>
        </div>
    );
}