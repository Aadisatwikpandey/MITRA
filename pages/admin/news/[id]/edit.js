// pages/admin/news/[id]/edit.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NewsForm from '../../../../components/admin/NewsForm';
import AdminLayout from '../../../../components/admin/AdminLayout';
import { newsService } from '../../../../lib/newsService';
import styles from '../../../../styles/admin/NewsForm.module.css';