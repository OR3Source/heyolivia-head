import React from 'react';

const MicrophonePage = () => {
    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>My Microphone</h1>
            <img
                src="https://i.pinimg.com/736x/5b/dd/18/5bdd181ab56b0fc20b5413d17b75c854.jpg"
                alt="Microphone"
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

export default MicrophonePage;
