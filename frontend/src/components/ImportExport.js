import React, { useState } from 'react';
import { Button, Modal, Form, Alert } from 'react-bootstrap';
import axios from 'axios';

const ImportExport = ({ fetchContacts }) => {
  const [show, setShow] = useState(false);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const handleImport = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a VCF file to import.');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      await axios.post('http://localhost:5000/api/contacts/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccess('Contacts imported successfully.');
      fetchContacts();
      setShow(false);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Import failed'
      );
    }
  };

  const handleExport = () => {
    axios
      .get('http://localhost:5000/api/contacts/export', {
        headers: { Authorization: `Bearer ${token}` },
        responseType: 'blob',
      })
      .then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'contacts.vcf');
        document.body.appendChild(link);
        link.click();
      })
      .catch((error) => {
        console.error('Export failed', error);
      });
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setShow(true)} className="me-2">
        Import
      </Button>
      <Button variant="success" onClick={handleExport}>
        Export
      </Button>

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Import Contacts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleImport}>
            <Form.Group controlId="formFile" className="mb-3">
              <Form.Label>Select VCF File</Form.Label>
              <Form.Control
                type="file"
                accept=".vcf"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Import
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ImportExport;
