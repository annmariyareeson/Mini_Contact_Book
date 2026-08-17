import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

function ContactDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchContact();
  }, [id]);

  const fetchContact = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.get(`/api/contacts/${id}/`);
      setContact(response.data);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        setError('Contact not found.');
      } else {
        setError('Failed to load contact details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm('Are you sure you want to delete this contact?');
    if (!confirmed) return;

    setDeleting(true);
    setError('');

    try {
      await api.delete(`/api/contacts/${id}/`);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete contact. Please try again.');
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (error && !contact) {
    return (
      <div className="auth-container">
        <div className="auth-card" style={{ maxWidth: '560px', textAlign: 'center' }}>
          <div className="alert alert-error" role="alert">
            {error}
          </div>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => navigate('/dashboard')}
          >
            Back to Contacts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-container">
      <div className="auth-card" style={{ maxWidth: '560px' }}>
        <div className="auth-header" style={{ marginBottom: '1.5rem' }}>
          <h2>Contact Details</h2>
        </div>

        {error && (
          <div className="alert alert-error" role="alert">
            {error}
          </div>
        )}

        {contact && (
          <div className="contact-details-view">
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.25rem',
                marginBottom: '1.75rem',
                paddingBottom: '1.25rem',
                borderBottom: '1px solid #f1f5f9',
              }}
            >
              <div className="avatar" style={{ width: '56px', height: '56px', fontSize: '1.5rem' }}>
                {(contact.name || 'C').charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 style={{ fontSize: '1.35rem', fontWeight: '700', color: '#0f172a' }}>
                  {contact.name}
                </h3>
                {contact.company && (
                  <p style={{ color: '#64748b', fontSize: '0.95rem' }}>{contact.company}</p>
                )}
              </div>
            </div>

            <div className="contact-details" style={{ gap: '1rem', marginBottom: '2rem' }}>
              <div className="detail-item" style={{ fontSize: '0.95rem' }}>
                <span className="detail-label">Name</span>
                <span className="detail-value" style={{ fontWeight: '500' }}>
                  {contact.name}
                </span>
              </div>

              <div className="detail-item" style={{ fontSize: '0.95rem' }}>
                <span className="detail-label">Email</span>
                <a href={`mailto:${contact.email}`} className="detail-value">
                  {contact.email}
                </a>
              </div>

              <div className="detail-item" style={{ fontSize: '0.95rem' }}>
                <span className="detail-label">Phone</span>
                <a href={`tel:${contact.phone}`} className="detail-value">
                  {contact.phone}
                </a>
              </div>

              <div className="detail-item" style={{ fontSize: '0.95rem' }}>
                <span className="detail-label">Company</span>
                <span className="detail-value">
                  {contact.company || '—'}
                </span>
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.75rem',
                paddingTop: '1rem',
                borderTop: '1px solid var(--color-border)',
              }}
            >
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate(`/edit-contact/${contact.id}`)}
                disabled={deleting}
                style={{ flex: '1 1 auto' }}
              >
                Edit Contact
              </button>

              <button
                type="button"
                className="btn btn-danger"
                onClick={handleDelete}
                disabled={deleting}
                style={{ flex: '1 1 auto' }}
              >
                {deleting ? 'Deleting...' : 'Delete Contact'}
              </button>

              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/dashboard')}
                disabled={deleting}
                style={{ width: '100%', marginTop: '0.25rem' }}
              >
                Back to Contacts
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ContactDetails;
