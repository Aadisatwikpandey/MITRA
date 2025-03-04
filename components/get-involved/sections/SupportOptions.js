// components/get-involved/sections/SupportOptions.js
import { FaHandHoldingHeart, FaUsers, FaRegBuilding } from 'react-icons/fa';
import { SectionTitle, IntroText } from '../styles/CommonStyles';
import styled from 'styled-components';

const SupportOptionsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const SupportCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  text-align: center;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

const CardContent = styled.div`
  padding: 2rem;
`;

const IconContainer = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background-color: rgba(30, 132, 73, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  
  svg {
    font-size: 2.5rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const CardTitle = styled.h3`
  font-size: 1.5rem;
  margin-bottom: 1rem;
  color: ${props => props.theme.colors.primary};
`;

const CardText = styled.p`
  color: ${props => props.theme.colors.text};
  margin-bottom: 1.5rem;
  min-height: 80px;
`;

const CardButton = styled.a`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: ${props => props.theme.colors.primary};
  color: white;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    background-color: #166638;
    transform: translateY(-2px);
  }
`;

export default function SupportOptions() {
  return (
    <>
      <SectionTitle>How You Can Help</SectionTitle>
      <IntroText>
        At MITRA, we believe in the collective power of community. There are many ways you can 
        contribute to our mission of empowering rural communities through education and sustainable 
        development. Whether you choose to donate, volunteer, or spread the word, your support 
        makes a significant difference in the lives of those we serve.
      </IntroText>
      
      <SupportOptionsGrid>
        <SupportCard>
          <CardContent>
            <IconContainer>
              <FaHandHoldingHeart />
            </IconContainer>
            <CardTitle>Donate</CardTitle>
            <CardText>
              Your financial contribution directly supports our educational programs and 
              community initiatives, helping us reach more children and families.
            </CardText>
            <CardButton href="#donate">Donate Now</CardButton>
          </CardContent>
        </SupportCard>
        
        <SupportCard>
          <CardContent>
            <IconContainer>
              <FaUsers />
            </IconContainer>
            <CardTitle>Volunteer</CardTitle>
            <CardText>
              Share your time and skills to make a meaningful impact. We have various 
              volunteer opportunities both on-site and remotely.
            </CardText>
            <CardButton href="#volunteer">Join Us</CardButton>
          </CardContent>
        </SupportCard>
        
        <SupportCard>
          <CardContent>
            <IconContainer>
              <FaRegBuilding />
            </IconContainer>
            <CardTitle>Sponsor</CardTitle>
            <CardText>
              Partner with us as a corporate sponsor to support our mission while 
              enhancing your company's social responsibility initiatives.
            </CardText>
            <CardButton href="#sponsor">Learn More</CardButton>
          </CardContent>
        </SupportCard>
      </SupportOptionsGrid>
    </>
  );
}