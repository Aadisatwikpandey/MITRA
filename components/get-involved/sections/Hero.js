// components/get-involved/sections/Hero.js
import styled from 'styled-components';

const HeroSection = styled.header`
  background: linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url('/images/get-involved-hero.jpg') no-repeat center center;
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

  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 0 2rem;
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin: 1rem 0 1.5rem;
  
  @media (max-width: 768px) {
    font-size: 1.1rem;
  }
`;

export default function Hero() {
  return (
    <HeroSection>
      <HeroContent>
        <PageTitle>Get Involved</PageTitle>
        <HeroSubtitle>
          Join us in our mission to create a better future through education and community development
        </HeroSubtitle>
      </HeroContent>
    </HeroSection>
  );
}