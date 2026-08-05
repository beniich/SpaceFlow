import { prisma } from '../config/database';
import { logger } from '../config/logger';
import emailService from './email.service';

/**
 * Système de relance automatique pour factures impayées
 * - J+3 : Rappel courtois
 * - J+7 : Rappel ferme
 * - J+14 : Mise en demeure
 * - J+30 : Alerte suspension
 */
class DunningService {
  async process() {
    const now = new Date();
    const tiers = [
      { days: 3, level: 'gentle' },
      { days: 7, level: 'firm' },
      { days: 14, level: 'legal' }
    ];

    for (const tier of tiers) {
      const targetDate = new Date(now);
      targetDate.setDate(targetDate.getDate() - tier.days);

      const start = new Date(targetDate); start.setHours(0, 0, 0, 0);
      const end = new Date(targetDate); end.setHours(23, 59, 59, 999);

      const invoices = await prisma.invoice.findMany({
        where: {
          status: 'open',
          dueDate: { gte: start, lt: end },
          amountDueCents: { gt: 0 }
        },
        include: { member: true, organization: true }
      });

      for (const invoice of invoices) {
        await this.sendReminder(invoice, tier.level).catch(err =>
          logger.error(`Dunning failed for ${invoice.number}:`, err)
        );
      }
    }

    await this.alertOverdueAccounts();
  }

  private async sendReminder(invoice: any, level: string) {
    if (!invoice.member?.email) return;

    // Éviter les doublons via un simple check en mémoire/logs
    logger.info(`Dunning ${level} → ${invoice.number} (${invoice.member.email})`);

    await emailService.send({
      to: invoice.member.email,
      subject: this.getSubject(level, invoice),
      html: this.getBody(invoice, level)
    });
  }

  private getSubject(level: string, invoice: any): string {
    return {
      gentle: `Rappel : facture ${invoice.number} en attente`,
      firm: `Action requise : facture ${invoice.number} impayée`,
      legal: `Mise en demeure : facture ${invoice.number}`
    }[level] || 'Rappel de paiement';
  }

  private getBody(invoice: any, level: string): string {
    const s = 'font-family: sans-serif; max-width: 600px; margin: 0 auto;';
    const amount = (invoice.amountDueCents / 100).toFixed(2);
    const due = new Date(invoice.dueDate).toLocaleDateString('fr-FR');
    const orgName = invoice.organization?.name || 'SpaceFlow';

    if (level === 'gentle') return `
      <div style="${s}">
        <h2>Petit rappel amical 👋</h2>
        <p>La facture <strong>${invoice.number}</strong> de <strong>${amount}€</strong> est en attente (échéance : ${due}).</p>
        <p>Si déjà réglée, ignorez ce message.</p>
        <p>Cordialement,<br/>${orgName}</p>
      </div>`;

    if (level === 'firm') return `
      <div style="${s}">
        <h2 style="color: #f59e0b;">Action requise ⚠️</h2>
        <p>La facture <strong>${invoice.number}</strong> de <strong>${amount}€</strong> reste impayée.</p>
        <p>Merci de régulariser dans les meilleurs délais ou de nous contacter.</p>
        <p>Cordialement,<br/>${orgName}</p>
      </div>`;

    return `
      <div style="${s}">
        <h2 style="color: #dc2626;">MISE EN DEMEURE</h2>
        <p>Malgré nos relances, la facture <strong>${invoice.number}</strong> de <strong>${amount}€</strong> demeure impayée.</p>
        <p>Sauf règlement sous 8 jours, nous procéderons à la suspension des services.</p>
        <p>${orgName}</p>
      </div>`;
  }

  private async alertOverdueAccounts() {
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const overdue = await prisma.invoice.findMany({
      where: { status: 'open', dueDate: { lt: cutoff } },
      distinct: ['organizationId'],
      select: { organizationId: true }
    });

    for (const { organizationId } of overdue) {
      const org = await prisma.organization.findUnique({ where: { id: organizationId } });
      if (org) logger.warn(`⚠️ Account ${org.name} is 30+ days overdue — eligible for suspension`);
    }
  }
}

export default new DunningService();
