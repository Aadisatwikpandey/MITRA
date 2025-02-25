// Header.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import Image from 'next/image';

const HeaderContainer = styled.header`
  background: ${props => props.$scrolled ? props.theme.colors.white : 'transparent'};
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
  color: ${props => props.$scrolled ? props.theme.colors.primary : props.theme.colors.white};
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
    display: ${props => (props.$isOpen ? 'flex' : 'none')};
    flex-direction: column;
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: ${props => props.theme.colors.white};
    box-shadow: ${props => props.theme.shadows.medium};
    padding: 1rem 0;
  }
`;

// Style the Link component directly
const NavLink = styled(Link)`
  color: ${props => props.$scrolled ? props.theme.colors.text : props.theme.colors.secondary};
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
    margin: 0.5rem 0;
    padding: 0.5rem 2rem;
    width: 100%;
    text-align: center;

    &:hover {
      background-color: ${props => props.theme.colors.background};
    }
  }
`;

const MenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: ${props => props.$scrolled ? props.theme.colors.text : props.theme.colors.white};
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;

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

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <HeaderContainer $scrolled={scrolled}>
      <Nav>
        <Logo>
          <LogoLink href="/">
            <Image src="/images/mitra-logo.png" alt="MITRA Logo" width={40} height={40} />
            <LogoText $scrolled={scrolled}>MITRA</LogoText>
          </LogoLink>
        </Logo>
        <MenuButton $scrolled={scrolled} onClick={toggleMenu}>
          {isOpen ? '✕' : '☰'}
        </MenuButton>
        <NavLinks $isOpen={isOpen}>
          <NavLink href="/" $scrolled={scrolled}>Home</NavLink>
          <NavLink href="/about" $scrolled={scrolled}>About Us</NavLink>
          <NavLink href="/get-involved" $scrolled={scrolled}>Get Involved</NavLink>
          <NavLink href="/news-events" $scrolled={scrolled}>News & Events</NavLink>
          <NavLink href="/gallery" $scrolled={scrolled}>Gallery</NavLink>
          <NavLink href="/contact" $scrolled={scrolled}>Contact Us</NavLink>
        </NavLinks>
      </Nav>
    </HeaderContainer>
  );
}