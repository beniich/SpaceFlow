import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export async function exportDashboardToPDF(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;

  try {
    const canvas = await html2canvas(element, { 
        scale: 2,
        useCORS: true,
        backgroundColor: '#f8fafc' // slate-50
    });
    const imgData = canvas.toDataURL('image/png');
    
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`AuditAX_Rapport_${new Date().toISOString().slice(0,10)}.pdf`);
  } catch (error) {
    console.error("Erreur durant l'export PDF:", error);
  }
}
