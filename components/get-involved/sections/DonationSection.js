// components/get-involved/sections/DonationSection.js
import { useState } from 'react';
import { SectionTitle, StyledList } from '../styles/CommonStyles';
import {
  DonationContainer,
  DonationInfo,
  DonationForm,
  FormTitle,
  AmountOptions,
  AmountButton,
  CustomAmount,
  FormGroup,
  RadioGroup,
  RadioOption,
  RadioInput,
  DonateButton,
  NoticeText
} from '../styles/DonationStyles';

export default function DonationSection() {
  // State for donation form
  const [donationAmount, setDonationAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [donationType, setDonationType] = useState('oneTime');
  
  // Handle donation amount selection
  const handleAmountSelect = (amount) => {
    setDonationAmount(amount);
    setCustomAmount('');
  };
  
  // Handle custom amount input
  const handleCustomAmountChange = (e) => {
    setCustomAmount(e.target.value);
    setDonationAmount(null);
  };
  
  // Handle donation type selection
  const handleDonationTypeChange = (e) => {
    setDonationType(e.target.value);
  };
  
  return (
    <>
      <SectionTitle>Donate</SectionTitle>
      <DonationContainer>
        <DonationInfo>
          <h3>Your Contribution Makes a Difference</h3>
          <p>
            Your generous donations enable us to provide quality education and support to 
            underprivileged children and communities. Every contribution, regardless of size, 
            has a significant impact on our ability to create lasting change.
          </p>
          
          <h4>How Your Donation Helps:</h4>
          <StyledList>
            <li>₹500 provides school supplies for one child for a month</li>
            <li>₹1,000 supports a child's education for one month</li>
            <li>₹5,000 helps train a teacher for improved educational outcomes</li>
            <li>₹10,000 funds community development initiatives</li>
            <li>₹25,000+ contributes to infrastructure improvements at our schools</li>
          </StyledList>
          
          <p>
            All donations are tax-deductible. You will receive a receipt for your contributions 
            that can be used for tax purposes.
          </p>
        </DonationInfo>
        
        <DonationForm>
          <FormTitle>Make a Donation</FormTitle>
          
          <AmountOptions>
            <AmountButton 
              active={donationAmount === 500}
              onClick={() => handleAmountSelect(500)}
            >
              ₹500
            </AmountButton>
            
            <AmountButton 
              active={donationAmount === 1000}
              onClick={() => handleAmountSelect(1000)}
            >
              ₹1,000
            </AmountButton>
            
            <AmountButton 
              active={donationAmount === 5000}
              onClick={() => handleAmountSelect(5000)}
            >
              ₹5,000
            </AmountButton>
          </AmountOptions>
          
          <FormGroup>
            <label htmlFor="customAmount">Other Amount (₹)</label>
            <CustomAmount
              id="customAmount"
              type="number"
              placeholder="Enter custom amount"
              value={customAmount}
              onChange={handleCustomAmountChange}
            />
          </FormGroup>
          
          <FormGroup>
            <label>Donation Frequency</label>
            <RadioGroup>
              <RadioOption>
                <RadioInput
                  type="radio"
                  id="oneTime"
                  name="donationType"
                  value="oneTime"
                  checked={donationType === 'oneTime'}
                  onChange={handleDonationTypeChange}
                />
                <label htmlFor="oneTime">One-time</label>
              </RadioOption>
              
              <RadioOption>
                <RadioInput
                  type="radio"
                  id="monthly"
                  name="donationType"
                  value="monthly"
                  checked={donationType === 'monthly'}
                  onChange={handleDonationTypeChange}
                />
                <label htmlFor="monthly">Monthly</label>
              </RadioOption>
            </RadioGroup>
          </FormGroup>
          
          <DonateButton 
            onClick={() => {
              // Get amount (either selected or custom)
              const amount = customAmount ? customAmount : donationAmount;
              // Get frequency
              const frequency = donationType === 'monthly' ? 'Monthly' : 'One-time';
              // Scroll to contact form and pre-fill if possible
              document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
              // Pre-select donation in the dropdown
              const interestSelect = document.getElementById('interest');
              if (interestSelect) interestSelect.value = 'donating';
              // Add donation details to message if possible
              const messageField = document.getElementById('message');
              if (messageField) messageField.value = `I'm interested in making a ${frequency.toLowerCase()} donation of ₹${amount}.`;
            }}
          >
            Proceed to Contact Form
          </DonateButton>
          
          <NoticeText>
            After submitting your information, our team will contact you with next steps for completing your donation.
          </NoticeText>
        </DonationForm>
      </DonationContainer>
    </>
  );
}