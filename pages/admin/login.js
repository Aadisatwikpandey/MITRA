// pages/admin/login.js
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { authService } from '../../lib/authService';
import styles from '../../styles/admin/Login.module.css';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
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
      // In production, this would call Firebase Auth
      // For development, simulate login
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check for demo credentials
      if (email === 'admin@mitra.org' && password === 'password') {
        // Redirect to admin dashboard
        router.push('/admin/news');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Failed to login. Please try again.');
    } finally {
      setLoading(false);
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
            {/* If you have a logo image */}
            {/* <Image src="/images/mitra-logo.png" alt="MITRA Logo" width={80} height={80} /> */}
            <div className={styles.logoText}>MITRA Admin</div>
          </div>
          
          <h1 className={styles.title}>Sign in to your account</h1>
          
          {error && <p className={styles.error}>{error}</p>}
          
          <form className={styles.form} onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="email">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className={styles.formInput}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className={styles.formGroup}>
              <label className={styles.formLabel} htmlFor="password">
                Password
              </label>
              <input
                type="password"
                id="password"
                className={styles.formInput}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <button
              type="submit"
              className={styles.submitButton}
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            
            <Link href="/admin/forgot-password" className={styles.forgotPassword}>
              Forgot password?
            </Link>
          </form>
        </div>
        
        <Link href="/" className={styles.backToSite}>
          ← Back to website
        </Link>
        
        {/* Development note that would be removed in production */}
        <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: '#666', textAlign: 'center' }}>
          <p>For development: use email <strong>admin@mitra.org</strong> and password <strong>password</strong></p>
        </div>
      </div>
    </>
  );
}