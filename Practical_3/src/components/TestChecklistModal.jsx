import React from 'react';
import { CheckCircle2, X, ClipboardCheck, Play } from 'lucide-react';

const TEST_CASES = [
  {
    id: 'T1',
    action: 'Submit all fields empty.',
    expected: 'Required-field messages appear on all required fields; no record is added to list.',
    category: 'Form Validation',
  },
  {
    id: 'T2',
    action: 'Enter a very short name (e.g., "Ab").',
    expected: 'Name validation error ("Name must contain at least 3 characters.") appears.',
    category: 'Field Validation',
  },
  {
    id: 'T3',
    action: 'Enter an invalid email address (e.g., "pankaj@domain").',
    expected: 'Email format validation error appears.',
    category: 'Field Validation',
  },
  {
    id: 'T4',
    action: 'Enter an invalid mobile number (e.g., "12345" or "5123456789").',
    expected: 'Indian mobile number validation error (10 digits starting with 6–9) appears.',
    category: 'Field Validation',
  },
  {
    id: 'T5',
    action: 'Leave job role or education unselected.',
    expected: 'Dropdown selection validation errors appear for unselected fields.',
    category: 'Field Validation',
  },
  {
    id: 'T6',
    action: 'Enter experience below 0 or above 50 (e.g., "-1" or "55").',
    expected: 'Experience validation error ("must be between 0 and 50") appears.',
    category: 'Field Validation',
  },
  {
    id: 'T7',
    action: 'Enter valid details and submit form.',
    expected: 'Application is added to the list, localStorage is updated, and success message appears.',
    category: 'Success Flow',
  },
  {
    id: 'T8',
    action: 'Leave resume URL blank and submit otherwise valid form.',
    expected: 'Form submission succeeds since resume URL is optional.',
    category: 'Optional Fields',
  },
  {
    id: 'T9',
    action: 'Enter an invalid resume URL (e.g., "ftp://example.com" or "myresume").',
    expected: 'Resume URL validation error ("Enter a valid HTTP or HTTPS URL") appears.',
    category: 'Field Validation',
  },
  {
    id: 'T10',
    action: 'Refresh the browser page after submitting applications.',
    expected: 'All saved application records persist via browser localStorage.',
    category: 'Persistence',
  },
  {
    id: 'T11',
    action: 'Click "Delete" on an application card.',
    expected: 'Selected application is removed from state and localStorage; count updates.',
    category: 'Interactive Controls',
  },
  {
    id: 'T12',
    action: 'Click "Clear form" button.',
    expected: 'All input values and validation error indicators reset immediately.',
    category: 'Interactive Controls',
  },
  {
    id: 'T13',
    action: 'Click "Clear all" applications button.',
    expected: 'All records removed; interactive empty-state message appears.',
    category: 'Interactive Controls',
  },
  {
    id: 'T14',
    action: 'Resize browser or open on mobile viewport (375px/390px).',
    expected: 'Layout stacks into a responsive single column without horizontal overflow.',
    category: 'Responsive Design',
  },
];

export default function TestChecklistModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modal-backdrop fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog test-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge test-icon-badge">
              <ClipboardCheck size={20} />
            </div>
            <div>
              <h3 className="modal-title">Practical No. 3: Testing &amp; Validation Checklist</h3>
              <p className="modal-subtitle">
                Academic evaluation checklist according to syllabus guidelines (T1–T14)
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="table-responsive">
            <table className="checklist-table">
              <thead>
                <tr>
                  <th style={{ width: '60px' }}>Test</th>
                  <th style={{ width: '35%' }}>Input / Action</th>
                  <th>Expected Result</th>
                  <th style={{ width: '100px', textAlign: 'center' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {TEST_CASES.map((tc) => (
                  <tr key={tc.id}>
                    <td>
                      <span className="test-id-pill">{tc.id}</span>
                    </td>
                    <td>
                      <strong>{tc.action}</strong>
                      <div className="category-meta">{tc.category}</div>
                    </td>
                    <td>{tc.expected}</td>
                    <td style={{ textAlign: 'center' }}>
                      <span className="test-status-pill">
                        <CheckCircle2 size={13} />
                        <span>Ready</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="modal-footer">
          <span className="modal-footer-note">
            Use the "✨ Valid Demo" and "⚠️ Invalid Demo" quick buttons on the form for live verification.
          </span>
          <button type="button" className="btn btn-primary" onClick={onClose}>
            Done Reviewing
          </button>
        </div>
      </div>
    </div>
  );
}
