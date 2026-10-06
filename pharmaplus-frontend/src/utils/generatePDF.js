import html2pdf from 'html2pdf.js';

export const downloadPrescriptionPDF = (prescription, patientName) => {
  // Temporary HTML template for PDF formatting
  const element = document.createElement('div');
  element.innerHTML = `
    <div style="padding: 30px; font-family: Arial, sans-serif; color: #1e293b; max-width: 700px; margin: auto;">
      <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #0284c7; padding-bottom: 15px; margin-bottom: 20px;">
        <div>
          <h1 style="color: #0284c7; margin: 0; font-size: 24px;">➕ PharmaPlus</h1>
          <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">Healthcare & Consultation Portal</p>
        </div>
        <div style="text-align: right;">
          <h3 style="margin: 0; font-size: 16px;">OFFICIAL PRESCRIPTION</h3>
          <p style="margin: 5px 0 0 0; color: #64748b; font-size: 12px;">Date: ${new Date(prescription.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>
      </div>

      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; margin-bottom: 25px;">
        <div style="display: flex; justify-content: space-between;">
          <div>
            <strong style="color: #64748b; font-size: 12px; display: block;">PATIENT NAME</strong>
            <span style="font-size: 16px; font-weight: bold;">${patientName || 'Patient'}</span>
          </div>
          <div>
            <strong style="color: #64748b; font-size: 12px; display: block;">PRESCRIPTION ID</strong>
            <span style="font-size: 14px; font-weight: bold; color: #0284c7;">#${(prescription.id || '12345678').slice(0, 8)}</span>
          </div>
        </div>
      </div>

      <div style="margin-bottom: 25px;">
        <h3 style="color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; font-size: 16px;">💊 Prescribed Medicines</h3>
        <div style="background-color: #ffffff; border: 1px solid #e2e8f0; border-radius: 8px; padding: 15px; font-size: 14px; line-height: 1.6;">
          ${prescription.medicines || 'No specific medicines listed.'}
        </div>
      </div>

      <div style="margin-bottom: 30px;">
        <h3 style="color: #0f172a; border-bottom: 1px solid #cbd5e1; padding-bottom: 8px; font-size: 16px;">📝 Doctor Instructions</h3>
        <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; color: #166534; border-radius: 8px; padding: 15px; font-size: 14px; line-height: 1.6;">
          ${prescription.instructions || 'Take medicines as directed by practitioner.'}
        </div>
      </div>

      <div style="margin-top: 50px; border-top: 1px dashed #cbd5e1; padding-top: 20px; text-align: center; color: #94a3b8; font-size: 11px;">
        <p style="margin: 0;">This is a computer-generated medical prescription issued via PharmaPlus Healthcare System.</p>
      </div>
    </div>
  `;

  const options = {
    margin: 10,
    filename: `Prescription_${patientName}_${Date.now()}.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };

  html2pdf().set(options).from(element).save();
};