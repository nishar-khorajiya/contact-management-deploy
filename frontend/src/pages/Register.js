import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Alert } from 'react-bootstrap'; 
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [username, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // State to handle errors
  const navigate = useNavigate();  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:5000/api/users/register', {
        username,
        email,
        password,
      });

      // Store the token
      localStorage.setItem('token', res.data.token);
      navigate('/');  // Navigate to dashboard on successful registration
    } catch (error) {
      setError(
        error.response && error.response.data.message
          ? error.response.data.message
          : 'Registration failed'
      );
    }
  };

  return (
    <div className="d-flex justify-content-center">
      <Form onSubmit={handleSubmit} style={{ width: '300px' }}>
        <h3 className="text-center">Register</h3>
        {error && <Alert variant="danger">{error}</Alert>}  {/* Error message */}
        
        <Form.Group controlId="name" className="mb-3">
          <Form.Label>Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter name"
            value={username}
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
            required
          />
        </Form.Group>

        <Form.Group controlId="password" className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>

        <Button variant="primary" type="submit" className="w-100">
          Register
        </Button>
      </Form>
    </div>
  );
};

export default Register;
