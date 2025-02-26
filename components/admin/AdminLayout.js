// components/admin/AdminLayout.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { 
  FaChevronLeft, 
  FaChevronRight, 
  FaTachometerAlt, 
  FaNewspaper, 
  FaUsers, 
  FaCog, 
  FaSignOutAlt, 
  FaUser, 
  FaBars, 
  FaCalendarAlt,
  FaChartBar
} from 'react-icons/fa';
import { authService } from '../../lib/authService';
import withAuth from './withAuth';
import styles from '../../styles/admin/AdminLayout.module.css';

const AdminLayout = ({ children, user }) => {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [userName, setUserName] = useState('');
  const [userInitial, setUserInitial] = useState('');
  
  // Process user data
  useEffect(() => {
    if (user) {
      // Get display name or email
      const displayName = user.displayName || user.email || 'Admin';
      setUserName(displayName);
      
      // Get first initial for avatar
      const initial = displayName.charAt(0).toUpperCase();
      setUserInitial(initial);
    }
  }, [user]);
  
  // Handle sidebar toggle
  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };
  
  // Handle mobile menu toggle
  const toggleMobileMenu = () => {
    setMobileOpen(!mobileOpen);
  };
  
  // Handle dropdown toggle
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest(`.${styles.userMenu}`)) {
        setDropdownOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [dropdownOpen, styles.userMenu]);
  
  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [router.pathname]);
  
  // Handle logout
  const handleLogout = async () => {
    try {
      await authService.signOut();
      router.replace('/admin/login');
    } catch (error) {
      console.error('Logout error:', error);
      alert('Failed to logout. Please try again.');
    }
  };
  
  // Check if a link is active
  const isActive = (path) => {
    if (path === '/admin/dashboard' && router.pathname === '/admin/dashboard') {
      return true;
    }
    if (path !== '/admin/dashboard' && router.pathname.startsWith(path)) {
      return true;
    }
    return false;
  };
  
  return (
    <div className={styles.layoutContainer}>
      {/* Sidebar */}
      <aside 
        className={`${styles.sidebar} ${collapsed ? styles.sidebarCollapsed : ''} ${
          mobileOpen ? styles.sidebarVisible : ''
        }`}
      >
        <div className={styles.logo}>
          <div className={styles.logoImage}>
            <FaTachometerAlt color="white" size={24} />
          </div>
          <div className={`${styles.logoText} ${collapsed ? styles.logoTextHidden : ''}`}>
            MITRA Admin
          </div>
        </div>
        
        <button 
          className={styles.toggleButton} 
          onClick={toggleSidebar}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <FaChevronRight size={10} /> : <FaChevronLeft size={10} />}
        </button>
        
        <nav>
          <ul className={styles.navMenu}>
            <li className={styles.navItem}>
              <Link 
                href="/admin/dashboard" 
                className={`${styles.navLink} ${isActive('/admin/dashboard') ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navIcon}>
                  <FaTachometerAlt />
                </span>
                <span className={`${styles.navLabel} ${collapsed ? styles.navLabelHidden : ''}`}>
                  Dashboard
                </span>
              </Link>
            </li>
            
            <li className={styles.navItem}>
              <Link 
                href="/admin/news" 
                className={`${styles.navLink} ${isActive('/admin/news') ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navIcon}>
                  <FaNewspaper />
                </span>
                <span className={`${styles.navLabel} ${collapsed ? styles.navLabelHidden : ''}`}>
                  News
                </span>
              </Link>
            </li>
            
            <li className={styles.navItem}>
              <Link 
                href="/admin/events" 
                className={`${styles.navLink} ${isActive('/admin/events') ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navIcon}>
                  <FaCalendarAlt />
                </span>
                <span className={`${styles.navLabel} ${collapsed ? styles.navLabelHidden : ''}`}>
                  Events
                </span>
              </Link>
            </li>
            
            <li className={styles.navItem}>
              <Link 
                href="/admin/users" 
                className={`${styles.navLink} ${isActive('/admin/users') ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navIcon}>
                  <FaUsers />
                </span>
                <span className={`${styles.navLabel} ${collapsed ? styles.navLabelHidden : ''}`}>
                  Users
                </span>
              </Link>
            </li>
            
            <li className={styles.navItem}>
              <Link 
                href="/admin/analytics" 
                className={`${styles.navLink} ${isActive('/admin/analytics') ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navIcon}>
                  <FaChartBar />
                </span>
                <span className={`${styles.navLabel} ${collapsed ? styles.navLabelHidden : ''}`}>
                  Analytics
                </span>
              </Link>
            </li>
            
            <li className={styles.navItem}>
              <Link 
                href="/admin/settings" 
                className={`${styles.navLink} ${isActive('/admin/settings') ? styles.navLinkActive : ''}`}
              >
                <span className={styles.navIcon}>
                  <FaCog />
                </span>
                <span className={`${styles.navLabel} ${collapsed ? styles.navLabelHidden : ''}`}>
                  Settings
                </span>
              </Link>
            </li>
          </ul>
        </nav>
      </aside>
      
      {/* Main Content */}
      <main className={`${styles.mainContent} ${collapsed ? styles.mainContentExpanded : ''}`}>
        <header className={styles.header}>
          <button 
            className={styles.menuButton} 
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
          >
            <FaBars />
          </button>
          
          <div className={styles.headerRight}>
            <div className={styles.userMenu}>
              <button 
                className={styles.userButton}
                onClick={toggleDropdown}
                aria-expanded={dropdownOpen}
                aria-haspopup="true"
              >
                <div className={styles.avatar}>
                  {userInitial}
                </div>
                <span className={styles.userName}>{userName}</span>
              </button>
              
              <div className={`${styles.dropdown} ${dropdownOpen ? styles.dropdownVisible : ''}`}>
                <Link href="/admin/profile" className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>
                    <FaUser />
                  </span>
                  <span>My Profile</span>
                </Link>
                
                <Link href="/admin/settings" className={styles.dropdownItem}>
                  <span className={styles.dropdownIcon}>
                    <FaCog />
                  </span>
                  <span>Settings</span>
                </Link>
                
                <div className={styles.separator}></div>
                
                <button 
                  className={styles.logoutButton}
                  onClick={handleLogout}
                >
                  <span className={styles.dropdownIcon}>
                    <FaSignOutAlt />
                  </span>
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        
        <div>{children}</div>
      </main>
    </div>
  );
};

export default withAuth(AdminLayout);