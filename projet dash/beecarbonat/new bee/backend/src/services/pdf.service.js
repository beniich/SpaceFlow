const PDFDocument = require('pdfkit');

class PdfService {
  async generateWorkOrderReport(workOrder) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // Header
      doc.fontSize(20).text('RAPPORT D\'INTERVENTION', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Généré le : ${new Date().toLocaleDateString('fr-FR')}`, { align: 'right' });
      doc.moveDown();

      // Informations Ordre de Travail
      doc.fontSize(14).text(`Ordre de Travail: ${workOrder.title}`, { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10)
         .text(`Priorité : ${workOrder.priority}`)
         .text(`Statut : ${workOrder.status}`)
         .text(`Description : ${workOrder.description || 'N/A'}`)
         .text(`Date programmée : ${workOrder.scheduledAt ? new Date(workOrder.scheduledAt).toLocaleDateString('fr-FR') : 'N/A'}`)
         .text(`Équipement concerné : ${workOrder.asset?.name || 'N/A'}`);

      doc.moveDown();
      doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Intervenant
      doc.fontSize(12).text('Intervenant & Coûts', { underline: true });
      doc.fontSize(10)
         .text(`Assigné à : ${workOrder.assignedTo ? `${workOrder.assignedTo.firstName} ${workOrder.assignedTo.lastName}` : 'Non assigné'}`)
         .text(`Coût estimé : ${workOrder.estimatedCost ? `${workOrder.estimatedCost} €` : 'N/A'}`)
         .text(`Coût réel : ${workOrder.actualCost ? `${workOrder.actualCost} €` : 'N/A'}`);

      doc.end();
    });
  }

  async generateInventoryReport(parts) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      doc.fontSize(20).text('RAPPORT D\'INVENTAIRE DES PIÈCES', { align: 'center' });
      doc.moveDown();

      parts.forEach((p, idx) => {
        doc.fontSize(11).text(`${idx + 1}. [${p.partNumber}] ${p.name} - Stock: ${p.quantity} (${p.unitCost} €/unité)`);
      });

      doc.end();
    });
  }
}

module.exports = new PdfService();
