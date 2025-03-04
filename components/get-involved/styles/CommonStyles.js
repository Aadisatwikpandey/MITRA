// components/get-involved/styles/CommonStyles.js
import styled from 'styled-components';

// Page Container
export const PageContainer = styled.div`
  padding: 0;
`;

// Content Container
export const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 3rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem 2rem;
  }
`;

// Section
export const Section = styled.section`
  margin-bottom: 5rem;
`;

// Section Title
export const SectionTitle = styled.h2`
  font-size: 2.2rem;
  margin-bottom: 2rem;
  position: relative;
  padding-bottom: 15px;
  color: ${props => props.theme.colors.primary};
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 70px;
    height: 3px;
    background-color: ${props => props.theme.colors.secondary};
  }

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

// Section Introduction Text
export const IntroText = styled.p`
  font-size: 1.2rem;
  line-height: 1.8;
  margin-bottom: 2.5rem;
  max-width: 800px;

  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

// Card Grid (for various sections)
export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(${props => props.columns || 3}, 1fr);
  gap: ${props => props.gap || '2rem'};
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(${props => Math.min(props.columns, 2) || 2}, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

// Generic Card
export const Card = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

// Form Group
export const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

// Input
export const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

// Textarea
export const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  resize: vertical;
  min-height: 150px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

// Select
export const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

// Button
export const Button = styled.button`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.secondary ? props.theme.colors.secondary : props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background-color: ${props => props.secondary ? '#d68910' : '#166638'};
    transform: translateY(-2px);
  }
`;

// Notice Text
export const NoticeText = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.lightText};
  margin-top: 1rem;
  text-align: center;
`;

// Icon Container
export const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(30, 132, 73, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  
  svg {
    font-size: 2.5rem;
    color: ${props => props.theme.colors.primary};
  }
`;

// List with styled markers
export const StyledList = styled.ul`
  margin-bottom: 2rem;
  padding-left: 1.5rem;
  
  li {
    margin-bottom: 1rem;
    position: relative;
    padding-left: 1rem;
    
    &::before {
      content: '';
      position: absolute;
      left: -1rem;
      top: 0.5rem;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: ${props => props.theme.colors.secondary};
    }
  }
`;