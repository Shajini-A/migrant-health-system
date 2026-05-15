import React, { useState, useEffect } from 'react';
import { Container, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [records, setRecords] = useState([]);
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      const appRes = await api.get('/doctor/appointments');
      setAppointments(appRes.data);
      
      const recRes = await api.get('/doctor/records');
      setRecords(recRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.put(`/doctor/appointments/${id}`, { status });
      fetchData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  return (
    <>
      <Navbar title="Doctor Dashboard" />
      <Container sx={{ py: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h5" fontWeight="bold">📅 Upcoming Appointments</Typography>
          <Button variant="contained" color="primary" onClick={() => navigate('/doctor/upload-record')}>
            + Upload New Health Record
          </Button>
        </Box>
        
        <Paper sx={{ p: 0, mb: 5, overflow: 'hidden', borderRadius: 2 }}>
          {appointments.length === 0 ? (
            <Box p={3}><Typography color="textSecondary">No appointments scheduled.</Typography></Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell><strong>Date & Time</strong></TableCell>
                  <TableCell><strong>Patient Name</strong></TableCell>
                  <TableCell><strong>Phone</strong></TableCell>
                  <TableCell><strong>Status</strong></TableCell>
                  <TableCell align="center"><strong>Actions</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((app) => (
                  <TableRow key={app._id} hover>
                    <TableCell>{new Date(app.date).toLocaleString()}</TableCell>
                    <TableCell>{app.patientId?.name}</TableCell>
                    <TableCell>{app.patientId?.phone}</TableCell>
                    <TableCell>
                      <Box sx={{ 
                        display: 'inline-block', px: 1.5, py: 0.5, borderRadius: 1, fontSize: '0.75rem', fontWeight: 'bold',
                        bgcolor: app.status === 'pending' ? '#fff3cd' : app.status === 'approved' ? '#d1e7dd' : '#f8d7da',
                        color: app.status === 'pending' ? '#856404' : app.status === 'approved' ? '#0f5132' : '#842029'
                      }}>
                        {app.status.toUpperCase()}
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      {app.status === 'pending' && (
                        <>
                          <Button size="small" color="success" variant="contained" sx={{ mr: 1 }} onClick={() => handleUpdateStatus(app._id, 'approved')}>Accept</Button>
                          <Button size="small" color="error" variant="outlined" onClick={() => handleUpdateStatus(app._id, 'rejected')}>Reject</Button>
                        </>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>

        <Typography variant="h5" fontWeight="bold" mb={3}>📋 Hospital Medical History</Typography>
        <Paper sx={{ p: 0, borderRadius: 2, overflow: 'hidden' }}>
          {records.length === 0 ? (
            <Box p={3}><Typography color="textSecondary">No medical records found for this hospital.</Typography></Box>
          ) : (
            <Table>
              <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                <TableRow>
                  <TableCell><strong>Date</strong></TableCell>
                  <TableCell><strong>Patient Name</strong></TableCell>
                  <TableCell><strong>Diagnosis</strong></TableCell>
                  <TableCell><strong>Added By</strong></TableCell>
                  <TableCell align="center"><strong>Reports</strong></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {records.map((rec) => (
                  <TableRow key={rec._id} hover>
                    <TableCell>{new Date(rec.date).toLocaleDateString()}</TableCell>
                    <TableCell>{rec.patientId?.name}</TableCell>
                    <TableCell><strong>{rec.diagnosis}</strong></TableCell>
                    <TableCell>Dr. {rec.doctorId?.name}</TableCell>
                    <TableCell align="center">
                      <Button size="small" variant="text" onClick={() => window.open(`/report/${rec._id}`, '_blank')} sx={{ mr: 1 }}>View Report</Button>
                      {rec.reportFile && (
                        <Button size="small" variant="outlined" color="secondary" href={`/${rec.reportFile}`} target="_blank">Attachment</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </Paper>
      </Container>
    </>
  );
};

export default DoctorDashboard;
