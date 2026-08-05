import cron from 'node-cron';
import { prisma } from '../config/database';
import invoiceService from '../services/invoice.service';
import { logger } from '../config/logger';
import { addDays, addMonths, startOfMonth } from 'date-fns';

class BillingJobs {
  start() {
    // Factures mensuelles : 1er du mois à 2h
    cron.schedule('0 2 1 * *', () =>
      this.generateMonthlyInvoices().catch(err =>
        logger.error('Monthly invoice generation failed:', err)
      )
    );

    // Retry paiements échoués : tous les jours à 10h
    cron.schedule('0 10 * * *', () =>
      this.retryFailedPayments().catch(err =>
        logger.error('Payment retry failed:', err)
      )
    );

    // Alertes expiration : tous les jours à 9h
    cron.schedule('0 9 * * *', () =>
      this.checkExpiringSubscriptions().catch(err =>
        logger.error('Expiration check failed:', err)
      )
    );

    logger.info('✅ Billing cron jobs started');
  }

  async generateMonthlyInvoices() {
    logger.info('Generating monthly subscription invoices...');

    const subs = await prisma.subscription.findMany({
      where: { status: 'active' },
      include: { organization: true }
    });

    const prices: Record<string, number> = {
      STARTER: 2900,
      PRO: 7900,
      ENTERPRISE: 29900
    };

    let created = 0;

    for (const sub of subs) {
      if (sub.plan === 'FREE') continue;

      const monthStart = startOfMonth(new Date());
      const existing = await prisma.invoice.findFirst({
        where: {
          organizationId: sub.organizationId,
          type: 'SUBSCRIPTION',
          createdAt: { gte: monthStart }
        }
      });
      if (existing) continue;

      const amountCents = prices[sub.plan] || 0;
      if (!amountCents) continue;

      // Trouver un member owner si dispo
      const ownerUser = await prisma.user.findFirst({
        where: { organizationId: sub.organizationId }
      });
      const member = ownerUser?.memberId
        ? await prisma.member.findUnique({ where: { id: ownerUser.memberId } })
        : null;

      const number = `INV-${new Date().getFullYear()}-${String(Date.now()).slice(-5)}`;

      await prisma.invoice.create({
        data: {
          organizationId: sub.organizationId,
          number,
          status: 'open',
          type: 'SUBSCRIPTION',
          subtotalCents: amountCents,
          taxCents: Math.round(amountCents * 0.2),
          totalCents: Math.round(amountCents * 1.2),
          amountPaidCents: 0,
          amountDueCents: Math.round(amountCents * 1.2),
          amount: amountCents,
          amountDue: amountCents,
          amountPaid: 0,
          currency: 'eur',
          dueDate: addDays(new Date(), 15),
          periodStart: new Date(),
          periodEnd: addMonths(new Date(), 1),
          ...(member ? { memberId: member.id } : {}),
          items: {
            create: [{
              description: `Abonnement SpaceFlow ${sub.plan}`,
              quantity: 1,
              unitPriceCents: amountCents,
              taxRate: 20,
              amountCents,
              unitPrice: amountCents / 100,
              amount: amountCents / 100,
              order: 0
            }]
          }
        }
      });

      created++;
    }

    logger.info(`✅ Generated ${created} subscription invoices`);
  }

  async retryFailedPayments() {
    logger.info('Checking failed payments...');

    const failedInvoices = await prisma.invoice.findMany({
      where: {
        status: 'open',
        dueDate: { lt: new Date() }
      },
      take: 50
    });

    logger.info(`Found ${failedInvoices.length} overdue invoices`);
  }

  async checkExpiringSubscriptions() {
    const in7Days = addDays(new Date(), 7);

    const expiring = await prisma.subscription.findMany({
      where: {
        status: 'active',
        currentPeriodEnd: { lte: in7Days, gte: new Date() },
        cancelAtPeriodEnd: false
      },
      include: { organization: true }
    });

    for (const sub of expiring) {
      logger.info(`Subscription ${sub.id} for org ${sub.organization?.name} expires ${sub.currentPeriodEnd}`);
      // TODO: send email notification
    }
  }
}

export default new BillingJobs();
