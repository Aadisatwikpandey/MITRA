// components/get-involved/sections/VolunteerSection.js
import { useState } from 'react';
import { SectionTitle } from '../styles/CommonStyles';
import {
  VolunteerContainer,
  VolunteerGrid,
  RoleCard,
  RoleHeader,
  RoleBody,
  RoleDetail,
  ApplyButton
} from '../styles/VolunteerStyles';

// Import directly without using default
const volunteerRoles = require('../data/volunteerRoles');

export default function VolunteerSection() {
  // Show only first 3 roles initially, with option to show more
  const [showAllRoles, setShowAllRoles] = useState(false);
  const displayedRoles = showAllRoles ? volunteerRoles : volunteerRoles.slice(0, 3);
  
  // Handle pre-fill form when a role is selected
  const handleRoleSelect = (role) => {
    // Scroll to contact form
    document.getElementById('contact-form').scrollIntoView({ behavior: 'smooth' });
    
    // Pre-select volunteering in the dropdown
    const interestSelect = document.getElementById('interest');
    if (interestSelect) interestSelect.value = 'volunteering';
    
    // Add role details to message
    const messageField = document.getElementById('message');
    if (messageField) {
      messageField.value = `I'm interested in volunteering as a ${role.title}. ${
        role.timeCommitment ? `\nI understand the time commitment is: ${role.timeCommitment}.` : ''
      }`;
    }
  };
  
  return (
    <>
      <SectionTitle>Volunteer</SectionTitle>
      <p>
        Volunteering with MITRA is a rewarding experience that allows you to make a direct impact 
        on the lives of children and communities. We welcome volunteers with diverse skills and 
        backgrounds who share our passion for education and community development.
      </p>
      
      <VolunteerContainer>
        <VolunteerGrid>
          {displayedRoles.map((role, index) => (
            <RoleCard key={index}>
              <RoleHeader>
                <h3>{role.title}</h3>
                <p>{role.subtitle}</p>
              </RoleHeader>
              
              <RoleBody>
                <RoleDetail>
                  <h4>Responsibilities:</h4>
                  <ul>
                    {role.responsibilities.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </RoleDetail>
                
                <RoleDetail>
                  <h4>Time Commitment:</h4>
                  <p>{role.timeCommitment}</p>
                </RoleDetail>
                
                <RoleDetail>
                  <h4>Skills Needed:</h4>
                  <p>{role.skills}</p>
                </RoleDetail>
                
                <ApplyButton 
                  href="#contact-form"
                  onClick={(e) => {
                    e.preventDefault();
                    handleRoleSelect(role);
                  }}
                >
                  Apply Now
                </ApplyButton>
              </RoleBody>
            </RoleCard>
          ))}
        </VolunteerGrid>
        
        {!showAllRoles && volunteerRoles.length > 3 && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button 
              onClick={() => setShowAllRoles(true)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                border: `1px solid ${props => props.theme?.colors?.primary || '#1E8449'}`,
                color: props => props.theme?.colors?.primary || '#1E8449',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              Show More Volunteer Roles
            </button>
          </div>
        )}
      </VolunteerContainer>
    </>
  );
}