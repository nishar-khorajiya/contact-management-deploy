import React, { useState } from 'react';
import { Accordion, Button, Modal, Alert } from 'react-bootstrap';
import axios from 'axios';

const DuplicateList = ({ duplicates, fetchContacts }) => {
  const [show, setShow] = useState(false);
  const [selectedDuplicate, setSelectedDuplicate] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const token = localStorage.getItem('token');

  const handleMerge = async () => {
    if (!selectedDuplicate) return;
    const { primaryId, duplicateId } = selectedDuplicate;

    try {
      await axios.post(
        'http://localhost:5000/api/contacts/merge',
        { primaryId, duplicateId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess('Contacts merged successfully.');
      fetchContacts();
      setShow(false);
    } catch (err) {
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : 'Merge failed'
      );
    }
  };

  return (
    <div className="mt-4">
      <h4>Duplicate Contacts</h4>
      {duplicates.length === 0 ? (
        <p>No duplicates found.</p>
      ) : (
        <Accordion>
          {duplicates.map((pair, index) => (
            <Accordion.Item eventKey={index.toString()} key={index}>
              <Accordion.Header>
                {pair[0].name} &amp; {pair[1].name}
              </Accordion.Header>
              <Accordion.Body>
                <p><strong>Primary:</strong> {pair[0].name}</p>
                <p><strong>Duplicate:</strong> {pair[1].name}</p>
                <Button variant="warning" onClick={() => {
                  setSelectedDuplicate({ primaryId: pair[0]._id, duplicateId: pair[1]._id });
                  setShow(true);
                }}>
                  Merge
                </Button>
              </Accordion.Body>
            </Accordion.Item>
          ))}
        </Accordion>
      )}

      <Modal show={show} onHide={() => setShow(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Merge Contacts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <p>Are you sure you want to merge these contacts?</p>
          <Button variant="primary" onClick={handleMerge}>
            Yes, Merge
          </Button>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DuplicateList;
