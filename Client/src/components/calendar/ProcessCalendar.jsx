import React, { useState } from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import 'react-big-calendar/lib/css/react-big-calendar.css'; // Ensure CSS is also imported for styles
import { Modal } from 'antd';

// Set up the localizer by providing the moment Object
const localizer = momentLocalizer(moment);

const views = ['month', 'week', 'day', 'agenda']; // Commonly used views

const events = [
  {
    'title': 'All Day Event very long title',
    'allDay': true,
    'start': new Date(2015, 3, 0),
    'end': new Date(2015, 3, 1),
    'desc': 'Description for All Day Event'
  },
  {
    'title': 'Long Event',
    'start': new Date(2015, 3, 7),
    'end': new Date(2015, 3, 10),
    'desc': 'Description for Long Event'
  },
  // Add more events here
];

const ProcessCalendar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});

  const handleEventClick = event => {
    setSelectedEvent(event);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  return (
    <div style={{ height: "100%" }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        defaultDate={new Date(2015, 3, 1)}
        views={views}
        onSelectEvent={handleEventClick}
      />
      <Modal
        title={selectedEvent.title}
        open={modalVisible}
        onOk={closeModal}
        onCancel={closeModal}
        footer={null}
      >
        <p>{selectedEvent.desc}</p>
      </Modal>
    </div>
  );
};

export default ProcessCalendar;
