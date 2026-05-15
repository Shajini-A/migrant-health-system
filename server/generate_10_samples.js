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
    if (data.type === 'BLOOD_CBC') {
        doc.text('TEST NAME              RESULT       UNIT       REF. RANGE', { underline: true });
        doc.text('Hemoglobin             14.2         g/dL       12.0 - 15.0');
        doc.text('Total WBC Count        8500         /cmm       4000 - 11000');
        doc.text('Platelet Count         2.4          Lakhs      1.5 - 4.5');
    } else if (data.type === 'MRI_BRAIN') {
        doc.text('FINDINGS:', { bold: true });
        doc.text('• No evidence of acute infarct or hemorrhage.');
        doc.text('• Ventricular system appears normal in size.');
        doc.text('• Major intracranial flow voids are preserved.');
        doc.text('IMPRESSION: Normal MRI Brain Study.');
    } else if (data.type === 'LIPID_PROFILE') {
        doc.text('Total Cholesterol      210 (High)   mg/dL      < 200');
        doc.text('HDL Cholesterol        45           mg/dL      > 40');
        doc.text('LDL Cholesterol        145 (High)   mg/dL      < 100');
        doc.text('Triglycerides          160          mg/dL      < 150');
    } else if (data.type === 'CHEST_XRAY') {
        doc.text('OBSERVATIONS:');
        doc.text('• Lung fields appear clear. No focal consolidation.');
        doc.text('• Cardiothoracic ratio is within normal limits.');
        doc.text('• Both costophrenic angles are sharp.');
        doc.text('CONCLUSION: Normal Chest Radiograph.');
    } else {
        doc.text('Detailed clinical observations have been recorded for this study.');
        doc.text('All parameters are within the expected physiological range for the patient age group.');
        doc.text('Please correlate with clinical symptoms for final diagnosis.');
    }

    // Footer
    doc.moveDown(10);
    doc.rect(50, 650, 512, 1).fill('#ddd');
    doc.fillColor('#666').fontSize(8).text('Verified Digitally by Senior Consultant Pathologist', 50, 665);
    doc.text('This is a computer generated report and does not require a physical signature.', 50, 675);

    doc.end();
    console.log(`Generated: ${filename}`);
};

reports.forEach((r, i) => generateReport(r, i));
