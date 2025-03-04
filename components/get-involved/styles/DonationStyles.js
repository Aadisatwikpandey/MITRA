// components/get-involved/styles/DonationStyles.js
import styled from 'styled-components';
import { FormGroup as BaseFormGroup } from './CommonStyles';

export const DonationContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const DonationInfo = styled.div`
  @media (max-width: 992px) {
    order: 1;
  }
  
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.primary};
  }
  
  h4 {
    font-size: 1.2rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.text};
  }
  
  p {
    margin-bottom: 1.2rem;
    line-height: 1.6;
  }
`;

export const DonationForm = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 992px) {
    order: 2;
  }
`;

export const FormTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.primary};
  text-align: center;
`;

export const AmountOptions = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
`;

export const AmountButton = styled.button`
  padding: 0.75rem;
  background-color: ${props => props.active ? props.theme.colors.primary : 'white'};
  color: ${props => props.active ? 'white' : props.theme.colors.text};
  border: 1px solid ${props => props.active ? props.theme.colors.primary : '#ddd'};
  border-radius: 4px;
  font-weight: ${props => props.active ? '600' : 'normal'};
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:hover {
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const CustomAmount = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

export const FormGroup = styled(BaseFormGroup)`
  margin-bottom: 1.5rem;
  
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }
`;

export const RadioGroup = styled.div`
  display: flex;
  gap: 2rem;
  margin-bottom: 1.5rem;
`;

export const RadioOption = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

export const RadioInput = styled.input`
  cursor: pointer;
`;

export const DonateButton = styled.button`
  width: 100%;
  padding: 1rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  
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