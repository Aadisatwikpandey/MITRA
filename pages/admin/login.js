// pages/admin/login.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { FaEnvelope, FaLock, FaExclamationTriangle } from 'react-icons/fa';
import { authService } from '../../lib/authService';
import styles from '../../styles/admin/Login.module.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  // Check if user is already authenticated
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = await authService.getCurrentUser();
        if (user) {
          // If already authenticated, redirect to admin dashboard
          router.replace('/admin/dashboard');
        }
      } catch (error) {
        console.error('Auth check error:', error);
      }
    };
    
    checkAuth();
  }, [router]);
  
  // Check for error query param
  useEffect(() => {
    if (router.query.error === 'unauthorized') {
      setError('You do not have permission to access the admin area');
    }
  }, [router.query]);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      // Sign in with Firebase Auth
      await authService.signIn(email, password);
      
      // Redirect to admin dashboard
      router.push('/admin/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      
      // Handle different Firebase auth errors
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Invalid email or password');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed login attempts. Please try again later.');
      } else {
        setError('Failed to login. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address to reset password');
      return;
    }
    
    try {
      await authService.sendPasswordResetEmail(email);
      alert('Password reset email sent! Please check your inbox.');
    } catch (err) {
      console.error('Password reset error:', err);
      
      if (err.code === 'auth/user-not-found') {
        setError('No account found with this email address');
      } else {
        setError('Failed to send password reset email. Please try again.');
      }
    }
  };
  
  return (
    <>
      <Head>
        <title>Admin Login | MITRA</title>
      </Head>
      
      <div className={styles.container}>
        <div className={styles.loginCard}>
          <div className={styles.logo}>
            {/* Logo or icon */}
            <div className={styles.logoImage}>
              {/* You can replace this with your actual logo */}
              <div className={styles.logoPlaceholder}>M</div>
            </div>
            <div className={styles.logoText}>MITRA Admin</div>
          </div>
          
          <h1 className={styles.title}>Sign in to your account</h1>
          
          {error && (
            <div className={styles.errorAlert}>
              <FaExclamationTriangle />
              <span>{error}</span>
            </div>
          )}
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="email">
                Email Address
              </label>
              <div className={styles.inputWithIcon}>
                <FaEnvelope className={styles.inputIcon} />
                <input
                  type="email"
                  id="email"
                  className={styles.formInput}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="password">
                Password
              </label>
              <div className={styles.inputWithIcon}>
                <FaLock className={styles.inputIcon} />
                <input
                  type="password"
                  id="password"
                  className={styles.formInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <button
              type="button"
              className={styles.forgotPassword}
              onClick={handleForgotPassword}
              disabled={loading}
            >
              Forgot password?
            </button>
          </form>
        </div>
        
        <Link href="/" className={styles.backToSite}>
          ← Back to website
        </Link>
      </div>
    </>
  );
}