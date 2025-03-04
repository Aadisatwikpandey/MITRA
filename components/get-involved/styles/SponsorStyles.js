// components/get-involved/styles/SponsorStyles.js
import styled from 'styled-components';

export const SponsorsContainer = styled.div`
  margin-top: 3rem;
`;

export const SponsorTiersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

export const TierCard = styled.div`
  background-color: white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  
  &:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }
`;

export const TierHeader = styled.div`
  background-color: ${props => 
    props.tier === 'gold' ? '#f9a825' : 
    props.tier === 'silver' ? '#9e9e9e' : 
    props.tier === 'bronze' ? '#8d6e63' : 
    props.theme.colors.primary};
  color: white;
  padding: 1.5rem;
  text-align: center;
`;

export const TierTitle = styled.h3`
  margin: 0;
  color: white;
  font-size: 1.5rem;
`;

export const TierPrice = styled.div`
  font-size: 2rem;
  font-weight: 700;
  margin: 1rem 0;
`;

export const TierDescription = styled.p`
  margin: 0;
  font-size: 0.9rem;
  opacity: 0.9;
`;

export const TierBody = styled.div`
  padding: 1.5rem;
  flex-grow: 1;
  display: flex;
  flex-direction: column;
`;

export const TierBenefits = styled.ul`
  margin: 0 0 1.5rem;
  padding-left: 1.5rem;
  flex-grow: 1;
  
  li {
    margin-bottom: 0.75rem;
    position: relative;
    
    &::marker {
      color: ${props => 
        props.tier === 'gold' ? '#f9a825' : 
        props.tier === 'silver' ? '#9e9e9e' : 
        props.tier === 'bronze' ? '#8d6e63' : 
        props.theme.colors.primary};
    }
  }
`;

export const ContactButton = styled.a`
  display: block;
  text-align: center;
  padding: 0.75rem 1rem;
  background-color: ${props => 
    props.tier === 'gold' ? '#f9a825' : 
    props.tier === 'silver' ? '#9e9e9e' : 
    props.tier === 'bronze' ? '#8d6e63' : 
    props.theme.colors.primary};
  color: white;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  
  &:hover {
    transform: translateY(-2px);
    opacity: 0.9;
  }
`;