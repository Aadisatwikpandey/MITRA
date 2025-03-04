// components/admin/users/ExportToExcel.js
import { useState } from 'react';
import styled from 'styled-components';
import { FaFileExcel } from 'react-icons/fa';
import * as XLSX from 'xlsx';
import { format } from 'date-fns';

const ExportButton = styled.button`
  background-color: #4CAF50;
  color: white;
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #388E3C;
    transform: translateY(-2px);
  }
  
  &:disabled {
    background-color: #A5D6A7;
    cursor: not-allowed;
    transform: none;
  }
`;

const ExportToExcel = ({ users, filename = 'users-export' }) => {
  const [exporting, setExporting] = useState(false);
  
  const handleExport = async () => {
    if (!users || users.length === 0 || exporting) return;
    
    setExporting(true);
    
    try {
      // Prepare data for export
      const exportData = users.map(user => ({
        'Name': user.fullName || `${user.firstName} ${user.lastName}`,
        'First Name': user.firstName,
        'Last Name': user.lastName,
        'Email': user.email,
        'Phone': user.phone || 'N/A',
        'Interest': user.interest,
        'Message': user.message,
        'Status': user.status,
        'Date': user.createdAt ? format(user.createdAt, 'MMM d, yyyy HH:mm') : 'N/A',
        'Viewed': user.viewed ? 'Yes' : 'No'
      }));
      
      // Create worksheet
      const ws = XLSX.utils.json_to_sheet(exportData);
      
      // Create workbook
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Contact Submissions');
      
      // Generate file name with date
      const dateStr = format(new Date(), 'yyyy-MM-dd');
      const fullFilename = `${filename}_${dateStr}.xlsx`;
      
      // Save file
      XLSX.writeFile(wb, fullFilename);
    } catch (error) {
      console.error('Error exporting to Excel:', error);
      alert('Failed to export data. Please try again.');
    } finally {
      setExporting(false);
    }
  };
  
  return (
    <ExportButton 
      onClick={handleExport} 
      disabled={exporting || !users || users.length === 0}
    >
      <FaFileExcel /> 
      {exporting ? 'Exporting...' : 'Export to Excel'}
    </ExportButton>
  );
};

export default ExportToExcel;