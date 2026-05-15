import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Paper, Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import api from '../../api';

const UploadRecord = () => {
  const [patientId, setPatientId] = useState('');
  const [diagnosis, setDiagnosis] = useState('');
  const [prescription, setPrescription] = useState('');
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('patientId', patientId);
    formData.append('diagnosis', diagnosis);
    formData.append('prescription', prescription);
    if (file) {
      formData.append('reportFile', file);
    }

    try {
      await api.post('/doctor/records', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Record uploaded successfully!');
      setPatientId('');
      setDiagnosis('');
      setPrescription('');
      setFile(null);
    } catch (err) {
      console.error(err);
      const errorMsg = err.response?.data?.error || 'Error uploading record';
      alert(errorMsg);
    }
  };

  return (
    <>
      <Navbar title="Upload Health Record" />
      <Container maxWidth="sm">
        <Paper sx={{ p: 4 }}>
          <Typography variant="h6" gutterBottom>New Health Record</Typography>
          <form onSubmit={handleSubmit}>
            <TextField fullWidth label="Patient ID (Phone Number)" margin="normal" value={patientId} onChange={(e) => setPatientId(e.target.value)} required />
            <TextField fullWidth label="Diagnosis" margin="normal" value={diagnosis} onChange={(e) => setDiagnosis(e.target.value)} required />
            <TextField fullWidth label="Prescription" margin="normal" multiline rows={3} value={prescription} onChange={(e) => setPrescription(e.target.value)} required />
            
            <Box mt={2} mb={2}>
              <Button variant="outlined" component="label">
                Upload Report (Optional)
                <input type="file" hidden onChange={(e) => setFile(e.target.files[0])} />
              </Button>
              {file && <Typography variant="caption" sx={{ ml: 2 }}>{file.name}</Typography>}
            </Box>

            <Button variant="contained" color="primary" type="submit" fullWidth>Submit Record</Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default UploadRecord;
