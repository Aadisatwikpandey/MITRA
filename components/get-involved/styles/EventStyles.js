// components/get-involved/styles/EventStyles.js
import styled from 'styled-components';

export const EventsContainer = styled.div`
  margin-top: 3rem;
`;

export const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 2rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const EventCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  
  &:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

export const EventImage = styled.div`
  position: relative;
  height: 200px;
`;

export const EventDate = styled.div`
  position: absolute;
  top: 1rem;
  left: 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 0.5rem;
  border-radius: 4px;
  font-weight: 600;
  z-index: 1;
`;

export const EventContent = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const EventTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.75rem;
  color: ${props => props.theme.colors.primary};
`;

export const EventDetails = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-bottom: 1rem;
  flex-grow: 1;
`;

export const EventDetail = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  
  svg {
    color: ${props => props.theme.colors.primary};
    font-size: 1rem;
  }
`;

export const EventButton = styled.a`
  display: block;
  text-align: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background-color: #d68910;
    transform: translateY(-2px);
  }
`;