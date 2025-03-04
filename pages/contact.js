// pages/contact.js
import { useState } from 'react';
import Head from 'next/head';
import styled from 'styled-components';
import Image from 'next/image';
import { FaMapMarkerAlt, FaEnvelope, FaPhone, FaClock, FaSchool } from 'react-icons/fa';
import { serverTimestamp } from 'firebase/firestore';
import { db, collection, addDoc } from '../lib/firebase';

// Styled Components
const PageContainer = styled.div`
  padding: 0;
`;

const HeroSection = styled.header`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/contact-hero.jpg') no-repeat center center;
  background-size: cover;
  height: 40vh;
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  margin-bottom: 3rem;
`;

const PageTitle = styled.h1`
  font-size: 3rem;
  font-weight: 700;
  color: white;
`;

const ContentContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto 5rem;
  padding: 0 2rem;
  
  @media (max-width: 768px) {
    padding: 0 1rem;
  }
`;

const ContactGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const ContactInfo = styled.div`
  @media (max-width: 992px) {
    order: 2;
  }
`;

const SectionTitle = styled.h2`
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
`;

const InfoItem = styled.div`
  display: flex;
  margin-bottom: 1.5rem;
  align-items: flex-start;
`;

const IconContainer = styled.div`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background-color: rgba(30, 132, 73, 0.1);
  color: ${props => props.theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 1rem;
  flex-shrink: 0;
  font-size: 1.2rem;
`;

const InfoContent = styled.div`
  flex: 1;
`;

const InfoTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: ${props => props.theme.colors.primary};
`;

const InfoText = styled.p`
  color: ${props => props.theme.colors.text};
  margin: 0;
  line-height: 1.5;
`;

const MapContainer = styled.div`
  margin-top: 3rem;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  height: 300px;
  position: relative;
`;

const ContactForm = styled.div`
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  
  @media (max-width: 992px) {
    order: 1;
  }
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
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.theme.colors.primary};
  }
`;

const Textarea = styled.textarea`
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
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const ErrorMessage = styled.div`
  background-color: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1.5rem;
  text-align: center;
`;

export default function Contact() {
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
      <Head>
        <title>Contact Us | MITRA</title>
        <meta name="description" content="Get in touch with MITRA. Contact us for inquiries about our educational programs, volunteer opportunities, or donations." />
      </Head>
      
      <PageContainer>
        <HeroSection>
          <PageTitle>Contact Us</PageTitle>
        </HeroSection>
        
        <ContentContainer>
          <ContactGrid>
            <ContactInfo>
              <SectionTitle>Get In Touch</SectionTitle>
              
              <InfoItem>
                <IconContainer>
                  <FaSchool />
                </IconContainer>
                <InfoContent>
                  <InfoTitle>Sandeepani Gyan Kunj</InfoTitle>
                  <InfoText>Our school and main office where you can visit us.</InfoText>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <IconContainer>
                  <FaMapMarkerAlt />
                </IconContainer>
                <InfoContent>
                  <InfoTitle>Our Address</InfoTitle>
                  <InfoText>Sandeepani Gyan Kunj, Village Area, District Name, State - 123456, India</InfoText>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <IconContainer>
                  <FaEnvelope />
                </IconContainer>
                <InfoContent>
                  <InfoTitle>Email Us</InfoTitle>
                  <InfoText>info@mitraorganization.org</InfoText>
                  <InfoText>support@mitraorganization.org</InfoText>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <IconContainer>
                  <FaPhone />
                </IconContainer>
                <InfoContent>
                  <InfoTitle>Call Us</InfoTitle>
                  <InfoText>+91 98765 43210</InfoText>
                  <InfoText>+91 98765 43211</InfoText>
                </InfoContent>
              </InfoItem>
              
              <InfoItem>
                <IconContainer>
                  <FaClock />
                </IconContainer>
                <InfoContent>
                  <InfoTitle>Office Hours</InfoTitle>
                  <InfoText>Monday to Friday: 9:00 AM - 5:00 PM</InfoText>
                  <InfoText>Saturday: 9:00 AM - 1:00 PM</InfoText>
                  <InfoText>Sunday: Closed</InfoText>
                </InfoContent>
              </InfoItem>
              
              <MapContainer>
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3504.2536055556256!2d77.20659501508338!3d28.56325708243953!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce26e99911a71%3A0x6518cae26c8beb31!2sIndia%20Gate%2C%20New%20Delhi%2C%20Delhi%20110001!5e0!3m2!1sen!2sin!4v1646404253424!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                  title="MITRA location map"
                ></iframe>
              </MapContainer>
            </ContactInfo>
            
            <ContactForm>
              <SectionTitle>Send Us a Message</SectionTitle>
              
              {submitSuccess ? (
                <SuccessMessage>
                  <h3>Thank You!</h3>
                  <p>Your message has been sent successfully. We'll get back to you shortly.</p>
                </SuccessMessage>
              ) : (
                <form onSubmit={handleSubmit}>
                  <FormRow>
                    <FormGroup>
                      <Label htmlFor="firstName">First Name*</Label>
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
                      <Label htmlFor="lastName">Last Name*</Label>
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
                      <Label htmlFor="email">Email Address*</Label>
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
                      <Label htmlFor="phone">Phone Number</Label>
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
                    <Label htmlFor="interest">I'm interested in:*</Label>
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
                    <Label htmlFor="message">Message*</Label>
                    <Textarea 
                      id="message" 
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></Textarea>
                  </FormGroup>
                  
                  {submitError && (
                    <ErrorMessage>{submitError}</ErrorMessage>
                  )}
                  
                  <SubmitButton type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Send Message'}
                  </SubmitButton>
                  
                  <NoticeText>
                    We respect your privacy. Your information will not be shared with third parties.
                  </NoticeText>
                </form>
              )}
            </ContactForm>
          </ContactGrid>
        </ContentContainer>
      </PageContainer>
    </>
  );
}