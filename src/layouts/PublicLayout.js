import React from 'react';
import { useLocation, Outlet } from 'react-router-dom';
import Navbar from '../components/navbar/Navbar';
import Callbtn from '../components/callbtn/Callbtn';

const PublicLayout = () => {
    const location = useLocation();
    const showCallButton = location.pathname === '/';
    return (
        <>
            <Navbar />
            {showCallButton && <Callbtn />}
            <main><Outlet /></main>
        </>
    );
};

export default PublicLayout;



