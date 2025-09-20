// src/pages/404.jsx or wherever your routes live
import React from 'react';

const NotFoundPage = () => {
    return (
        <div style={{ textAlign: 'center', padding: '2rem', paddingTop: '8rem', backgroundColor: '#ffffff' }}>
            <h1>404 - Page Not Found</h1>
            <p>Oops! The page you're looking for doesn't exist.</p>
        </div>
    );
};

export default NotFoundPage;
