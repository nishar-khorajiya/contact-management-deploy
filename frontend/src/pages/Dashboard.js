import React, { useEffect, useState } from 'react';
import { Table, Button, Modal, Form, Badge, Row, Col, InputGroup, FormControl } from 'react-bootstrap';
import axios from 'axios';
import ContactForm from '../components/ContactForm';
import ImportExport from '../components/ImportExport';
import DuplicateList from '../components/DuplicateList';

const Dashboard = () => {
  const [contacts, setContacts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [search, setSearch] = useState('');
  const [duplicates, setDuplicates] = useState([]);

  const token = localStorage.getItem('token');

  const fetchContacts = async () => {
    try {
      const res = await axios.get('contact-management-deploy-apis.vercel.app/api/contacts', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setContacts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await axios.delete(`contact-management-deploy-apis.vercel.app/api/contacts/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchContacts();
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (contact) => {
    setCurrentContact(contact);
    setShowModal(true);
  };

  const handleClose = () => {
    setCurrentContact(null);
    setShowModal(false);
  };

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    (contact.email && contact.email.toLowerCase().includes(search.toLowerCase())) ||
    (contact.phone && contact.phone.includes(search))
  );

  const fetchDuplicates = async () => {
    try {
      const res = await axios.get('contact-management-deploy-apis.vercel.app/api/contacts/duplicates', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDuplicates(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchContacts();
    fetchDuplicates();
  }, []);

  return (
    <div>
      <Row className="mb-3">
        <Col md={6}>
          <InputGroup>
            <FormControl
              placeholder="Search contacts..."
              value={search}
              onChange={handleSearch}
            />
          </InputGroup>
        </Col>
        <Col md={6} className="text-end">
          <Button variant="primary" onClick={() => setShowModal(true)} className="me-2">
            Add Contact
          </Button>
          <ImportExport fetchContacts={fetchContacts} />
        </Col>
      </Row>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredContacts.map((contact) => (
            <tr key={contact._id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>
                {contact.tags.map((tag, index) => (
                  <Badge bg="secondary" key={index} className="me-1">
                    {tag}
                  </Badge>
                ))}
              </td>
              <td>
                <Button variant="warning" size="sm" onClick={() => handleEdit(contact)} className="me-2">
                  Edit
                </Button>
                <Button variant="danger" size="sm" onClick={() => handleDelete(contact._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <DuplicateList duplicates={duplicates} fetchContacts={fetchContacts} />

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{currentContact ? 'Edit Contact' : 'Add Contact'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ContactForm contact={currentContact} handleClose={handleClose} fetchContacts={fetchContacts} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Dashboard;
