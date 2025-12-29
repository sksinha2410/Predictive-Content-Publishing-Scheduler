# 🔒 Security Considerations

This document outlines the security measures implemented in the Predictive Content Publishing Scheduler and recommendations for production deployment.

## Current Security Implementations

### ✅ Rate Limiting

**General API Rate Limiting:**
- **Limit**: 100 requests per 15 minutes per IP
- **Scope**: All `/api/*` endpoints
- **Purpose**: Prevent API abuse and DoS attacks

**AI Endpoints Rate Limiting:**
- **Limit**: 20 requests per hour per IP
- **Scope**: `/api/ai/*` endpoints
- **Purpose**: Prevent excessive OpenAI API usage and costs

**Implementation:**
```javascript
// General rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: 'Too many requests from this IP, please try again later.'
});

// AI-specific rate limiting (more restrictive)
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: 'Too many AI requests, please try again later.'
});
```

### ✅ Environment Variables

**Sensitive data is stored in environment variables:**
- OpenAI API keys
- MongoDB connection strings
- Port configurations

**Files:**
- `.env` - Actual secrets (git-ignored)
- `.env.example` - Template without secrets (committed)

### ✅ CORS Configuration

**Current Setup:**
- CORS enabled for development
- Allows all origins in development

**Production Recommendation:**
```javascript
const corsOptions = {
  origin: 'https://yourdomain.com',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));
```

### ✅ Input Validation

**Backend validation:**
- Mongoose schema validation
- Required field checks
- Data type validation
- Enum value restrictions

**Example:**
```javascript
title: {
  type: String,
  required: true
},
status: {
  type: String,
  enum: ['draft', 'scheduled', 'published'],
  default: 'draft'
}
```

### ✅ Error Handling

**Generic error messages:**
- No sensitive information in error responses
- Detailed errors logged server-side only
- User-friendly error messages to client

### ✅ Git Security

**Protected files via `.gitignore`:**
- `.env` files with secrets
- `node_modules/`
- Build artifacts
- Temporary files

## Security Gaps (Development vs Production)

### ⚠️ Missing in Current Implementation

These features should be added for production:

#### 1. Authentication & Authorization
**Current**: No authentication
**Production Need**: User authentication

**Recommendation:**
```javascript
// JWT-based authentication
const jwt = require('jsonwebtoken');

// Middleware
const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Protected routes
app.use('/api/posts', authenticateToken, postRoutes);
```

#### 2. Input Sanitization
**Current**: Basic validation
**Production Need**: Sanitize inputs to prevent injection

**Recommendation:**
```javascript
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

app.use(mongoSanitize()); // Prevent MongoDB injection
app.use(xss()); // Prevent XSS attacks
```

#### 3. HTTPS Only
**Current**: HTTP in development
**Production Need**: HTTPS enforcement

**Recommendation:**
```javascript
// Force HTTPS in production
if (process.env.NODE_ENV === 'production') {
  app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
      res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
      next();
    }
  });
}
```

#### 4. Security Headers
**Current**: Default headers
**Production Need**: Security headers

**Recommendation:**
```javascript
const helmet = require('helmet');
app.use(helmet()); // Adds various security headers
```

#### 5. Request Size Limits
**Current**: Default limits
**Production Need**: Prevent large payloads

**Recommendation:**
```javascript
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));
```

## OpenAI API Security

### ✅ Current Measures
- API key stored server-side only
- Never exposed to frontend
- Rate limiting on AI endpoints

### ⚠️ Additional Recommendations

**Cost Control:**
```javascript
// Track API usage
const usageTracker = {};

const checkUsageLimit = async (userId) => {
  const dailyLimit = 100; // Max AI calls per user per day
  const usage = usageTracker[userId] || 0;
  
  if (usage >= dailyLimit) {
    throw new Error('Daily AI usage limit reached');
  }
  
  usageTracker[userId] = usage + 1;
};
```

**Request Validation:**
```javascript
// Limit content length for AI processing
const MAX_CONTENT_LENGTH = 5000;

if (content.length > MAX_CONTENT_LENGTH) {
  return res.status(400).json({ 
    error: 'Content too long for AI processing' 
  });
}
```

## MongoDB Security

### ✅ Current Measures
- Connection string in environment variable
- Mongoose schema validation

### ⚠️ Production Recommendations

**Database User Permissions:**
```javascript
// Use read-write user, not admin
// Create specific database user with limited permissions
db.createUser({
  user: "contentScheduler",
  pwd: "strong_password_here",
  roles: [
    { role: "readWrite", db: "content-scheduler" }
  ]
})
```

**Network Security:**
- Whitelist only application server IPs
- Don't use 0.0.0.0/0 in production
- Enable MongoDB authentication

**Connection Options:**
```javascript
mongoose.connect(MONGODB_URI, {
  // These options are now defaults in Mongoose 6+
  authSource: 'admin',
  retryWrites: true,
  w: 'majority'
});
```

## Data Protection

### Current Implementation
- No sensitive user data stored
- Engagement metrics are anonymous

### GDPR Compliance (if applicable)
- Implement data export functionality
- Add data deletion capability
- Privacy policy and terms of service
- Cookie consent if using tracking

## API Key Rotation

**Best Practices:**
```bash
# Regularly rotate OpenAI API key
# Steps:
1. Generate new key in OpenAI dashboard
2. Update .env file
3. Restart application
4. Delete old key after verification
```

## Logging & Monitoring

### Recommended Implementation
```javascript
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});

// Log security events
logger.info('API request', { 
  ip: req.ip, 
  endpoint: req.path,
  method: req.method 
});
```

## Dependency Security

### Current Status
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Best Practices
- Regularly update dependencies
- Use `npm audit` in CI/CD
- Monitor GitHub security alerts
- Use tools like Snyk or Dependabot

## Production Deployment Checklist

- [ ] Enable HTTPS/SSL
- [ ] Configure CORS for specific origin
- [ ] Add authentication and authorization
- [ ] Implement request sanitization
- [ ] Add security headers (helmet)
- [ ] Set up proper logging
- [ ] Configure MongoDB Atlas with IP whitelist
- [ ] Rotate API keys
- [ ] Set up monitoring and alerts
- [ ] Implement backup strategy
- [ ] Add request size limits
- [ ] Set up rate limiting (✅ Implemented)
- [ ] Use environment variables (✅ Implemented)
- [ ] Remove console.log statements
- [ ] Add CSP (Content Security Policy)
- [ ] Enable 2FA for admin access
- [ ] Set up intrusion detection
- [ ] Implement audit logging
- [ ] Add health checks
- [ ] Configure firewall rules
- [ ] Set up DDoS protection

## Security Testing

### Recommended Tools
```bash
# OWASP ZAP - Security testing
# Burp Suite - Penetration testing
# npm audit - Dependency scanning
# Snyk - Vulnerability monitoring
```

### Test Scenarios
- SQL/NoSQL injection attempts
- XSS attack vectors
- CSRF protection
- Rate limit bypass attempts
- Authentication bypass
- Authorization escalation

## Incident Response Plan

### Detection
- Monitor error logs
- Track unusual API patterns
- Alert on failed authentication attempts
- Monitor API costs

### Response
1. Identify the issue
2. Isolate affected systems
3. Patch vulnerabilities
4. Rotate compromised credentials
5. Document incident
6. Review and improve

## Environment-Specific Settings

### Development
```env
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
LOG_LEVEL=debug
```

### Production
```env
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
LOG_LEVEL=error
```

## Compliance

For production use, consider:
- **GDPR** - EU data protection
- **CCPA** - California privacy
- **SOC 2** - Security standards
- **PCI DSS** - If handling payments

## Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [Express.js Security](https://expressjs.com/en/advanced/best-practice-security.html)
- [MongoDB Security Checklist](https://www.mongodb.com/docs/manual/administration/security-checklist/)

## Summary

**✅ Implemented:**
- Rate limiting on all API endpoints
- Environment variable security
- Input validation
- Error handling
- Git security

**⚠️ For Production:**
- Add authentication/authorization
- Enable HTTPS
- Add security headers
- Implement input sanitization
- Set up monitoring and logging
- Configure CORS properly
- Add backup strategy

The current implementation is secure for development and demonstration purposes. For production deployment, implement the additional security measures outlined above.
