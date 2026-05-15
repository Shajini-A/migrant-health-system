import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Button, Box } from '@mui/material';
import Navbar from '../../components/Navbar';
import api from '../../api';

const ViewRecords = () => {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await api.get('/migrant/records');
        setRecords(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecords();
  }, []);

  return (
    <>
      <Navbar title="My Health Records" />
      <Container>
        <Typography variant="h5" gutterBottom>Medical History</Typography>
        {records.length === 0 ? (
          <Typography>No health records found.</Typography>
        ) : (
          <Grid container spacing={3}>
            {records.map((record) => (
              <Grid item xs={12} md={6} key={record._id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" color="primary">{record.diagnosis}</Typography>
                    <Typography color="textSecondary" gutterBottom>
                      Date: {new Date(record.date).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, mb: 1 }}>
                      <strong>Prescription:</strong> {record.prescription}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      Doctor: {record.doctorId?.name || 'N/A'} | Hospital: {record.hospitalId?.name || 'N/A'}
                    </Typography>
                    <Box mt={2} display="flex" gap={2}>
                      <Button variant="contained" size="small" onClick={() => window.open(`/report/${record._id}`, '_blank')}>
                        Generate Official Report
                      </Button>
                      {record.reportFile && (
                        <Button variant="outlined" size="small" href={`/${record.reportFile}`} target="_blank">
                          View Attachment
                        </Button>
                      )}
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default ViewRecords;
