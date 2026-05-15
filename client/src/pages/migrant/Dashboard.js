import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Paper, Button, Box, Table, TableHead, TableBody, TableCell, TableRow } from '@mui/material';
import Navbar from '../../components/Navbar';
import { useNavigate } from 'react-router-dom';
import api from '../../api';

const MigrantDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    try {
      const res = await api.get('/migrant/appointments');
      setAppointments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await api.delete(`/migrant/appointments/${id}`);
        fetchAppointments();
      } catch (err) {
        alert('Error cancelling appointment');
      }
    }
  };

  return (
    <>
      <Navbar title="Migrant Dashboard" />
      <Container>
        <Box display="flex" justifyContent="space-between" mb={3}>
          <Typography variant="h5">My Appointments</Typography>
          <Box>
            <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => navigate('/migrant/book-appointment')}>
              Book Appointment
            </Button>
            <Button variant="outlined" color="secondary" onClick={() => navigate('/migrant/records')}>
              View Health Records
            </Button>
          </Box>
        </Box>

        <Paper sx={{ p: 2 }}>
          {appointments.length === 0 ? (
            <Typography>You have no appointments.</Typography>
          ) : (
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Doctor</TableCell>
                  <TableCell>Hospital</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {appointments.map((app) => (
                  <TableRow key={app._id}>
                    <TableCell>{new Date(app.date).toLocaleString()}</TableCell>
                    <TableCell>{app.doctorId?.name || 'Deleted Doctor'}</TableCell>
                    <TableCell>{app.hospitalId?.name || 'Deleted Hospital'}</TableCell>
                    <TableCell>
                      <Typography color={app.status === 'pending' ? 'orange' : app.status === 'approved' ? 'green' : 'red'}>
                        {app.status.toUpperCase()}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Button size="small" color="error" variant="outlined" onClick={() => handleCancel(app._id)}>Cancel</Button>
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

export default MigrantDashboard;
