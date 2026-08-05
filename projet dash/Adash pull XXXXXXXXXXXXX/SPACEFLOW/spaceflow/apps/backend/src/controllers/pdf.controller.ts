import { Response } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';
import pdfService from '../services/pdf.service';

export const generateInvoicePDF = async (req: any, res: Response) => {
  try {
    const invoice = await prisma.invoice.findFirst({
      where: { id: req.params.id, organizationId: req.user.organizationId },
      include: { organization: true, member: true, items: { orderBy: { order: 'asc' } } }
    });

    if (!invoice) throw new AppError('Invoice not found', 404);

    const pdfBuffer = await pdfService.generateInvoicePDF({
      invoice: {
        number: invoice.number,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        periodStart: invoice.periodStart ?? undefined,
        periodEnd: invoice.periodEnd ?? undefined,
        subtotalCents: invoice.subtotalCents,
        taxCents: invoice.taxCents,
        totalCents: invoice.totalCents,
        amountPaidCents: invoice.amountPaidCents,
        status: invoice.status,
        notes: invoice.notes ?? undefined
      },
      organization: {
        name: invoice.organization.name,
        address: invoice.organization.address ?? undefined,
        city: invoice.organization.city ?? undefined,
        postalCode: invoice.organization.postalCode ?? undefined,
        country: invoice.organization.country ?? undefined,
        email: invoice.organization.email,
        phone: invoice.organization.phone ?? undefined
      },
      member: {
        email: invoice.member?.email || 'no-email@example.com',
        firstName: invoice.member?.firstName ?? undefined,
        lastName: invoice.member?.lastName ?? undefined,
        companyName: invoice.member?.companyName ?? undefined
      },
      items: invoice.items.map(item => ({
        description: item.description,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
        amountCents: item.amountCents
      }))
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="facture-${invoice.number}.pdf"`);
    res.send(pdfBuffer);
  } catch (err: any) {
    if (err instanceof AppError) {
      res.status(err.statusCode).json({ error: err.message });
    } else {
      res.status(500).json({ error: 'Failed to generate PDF' });
    }
  }
};
