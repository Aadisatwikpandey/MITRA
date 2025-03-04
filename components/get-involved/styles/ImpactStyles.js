// components/get-involved/styles/ImpactStyles.js
import styled from 'styled-components';

export const StoriesContainer = styled.div`
  margin-top: 3rem;
`;

export const Story = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 3rem;
  margin-bottom: 3rem;
  align-items: center;
  
  &:nth-child(even) {
    direction: rtl;
    
    > div {
      direction: ltr;
    }
  }
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
    direction: ltr !important;
  }
`;

export const StoryImage = styled.div`
  position: relative;
  height: 400px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  
  @media (max-width: 768px) {
    height: 300px;
  }
`;

export const StoryContent = styled.div`
  h3 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: ${props => props.theme.colors.primary};
  }
  
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }
`;

export const Testimonial = styled.blockquote`
  font-style: italic;
  padding: 1rem 1.5rem;
  background-color: #f9f9f9;
  border-left: 4px solid ${props => props.theme.colors.secondary};
  margin: 1.5rem 0;
`;

export const TestimonialAuthor = styled.cite`
  display: block;
  margin-top: 0.5rem;
  font-style: normal;
  font-weight: 600;
`;