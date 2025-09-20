import React from 'react';
import '../../assets/styles/forms/event-submission-style.css';

const EventSubmissionForm = () => {
    return (
        <div className="event-submission-page">
            <div className="es-form-container">
                <h1>Submit Your Event</h1>
                <form>
                    <label htmlFor="eventName">Event Name</label>
                    <input
                        type="text"
                        id="eventName"
                        name="eventName"
                        placeholder="Enter event name"
                        autoComplete="off"
                    />

                    <button type="submit">send</button>
                </form>
            </div>
        </div>
    );
};

export default EventSubmissionForm;
