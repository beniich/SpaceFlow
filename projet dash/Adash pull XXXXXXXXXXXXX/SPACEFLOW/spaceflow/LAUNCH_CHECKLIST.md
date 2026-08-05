# 🚀 Launch Checklist

## Pre-Launch (1 semaine avant)

### Backend
- [ ] Database migrations applied
- [ ] Environment variables set in production
- [ ] Firebase service account uploaded
- [ ] Stripe webhook configured and tested
- [ ] Email service (Resend) configured
- [ ] Sentry DSN configured
- [ ] Logs structured (JSON)
- [ ] Rate limiting tested
- [ ] CORS configured
- [ ] Helmet security headers
- [ ] Database backups configured (daily)

### Frontend
- [ ] Production build successful
- [ ] No console errors
- [ ] Lighthouse score > 90
- [ ] PWA installable
- [ ] Service Worker registered
- [ ] All env vars set
- [ ] Sentry initialized
- [ ] Analytics tracking (Plausible)

### Database
- [ ] Indexes on all foreign keys
- [ ] Connection pooling configured
- [ ] Backup strategy in place
- [ ] Migration tested in staging
- [ ] Demo data NOT in production

### Stripe
- [ ] Products created (Starter, Pro, Enterprise)
- [ ] Prices synced (monthly, yearly)
- [ ] Webhook endpoint tested with Stripe CLI
- [ ] Customer portal configured
- [ ] Tax rates set

## Launch Day

### Morning
- [ ] Deploy backend (docker compose up -d)
- [ ] Run migrations
- [ ] Seed demo data
- [ ] Verify health endpoint (/api/health)
- [ ] Check logs (no errors)

### Afternoon
- [ ] Deploy frontend
- [ ] Test login flow
- [ ] Test signup with license
- [ ] Test Stripe checkout (test card)
- [ ] Test invoice creation
- [ ] Test PDF generation
- [ ] Verify emails are sent

### Evening
- [ ] Monitor Sentry for errors
- [ ] Check response times
- [ ] Verify WebSocket connections
- [ ] Test PWA installation
- [ ] Check mobile responsive

## Post-Launch (1 semaine après)

### Metrics to Track
- [ ] Sign-up conversion rate
- [ ] Time to first value (TTV)
- [ ] Daily/Monthly active users
- [ ] Churn rate
- [ ] MRR growth
- [ ] NPS score
- [ ] Support ticket volume
- [ ] P95 response time < 500ms
- [ ] Uptime > 99.5%

### Customer Support
- [ ] Help center articles
- [ ] Email templates ready
- [ ] Onboarding email sequence
- [ ] Slack/Discord channel for support
- [ ] Status page (statuspage.io)
