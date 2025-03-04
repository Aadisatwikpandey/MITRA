// pages/admin/users/index.js
import Head from 'next/head';
import AdminLayout from '../../../components/admin/AdminLayout';
import UserManagement from '../../../components/admin/UserManagement';

export default function UsersPage() {
  return (
    <AdminLayout>
      <Head>
        <title>User Management | MITRA Admin</title>
      </Head>
      
      <UserManagement />
    </AdminLayout>
  );
}