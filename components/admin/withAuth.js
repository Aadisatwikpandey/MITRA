// components/admin/withAuth.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { authService } from '../../lib/authService';
import LoadingScreen from './LoadingScreen';

const withAuth = (WrappedComponent) => {
  const WithAuth = (props) => {
    const router = useRouter();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
      const checkAuth = async () => {
        try {
          // Check if user is authenticated
          const currentUser = await authService.getCurrentUser();
          
          if (!currentUser) {
            // Redirect to login if not authenticated
            router.replace('/admin/login');
            return;
          }
          
          // Check if user is admin (optional additional check)
          const isAdmin = await authService.isAdmin(currentUser);
          
          if (!isAdmin) {
            // Redirect to login if not admin
            router.replace('/admin/login?error=unauthorized');
            return;
          }
          
          // Set user and continue
          setUser(currentUser);
        } catch (error) {
          console.error('Auth check error:', error);
          router.replace('/admin/login');
        } finally {
          setLoading(false);
        }
      };
      
      checkAuth();
    }, [router]);
    
    if (loading) {
      return <LoadingScreen />;
    }
    
    return user ? <WrappedComponent {...props} user={user} /> : null;
  };
  
  return WithAuth;
};

export default withAuth;