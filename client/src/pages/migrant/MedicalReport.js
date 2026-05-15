import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Paper, Typography, Box, Divider, Button, Grid } from '@mui/material';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import DownloadIcon from '@mui/icons-material/Download';
import PrintIcon from '@mui/icons-material/Print';
import api from '../../api';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const MedicalReport = () => {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const navigate = useNavigate();
  const reportRef = useRef();

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const res = await api.get(`/doctor/records/${id}`);
        setRecord(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRecord();
  }, [id]);

  const handleDownload = async () => {
    const element = reportRef.current;
    const canvas = await html2canvas(element, { scale: 2 });
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Medical_Report_${record.patientId?.name || 'Patient'}_${id.substring(0, 5)}.pdf`);
  };

  if (!record) return <Typography>Loading report...</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, '@media print': { display: 'none' } }}>
        <Box>
          <Button variant="contained" startIcon={<PrintIcon />} onClick={() => window.print()}>Print</Button>
          <Button variant="contained" color="secondary" startIcon={<DownloadIcon />} sx={{ ml: 2 }} onClick={handleDownload}>Download PDF</Button>
        </Box>
        <Button variant="outlined" onClick={() => navigate(-1)}>Back to History</Button>
      </Box>

      <Paper ref={reportRef} elevation={3} sx={{ p: 6, borderRadius: 2, border: '1px solid #e0e0e0' }}>
        {/* Header */}
        <Grid container alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <Grid item>
            <LocalHospitalIcon sx={{ fontSize: 60, color: '#1976d2' }} />
          </Grid>
          <Grid item xs>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
              {record.hospitalId?.name || 'Life Care Hospital'}
            </Typography>
            <Typography variant="subtitle1" color="textSecondary">
              Hospital ID: {record.hospitalId?.hospitalId || 'H0001'} | {record.hospitalId?.location || 'Parvathipuram, Kanyakumari'}
            </Typography>
          </Grid>
          <Grid item>
             <Box sx={{ p: 1, border: '2px solid #1976d2', borderRadius: 1 }}>
                <Typography variant="h6" color="#1976d2">OFFICIAL REPORT</Typography>
             </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mb: 4, borderBottomWidth: 2 }} />

        {/* Patient & Doctor Info */}
        <Grid container spacing={4} sx={{ mb: 4 }}>
          <Grid item xs={6}>
            <Typography variant="overline" color="textSecondary">PATIENT DETAILS</Typography>
            <Typography variant="h6">{record.patientId?.name || 'SHAJINI A'}</Typography>
            <Typography variant="body2">Patient ID: MIG0001</Typography>
            <Typography variant="body2">Phone: {record.patientId?.phone || '9488553264'}</Typography>
          </Grid>
          <Grid item xs={6} sx={{ textAlign: 'right' }}>
            <Typography variant="overline" color="textSecondary">REPORT DETAILS</Typography>
            <Typography variant="body1">Date: {new Date(record.date).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' })}</Typography>
            <Typography variant="body1">Report Ref: {record._id.substring(0, 8).toUpperCase()}</Typography>
          </Grid>
        </Grid>

        {/* Clinical Findings */}
        <Box sx={{ mb: 4, p: 3, bgcolor: '#f5f9ff', borderRadius: 2 }}>
          <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>Diagnosis</Typography>
          <Typography variant="body1" sx={{ fontWeight: 500, fontSize: '1.1rem' }}>
            {record.diagnosis}
          </Typography>
        </Box>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h6" sx={{ color: '#1976d2', mb: 1 }}>Prescription & Advice</Typography>
          <Typography variant="body1" component="div" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
            {record.prescription}
          </Typography>
        </Box>

        {/* Footer / Verification Area */}
        <Divider sx={{ mb: 4 }} />
        <Grid container spacing={3} alignItems="center">
          <Grid item xs={12} md={8}>
            <Box sx={{ p: 2, border: '1px dashed #1976d2', borderRadius: 2, bgcolor: '#f0f7ff' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                DIGITAL VERIFICATION NOTICE
              </Typography>
              <Typography variant="caption" display="block" color="textSecondary">
                This document is a system-generated medical record from the **Migrant Health Management System**.
                Authenticity can be verified using the digital reference ID below. No physical signature is required.
              </Typography>
              <Typography variant="caption" sx={{ mt: 1, fontWeight: 'bold', display: 'block' }}>
                Ref ID: {record._id.toUpperCase()} | Verified On: {new Date(record.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} md={4} sx={{ textAlign: 'center' }}>
            <Box sx={{ display: 'inline-block', p: 1, border: '1px solid #ddd', borderRadius: 1 }}>
              {/* Using an image placeholder for QR code */}
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://migrant-health.app/verify/${record._id}`} 
                alt="Verification QR" 
                style={{ width: 80, height: 80 }}
              />
              <Typography variant="caption" display="block" sx={{ fontSize: '0.6rem', mt: 0.5 }}>
                SCAN TO VERIFY
              </Typography>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="textSecondary">
            Issued by: **Dr. {record.doctorId?.name || 'Medical Officer'}** ({record.doctorId?.specialization || 'General Practitioner'})
          </Typography>
          <Typography variant="caption" color="textSecondary">
            {record.hospitalId?.name} | {record.hospitalId?.location}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default MedicalReport;
