// components/get-involved/sections/ContactForm.js
import { useState } from 'react';
import { SectionTitle } from '../styles/CommonStyles';
import { Input, Select, Textarea } from '../styles/CommonStyles';
import { 
  ContactFormContainer,
  FormRow,
  FormGroup,
  SubmitButton,
  NoticeText
} from '../styles/ContactStyles';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    interest: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError('');

    try {
      // In a real implementation, you would send this data to your backend
      // For now, we'll simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Form submitted:', formData);
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
    <>
      <SectionTitle>Get in Touch</SectionTitle>
      <p>
        Interested in getting involved? Have questions about our programs? 
        Fill out the form below, and our team will get back to you as soon as possible.
      </p>
      
      <ContactFormContainer>
        {submitSuccess ? (
          <div className="success-message" style={{ textAlign: 'center', padding: '2rem 0' }}>
            <h3 style={{ color: '#27ae60', marginBottom: '1rem' }}>Thank You!</h3>
            <p>Your message has been sent successfully. We'll get back to you shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <label htmlFor="firstName">First Name*</label>
                <Input 
                  id="firstName" 
                  name="firstName"
                  type="text" 
                  value={formData.firstName}
                  onChange={handleChange}
                  required 
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="lastName">Last Name*</label>
                <Input 
                  id="lastName" 
                  name="lastName"
                  type="text" 
                  value={formData.lastName}
                  onChange={handleChange}
                  required 
                />
              </FormGroup>
            </FormRow>
            
            <FormRow>
              <FormGroup>
                <label htmlFor="email">Email Address*</label>
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="phone">Phone Number</label>
                <Input 
                  id="phone" 
                  name="phone"
                  type="tel" 
                  value={formData.phone}
                  onChange={handleChange}
                />
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <label htmlFor="interest">I'm interested in:*</label>
              <Select 
                id="interest" 
                name="interest"
                value={formData.interest}
                onChange={handleChange}
                required
              >
                <option value="">Select an option</option>
                <option value="donating">Making a Donation</option>
                <option value="volunteering">Volunteering</option>
                <option value="sponsoring">Corporate Sponsorship</option>
                <option value="events">Attending an Event</option>
                <option value="other">Other</option>
              </Select>
            </FormGroup>
            
            <FormGroup>
              <label htmlFor="message">Message*</label>
              <Textarea 
                id="message" 
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              ></Textarea>
            </FormGroup>
            
            {submitError && (
              <div className="error-message" style={{ color: '#e74c3c', marginBottom: '1.5rem' }}>
                {submitError}
              </div>
            )}
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </SubmitButton>
            
            <NoticeText>
              We respect your privacy. Your information will not be shared with third parties.
            </NoticeText>
          </form>
        )}
      </ContactFormContainer>
    </>
  );
}