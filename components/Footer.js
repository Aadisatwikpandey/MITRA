// Footer.js - fixed version
import Link from 'next/link';
import styled from 'styled-components';

const FooterContainer = styled.footer`
  background-color: ${props => props.theme.colors.footer};
  color: ${props => props.theme.colors.white};
  padding: 3rem 0 1rem;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  padding: 0 1rem;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FooterSection = styled.div`
  margin-bottom: 1.5rem;
`;

const FooterHeading = styled.h3`
  color: ${props => props.theme.colors.white};
  font-size: 1.2rem;
  margin-bottom: 1rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -10px;
    left: 0;
    width: 50px;
    height: 2px;
    background-color: ${props => props.theme.colors.secondary};
  }
`;

// Style the Link component directly
const FooterLink = styled(Link)`
  color: #ccc;
  display: block;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.colors.secondary};
    padding-left: 5px;
  }
`;

const ExternalLink = styled.a`
  color: #ccc;
  display: block;
  margin-bottom: 0.5rem;
  transition: all 0.3s ease;
  text-decoration: none;

  &:hover {
    color: ${props => props.theme.colors.secondary};
    padding-left: 5px;
  }
`;

const ContactItem = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 1rem;
  color: #ccc;
`;

const IconWrapper = styled.span`
  margin-right: 10px;
  color: ${props => props.theme.colors.secondary};
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
`;

const SocialIcon = styled.a`
  color: ${props => props.theme.colors.white};
  font-size: 1.2rem;
  transition: all 0.3s ease;

  &:hover {
    color: ${props => props.theme.colors.secondary};
    transform: translateY(-3px);
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 2rem;
  margin-top: 2rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #aaa;
  font-size: 0.9rem;
`;

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <FooterHeading>About MITRA</FooterHeading>
          <p style={{ color: '#ccc', marginBottom: '1rem' }}>
            MITRA is dedicated to empowering rural communities through quality education, skill development, and sustainable initiatives.
          </p>
          <SocialLinks>
            <SocialIcon href="#" aria-label="Facebook">
              <i className="fab fa-facebook-f"></i>
            </SocialIcon>
            <SocialIcon href="#" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </SocialIcon>
            <SocialIcon href="#" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </SocialIcon>
            <SocialIcon href="#" aria-label="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </SocialIcon>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <FooterHeading>Quick Links</FooterHeading>
          <FooterLink href="/">Home</FooterLink>
          <FooterLink href="/about">About Us</FooterLink>
          <FooterLink href="/get-involved">Get Involved</FooterLink>
          <FooterLink href="/news-events">News & Events</FooterLink>
          <FooterLink href="/gallery">Gallery</FooterLink>
          <FooterLink href="/contact">Contact Us</FooterLink>
        </FooterSection>

        <FooterSection>
          <FooterHeading>Our Programs</FooterHeading>
          <FooterLink href="/about#sandeepani">Sandeepani Gyan Kunj</FooterLink>
          <ExternalLink href="#">Community Outreach</ExternalLink>
          <ExternalLink href="#">Skill Development</ExternalLink>
          <ExternalLink href="#">Health Initiatives</ExternalLink>
          <ExternalLink href="#">Women Empowerment</ExternalLink>
        </FooterSection>

        <FooterSection>
          <FooterHeading>Contact Info</FooterHeading>
          <ContactItem>
            <IconWrapper>
              <i className="fas fa-map-marker-alt"></i>
            </IconWrapper>
            <span>Sandeepani Gyan Kunj, Rural Area, District Name, State, India</span>
          </ContactItem>
          <ContactItem>
            <IconWrapper>
              <i className="fas fa-phone-alt"></i>
            </IconWrapper>
            <span>+91 98765 43210</span>
          </ContactItem>
          <ContactItem>
            <IconWrapper>
              <i className="fas fa-envelope"></i>
            </IconWrapper>
            <span>info@mitraorganization.org</span>
          </ContactItem>
        </FooterSection>
      </FooterContent>
      
      <Copyright>
        &copy; {new Date().getFullYear()} MITRA. All rights reserved.
      </Copyright>
    </FooterContainer>
  );
}