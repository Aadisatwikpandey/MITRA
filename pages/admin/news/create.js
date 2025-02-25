// pages/admin/news/create.js
import Head from 'next/head';
import NewsForm from '../../../components/admin/NewsForm';
import AdminLayout from '../../../components/admin/AdminLayout';

export default function CreateNews() {
  return (
    <AdminLayout>
      <Head>
        <title>Create News | MITRA Admin</title>
      </Head>
      
      <NewsForm isEdit={false} />
    </AdminLayout>
  );
}