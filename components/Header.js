// Enhanced Header.js with smoother mobile menu animations and better state management
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';

const HeaderContainer = styled.header`
  background: ${props => props.$scrolled 
    ? props.theme.colors.white 
    : 'rgba(0, 0, 0, 0.7)'}; /* Darker background when not scrolled */
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  transition: all 0.3s ease;
  box-shadow: ${props => props.$scrolled ? props.theme.shadows.small : 'none'};
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  max-width: 1200px;
  margin: 0 auto;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    padding: 0.75rem 1rem;
  }
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
`;

const LogoText = styled.span`
  color: ${props => props.$scrolled ? props.theme.colors.primary : 'white'};
  font-size: 1.5rem;
  font-weight: 700;
  font-family: ${props => props.theme.fonts.heading};
  margin-left: 0.5rem;
  transition: all 0.3s ease;
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    position: fixed;
    top: 0;
    right: ${props => (props.$isOpen ? '0' : '-100%')};
    width: 280px;
    height: 100vh;
    flex-direction: column;
    background: ${props => props.theme.colors.white};
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.1);
    padding: 5rem 2rem 2rem;
    transition: right 0.3s ease-in-out;
    align-items: flex-start;
    z-index: 1000;
  }
`;

// Style the Link component directly
const NavLink = styled(Link)`
  color: ${props => props.$scrolled ? props.theme.colors.text : 'white'};
  margin: 0 1rem;
  font-weight: 600;
  position: relative;
  transition: all 0.3s ease;
  text-decoration: none;

  &:after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -4px;
    left: 0;
    background-color: ${props => props.theme.colors.secondary};
    transition: width 0.3s ease;
  }

  &:hover {
    color: ${props => props.theme.colors.secondary};
    
    &:after {
      width: 100%;
    }
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    color: ${props => props.theme.colors.text};
    margin: 0.8rem 0;
    padding: 0.5rem 0;
    width: 100%;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);

    &:hover {
      transform: translateX(5px);
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.$scrolled ? props.theme.colors.text : 'white'};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 1100;

  &:hover {
    color: ${props => props.theme.colors.secondary};
  }

  @media (max-width: ${props => props.theme.breakpoints.md}) {
    display: block;
  }
`;

const LogoLink = styled(Link)`
  display: flex;
  align-items: center;
  text-decoration: none;
`;

// Add a mobile overlay for when menu is open
const MobileOverlay = styled.div`
  display: ${props => props.$isOpen ? 'block' : 'none'};
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  opacity: ${props => props.$isOpen ? 1 : 0};
  transition: opacity 0.3s ease-in-out;
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: none;
  border: none;
  color: ${props => props.theme.colors.text};
  font-size: 1.5rem;
  cursor: pointer;
  z-index: 1100;
  
  &:hover {
    color: ${props => props.theme.colors.secondary};
  }
  
  @media (min-width: ${props => props.theme.breakpoints.md}) {
    display: none;
  }
`;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle click outside to close menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Close mobile menu when clicking outside
  const closeMobileMenu = () => {
    if (isOpen) {
      setIsOpen(false);
    }
  };

  return (
    <>
      <HeaderContainer $scrolled={scrolled}>
        <Nav>
          <Logo>
            <LogoLink href="/">
              <Image 
                src="/images/mitra-logo.png" 
                alt="MITRA Logo" 
                width={40} 
                height={40} 
                style={{ 
                  filter: !scrolled ? 'brightness(1.2)' : 'none' // Make logo brighter on dark background
                }} 
              />
              <LogoText $scrolled={scrolled}>MITRA</LogoText>
            </LogoLink>
          </Logo>
          <MenuButton $scrolled={scrolled} onClick={toggleMenu} aria-label="Toggle menu">
            {isOpen ? '✕' : '☰'}
          </MenuButton>
          <NavLinks ref={menuRef} $isOpen={isOpen}>
            <CloseButton onClick={closeMobileMenu} aria-label="Close menu">✕</CloseButton>
            <NavLink href="/" $scrolled={scrolled} onClick={closeMobileMenu}>Home</NavLink>
            <NavLink href="/about" $scrolled={scrolled} onClick={closeMobileMenu}>About Us</NavLink>
            <NavLink href="/get-involved" $scrolled={scrolled} onClick={closeMobileMenu}>Get Involved</NavLink>
            <NavLink href="/news-events" $scrolled={scrolled} onClick={closeMobileMenu}>News & Events</NavLink>
            <NavLink href="/gallery" $scrolled={scrolled} onClick={closeMobileMenu}>Gallery</NavLink>
            <NavLink href="/contact" $scrolled={scrolled} onClick={closeMobileMenu}>Contact Us</NavLink>
          </NavLinks>
        </Nav>
      </HeaderContainer>
      
      {/* Mobile overlay to close menu when clicking outside */}
      <MobileOverlay $isOpen={isOpen} onClick={closeMobileMenu} />
    </>
  );
}