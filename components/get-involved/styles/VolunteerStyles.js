// components/get-involved/styles/VolunteerStyles.js
import styled from 'styled-components';

export const VolunteerContainer = styled.div`
  margin-top: 3rem;
`;

export const VolunteerGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const RoleCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

export const RoleHeader = styled.div`
  background-color: ${props => props.theme.colors.primary};
  color: white;
  padding: 1.5rem;
  
  h3 {
    margin: 0;
    color: white;
  }
  
  p {
    margin: 0.5rem 0 0;
    opacity: 0.9;
    font-size: 0.9rem;
  }
`;

export const RoleBody = styled.div`
  padding: 1.5rem;
`;

export const RoleDetail = styled.div`
  margin-bottom: 1rem;
  
  h4 {
    font-size: 1rem;
    margin-bottom: 0.5rem;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    margin: 0;
    font-size: 0.95rem;
  }
  
  ul {
    margin: 0.5rem 0 0;
    padding-left: 1.5rem;
    
    li {
      margin-bottom: 0.25rem;
      font-size: 0.95rem;
    }
  }
`;

export const ApplyButton = styled.a`
  display: block;
  text-align: center;
  padding: 0.75rem 1rem;
  background-color: ${props => props.theme.colors.secondary};
  color: white;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1.5rem;
  text-decoration: none;
  
  &:hover {
    background-color: #d68910;
    transform: translateY(-2px);
  }
`;