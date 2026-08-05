import { prisma } from '../config/database';
import { AppError } from '../middleware/error.middleware';

interface InvoiceItemInput {
  description: string;
  quantity: number;
  unitPriceCents: number;
  taxRate?: number;
}

interface CreateInvoiceInput {
  organizationId: string;
  memberId: string;
  type?: string;
  items: InvoiceItemInput[];
  dueDate?: Date;
  notes?: string;
}

class InvoiceService {
  async create(input: CreateInvoiceInput) {
    let subtotalCents = 0;
    let taxCents = 0;

    const itemsData = input.items.map((item, index) => {
      const itemSubtotal = Math.round(item.quantity * item.unitPriceCents);
      const itemTax = Math.round(itemSubtotal * (item.taxRate ?? 20) / 100);
      subtotalCents += itemSubtotal;
      taxCents += itemTax;
      return {
        description: item.description,
        quantity: item.quantity,
        unitPriceCents: item.unitPriceCents,
        taxRate: item.taxRate ?? 20,
        amountCents: itemSubtotal,
        unitPrice: item.unitPriceCents / 100,
        amount: itemSubtotal / 100,
        order: index
      };
    });

    const totalCents = subtotalCents + taxCents;
    const number = await this.generateInvoiceNumber(input.organizationId);
    const issueDate = new Date();
    const dueDate = input.dueDate || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
    const periodStart = new Date(issueDate.getFullYear(), issueDate.getMonth(), 1);
    const periodEnd = new Date(issueDate.getFullYear(), issueDate.getMonth() + 1, 0);

    return prisma.invoice.create({
      data: {
        organizationId: input.organizationId,
        number,
        type: input.type || 'MANUAL',
        status: 'open',
        subtotalCents,
        taxCents,
        totalCents,
        amountPaidCents: 0,
        amountDueCents: totalCents,
        amount: totalCents,
        amountDue: totalCents,
        amountPaid: 0,
        issueDate,
        dueDate,
        periodStart,
        periodEnd,
        notes: input.notes,
        memberId: input.memberId,
        items: { create: itemsData }
      },
      include: { member: true, items: true }
    });
  }

  private async generateInvoiceNumber(organizationId: string): Promise<string> {
    const year = new Date().getFullYear();
    const count = await prisma.invoice.count({
      where: { organizationId, createdAt: { gte: new Date(year, 0, 1) } }
    });
    return `INV-${year}-${String(count + 1).padStart(5, '0')}`;
  }

  async markAsPaid(invoiceId: string, organizationId: string) {
    const invoice = await prisma.invoice.findFirst({ where: { id: invoiceId, organizationId } });
    if (!invoice) throw new AppError('Invoice not found', 404);

    return prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        status: 'paid',
        amountPaidCents: invoice.totalCents,
        amountDueCents: 0,
        amountPaid: invoice.totalCents / 100,
        amountDue: 0,
        paidAt: new Date()
      }
    });
  }

  async list(organizationId: string, options: {
    status?: string;
    memberId?: string;
    page?: number;
    limit?: number;
  } = {}) {
    const { status, memberId, page = 1, limit = 25 } = options;
    const where: any = { organizationId };
    if (status) where.status = status;
    if (memberId) where.memberId = memberId;

    const [invoices, total] = await Promise.all([
      prisma.invoice.findMany({
        where,
        include: {
          member: { select: { id: true, firstName: true, lastName: true, companyName: true, email: true } },
          _count: { select: { items: true } }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.invoice.count({ where })
    ]);

    return { invoices, total, page, limit, pages: Math.ceil(total / limit) };
  }

  async get(invoiceId: string, organizationId: string) {
    const invoice = await prisma.invoice.findFirst({
      where: { id: invoiceId, organizationId },
      include: { member: true, organization: true, items: { orderBy: { order: 'asc' } } }
    });
    if (!invoice) throw new AppError('Invoice not found', 404);
    return invoice;
  }

  async getStats(organizationId: string) {
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1);

    const [total, paid, overdue, thisMonth, lastMonth, totalRevenue, pending] = await Promise.all([
      prisma.invoice.count({ where: { organizationId } }),
      prisma.invoice.count({ where: { organizationId, status: 'paid' } }),
      prisma.invoice.count({ where: { organizationId, status: 'open', dueDate: { lt: now } } }),
      prisma.invoice.aggregate({ where: { organizationId, createdAt: { gte: monthStart } }, _sum: { totalCents: true } }),
      prisma.invoice.aggregate({ where: { organizationId, createdAt: { gte: lastMonthStart, lt: monthStart } }, _sum: { totalCents: true } }),
      prisma.invoice.aggregate({ where: { organizationId, status: 'paid' }, _sum: { amountPaidCents: true } }),
      prisma.invoice.aggregate({ where: { organizationId, status: 'open' }, _sum: { amountDueCents: true } })
    ]);

    return {
      total, paid, overdue,
      thisMonthTotal: thisMonth._sum.totalCents || 0,
      lastMonthTotal: lastMonth._sum.totalCents || 0,
      totalRevenue: totalRevenue._sum.amountPaidCents || 0,
      pendingAmount: pending._sum.amountDueCents || 0
    };
  }
}

export default new InvoiceService();
