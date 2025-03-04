// components/get-involved/sections/FaqSection.js
import { useState } from 'react';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { SectionTitle } from '../styles/CommonStyles';
import { FaqContainer, FaqItem, FaqQuestion, FaqAnswer } from '../styles/FaqStyles';

// Import directly without using default
const faqItems = require('../data/faqData');

export default function FaqSection() {
  // State for FAQ accordions
  const [openFaq, setOpenFaq] = useState(null);
  
  // Toggle FAQ item
  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };
  
  return (
    <>
      <SectionTitle>Frequently Asked Questions</SectionTitle>
      
      <FaqContainer>
        {faqItems.map((item, index) => (
          <FaqItem key={index}>
            <FaqQuestion 
              isOpen={openFaq === index}
              onClick={() => toggleFaq(index)}
            >
              {item.question}
              {openFaq === index ? <FaChevronUp /> : <FaChevronDown />}
            </FaqQuestion>
            
            <FaqAnswer isOpen={openFaq === index}>
              <p>{item.answer}</p>
            </FaqAnswer>
          </FaqItem>
        ))}
      </FaqContainer>
    </>
  );
}