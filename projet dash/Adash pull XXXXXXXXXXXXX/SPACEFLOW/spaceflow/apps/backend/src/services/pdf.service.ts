import PDFDocument from 'pdfkit';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const COLORS = {
  primary: '#6366f1',
  text: '#1e293b',
  textMuted: '#64748b',
  border: '#e2e8f0',
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444'
};

interface InvoiceData {
  invoice: {
    number: string;
    issueDate: Date;
    dueDate: Date;
    periodStart?: Date;
    periodEnd?: Date;
    subtotalCents: number;
    taxCents: number;
    totalCents: number;
    amountPaidCents: number;
    status: string;
    notes?: string;
  };
  organization: {
    name: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
    email?: string;
    phone?: string;
    siret?: string;
    vatNumber?: string;
  };
  member: {
    email: string;
    firstName?: string;
    lastName?: string;
    companyName?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    country?: string;
  };
  items: Array<{
    description: string;
    quantity: number;
    unitPriceCents: number;
    amountCents: number;
  }>;
}

class PDFService {
  async generateInvoicePDF(data: InvoiceData): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          margin: 50,
          info: {
            Title: `Facture ${data.invoice.number}`,
            Author: data.organization.name
          }
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk) => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', reject);

        this.renderHeader(doc, data);
        this.renderInvoiceInfo(doc, data);
        this.renderParties(doc, data);
        this.renderItems(doc, data);
        this.renderTotals(doc, data);
        this.renderFooter(doc, data);

        doc.end();
      } catch (err) {
        reject(err);
      }
    });
  }

  private renderHeader(doc: any, data: InvoiceData) {
    const { organization } = data;

    doc.fillColor(COLORS.primary)
       .fontSize(24).font('Helvetica-Bold')
       .text(organization.name, 50, 50);

    let y = 80;
    doc.fillColor(COLORS.textMuted).fontSize(9).font('Helvetica');
    if (organization.email) { doc.text(organization.email, 50, y); y += 13; }
    if (organization.address) { doc.text(organization.address, 50, y); y += 13; }
    if (organization.city) {
      doc.text([organization.postalCode, organization.city].filter(Boolean).join(' '), 50, y);
      y += 13;
    }
    if (organization.phone) { doc.text(organization.phone, 50, y); y += 13; }
    if (organization.siret) { doc.text(`SIRET: ${organization.siret}`, 50, y); y += 13; }
    if (organization.vatNumber) { doc.text(`TVA: ${organization.vatNumber}`, 50, y); }

    doc.fillColor(COLORS.text).fontSize(28).font('Helvetica-Bold')
       .text('FACTURE', 350, 50, { align: 'right', width: 200 });
    doc.fontSize(11).font('Helvetica').fillColor(COLORS.textMuted)
       .text(data.invoice.number, 350, 85, { align: 'right', width: 200 });
  }

  private renderInvoiceInfo(doc: any, data: InvoiceData) {
    const y = 175;
    const { invoice } = data;

    doc.fillColor(COLORS.textMuted).fontSize(9).font('Helvetica')
       .text("DATE D'ÉMISSION", 50, y)
       .text("DATE D'ÉCHÉANCE", 250, y);

    doc.fillColor(COLORS.text).fontSize(11).font('Helvetica-Bold')
       .text(format(invoice.issueDate, 'dd MMMM yyyy', { locale: fr }), 50, y + 14)
       .text(format(invoice.dueDate, 'dd MMMM yyyy', { locale: fr }), 250, y + 14);

    if (invoice.periodStart && invoice.periodEnd) {
      doc.fillColor(COLORS.textMuted).fontSize(9).font('Helvetica').text('PÉRIODE', 400, y)
         .fillColor(COLORS.text).fontSize(10)
         .text(
           `${format(invoice.periodStart, 'dd MMM yyyy', { locale: fr })} - ${format(invoice.periodEnd, 'dd MMM yyyy', { locale: fr })}`,
           350, y + 14, { align: 'right', width: 200 }
         );
    }
  }

  private renderParties(doc: any, data: InvoiceData) {
    const y = 240;
    const { organization, member } = data;

    doc.fillColor(COLORS.textMuted).fontSize(9).font('Helvetica')
       .text('ÉMETTEUR', 50, y)
       .text('FACTURÉ À', 300, y);

    doc.fillColor(COLORS.text).fontSize(10).font('Helvetica-Bold')
       .text(organization.name, 50, y + 14);

    const memberName = member.companyName 
      || `${member.firstName || ''} ${member.lastName || ''}`.trim()
      || member.email;

    doc.fillColor(COLORS.text).fontSize(10).font('Helvetica-Bold')
       .text(memberName, 300, y + 14);

    let memberY = y + 32;
    doc.fillColor(COLORS.textMuted).fontSize(9).font('Helvetica');
    if (member.address) { doc.text(member.address, 300, memberY); memberY += 13; }
    if (member.city) {
      doc.text([member.postalCode, member.city].filter(Boolean).join(' '), 300, memberY);
      memberY += 13;
    }
    doc.text(member.email, 300, memberY);
  }

  private renderItems(doc: any, data: InvoiceData) {
    const startY = 360;
    const { items } = data;

    doc.rect(50, startY, 500, 25).fill(COLORS.primary);
    doc.fillColor('#ffffff').fontSize(10).font('Helvetica-Bold')
       .text('DESCRIPTION', 60, startY + 8)
       .text('QTÉ', 350, startY + 8, { width: 40, align: 'right' })
       .text('PRIX UNIT.', 395, startY + 8, { width: 70, align: 'right' })
       .text('TOTAL', 470, startY + 8, { width: 70, align: 'right' });

    let y = startY + 25;

    items.forEach((item, i) => {
      if (i % 2 === 1) {
        doc.rect(50, y, 500, 30).fill('#f8fafc');
      }
      doc.fillColor(COLORS.text).fontSize(9).font('Helvetica')
         .text(item.description.substring(0, 60), 60, y + 10, { width: 280 })
         .text(item.quantity.toString(), 350, y + 10, { width: 40, align: 'right' })
         .text(`${(item.unitPriceCents / 100).toFixed(2)}€`, 395, y + 10, { width: 70, align: 'right' })
         .font('Helvetica-Bold')
         .text(`${(item.amountCents / 100).toFixed(2)}€`, 470, y + 10, { width: 70, align: 'right' });
      y += 30;
    });

    doc.moveTo(50, y).lineTo(550, y).strokeColor(COLORS.border).lineWidth(1).stroke();
  }

  private renderTotals(doc: any, data: InvoiceData) {
    const y = 490;
    const { invoice } = data;
    const boxX = 380;
    const boxWidth = 170;

    doc.fillColor(COLORS.textMuted).fontSize(9).font('Helvetica')
       .text('Sous-total HT', boxX, y);
    doc.fillColor(COLORS.text).fontSize(10)
       .text(`${(invoice.subtotalCents / 100).toFixed(2)} €`, boxX, y, { width: boxWidth, align: 'right' });

    if (invoice.taxCents > 0) {
      doc.fillColor(COLORS.textMuted).fontSize(9).text('TVA', boxX, y + 20);
      doc.fillColor(COLORS.text).fontSize(10)
         .text(`${(invoice.taxCents / 100).toFixed(2)} €`, boxX, y + 20, { width: boxWidth, align: 'right' });
    }

    doc.moveTo(boxX, y + 40).lineTo(boxX + boxWidth, y + 40)
       .strokeColor(COLORS.text).lineWidth(1).stroke();

    doc.fillColor(COLORS.text).font('Helvetica-Bold').fontSize(13).text('TOTAL TTC', boxX, y + 50);
    doc.fillColor(COLORS.primary).fontSize(15)
       .text(`${(invoice.totalCents / 100).toFixed(2)} €`, boxX, y + 50, { width: boxWidth, align: 'right' });

    if (invoice.amountPaidCents > 0) {
      doc.fillColor(COLORS.success).fontSize(10).font('Helvetica-Bold')
         .text('✓ PAYÉ', boxX, y + 80);
      doc.fillColor(COLORS.text).font('Helvetica').fontSize(10)
         .text(`${(invoice.amountPaidCents / 100).toFixed(2)} €`, boxX, y + 80, { width: boxWidth, align: 'right' });
    }

    const statusColor = invoice.status === 'paid' ? COLORS.success :
                       invoice.status === 'overdue' ? COLORS.danger : COLORS.warning;
    doc.fillColor(statusColor).font('Helvetica-Bold').fontSize(10)
       .text(`Statut: ${this.translateStatus(invoice.status)}`, 50, y);

    if (invoice.notes) {
      doc.fillColor(COLORS.textMuted).font('Helvetica').fontSize(9)
         .text('Notes:', 50, y + 90)
         .text(invoice.notes.substring(0, 200), 50, y + 105, { width: 300 });
    }
  }

  private renderFooter(doc: any, data: InvoiceData) {
    const y = 720;
    doc.fillColor(COLORS.border).moveTo(50, y).lineTo(550, y).lineWidth(0.5).stroke();
    doc.fillColor(COLORS.textMuted).fontSize(8).font('Helvetica')
       .text(data.organization.name, 50, y + 15, { align: 'center', width: 500 })
       .text('Ce document a été généré automatiquement', 50, y + 30, { align: 'center', width: 500 });
    if (data.organization.email) {
      doc.text(`Contact: ${data.organization.email}`, 50, y + 45, { align: 'center', width: 500 });
    }
  }

  private translateStatus(status: string): string {
    const map: Record<string, string> = {
      draft: 'Brouillon', open: 'En attente', paid: 'Payée',
      void: 'Annulée', uncollectible: 'Impayable', overdue: 'En retard'
    };
    return map[status] || status;
  }
}

export default new PDFService();
