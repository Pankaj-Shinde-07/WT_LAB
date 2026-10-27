import React, { useState } from 'react';
import { Code, Copy, Check, X, Database } from 'lucide-react';

export default function JsonViewerModal({ applications, isOpen, onClose }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const jsonString = JSON.stringify(applications, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="modal-backdrop fade-in" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog json-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title-wrap">
            <div className="modal-icon-badge">
              <Database size={18} />
            </div>
            <div>
              <h3 className="modal-title">Browser LocalStorage State (JSON)</h3>
              <p className="modal-subtitle">
                Serialized state key: <code>jobApplyApplications</code> ({applications.length} records)
              </p>
            </div>
          </div>
          <button type="button" className="modal-close-btn" onClick={onClose} aria-label="Close dialog">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          <div className="json-toolbar">
            <span className="json-badge">JSON Format</span>
            <button type="button" className="copy-json-btn" onClick={handleCopy}>
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy JSON'}</span>
            </button>
          </div>
          <pre className="json-code-block">
            <code>{jsonString}</code>
          </pre>
        </div>

        <div className="modal-footer">
          <span className="modal-footer-note">
            This demonstrates JSON serialization / deserialization &amp; React state synchronization.
          </span>
          <button type="button" className="btn btn-outline" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
