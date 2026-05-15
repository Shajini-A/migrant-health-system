const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const doc = new PDFDocument({ margin: 50 });
const filePath = path.join(__dirname, 'uploads', 'medical_report_SHAJINI_A.pdf');

// Ensure uploads directory exists
if (!fs.existsSync(path.join(__dirname, 'uploads'))) {
    fs.mkdirSync(path.join(__dirname, 'uploads'));
}

doc.pipe(fs.createWriteStream(filePath));

// Background Header
doc.rect(0, 0, 612, 85).fill('#f0f7ff');

// Draw Medical Logo (Cross Icon)
doc.save();
doc.translate(50, 15);
doc.scale(0.8);
doc.fillColor('#1976d2');
// Vertical bar
doc.rect(15, 0, 10, 40).fill();
// Horizontal bar
doc.rect(0, 15, 40, 10).fill();
// Pulse line
doc.strokeColor('#fff').lineWidth(2);
doc.moveTo(2, 20).lineTo(12, 20).lineTo(16, 10).lineTo(24, 30).lineTo(28, 20).lineTo(38, 20).stroke();
doc.restore();

// Hospital Info
doc.fillColor('#1976d2').fontSize(28).text('Life Care Hospital', 100, 15, { characterSpacing: 1, fontWeight: 'bold' });
doc.fontSize(10).fillColor('#666').text('H0001 | Parvathipuram, Kanyakumari', 100, 50);
doc.rect(100, 48, 300, 1.5).fill('#1976d2'); // Shortened line to avoid stamp

// Official Stamp
doc.rect(415, 15, 140, 40).lineWidth(1.5).stroke('#1976d2');
doc.fillColor('#1976d2').fontSize(12).text('OFFICIAL REPORT', 428, 28);

doc.moveDown(5);

// Patient Section Header
doc.rect(50, 100, 512, 25).fill('#e3f2fd');
doc.fillColor('#1976d2').fontSize(12).text('PATIENT DETAILS', 60, 107, { characterSpacing: 1 });

// Patient Data
doc.moveDown(1.5);
doc.fillColor('#333').fontSize(14).text('Name: ', 50, 140, { continued: true }).fillColor('#000').text('SHAJINI A');
doc.fillColor('#333').fontSize(11).text('Patient ID: ', 50, 165, { continued: true }).fillColor('#000').text('MIG0001');
doc.fillColor('#333').text('Phone: ', 50, 185, { continued: true }).fillColor('#000').text('9488553264');

// Date Info (Spaced out even more)
doc.fillColor('#666').fontSize(10).text('Date: May 15, 2026', 420, 135);
doc.text('Report Type: MRI SCAN', 420, 155); // Shortened text to avoid wrap
doc.text('Ref ID: 6A06CA1FD66F', 420, 175);

doc.moveDown(5);

// Clinical Details Header
doc.rect(50, 220, 512, 25).fill('#e3f2fd');
doc.fillColor('#1976d2').fontSize(12).text('TECHNICAL FINDINGS & OBSERVATIONS', 60, 227, { characterSpacing: 1 });

// Technical Findings Section
doc.fillColor('#333').fontSize(12).text('Clinical Impression:', 50, 260, { continued: true }).fillColor('#000').text(' ACUTE LUMBAR STRAIN');

doc.fillColor('#444').fontSize(10).text('SPINE ALIGNMENT:', 70, 285, { continued: true }).fillColor('#000').text(' Normal cervical/lumbar curvature detected.');
doc.fillColor('#444').text('VERTEBRAL LEVELS:', 70, 305, { continued: true }).fillColor('#000').text(' L4-L5 levels show minor disc bulge / protrusion.');
doc.fillColor('#444').text('SOFT TISSUE:', 70, 325, { continued: true }).fillColor('#000').text(' Mild swelling and edema in the paraspinal muscles.');
doc.fillColor('#444').text('MOBILITY:', 70, 345, { continued: true }).fillColor('#000').text(' Restricted range of motion due to localized spasms.');
doc.fillColor('#444').text('BONE DENSITY:', 70, 365, { continued: true }).fillColor('#000').text(' Normal for patient age and gender.');

// Prescription (Moved down significantly to avoid overlap)
doc.rect(50, 400, 512, 25).fill('#e3f2fd');
doc.fillColor('#1976d2').fontSize(12).text('PRESCRIPTION & MEDICAL ADVICE', 60, 407, { characterSpacing: 1 });

doc.fillColor('#000').fontSize(11).text('• Tab. Naproxen 500mg (BID after food for 5 days)', 70, 440, { lineGap: 5 });
doc.text('• Tab. Myospas (Nightly for muscle relaxation)', 70, 460, { lineGap: 5 });
doc.text('• Physiotherapy: Short-wave diathermy recommended.', 70, 480, { lineGap: 5 });
doc.text('• Strict bed rest on a firm mattress for 48 hours.', 70, 500, { lineGap: 5 });

// Footer Area
doc.rect(50, 650, 512, 1).fill('#ddd');
doc.fillColor('#1976d2').fontSize(10).text('DIGITAL VERIFICATION NOTICE', 50, 665);
doc.fillColor('#666').fontSize(8).text('This document is system-generated and verified online. Authenticity can be checked using the Ref ID provided above. No physical signature is required.', 50, 680, { width: 350 });

// Doctor Info
doc.fillColor('#000').fontSize(12).text('Dr. Johny Mandice C', 400, 665, { align: 'right' });
doc.fontSize(10).fillColor('#333').text('Orthopedic Surgeon', 400, 680, { align: 'right' });
doc.fontSize(9).text('Reg: DOC0001', 400, 695, { align: 'right' });

doc.end();

console.log('PDF Report generated at:', filePath);
