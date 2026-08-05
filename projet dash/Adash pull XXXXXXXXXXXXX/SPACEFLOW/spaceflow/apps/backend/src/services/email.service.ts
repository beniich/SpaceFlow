import { resend, FROM_EMAIL, FROM_NAME } from '../config/email';
import { logger } from '../config/logger';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

class EmailService {
  async send(data: EmailData): Promise<boolean> {
    if (!resend) {
      logger.warn('Email not sent (no Resend key):', data.subject);
      return false;
    }

    try {
      const result = await resend.emails.send({
        from: FROM_EMAIL,
        to: data.to,
        subject: data.subject,
        html: data.html,
        text: data.text
      });

      if (result.error) {
        logger.error('Resend error:', result.error);
        return false;
      }

      logger.info(`✅ Email sent to ${data.to}: ${data.subject}`);
      return true;
    } catch (err) {
      logger.error('Email send error:', err);
      return false;
    }
  }

  private getBaseTemplate(content: string): string {
    return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="font-family: -apple-system, sans-serif; background: #f8fafc; padding: 20px; margin: 0;">
<div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden;">
  <div style="background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white; padding: 32px; text-align: center;">
    <h1 style="margin: 0; font-size: 28px;">${FROM_NAME}</h1>
  </div>
  <div style="padding: 32px; color: #334155;">${content}</div>
  <div style="background: #f8fafc; padding: 20px; text-align: center; font-size: 12px; color: #64748b;">
    ${FROM_NAME} · Email automatique
  </div>
</div>
</body>
</html>`.trim();
  }

  async sendBookingConfirmation(booking: any): Promise<boolean> {
    const startTime = new Date(booking.startTime).toLocaleString('fr-FR', {
      weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit'
    });
    const endTime = new Date(booking.endTime).toLocaleString('fr-FR', {
      hour: '2-digit', minute: '2-digit'
    });

    const html = this.getBaseTemplate(`
      <h2 style="margin-top: 0;">Réservation confirmée ✓</h2>
      <p>Bonjour <strong>${booking.member.firstName || booking.member.companyName}</strong>,</p>
      <p>Votre réservation a bien été prise en compte.</p>
      <div style="background: #f1f5f9; border-left: 4px solid #6366f1; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <p><strong>Référence :</strong> ${booking.reference}</p>
        <p><strong>Espace :</strong> ${booking.space.name}</p>
        <p><strong>Début :</strong> ${startTime}</p>
        <p><strong>Fin :</strong> ${endTime}</p>
        <p><strong>Total :</strong> ${(booking.totalCents / 100).toFixed(2)}€</p>
      </div>
      <p>Présentez le QR code à l'accueil pour votre check-in.</p>
      <a href="${process.env.APP_URL}/bookings/${booking.id}" 
         style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Voir ma réservation
      </a>
    `);

    return this.send({
      to: booking.member.email,
      subject: `✅ Réservation confirmée - ${booking.reference}`,
      html
    });
  }

  async sendCheckInConfirmation(booking: any): Promise<boolean> {
    const html = this.getBaseTemplate(`
      <h2 style="margin-top: 0;">Bienvenue ! 👋</h2>
      <p>Bonjour <strong>${booking.member.firstName || booking.member.companyName}</strong>,</p>
      <p>Votre check-in a bien été enregistré.</p>
      <div style="background: #f1f5f9; border-left: 4px solid #10b981; padding: 12px 16px; margin: 16px 0; border-radius: 4px;">
        <p><strong>Espace :</strong> ${booking.space.name}</p>
        <p><strong>Réservation :</strong> ${booking.reference}</p>
        <p><strong>Heure d'arrivée :</strong> ${new Date(booking.checkedInAt).toLocaleString('fr-FR')}</p>
      </div>
      <p>Profitez bien de votre espace !</p>
    `);

    return this.send({
      to: booking.member.email,
      subject: `👋 Bienvenue chez ${FROM_NAME}`,
      html
    });
  }

  async sendBookingCancellation(booking: any): Promise<boolean> {
    const html = this.getBaseTemplate(`
      <h2 style="margin-top: 0;">Réservation annulée</h2>
      <p>Bonjour <strong>${booking.member.firstName || booking.member.companyName}</strong>,</p>
      <p>Votre réservation <strong>${booking.reference}</strong> a été annulée.</p>
      <a href="${process.env.APP_URL}/spaces" 
         style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Réserver à nouveau
      </a>
    `);

    return this.send({
      to: booking.member.email,
      subject: `Réservation annulée - ${booking.reference}`,
      html
    });
  }

  async sendWelcome(data: { email: string; firstName: string; organizationName: string }): Promise<boolean> {
    const html = this.getBaseTemplate(`
      <h2 style="margin-top: 0;">Bienvenue sur ${FROM_NAME} ! 🎉</h2>
      <p>Bonjour <strong>${data.firstName}</strong>,</p>
      <p>Votre compte <strong>${data.organizationName}</strong> a été créé avec succès.</p>
      <p><strong>14 jours d'essai gratuit</strong> vous attendent.</p>
      <h3>Prochaines étapes :</h3>
      <ol>
        <li>Configurez votre premier espace</li>
        <li>Ajoutez vos tarifs</li>
        <li>Invitez vos members</li>
      </ol>
      <a href="${process.env.APP_URL}/onboarding" 
         style="display: inline-block; background: #6366f1; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Commencer
      </a>
    `);

    return this.send({
      to: data.email,
      subject: `🎉 Bienvenue sur ${FROM_NAME} !`,
      html
    });
  }
}

export default new EmailService();
