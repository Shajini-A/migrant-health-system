import React, { useState, useContext } from 'react';
import { Container, TextField, Button, Typography, Box, FormControlLabel, Checkbox, Paper } from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';

const Login = () => {
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [isDoctor, setIsDoctor] = useState(false);
  const [hospitalId, setHospitalId] = useState('');
  const [doctorId, setDoctorId] = useState('');
  const [error, setError] = useState('');
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = isDoctor ? { password, isDoctor: true, hospitalId, doctorId } : { phone, password };
      const res = await api.post('/auth/login', payload);
      login(res.data);
      navigate(`/${res.data.role}/dashboard`);
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10}>
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Typography variant="h5" align="center" gutterBottom>Login</Typography>
          {error && <Typography color="error" align="center">{error}</Typography>}
          
          <form onSubmit={handleSubmit}>
            <FormControlLabel
              control={<Checkbox checked={isDoctor} onChange={(e) => setIsDoctor(e.target.checked)} />}
              label="I am a Doctor"
            />

            {isDoctor ? (
              <>
                <TextField fullWidth label="Hospital ID" margin="normal" value={hospitalId} onChange={(e) => setHospitalId(e.target.value)} required />
                <TextField fullWidth label="Doctor ID" margin="normal" value={doctorId} onChange={(e) => setDoctorId(e.target.value)} required />
              </>
            ) : (
              <TextField fullWidth label="Phone (or 'admin')" margin="normal" value={phone} onChange={(e) => setPhone(e.target.value)} required />
            )}

            <TextField fullWidth label="Password" type="password" margin="normal" value={password} onChange={(e) => setPassword(e.target.value)} required />
            
            <Button fullWidth variant="contained" color="primary" type="submit" sx={{ mt: 2 }}>Login</Button>
            
            {!isDoctor && (
              <Typography align="center" sx={{ mt: 2 }}>
                Don't have an account? <Link to="/register">Register here</Link>
              </Typography>
            )}
          </form>
        </Paper>
      </Box>
    </Container>
  );
};

export default Login;
