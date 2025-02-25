// index.js
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';

const HeroSection = styled.section`
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/images/hero.jpg') no-repeat center center;
  background-size: cover;
  height: 80vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  padding: 0 1rem;
`;

const HeroContent = styled.div`
  max-width: 800px;
`;

const HeroTitle = styled.h1`
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  color: white;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.25rem;
  margin-bottom: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 1.1rem;
  }
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    flex-direction: column;
    width: 100%;
    max-width: 300px;
    margin: 0 auto;
  }
`;

const Button = styled.a`
  display: inline-block;
  padding: 0.75rem 2rem;
  background-color: ${props => props.primary ? props.theme.colors.primary : 'transparent'};
  color: white;
  border: 2px solid ${props => props.primary ? props.theme.colors.primary : 'white'};
  border-radius: ${props => props.theme.borderRadius.medium};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.primary ? '#166638' : props.theme.colors.secondary};
    border-color: ${props => props.primary ? '#166638' : props.theme.colors.secondary};
    transform: translateY(-3px);
  }
`;

const Section = styled.section`
  padding: 5rem 0;
  background-color: ${props => props.background || props.theme.colors.white};
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
`;

const SectionTitle = styled.h2`
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 3rem;
  position: relative;
  
  &:after {
    content: '';
    position: absolute;
    bottom: -15px;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 3px;
    background-color: ${props => props.theme.colors.secondary};
  }
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    font-size: 2rem;
  }
`;

const AboutContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const ImageContainer = styled.div`
  position: relative;
  height: 400px;
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
  box-shadow: ${props => props.theme.shadows.large};
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.5rem;
  margin-top: 4rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const StatCard = styled.div`
  background-color: white;
  padding: 1.5rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
  box-shadow: ${props => props.theme.shadows.small};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const StatNumber = styled.h3`
  font-size: 2.5rem;
  color: ${props => props.theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const FeaturesContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: ${props => props.theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.div`
  background-color: white;
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  text-align: center;
  box-shadow: ${props => props.theme.shadows.small};
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: ${props => props.theme.shadows.medium};
  }
`;

const IconContainer = styled.div`
  width: 70px;
  height: 70px;
  border-radius: 50%;
  background-color: ${props => props.theme.colors.primary}10;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem;
  
  i {
    font-size: 1.8rem;
    color: ${props => props.theme.colors.primary};
  }
`;

const SchoolSection = styled.div`
  margin-top: 4rem;
  background-color: ${props => props.theme.colors.primary}05;
  padding: 2rem;
  border-radius: ${props => props.theme.borderRadius.medium};
  box-shadow: ${props => props.theme.shadows.small};
`;

const SchoolContent = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 2rem;
  align-items: center;
  
  @media (max-width: ${props => props.theme.breakpoints.md}) {
    grid-template-columns: 1fr;
  }
`;

const SchoolImageContainer = styled.div`
  position: relative;
  height: 300px;
  border-radius: ${props => props.theme.borderRadius.medium};
  overflow: hidden;
`;

export default function Home() {
  return (
    <>
      <HeroSection>
        <HeroContent>
          <HeroTitle>Empowering Rural Communities through Education</HeroTitle>
          <HeroSubtitle>Building a brighter future through knowledge, compassion, and sustainable development</HeroSubtitle>
          <ButtonGroup>
            <Link href="/get-involved" passHref legacyBehavior>
              <Button primary>Donate Now</Button>
            </Link>
            <Link href="/get-involved#volunteer" passHref legacyBehavior>
              <Button>Volunteer</Button>
            </Link>
          </ButtonGroup>
        </HeroContent>
      </HeroSection>

      <Section>
        <Container>
          <SectionTitle>About MITRA</SectionTitle>
          <AboutContent>
            <div>
              <p>
                MITRA (Movement for Inclusive Transformation through Rural Advancement) is a non-profit organization 
                dedicated to empowering rural communities through quality education, skill development, and sustainable 
                initiatives. For over 10 years, we have been working tirelessly to create positive change in rural areas.
              </p>
              <p>
                Our mission is to bridge the urban-rural divide by providing equal opportunities for education and development. 
                We believe in the power of knowledge to transform lives and build self-sufficient communities.
              </p>
              <p>
                Through our various programs, we have successfully reached thousands of children and adults, 
                helping them realize their potential and work towards a better future.
              </p>
            </div>
            <ImageContainer>
              <Image src="/images/about-mitra.jpg" alt="MITRA Activities" layout="fill" objectFit="cover" />
            </ImageContainer>
          </AboutContent>

          <StatsContainer>
            <StatCard>
              <StatNumber>10+</StatNumber>
              <p>Years of Service</p>
            </StatCard>
            <StatCard>
              <StatNumber>1000+</StatNumber>
              <p>Students Educated</p>
            </StatCard>
            <StatCard>
              <StatNumber>20+</StatNumber>
              <p>Villages Reached</p>
            </StatCard>
            <StatCard>
              <StatNumber>50+</StatNumber>
              <p>Volunteers</p>
            </StatCard>
          </StatsContainer>
        </Container>
      </Section>

      <Section background={props => `${props.theme.colors.background}`}>
        <Container>
          <SectionTitle>Our Initiatives</SectionTitle>
          <FeaturesContainer>
            <FeatureCard>
              <IconContainer>
                <i className="fas fa-book"></i>
              </IconContainer>
              <h3>Quality Education</h3>
              <p>Providing quality education to children from underprivileged backgrounds through our school and learning centers.</p>
            </FeatureCard>
            <FeatureCard>
              <IconContainer>
                <i className="fas fa-hands-helping"></i>
              </IconContainer>
              <h3>Community Development</h3>
              <p>Engaging with communities to identify their needs and implementing sustainable solutions.</p>
            </FeatureCard>
            <FeatureCard>
              <IconContainer>
                <i className="fas fa-cogs"></i>
              </IconContainer>
              <h3>Skill Development</h3>
              <p>Training youth and adults in various skills to enhance their employability and entrepreneurship abilities.</p>
            </FeatureCard>
          </FeaturesContainer>
        </Container>
      </Section>

      <Section>
        <Container>
          <SectionTitle>Sandeepani Gyan Kunj</SectionTitle>
          <SchoolSection id="sandeepani">
            <SchoolContent>
              <SchoolImageContainer>
                <Image src="/images/school-building.jpg" alt="Sandeepani Gyan Kunj School" layout="fill" objectFit="cover" />
              </SchoolImageContainer>
              <div>
                <h3>Our School</h3>
                <p>
                  Sandeepani Gyan Kunj is a school run by MITRA in a rural area, providing education to students who cannot afford 
                  traditional schooling. The school focuses on holistic development through a balanced curriculum that includes 
                  academics, arts, sports, and life skills.
                </p>
                <p>
                  With dedicated teachers and modern teaching methodologies, we ensure that our students receive an education that 
                  prepares them for the future while staying rooted in their cultural values.
                </p>
                <p>
                  The school regularly organizes events, workshops, and other programs to enhance the learning experience and 
                  provide entertainment for the students.
                </p>
                <Link href="/about#sandeepani" passHref legacyBehavior>
                  <Button primary style={{ marginTop: '1rem' }}>Learn More</Button>
                </Link>
              </div>
            </SchoolContent>
          </SchoolSection>
        </Container>
      </Section>
    </>
  );
}