// pages/get-involved.js
import Head from 'next/head';
import styled from 'styled-components';

// Import page sections
import Hero from '../components/get-involved/sections/Hero';
import SupportOptions from '../components/get-involved/sections/SupportOptions';
import DonationSection from '../components/get-involved/sections/DonationSection';
import VolunteerSection from '../components/get-involved/sections/VolunteerSection';
import SponsorSection from '../components/get-involved/sections/SponsorSection';
import EventsSection from '../components/get-involved/sections/EventsSection';
import ImpactSection from '../components/get-involved/sections/ImpactSection';
import FaqSection from '../components/get-involved/sections/FaqSection';
import ContactForm from '../components/get-involved/sections/ContactForm';

// Import shared styled components
import { PageContainer, ContentContainer, Section } from '../components/get-involved/styles/CommonStyles';

export default function GetInvolved() {
  return (
    <>
      <Head>
        <title>Get Involved | MITRA</title>
        <meta 
          name="description" 
          content="Join MITRA in empowering rural communities through education. Donate, volunteer, or sponsor our initiatives to make a difference." 
        />
      </Head>
      
      <PageContainer>
        <Hero />
        
        <ContentContainer>
          {/* Ways to Support Section */}
          <Section>
            <SupportOptions />
          </Section>
          
          {/* Donation Section */}
          <Section id="donate">
            <DonationSection />
          </Section>
          
          {/* Volunteer Section */}
          <Section id="volunteer">
            <VolunteerSection />
          </Section>
          
          {/* Sponsorship Section */}
          <Section id="sponsor">
            <SponsorSection />
          </Section>
          
          {/* Events Section */}
          <Section id="events">
            <EventsSection />
          </Section>
          
          {/* Impact Stories Section */}
          <Section id="impact">
            <ImpactSection />
          </Section>
          
          {/* FAQ Section */}
          <Section id="faq">
            <FaqSection />
          </Section>
          
          {/* Contact Form Section */}
          <Section id="contact-form">
            <ContactForm />
          </Section>
        </ContentContainer>
      </PageContainer>
    </>
  );
}