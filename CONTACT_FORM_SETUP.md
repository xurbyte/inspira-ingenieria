# Email Configuration for Contact Form
# Nodemailer SMTP Settings

## 🔐 Security Features Implemented

This contact form includes multiple layers of security:

### 🛡️ Server-Side Protections
- **Rate Limiting**: 5 requests per 15 minutes per IP address
- **Input Sanitization**: Removes HTML tags, JavaScript, and event handlers
- **Honeypot Detection**: Hidden field to catch automated bots
- **Comprehensive Validation**: Email format, phone format, length limits
- **Type Checking**: Ensures all inputs are correct data types

### 🤖 Bot Detection
- **Honeypot Field**: Invisible field that bots tend to fill
- **Time Validation**: Minimum 3-second completion time on client-side
- **Pattern Analysis**: Detects suspicious input patterns

### 📊 Monitoring & Logging
- **Request Logging**: IP addresses and timestamps for monitoring
- **Error Tracking**: Detailed error messages for debugging
- **Security Alerts**: Logs suspicious activities

### 🔒 Data Protection
- **Input Length Limits**: Prevents buffer overflow attacks
- **XSS Prevention**: Sanitization removes dangerous HTML/JavaScript
- **SQL Injection Prevention**: Proper input handling

## SMTP Server Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false

## Authentication
SMTP_USER=ingenieria.inspira@gmail.com
SMTP_PASS=your_app_password_here

## Contact Email (where messages will be sent)
CONTACT_EMAIL=ingenieria.inspira@gmail.com

## Setup Instructions:
1. Install nodemailer: `npm install nodemailer @types/nodemailer`
2. For Gmail, you need to:
   - Enable 2-factor authentication on your Google account
   - Generate an App Password: https://myaccount.google.com/apppasswords
   - Use the App Password (not your regular password) for SMTP_PASS
3. For other email providers, check their SMTP settings

## Security Headers
The API includes proper rate limiting headers:
- `X-RateLimit-Remaining`: Requests remaining in current window
- `X-RateLimit-Reset`: Timestamp when limit resets
- `Retry-After`: Seconds to wait before retrying (when limit exceeded)

## Error Codes
- `400`: Validation errors or honeypot triggered
- `429`: Rate limit exceeded
- `500`: Server errors (SMTP configuration, etc.)
