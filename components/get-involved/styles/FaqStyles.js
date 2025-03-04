// components/get-involved/styles/FaqStyles.js
import styled from 'styled-components';

export const FaqContainer = styled.div`
  margin-top: 3rem;
  max-width: 800px;
`;

export const FaqItem = styled.div`
  margin-bottom: 1rem;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
`;

export const FaqQuestion = styled.button`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  background-color: ${props => props.isOpen ? 'rgba(30, 132, 73, 0.05)' : 'white'};
  border: none;
  text-align: left;
  cursor: pointer;
  font-weight: 600;
  color: ${props => props.theme.colors.primary};
  transition: background-color 0.2s ease;
  
  &:hover {
    background-color: rgba(30, 132, 73, 0.05);
  }
`;

export const FaqAnswer = styled.div`
  padding: ${props => props.isOpen ? '1rem 1.5rem' : '0 1.5rem'};
  max-height: ${props => props.isOpen ? '300px' : '0'};
  overflow: hidden;
  transition: all 0.3s ease;
  opacity: ${props => props.isOpen ? '1' : '0'};
  border-top: ${props => props.isOpen ? '1px solid #eee' : 'none'};
  
  p {
    margin: 0;
  }
`;