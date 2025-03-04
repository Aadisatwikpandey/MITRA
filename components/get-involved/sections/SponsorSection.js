// components/get-involved/sections/SponsorSection.js
import { SectionTitle } from '../styles/CommonStyles';
import {
  SponsorsContainer,
  SponsorTiersGrid,
  TierCard,
  TierHeader,
  TierTitle,
  TierPrice,
  TierDescription,
  TierBody,
  TierBenefits,
  ContactButton
} from '../styles/SponsorStyles';

// Import directly without using default
const sponsorTiers = require('../data/sponsorTiers');

export default function SponsorSection() {
  // Handle sponsor tier selection to pre-fill contact form
  const handleSponsorSelect = (tier) => {
    // Scroll to contact form
    document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
    
    // Pre-select sponsoring in the dropdown
    const interestSelect = document.getElementById('interest');
    if (interestSelect) interestSelect.value = 'sponsoring';
    
    // Add sponsorship details to message
    const messageField = document.getElementById('message');
    if (messageField) {
      messageField.value = `Our company is interested in becoming a ${tier.title}. Please provide us with more information about the sponsorship program.`;
    }
  };
  
  return (
    <>
      <SectionTitle>Become a Sponsor</SectionTitle>
      <p>
        Corporate partnerships play a crucial role in sustaining our programs and expanding our reach. 
        By sponsoring MITRA, your company demonstrates commitment to social responsibility while making 
        a meaningful difference in the lives of underprivileged children and communities.
      </p>
      
      <SponsorsContainer>
        <SponsorTiersGrid>
          {sponsorTiers.map((tier, index) => (
            <TierCard key={index}>
              <TierHeader tier={tier.tier}>
                <TierTitle>{tier.title}</TierTitle>
                <TierPrice>{tier.price}</TierPrice>
                <TierDescription>{tier.description}</TierDescription>
              </TierHeader>
              
              <TierBody>
                <TierBenefits tier={tier.tier}>
                  {tier.benefits.map((benefit, i) => (
                    <li key={i}>{benefit}</li>
                  ))}
                </TierBenefits>
                
                <ContactButton 
                  tier={tier.tier} 
                  href="#contact-form"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSponsorSelect(tier);
                  }}
                >
                  {tier.buttonText}
                </ContactButton>
              </TierBody>
            </TierCard>
          ))}
        </SponsorTiersGrid>
      </SponsorsContainer>
    </>
  );
}