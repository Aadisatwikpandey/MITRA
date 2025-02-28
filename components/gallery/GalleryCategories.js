// components/gallery/GalleryCategories.js - Fixed boolean props
import styled from 'styled-components';

const CategoriesContainer = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid #eee;
`;

const CategoryButton = styled.button`
  background-color: ${props => props.isActive ? props.theme.colors.primary : '#f5f5f5'};
  color: ${props => props.isActive ? 'white' : props.theme.colors.text};
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 30px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.isActive ? props.theme.colors.primary : '#e0e0e0'};
    transform: translateY(-2px);
  }
`;

const CategoriesTitle = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 1.5rem;
  color: ${props => props.theme.colors.primary};
`;

const GalleryCategories = ({ categories = [], activeCategory = 'all', onCategoryChange }) => {
  // Add "All" category to the beginning
  const allCategories = [
    { id: 'all', name: 'All Photos' },
    ...categories
  ];
  
  const handleCategoryClick = (categoryId) => {
    if (onCategoryChange) {
      onCategoryChange(categoryId);
    }
  };
  
  return (
    <div>
      <CategoriesTitle>Browse Our Gallery</CategoriesTitle>
      <CategoriesContainer>
        {allCategories.map(category => (
          <CategoryButton
            key={category.id}
            isActive={activeCategory === category.id}
            onClick={() => handleCategoryClick(category.id)}
          >
            {category.name}
          </CategoryButton>
        ))}
      </CategoriesContainer>
    </div>
  );
};

export default GalleryCategories;