import React from 'react';

const GuitarPage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>My Guitar</h1>
            <img
                src="https://m.media-amazon.com/images/I/61hZghaBMVL._AC_SX679_.jpg"
                alt="Electric Guitar"
                style={{
                    maxWidth: '80%',
                    height: 'auto',
                    border: '4px solid #333',
                    borderRadius: '10px'
                }}
            />
        </div>
    );
};

export default GuitarPage;
