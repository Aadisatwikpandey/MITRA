// pages/admin/dashboard.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { FaNewspaper, FaUsers, FaChartBar, FaCalendarAlt, FaEdit } from 'react-icons/fa';
import AdminLayout from '../../components/admin/AdminLayout';
import styles from '../../styles/admin/Dashboard.module.css';

// Dashboard card component
const DashboardCard = ({ title, value, icon, color, link }) => (
  <Link href={link} className={styles.card}>
    <div className={styles.cardIconContainer} style={{ backgroundColor: `${color}25` }}>
      <div className={styles.cardIcon} style={{ color }}>
        {icon}
      </div>
    </div>
    <div className={styles.cardContent}>
      <h3 className={styles.cardTitle}>{title}</h3>
      <p className={styles.cardValue}>{value}</p>
    </div>
  </Link>
);