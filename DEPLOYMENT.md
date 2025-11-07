# Deployment Guide

This guide covers deploying the BigSix AutoSales Expense Tracker to production environments.

## Prerequisites

- Node.js v18+ installed
- PostgreSQL database (managed or self-hosted)
- Domain name (optional)
- SSL certificate (for HTTPS)

## Deployment Options

### Option 1: Heroku (Easiest)

#### Frontend Deployment

1. Install Heroku CLI: https://devcenter.heroku.com/articles/heroku-cli

2. Create new Heroku app:
```bash
cd expenses-app
heroku create your-app-name-frontend
```

3. Install buildpacks:
```bash
heroku buildpacks:add heroku/nodejs
```

4. Deploy:
```bash
git push heroku main
```

#### Backend Deployment

1. Create separate Heroku app:
```bash
cd server
heroku create your-app-name-backend
```

2. Add PostgreSQL addon:
```bash
heroku addons:create heroku-postgresql:hobby-dev
```

3. Set environment variables:
```bash
heroku config:set NODE_ENV=production
heroku config:set JWT_SECRET=$(openssl rand -base64 32)
heroku config:set FRONTEND_URL=https://your-app-name-frontend.herokuapp.com
```

4. Run migrations:
```bash
heroku pg:psql < src/config/schema.sql
```

5. Deploy:
```bash
git push heroku main
```

6. Update frontend API URL:
```bash
# In frontend Heroku app
heroku config:set VITE_API_URL=https://your-app-name-backend.herokuapp.com/api
```

### Option 2: Railway

1. Sign up at https://railway.app

2. Create new project

3. Deploy PostgreSQL:
   - Click "New" → "Database" → "PostgreSQL"
   - Note connection string

4. Deploy backend:
   - Click "New" → "GitHub Repo"
   - Select repository
   - Set root directory to `server`
   - Add environment variables in dashboard
   - Run schema: `railway run psql $DATABASE_URL < src/config/schema.sql`

5. Deploy frontend:
   - Create another service from same repo
   - Set root directory to project root
   - Set environment variable: `VITE_API_URL=https://your-backend.railway.app/api`

### Option 3: AWS (Production)

#### 1. Database Setup (RDS)

```bash
# Create RDS PostgreSQL instance
aws rds create-db-instance \
  --db-instance-identifier bigsix-db \
  --db-instance-class db.t3.micro \
  --engine postgres \
  --master-username postgres \
  --master-user-password YourSecurePassword \
  --allocated-storage 20
```

#### 2. Backend Deployment (EC2 or ECS)

**EC2:**
```bash
# Launch EC2 instance
# SSH into instance
sudo yum update -y
sudo yum install nodejs npm postgresql -y

# Clone repository
git clone your-repo-url
cd expenses-app/server

# Install dependencies
npm install

# Set up environment
cp .env.example .env
nano .env  # Edit with RDS connection details

# Run database migrations
psql -h your-rds-endpoint -U postgres -d bigsix_expenses -f src/config/schema.sql

# Install PM2
sudo npm install -g pm2

# Start application
pm2 start dist/index.js --name bigsix-api
pm2 save
pm2 startup
```

**ECS (Container):**
```bash
# Build Docker image
docker build -t bigsix-backend .

# Push to ECR
aws ecr create-repository --repository-name bigsix-backend
docker tag bigsix-backend:latest your-account.dkr.ecr.region.amazonaws.com/bigsix-backend:latest
docker push your-account.dkr.ecr.region.amazonaws.com/bigsix-backend:latest

# Create ECS task definition
# Deploy via AWS Console or CLI
```

#### 3. Frontend Deployment (S3 + CloudFront)

```bash
# Build frontend
npm run build

# Create S3 bucket
aws s3 mb s3://bigsix-expenses-frontend

# Upload build
aws s3 sync dist/ s3://bigsix-expenses-frontend/

# Enable static website hosting
aws s3 website s3://bigsix-expenses-frontend/ --index-document index.html

# Create CloudFront distribution
# Point to S3 bucket origin
```

## Environment Variables

### Backend (.env)

```env
NODE_ENV=production
PORT=3000

DB_HOST=your-database-host
DB_PORT=5432
DB_NAME=bigsix_expenses
DB_USER=postgres
DB_PASSWORD=your-secure-password

JWT_SECRET=your-super-secure-random-jwt-secret-key
FRONTEND_URL=https://your-frontend-domain.com
```

### Frontend (.env)

```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Security Checklist

- [ ] Strong JWT_SECRET (minimum 32 characters, random)
- [ ] HTTPS enabled (SSL certificate)
- [ ] Database password is strong
- [ ] Environment variables not committed to git
- [ ] CORS configured for production domain only
- [ ] Rate limiting implemented
- [ ] Regular database backups configured
- [ ] Monitoring and logging set up
- [ ] Firewall rules configured
- [ ] Database connection uses SSL

## Post-Deployment

1. **Test authentication**: Register and login
2. **Test CRUD operations**: Add, edit, delete expenses
3. **Test export**: Download CSV
4. **Check database**: Verify data persistence
5. **Monitor logs**: Check for errors
6. **Set up backups**: Configure automated database backups

## Monitoring

Recommended tools:
- **Application**: PM2 (for Node.js apps)
- **Database**: AWS RDS monitoring or custom queries
- **Errors**: Sentry
- **Logs**: CloudWatch, Loggly, or Papertrail
- **Uptime**: UptimeRobot or Pingdom

## Scaling

For high traffic:
1. **Database**: Enable connection pooling (already configured)
2. **Backend**: Deploy multiple instances behind load balancer
3. **Caching**: Add Redis for frequently accessed data
4. **CDN**: Use CloudFront for static assets
5. **Monitoring**: Set up alerts for performance thresholds

## Maintenance

Regular tasks:
- Update dependencies monthly
- Review security patches
- Monitor database size and performance
- Review logs for errors
- Back up database weekly
- Update SSL certificates

## Rollback Plan

If issues occur:
1. Identify problematic deployment
2. Revert to previous version
3. Check logs for root cause
4. Test fix in staging
5. Redeploy to production

## Support

For production issues:
- Check application logs
- Check database logs
- Review error tracking (Sentry, etc.)
- Check uptime monitoring

