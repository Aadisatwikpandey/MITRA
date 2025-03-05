// Enhanced Contact Form with improved validation
import { useState, useEffect } from 'react';
import styled from 'styled-components';
import { serverTimestamp } from 'firebase/firestore';
import { db, collection, addDoc } from '../lib/firebase';

// Styled Components
const FormContainer = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
  position: relative;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: ${props => props.theme.colors.text};
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e74c3c' : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError 
      ? 'rgba(231, 76, 60, 0.1)' 
      : 'rgba(30, 132, 73, 0.1)'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e74c3c' : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError 
      ? 'rgba(231, 76, 60, 0.1)' 
      : 'rgba(30, 132, 73, 0.1)'};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid ${props => props.hasError ? '#e74c3c' : '#ddd'};
  border-radius: 4px;
  resize: vertical;
  min-height: 150px;
  transition: all 0.3s ease;
  
  &:focus {
    outline: none;
    border-color: ${props => props.hasError ? '#e74c3c' : props.theme.colors.primary};
    box-shadow: 0 0 0 2px ${props => props.hasError 
      ? 'rgba(231, 76, 60, 0.1)' 
      : 'rgba(30, 132, 73, 0.1)'};
  }
`;

const ErrorMessage = styled.div`
  color: #e74c3c;
  font-size: 0.8rem;
  margin-top: 0.3rem;
  transition: all 0.3s ease;
`;

const SubmitButton = styled.button`
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
  
  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const NoticeText = styled.p`
  font-size: 0.85rem;
  color: ${props => props.theme.colors.lightText};
  margin-top: 1rem;
`;

const SuccessMessage = styled.div`
  background-color: rgba(39, 174, 96, 0.1);
  color: #27ae60;
  padding: 1.5rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
  animation: fadeIn 0.5s ease-in;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  h3 {
    margin-bottom: 0.5rem;
    color: #27ae60;
  }
`;

const FormError = styled.div`
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

// Email validation regex pattern
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
// Phone number validation (allows various formats)
const PHONE_REGEX = /^(\+\d{1,3})?[-.\s]?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}$/;

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [formValid, setFormValid] = useState(false);

  // Validate form when formData or touched fields change
  useEffect(() => {
    const validateForm = () => {
      const errors = {};
      
      // First Name validation
      if (!formData.firstName.trim()) {
        errors.firstName = 'First name is required';
      } else if (formData.firstName.length < 2) {
        errors.firstName = 'First name must be at least 2 characters';
      }
      
      // Last Name validation
      if (!formData.lastName.trim()) {
        errors.lastName = 'Last name is required';
      } else if (formData.lastName.length < 2) {
        errors.lastName = 'Last name must be at least 2 characters';
      }
      
      // Email validation
      if (!formData.email.trim()) {
        errors.email = 'Email address is required';
      } else if (!EMAIL_REGEX.test(formData.email)) {
        errors.email = 'Please enter a valid email address';
      }
      
      // Phone validation (optional field)
      if (formData.phone.trim() && !PHONE_REGEX.test(formData.phone)) {
        errors.phone = 'Please enter a valid phone number';
      }
      
      // Interest validation
      if (!formData.interest) {
        errors.interest = 'Please select an interest';
      }
      
      // Message validation
      if (!formData.message.trim()) {
        errors.message = 'Message is required';
      } else if (formData.message.length < 10) {
        errors.message = 'Message must be at least 10 characters';
      }
      
      setFormErrors(errors);
      setFormValid(Object.keys(errors).length === 0);
    };
    
    validateForm();
  }, [formData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Mark field as touched when changed
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };
  
  const handleBlur = (e) => {
    const { name } = e.target;
    
    // Mark field as touched when blurred
    if (!touched[name]) {
      setTouched(prev => ({
        ...prev,
        [name]: true
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched
    const allTouched = Object.keys(formData).reduce((acc, key) => {
      acc[key] = true;
      return acc;
    }, {});
    setTouched(allTouched);
    
    // Check if form is valid before submitting
    if (!formValid) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // Save the form data to Firebase
      const docRef = await addDoc(collection(db, 'contactSubmissions'), {
        ...formData,
        fullName: `${formData.firstName} ${formData.lastName}`,
        status: 'new',
        viewed: false,
        createdAt: serverTimestamp(),
      });
      
      console.log('Form submitted with ID:', docRef.id);
      setSubmitSuccess(true);
      
      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        interest: '',
        message: ''
      });
      setTouched({});
      
      // Reset success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitError('There was a problem submitting your request. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer>
      {submitSuccess ? (
        <SuccessMessage>
          <h3>Thank You!</h3>
          <p>Your message has been sent successfully. We'll get back to you shortly.</p>
        </SuccessMessage>
      ) : (
        <form onSubmit={handleSubmit} noValidate>
          <FormRow>
            <FormGroup>
              <Label htmlFor="firstName">First Name*</Label>
              <Input 
                id="firstName" 
                name="firstName"
                type="text" 
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.firstName && formErrors.firstName}
                aria-invalid={touched.firstName && !!formErrors.firstName}
                aria-describedby={formErrors.firstName ? "firstName-error" : undefined}
              />
              {touched.firstName && formErrors.firstName && (
                <ErrorMessage id="firstName-error">{formErrors.firstName}</ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="lastName">Last Name*</Label>
              <Input 
                id="lastName" 
                name="lastName"
                type="text" 
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.lastName && formErrors.lastName}
                aria-invalid={touched.lastName && !!formErrors.lastName}
                aria-describedby={formErrors.lastName ? "lastName-error" : undefined}
              />
              {touched.lastName && formErrors.lastName && (
                <ErrorMessage id="lastName-error">{formErrors.lastName}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>
          
          <FormRow>
            <FormGroup>
              <Label htmlFor="email">Email Address*</Label>
              <Input 
                id="email" 
                name="email"
                type="email" 
                value={formData.email}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.email && formErrors.email}
                aria-invalid={touched.email && !!formErrors.email}
                aria-describedby={formErrors.email ? "email-error" : undefined}
              />
              {touched.email && formErrors.email && (
                <ErrorMessage id="email-error">{formErrors.email}</ErrorMessage>
              )}
            </FormGroup>
            
            <FormGroup>
              <Label htmlFor="phone">Phone Number</Label>
              <Input 
                id="phone" 
                name="phone"
                type="tel" 
                value={formData.phone}
                onChange={handleChange}
                onBlur={handleBlur}
                hasError={touched.phone && formErrors.phone}
                aria-invalid={touched.phone && !!formErrors.phone}
                aria-describedby={formErrors.phone ? "phone-error" : undefined}
              />
              {touched.phone && formErrors.phone && (
                <ErrorMessage id="phone-error">{formErrors.phone}</ErrorMessage>
              )}
            </FormGroup>
          </FormRow>
          
          <FormGroup>
            <Label htmlFor="interest">I'm interested in:*</Label>
            <Select 
              id="interest" 
              name="interest"
              value={formData.interest}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.interest && formErrors.interest}
              aria-invalid={touched.interest && !!formErrors.interest}
              aria-describedby={formErrors.interest ? "interest-error" : undefined}
            >
              <option value="">Select an option</option>
              <option value="donating">Making a Donation</option>
              <option value="volunteering">Volunteering</option>
              <option value="sponsoring">Corporate Sponsorship</option>
              <option value="events">Attending an Event</option>
              <option value="other">Other</option>
            </Select>
            {touched.interest && formErrors.interest && (
              <ErrorMessage id="interest-error">{formErrors.interest}</ErrorMessage>
            )}
          </FormGroup>
          
          <FormGroup>
            <Label htmlFor="message">Message*</Label>
            <Textarea 
              id="message" 
              name="message"
              value={formData.message}
              onChange={handleChange}
              onBlur={handleBlur}
              hasError={touched.message && formErrors.message}
              aria-invalid={touched.message && !!formErrors.message}
              aria-describedby={formErrors.message ? "message-error" : undefined}
            ></Textarea>
            {touched.message && formErrors.message && (
              <ErrorMessage id="message-error">{formErrors.message}</ErrorMessage>
            )}
          </FormGroup>
          
          {submitError && (
            <FormError>{submitError}</FormError>
          )}
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Send Message'}
          </SubmitButton>
          
          <NoticeText>
            We respect your privacy. Your information will not be shared with third parties.
          </NoticeText>
        </form>
      )}
    </FormContainer>
  );
}