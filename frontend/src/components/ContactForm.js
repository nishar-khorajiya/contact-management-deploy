import React, { useState, useEffect } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ContactForm = ({ contact, handleClose, fetchContacts }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setEmail(contact.email || '');
      setPhone(contact.phone || '');
      setTags(contact.tags.join(', ') || '');
    }
  }, [contact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const contactData = {
        name,
        email,
        phone,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      };

      if (contact) {
        await axios.put(`contact-management-deploy-apis.vercel.app/api/contacts/${contact._id}`, contactData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post('contact-management-deploy-apis.vercel.app/api/contacts', contactData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      fetchContacts();
      handleClose();
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Something went wrong'
      );
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="name" className="mb-3">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </Form.Group>

      <Form.Group controlId="email" className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="phone" className="mb-3">
        <Form.Label>Phone</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
      </Form.Group>

      <Form.Group controlId="tags" className="mb-3">
        <Form.Label>Tags (comma separated)</Form.Label>
        <Form.Control
          type="text"
          placeholder="e.g., friend, work"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />
      </Form.Group>

      <Button variant="primary" type="submit" className="w-100">
        {contact ? 'Update' : 'Add'} Contact
      </Button>
    </Form>
  );
};

export default ContactForm;
