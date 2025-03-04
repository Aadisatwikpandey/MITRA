// components/get-involved/sections/EventsSection.js
import Image from 'next/image';
import { FaCalendarCheck, FaMapMarkerAlt } from 'react-icons/fa';
import { SectionTitle } from '../styles/CommonStyles';
import {
  EventsContainer,
  EventsGrid,
  EventCard,
  EventImage,
  EventDate,
  EventContent,
  EventTitle,
  EventDetails,
  EventDetail,
  EventButton
} from '../styles/EventStyles';

// Import directly without using default
const events = require('../data/eventsData');

export default function EventsSection() {
  // Handle event button click to pre-fill contact form
  const handleEventSelect = (event) => {
    // Scroll to contact form
    document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
    
    // Pre-select events in the dropdown
    const interestSelect = document.getElementById('interest');
    if (interestSelect) interestSelect.value = 'events';
    
    // Add event details to message
    const messageField = document.getElementById('message');
    if (messageField) {
      messageField.value = `I'm interested in the "${event.title}" on ${event.date}. Please provide me with more information.`;
    }
  };
  
  return (
    <>
      <SectionTitle>Upcoming Events</SectionTitle>
      <p>
        Join us at our upcoming events to learn more about our work, meet our team, 
        and find opportunities to get involved. These events are great ways to connect 
        with our community and support our cause.
      </p>
      
      <EventsContainer>
        <EventsGrid>
          {events.map((event, index) => (
            <EventCard key={index}>
              <EventImage>
                <EventDate>{event.date}</EventDate>
                <Image 
                  src={event.image} 
                  alt={event.title} 
                  layout="fill"
                  objectFit="cover"
                />
              </EventImage>
              
              <EventContent>
                <EventTitle>{event.title}</EventTitle>
                
                <EventDetails>
                  <EventDetail>
                    <FaCalendarCheck />
                    <span>{event.date} | {event.time}</span>
                  </EventDetail>
                  
                  <EventDetail>
                    <FaMapMarkerAlt />
                    <span>{event.location}</span>
                  </EventDetail>
                  
                  <EventDetail>
                    <span>{event.description}</span>
                  </EventDetail>
                </EventDetails>
                
                <EventButton 
                  href="#contact-form"
                  onClick={(e) => {
                    e.preventDefault();
                    handleEventSelect(event);
                  }}
                >
                  {event.buttonText}
                </EventButton>
              </EventContent>
            </EventCard>
          ))}
        </EventsGrid>
      </EventsContainer>
    </>
  );
}