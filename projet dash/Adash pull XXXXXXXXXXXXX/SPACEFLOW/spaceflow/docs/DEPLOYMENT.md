# Deployment Guide

## Prerequisites
- Linux VPS (Ubuntu 22+, 2GB RAM min)
- Domain name
- Stripe account
- Resend account
- Firebase project

## Quick Deploy

```bash
# 1. Clone and setup
git clone https://github.com/your-org/spaceflow.git
cd spaceflow
cp apps/backend/.env.example apps/backend/.env.production
# Edit .env.production with your values

# 2. Run deployment script
chmod +x deploy.sh
./deploy.sh

# 3. Setup SSL
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com

# 4. Setup Stripe webhook
# Stripe Dashboard > Webhooks > Add endpoint
# URL: https://yourdomain.com/api/stripe/webhook
```

## Environment Variables

See `apps/backend/.env.production`
