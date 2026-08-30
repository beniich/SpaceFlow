const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key');
const FROM_EMAIL = process.env.FROM_EMAIL || 'BeeCarbonat <noreply@beecarbonat.ricecloud.net>';

class EmailService {
  /**
   * Email générique
   */
  async send({ to, subject, html, text, attachments }) {
    if (!process.env.RESEND_API_KEY) {
      console.log('📧 Mock Email sent to:', to, 'Subject:', subject);
      return { id: 'mock-id' };
    }

    try {
      const { data, error } = await resend.emails.send({
        from: FROM_EMAIL,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        attachments
      });

      if (error) throw error;
      return data;
    } catch (err) {
      console.error('Email error:', err);
      throw err;
    }
  }

  async sendWelcome(email, firstName) {
    return this.send({
      to: email,
      subject: '🎉 Bienvenue sur CAFM CRM',
      html: `
        <h1>Bonjour ${firstName},</h1>
        <p>Votre compte CAFM CRM est actif. Profitez de 14 jours d'essai gratuit.</p>
        <a href="${process.env.APP_URL || 'http://localhost:3000'}/crm/login">Se connecter</a>
      `
    });
  }

  async sendReport(email, reportData, pdfBuffer) {
    return this.send({
      to: email,
      subject: `📊 Rapport ${reportData.type} - ${new Date().toLocaleDateString('fr-FR')}`,
      html: `<p>Bonjour,</p><p>Veuillez trouver votre rapport en pièce jointe.</p>`,
      attachments: [{
        filename: `rapport-${Date.now()}.pdf`,
        content: pdfBuffer
      }]
    });
  }

  async sendAlert(email, alert) {
    return this.send({
      to: email,
      subject: `🚨 ${alert.title}`,
      html: `
        <h2>${alert.title}</h2>
        <p>${alert.message}</p>
        <p><strong>Sévérité:</strong> ${alert.severity}</p>
      `
    });
  }
  async sendPasswordReset(email, resetUrl) {
    return this.send({
      to: email,
      subject: '🔒 Réinitialisation de votre mot de passe',
      html: `
        <h2>Demande de réinitialisation de mot de passe</h2>
        <p>Vous avez demandé la réinitialisation de votre mot de passe BeeCarbonat. Cliquez sur le lien ci-dessous pour créer un nouveau mot de passe :</p>
        <p><a href="${resetUrl}" style="padding:10px 20px;background:#00dbe7;color:#05070a;text-decoration:none;border-radius:5px;display:inline-block;">Réinitialiser mon mot de passe</a></p>
        <p>Si vous n'êtes pas à l'origine de cette demande, vous pouvez ignorer cet email.</p>
        <p>Ce lien expirera dans 1 heure.</p>
      `
    });
  }

  async sendVerificationEmail(email, verificationUrl) {
    return this.send({
      to: email,
      subject: '✅ Vérifiez votre adresse email',
      html: `
        <h2>Bienvenue sur BeeCarbonat !</h2>
        <p>Pour finaliser la création de votre compte, veuillez vérifier votre adresse email en cliquant sur le lien ci-dessous :</p>
        <p><a href="${verificationUrl}" style="padding:10px 20px;background:#00dbe7;color:#05070a;text-decoration:none;border-radius:5px;display:inline-block;">Vérifier mon email</a></p>
      `
    });
  }
}

module.exports = new EmailService();
