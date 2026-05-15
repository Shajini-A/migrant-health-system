const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const reports = [
    { type: 'BLOOD_CBC', title: 'Complete Blood Count (CBC)', patient: 'SHAJINI A', id: 'MIG0001' },
    { type: 'MRI_BRAIN', title: 'MRI Brain Scan', patient: 'SHAJIBHA A', id: 'MIG0002' },
    { type: 'LIPID_PROFILE', title: 'Lipid Profile (Cholesterol)', patient: 'RAHUL R', id: 'MIG0003' },
    { type: 'CHEST_XRAY', title: 'Chest X-Ray Report', patient: 'PRIYA P', id: 'MIG0004' },
    { type: 'ECG', title: 'Electrocardiogram (ECG)', patient: 'ANAND K', id: 'MIG0005' },
    { type: 'THYROID', title: 'Thyroid Function Test', patient: 'MEENA S', id: 'MIG0006' },
    { type: 'LFT', title: 'Liver Function Test (LFT)', patient: 'VIKRAM V', id: 'MIG0007' },
    { type: 'KFT', title: 'Kidney Function Test (KFT)', patient: 'SONIYA M', id: 'MIG0008' },
    { type: 'CT_ABDOMEN', title: 'CT Abdomen / Pelvis', patient: 'KARTHIK B', id: 'MIG0009' },
    { type: 'DIABETIC', title: 'Diabetic Screening (HbA1c)', patient: 'DIVYA D', id: 'MIG0010' }
];

const generateReport = (data, index) => {
    const doc = new PDFDocument({ margin: 50 });
    const filename = `Sample_Attachment_${index + 1}_${data.type}.pdf`;
    const filePath = path.join(__dirname, 'uploads', filename);

    if (!fs.existsSync(path.join(__dirname, 'uploads'))) fs.mkdirSync(path.join(__dirname, 'uploads'));
    doc.pipe(fs.createWriteStream(filePath));

    // Header
    doc.rect(0, 0, 612, 80).fill('#f8f9fa');
    doc.fillColor('#1976d2').fontSize(24).text('METRO DIAGNOSTICS & RESEARCH', 50, 20);
    doc.fontSize(10).fillColor('#666').text('ISO 9001:2015 Certified Laboratory | NABL Accredited', 50, 50);

    // Metadata
    doc.rect(50, 100, 512, 60).stroke('#ddd');
    doc.fillColor('#000').fontSize(10);
    doc.text(`Patient: ${data.patient}`, 65, 115);
    doc.text(`ID: ${data.id}`, 65, 130);
    doc.text(`Age/Sex: 24Y / Female`, 65, 145);
    
    doc.text(`Date: May 15, 2026`, 400, 115, { align: 'right' });
    doc.text(`Ref: ${data.type}_${Math.floor(Math.random()*10000)}`, 400, 130, { align: 'right' });

    doc.moveDown(4);
    doc.fillColor('#1976d2').fontSize(16).text(data.title.toUpperCase(), { align: 'center', underline: true });
    doc.moveDown(1);

    // Specific Content Based on Type
    doc.fillColor('#000').fontSize(11);
    if (data.type === 'BLOOD_CBC' || data.type === 'LIPID_PROFILE') {
        const title1 = data.type === 'BLOOD_CBC' ? 'TEST NAME' : 'PARAMETER';
        
        // Table Header Background
        doc.rect(50, 255, 512, 22).fill('#1976d2');
        doc.fillColor('#fff').font('Helvetica-Bold').fontSize(10);
        doc.text(title1, 65, 262);
        doc.text('RESULT', 210, 262);
        doc.text('UNIT', 330, 262);
        doc.text('REFERENCE RANGE', 430, 262);
        
        doc.fillColor('#000').font('Helvetica').fontSize(10);
        const drawRow = (y, name, res, unit, ref) => {
            doc.fillColor('#000'); // Ensure text is BLACK
            doc.font('Helvetica').text(name, 65, y);
            doc.font('Helvetica-Bold').text(res, 210, y);
            doc.font('Helvetica').text(unit, 330, y);
            doc.font('Helvetica').text(ref, 430, y);
            
            // Draw separator line using STROKE so it doesn't affect fill color
            doc.moveTo(50, y + 15).lineTo(562, y + 15).lineWidth(0.5).stroke('#eee');
        };

        if (data.type === 'BLOOD_CBC') {
            drawRow(290, 'Hemoglobin', '14.2', 'g/dL', '12.0 - 15.0');
            drawRow(315, 'Total WBC Count', '8500', '/cmm', '4000 - 11000');
            drawRow(340, 'Platelet Count', '2.4', 'Lakhs', '1.5 - 4.5');
            drawRow(365, 'RBC Count', '4.8', 'mill/cmm', '4.5 - 5.5');
        } else {
            drawRow(290, 'Total Cholesterol', '210', 'mg/dL', '< 200');
            drawRow(315, 'HDL Cholesterol', '45', 'mg/dL', '> 40');
            drawRow(340, 'LDL Cholesterol', '145', 'mg/dL', '< 100');
            drawRow(365, 'Triglycerides', '165', 'mg/dL', '< 150');
        }

        // Vertical Separators
        doc.lineWidth(0.5).strokeColor('#ddd');
        doc.moveTo(200, 255).lineTo(200, 395).stroke();
        doc.moveTo(320, 255).lineTo(320, 395).stroke();
        doc.moveTo(420, 255).lineTo(420, 395).stroke();

    } else if (data.type === 'MRI_BRAIN' || data.type === 'CHEST_XRAY') {
        doc.rect(50, 255, 512, 22).fill('#1976d2');
        doc.fillColor('#fff').font('Helvetica-Bold').fontSize(10).text('CLINICAL OBSERVATIONS & RADIOLOGICAL FINDINGS', 65, 262);
        
        doc.fillColor('#000').font('Helvetica').fontSize(11);
        if (data.type === 'MRI_BRAIN') {
            doc.font('Helvetica-Bold').text('FINDINGS:', 65, 290);
            doc.font('Helvetica').text('• No evidence of acute infarct or hemorrhage.', 85, 310);
            doc.text('• Ventricular system appears normal in size.', 85, 330);
            doc.text('• Major intracranial flow voids are preserved.', 85, 350);
            doc.rect(65, 380, 480, 0.5).fill('#eee');
            doc.font('Helvetica-Bold').text('IMPRESSION: Normal MRI Brain Study.', 65, 395);
        } else {
            doc.font('Helvetica-Bold').text('OBSERVATIONS:', 65, 290);
            doc.font('Helvetica').text('• Lung fields appear clear. No focal consolidation.', 85, 310);
            doc.text('• Cardiothoracic ratio is within normal limits.', 85, 330);
            doc.text('• Both costophrenic angles are sharp.', 85, 350);
            doc.rect(65, 380, 480, 0.5).fill('#eee');
            doc.font('Helvetica-Bold').text('CONCLUSION: Normal Chest Radiograph.', 65, 395);
        }
    }
 else {
        doc.text('Detailed clinical observations have been recorded for this study.');
        doc.text('All parameters are within the expected physiological range for the patient age group.');
        doc.text('Please correlate with clinical symptoms for final diagnosis.');
    }

    // Digital Verification Box
    doc.rect(50, 580, 200, 50).dash(5, { space: 2 }).stroke('#1976d2');
    doc.fillColor('#1976d2').fontSize(8).font('Helvetica-Bold').text('VERIFIED DOCUMENT', 60, 590);
    doc.fontSize(7).font('Helvetica').text(`ID: ${data.id}_${data.type}`, 60, 605);
    doc.text(`Timestamp: ${new Date().toLocaleString()}`, 60, 615);

    // Footer
    doc.rect(50, 650, 512, 1).undash().fill('#ddd');
    doc.fillColor('#666').fontSize(8).text('Verified Digitally by Senior Consultant Pathologist', 50, 665);
    doc.text('This is a computer generated report and does not require a physical signature.', 50, 675);

    doc.end();
    console.log(`Generated: ${filename}`);
};

reports.forEach((r, i) => generateReport(r, i));
