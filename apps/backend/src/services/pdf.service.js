const PDFDocument = require('pdfkit');

class PdfService {
  async generateWorkOrderReport(workOrder) {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const buffers = [];

      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // En-tête officiel BeeCarbonat & Spider CAFM
      doc.fontSize(24).fillColor('#D97706').text('BeeCarbonat', { align: 'left', continued: true })
         .fillColor('#000000').text(' x Spider CAFM', { align: 'left' });
      doc.fontSize(10).fillColor('#666666').text('Enterprise Facility Management & Predictive Maintenance');
      doc.moveDown();
      
      doc.fontSize(20).fillColor('#000000').text('RAPPORT D\'INTERVENTION OFFICIEL', { align: 'center' });
      doc.moveDown();
      doc.fontSize(10).text(`Généré le : ${new Date().toLocaleDateString('fr-FR')} à ${new Date().toLocaleTimeString('fr-FR')}`, { align: 'right' });
      doc.moveDown();

      // Informations Ordre de Travail
      doc.fontSize(14).text(`Ordre de Travail: ${workOrder.title}`, { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10)
         .text(`ID Ticket : ${workOrder.id}`)
         .text(`Priorité : ${workOrder.priority}`)
         .text(`Catégorie : ${workOrder.type}`)
         .text(`Statut : ${workOrder.status}`)
         .text(`Description : ${workOrder.description || 'N/A'}`)
         .text(`Date programmée : ${workOrder.scheduledAt ? new Date(workOrder.scheduledAt).toLocaleDateString('fr-FR') : 'N/A'}`)
         .text(`Équipement cible : ${workOrder.asset?.name || 'N/A'} (Zone: ${workOrder.asset?.zone || '-'}, Étage: ${workOrder.asset?.floor || '-'})`);

      doc.moveDown();
      doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();

      // Étapes de procédure
      if (workOrder.procedureSteps) {
        let steps = typeof workOrder.procedureSteps === 'string' ? JSON.parse(workOrder.procedureSteps) : workOrder.procedureSteps;
        if (steps && steps.length > 0) {
          doc.fontSize(12).text('Procédure d\'intervention', { underline: true });
          doc.moveDown(0.5);
          steps.forEach((step, idx) => {
            const statusMark = step.isDone ? '[X]' : '[ ]';
            const validText = step.isDone ? ` (Validé par ${step.validatedBy || 'Technicien'} le ${new Date(step.validatedAt).toLocaleDateString('fr-FR')})` : '';
            doc.fontSize(10).text(`${statusMark} ${idx + 1}. ${step.title}${validText}`);
            if (step.description) {
              doc.fontSize(9).fillColor('#666666').text(`    Détail: ${step.description}`);
              doc.fillColor('#000000');
            }
          });
          doc.moveDown();
        }
      }

      // Pièces et Matériel
      if (workOrder.partsUsed) {
        let parts = typeof workOrder.partsUsed === 'string' ? JSON.parse(workOrder.partsUsed) : workOrder.partsUsed;
        if (parts && parts.length > 0) {
          doc.fontSize(12).text('Pièces & Matériel Utilisé', { underline: true });
          doc.moveDown(0.5);
          let partsTotal = 0;
          parts.forEach(part => {
            const cost = (part.quantity * part.unitCost).toFixed(2);
            partsTotal += (part.quantity * part.unitCost);
            doc.fontSize(10).text(`- ${part.quantity}x ${part.name} (Réf: ${part.partNumber || '-'}) : ${cost} €`);
          });
          doc.moveDown(0.5);
          doc.fontSize(10).text(`Total Pièces : ${partsTotal.toFixed(2)} €`, { align: 'right' });
          doc.moveDown();
        }
      }

      // Clôture et Résolution
      doc.strokeColor('#aaaaaa').lineWidth(1).moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown();
      doc.fontSize(12).text('Diagnostic & Clôture', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10)
         .text(`Cause Racine : ${workOrder.rootCause || 'Non spécifiée'}`)
         .text(`Notes de Résolution : ${workOrder.resolutionNotes || 'Aucune note'}`)
         .text(`Temps effectif (heures) : ${workOrder.actualDuration ? (workOrder.actualDuration / 60).toFixed(2) : 'N/A'}`);

      // Intervenant & Coûts
      doc.moveDown();
      doc.fontSize(12).text('Intervenant & Coûts', { underline: true });
      doc.moveDown(0.5);
      doc.fontSize(10)
         .text(`Assigné à : ${workOrder.assignee ? `${workOrder.assignee.fullName || workOrder.assignee.email}` : 'Non assigné'}`)
         .text(`Clôturé par : ${workOrder.completedBy || 'N/A'}`)
         .text(`Coût total de l'intervention : ${workOrder.totalCost ? `${workOrder.totalCost.toFixed(2)} €` : 'Calcul en cours'}`);

      // Signatures
      doc.moveDown(3);
      doc.fontSize(10).text('Signature Technicien', { align: 'left', continued: true })
         .text('Signature Client / Manager', { align: 'right' });
      
      doc.moveDown(2);
      doc.strokeColor('#000000').lineWidth(1)
         .moveTo(50, doc.y).lineTo(250, doc.y).stroke()
         .moveTo(350, doc.y).lineTo(550, doc.y).stroke();

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
