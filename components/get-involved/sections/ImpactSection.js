// components/get-involved/sections/ImpactSection.js
import { useState } from 'react';
import Image from 'next/image';
import { SectionTitle } from '../styles/CommonStyles';
import {
  StoriesContainer,
  Story,
  StoryImage,
  StoryContent,
  Testimonial,
  TestimonialAuthor
} from '../styles/ImpactStyles';

// Define the stories directly within this file to avoid import issues
const impactStories = [
  {
    title: "Meera's Journey to Education",
    content: [
      "Meera, a 12-year-old from a remote village, had limited access to education. Her parents, both daily wage laborers, couldn't afford to send her to school beyond the 5th grade. Through MITRA's scholarship program, Meera was able to continue her education.",
      "Today, she excels in mathematics and dreams of becoming an engineer. With continued support, she is on track to be the first person in her family to attend college."
    ],
    testimonial: "Education has opened up a world of possibilities for me. I never thought I would be able to continue school, but thanks to MITRA, I can pursue my dreams.",
    testimonialAuthor: "Meera",
    image: "/images/story1.jpg"
  },
  {
    title: "Transforming a Community Through Education",
    content: [
      "Ramnagar village faced numerous challenges: low literacy rates, limited employment opportunities, and poor access to basic services. MITRA established a learning center in the village five years ago, providing quality education to children and skill development programs for adults.",
      "The results have been transformative. Literacy rates have increased by 40%, more young people are pursuing higher education, and several successful micro-enterprises have been established by community members who received training through our programs."
    ],
    testimonial: "Our village has been transformed. Children who once had no hope for education are now dreaming big, and our community has become more self-sufficient.",
    testimonialAuthor: "Ramesh, Village Elder",
    image: "/images/story2.jpg"
  },
  {
    title: "Teaching Skills for Sustainability",
    content: [
      "In the agricultural community of Sundarpur, traditional farming methods were becoming less viable due to changing climate conditions. MITRA introduced sustainable farming workshops and entrepreneurship training for farmers and their families.",
      "Now, farmers like Gopal have diversified their crops and adopted sustainable practices that have increased their yields while reducing water usage. Several women in the community have started small businesses selling organic produce and handicrafts."
    ],
    testimonial: "The training changed my perspective on farming. I now understand how to work with nature rather than against it, and my family's income has doubled as a result.",
    testimonialAuthor: "Gopal, Farmer",
    image: "/images/story3.jpg"
  }
];

export default function ImpactSection() {
  // Show only a subset of stories for performance, with option to show more
  const [displayCount, setDisplayCount] = useState(2);
  const displayedStories = impactStories.slice(0, displayCount);
  
  return (
    <>
      <SectionTitle>Impact Stories</SectionTitle>
      <p>
        Every donation, volunteer hour, and sponsorship makes a real difference in the lives 
        of the children and communities we serve. Here are just a few stories that showcase 
        the impact of your support.
      </p>
      
      <StoriesContainer>
        {displayedStories.map((story, index) => (
          <Story key={index}>
            <StoryImage>
              <Image 
                src={story.image} 
                alt={story.title} 
                layout="fill"
                objectFit="cover"
              />
            </StoryImage>
            
            <StoryContent>
              <h3>{story.title}</h3>
              {story.content.map((paragraph, i) => (
                <p key={i}>{paragraph}</p>
              ))}
              
              <Testimonial>
                "{story.testimonial}"
                <TestimonialAuthor>- {story.testimonialAuthor}</TestimonialAuthor>
              </Testimonial>
            </StoryContent>
          </Story>
        ))}
        
        {displayCount < impactStories.length && (
          <div style={{ textAlign: 'center', marginTop: '1rem' }}>
            <button 
              onClick={() => setDisplayCount(impactStories.length)}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: 'transparent',
                border: '1px solid #1E8449',
                color: '#1E8449',
                borderRadius: '4px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease'
              }}
            >
              Show More Stories
            </button>
          </div>
        )}
      </StoriesContainer>
    </>
  );
}