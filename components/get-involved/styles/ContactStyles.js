// components/get-involved/styles/ContactStyles.js
import styled from 'styled-components';
import { FormGroup as BaseFormGroup } from './CommonStyles';

export const ContactFormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 600px;
  margin: 3rem auto 0;
`;

export const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

export const FormGroup = styled(BaseFormGroup)`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: ${props => props.theme.colors.text};
  }
`;

export const SubmitButton = styled.button`
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #166638;
    transform: translateY(-2px);
  }
`;

export const NoticeText = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.lightText};
  margin-top: 1rem;
  text-align: center;
`;