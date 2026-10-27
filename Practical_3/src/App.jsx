import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import JobApplicationForm from './components/JobApplicationForm';
import ApplicationList from './components/ApplicationList';
import JsonViewerModal from './components/JsonViewerModal';
import TestChecklistModal from './components/TestChecklistModal';
import Footer from './components/Footer';
import './App.css';

// Initial preloaded sample applications to showcase the UI immediately
const DEFAULT_APPLICATIONS = [
  {
    id: 1729000000001,
    fullName: 'Pankaj Shinde',
    email: 'pankajshinde0409@gmail.com',
    mobile: '9823456789',
    jobRole: 'Software Developer',
    education: "Bachelor's Degree",
    experience: 2,
    resumeUrl: 'https://pankajshinde.dev/resume.pdf',
    submittedAt: '17/10/2026, 10:30 AM',
  },
  {
    id: 1729000000002,
    fullName: 'Aarav Deshmukh',
    email: 'aarav.deshmukh@example.com',
    mobile: '9890123456',
    jobRole: 'Data Analyst',
    education: "Master's Degree",
    experience: 3,
    resumeUrl: 'https://aarav-portfolio.com',
    submittedAt: '17/10/2026, 11:15 AM',
  },
];

export default function App() {
  // Initialize applications state from localStorage or default samples
  const [applications, setApplications] = useState(() => {
    try {
      const saved = localStorage.getItem('jobApplyApplications');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved applications from localStorage:', e);
    }
    return DEFAULT_APPLICATIONS;
  });

  // Modal visibility states
  const [isJsonModalOpen, setIsJsonModalOpen] = useState(false);
  const [isTestModalOpen, setIsTestModalOpen] = useState(false);

  // Synchronize applications collection with localStorage
  useEffect(() => {
    try {
      localStorage.setItem('jobApplyApplications', JSON.stringify(applications));
    } catch (e) {
      console.error('Failed to write to localStorage:', e);
    }
  }, [applications]);

  // Add new validated application
  const handleAddApplication = (newRecord) => {
    setApplications((prev) => [newRecord, ...prev]);
  };

  // Delete single application
  const handleDeleteApplication = (id, candidateName) => {
    const confirmed = window.confirm(`Are you sure you want to delete the application for "${candidateName}"?`);
    if (confirmed) {
      setApplications((prev) => prev.filter((app) => app.id !== id));
    }
  };

  // Clear all applications
  const handleClearAll = () => {
    const confirmed = window.confirm('Are you sure you want to remove ALL application records from storage?');
    if (confirmed) {
      setApplications([]);
    }
  };

  return (
    <div className="portal-app">
      {/* Navigation Header */}
      <Navbar
        onOpenJson={() => setIsJsonModalOpen(true)}
        onOpenTestCases={() => setIsTestModalOpen(true)}
        totalCount={applications.length}
      />

      {/* Hero Banner with Live Metrics */}
      <HeroSection applicationCount={applications.length} />

      {/* Main Container */}
      <main className="portal-content-container">
        {/* Form and Helper Section */}
        <JobApplicationForm onAddApplication={handleAddApplication} />

        {/* Submitted Applications List */}
        <ApplicationList
          applications={applications}
          onDeleteApplication={handleDeleteApplication}
          onClearAll={handleClearAll}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* LocalStorage JSON Viewer Modal */}
      <JsonViewerModal
        applications={applications}
        isOpen={isJsonModalOpen}
        onClose={() => setIsJsonModalOpen(false)}
      />

      {/* Testing Checklist Modal (T1 to T14) */}
      <TestChecklistModal
        isOpen={isTestModalOpen}
        onClose={() => setIsTestModalOpen(false)}
      />
    </div>
  );
}
