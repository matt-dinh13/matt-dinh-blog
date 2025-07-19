# Security Guidelines for Matt Dinh Blog

## 🔒 Security Checklist for Public Repository

### **Before Pushing to GitHub:**

#### ✅ Environment Variables
- [ ] **NEVER commit `.env` files** - They are already in `.gitignore`
- [ ] Use `env.example` as a template for required variables
- [ ] All sensitive values should be placeholders in example files
- [ ] Use environment variables for all secrets in production

#### ✅ API Keys and Secrets
- [ ] **NEVER commit real API keys** to the repository
- [ ] Supabase keys should be set in Vercel environment variables
- [ ] Service role keys should be kept secret
- [ ] Use placeholder values in configuration files

#### ✅ Database Credentials
- [ ] **NEVER commit real database passwords**
- [ ] Use environment variables for database connections
- [ ] Local development passwords should be different from production
- [ ] Use strong, unique passwords for each environment

#### ✅ Authentication
- [ ] JWT secrets should be environment variables
- [ ] Session secrets should be unique per environment
- [ ] OAuth provider secrets should be kept secure
- [ ] Admin credentials should never be in code

#### ✅ File Storage
- [ ] Storage bucket credentials should be environment variables
- [ ] File upload limits should be configured
- [ ] Access controls should be properly set
- [ ] Public URLs should be safe to expose

### **Configuration Files Security**

#### ✅ Safe to Commit (Public)
- `package.json` - Dependencies and scripts
- `next.config.ts` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `tailwind.config.js` - Styling configuration
- `eslint.config.mjs` - Code linting rules
- `vercel.json` - Deployment configuration (with placeholders)
- `docker-compose.yml` - Container configuration (with environment variables)
- `Dockerfile` - Container build instructions
- `.github/workflows/ci-cd.yml` - CI/CD pipeline (with secrets references)

#### ❌ Never Commit (Private)
- `.env` files
- `.env.local`
- `.env.production`
- API keys
- Database passwords
- JWT secrets
- OAuth secrets
- SSL certificates
- Private keys

### **Environment Variables Management**

#### **Local Development:**
```bash
# Copy the example file
cp env.example .env.local

# Edit with your actual values
nano .env.local
```

#### **Production (Vercel):**
1. Go to Vercel Dashboard
2. Select your project
3. Go to Settings > Environment Variables
4. Add each variable from `env.example`

#### **Required Environment Variables:**
```bash
# Supabase (Required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Authentication (Required)
NEXTAUTH_SECRET=your_secret_key
NEXTAUTH_URL=https://your-domain.com

# Database (If using local)
POSTGRES_PASSWORD=your_secure_password
DATABASE_URL=your_database_url

# File Storage (If using local)
MINIO_ROOT_PASSWORD=your_secure_password
MINIO_SECRET_KEY=your_secret_key

# Monitoring (Optional)
GRAFANA_ADMIN_PASSWORD=your_secure_password
```

### **Security Best Practices**

#### **1. Code Security**
- [ ] Use HTTPS in production
- [ ] Implement proper CORS policies
- [ ] Validate all user inputs
- [ ] Use parameterized queries
- [ ] Implement rate limiting
- [ ] Add security headers

#### **2. Authentication Security**
- [ ] Use strong password policies
- [ ] Implement MFA if possible
- [ ] Use secure session management
- [ ] Implement proper logout
- [ ] Use secure token storage

#### **3. Data Security**
- [ ] Encrypt sensitive data at rest
- [ ] Use HTTPS for data in transit
- [ ] Implement proper access controls
- [ ] Regular security audits
- [ ] Backup encryption

#### **4. Infrastructure Security**
- [ ] Keep dependencies updated
- [ ] Use security scanning tools
- [ ] Monitor for vulnerabilities
- [ ] Implement logging and monitoring
- [ ] Regular security updates

### **Deployment Security**

#### **Vercel Deployment:**
1. **Environment Variables**: Set all secrets in Vercel dashboard
2. **Domain Security**: Use HTTPS and proper DNS
3. **Access Control**: Restrict admin access
4. **Monitoring**: Enable Vercel Analytics and monitoring

#### **Local Development:**
1. **Separate Environment**: Use different credentials for local dev
2. **No Production Data**: Never use production data locally
3. **Secure Local Services**: Use strong passwords for local services
4. **Network Security**: Don't expose local services to internet

### **Monitoring and Alerts**

#### **Security Monitoring:**
- [ ] Set up error tracking (Sentry)
- [ ] Monitor failed login attempts
- [ ] Track suspicious activities
- [ ] Set up security alerts
- [ ] Regular security reviews

#### **Performance Monitoring:**
- [ ] Monitor application performance
- [ ] Track resource usage
- [ ] Set up uptime monitoring
- [ ] Monitor API response times
- [ ] Track user experience metrics

### **Emergency Procedures**

#### **If Secrets are Compromised:**
1. **Immediate Actions:**
   - Rotate all compromised secrets
   - Revoke and regenerate API keys
   - Change database passwords
   - Update environment variables

2. **Investigation:**
   - Review access logs
   - Check for unauthorized access
   - Identify the source of compromise
   - Document the incident

3. **Prevention:**
   - Update security procedures
   - Implement additional monitoring
   - Review access controls
   - Update documentation

### **Regular Security Tasks**

#### **Weekly:**
- [ ] Review security logs
- [ ] Check for dependency updates
- [ ] Monitor for new vulnerabilities
- [ ] Review access permissions

#### **Monthly:**
- [ ] Security audit of code
- [ ] Review environment variables
- [ ] Update security documentation
- [ ] Test backup and recovery

#### **Quarterly:**
- [ ] Comprehensive security review
- [ ] Update security policies
- [ ] Review and update access controls
- [ ] Security training for team

### **Resources**

#### **Security Tools:**
- [Snyk](https://snyk.io/) - Vulnerability scanning
- [OWASP](https://owasp.org/) - Security guidelines
- [Security Headers](https://securityheaders.com/) - Header testing
- [Mozilla Observatory](https://observatory.mozilla.org/) - Security scanning

#### **Documentation:**
- [Next.js Security](https://nextjs.org/docs/advanced-features/security-headers)
- [Supabase Security](https://supabase.com/docs/guides/security)
- [Vercel Security](https://vercel.com/docs/security)

---

**Remember: Security is an ongoing process, not a one-time setup!**

Last updated: January 19, 2025 