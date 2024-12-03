// src/pages/ContactPage.js
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitContact } from '../features/contactSlice';
import './ContactPage.css';

const ContactPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    text: ''
  });
  const [status, setStatus] = useState({ type: '', message: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(submitContact(formData)).unwrap();
      setStatus({
        type: 'success',
        message: 'Message sent successfully!'
      });
      setFormData({ name: '', email: '', subject: '', text: '' });
    } catch (error) {
      setStatus({
        type: 'error',
        message: error.message || 'Failed to send message'
      });
    }
  };

  return (
    <div className="contact-page">
      <div className="container py-5">
        <div className="contact-card">
          <h2 className="text-center mb-4 neon-text">Contact Us</h2>
          
          {status.message && (
            <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'} mb-4`}>
              {status.message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Name"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
              />
            </div>

            <div className="mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Subject"
                value={formData.subject}
                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                required
              />
            </div>

            <div className="mb-4">
              <textarea
                className="form-control"
                placeholder="Your message"
                rows="5"
                value={formData.text}
                onChange={(e) => setFormData({...formData, text: e.target.value})}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;