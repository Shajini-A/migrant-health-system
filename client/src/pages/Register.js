import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Paper } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Register = () => {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', { name, phone, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>Migrant Registration</Typography>
          {error && <Typography color="error" align="center">{error}</Typography>}
          
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" margin="normal" value={name} onChange={(e) => setName(e.target.value)} required />
            <TextField fullWidth label="Phone Number" margin="normal" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
            
            <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>Register</Button>
            
            <Typography align="center" sx={{ mt: 2 }}>
              Already have an account? <Link to="/login">Login here</Link>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Register;
