import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// In-memory rate limiting store (in production, use Redis or database)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS_PER_WINDOW = 5; // 5 requests per 15 minutes per IP

// Input sanitization function
function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .slice(0, 1000); // Limit length to prevent buffer overflow
}

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return emailRegex.test(email) && email.length <= 254;
}

// Phone validation function
function isValidPhone(phone: string): boolean {
  const phoneRegex = /^[\+]?[0-9\s\-\(\)]{8,20}$/;
  return phoneRegex.test(phone);
}

// Rate limiting function
function checkRateLimit(ip: string): { allowed: boolean; remainingRequests: number; resetTime: number } {
  const now = Date.now();
  const userData = rateLimitStore.get(ip);

  if (!userData || now > userData.resetTime) {
    // First request or window expired, reset counter
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true, remainingRequests: MAX_REQUESTS_PER_WINDOW - 1, resetTime: now + RATE_LIMIT_WINDOW };
  }

  if (userData.count >= MAX_REQUESTS_PER_WINDOW) {
    return { allowed: false, remainingRequests: 0, resetTime: userData.resetTime };
  }

  userData.count++;
  return { allowed: true, remainingRequests: MAX_REQUESTS_PER_WINDOW - userData.count, resetTime: userData.resetTime };
}

// Clean up expired rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now > data.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 60000); // Clean up every minute

export async function POST(request: NextRequest) {
  try {
    // Get client IP for rate limiting
    const ip = request.headers.get('x-forwarded-for') ||
               request.headers.get('x-real-ip') ||
               'unknown';

    // Check rate limit
    const rateLimitResult = checkRateLimit(ip);
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          error: 'Demasiadas solicitudes. Inténtalo de nuevo más tarde.',
          retryAfter: Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000)
        },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
            'X-RateLimit-Remaining': rateLimitResult.remainingRequests.toString(),
            'X-RateLimit-Reset': rateLimitResult.resetTime.toString()
          }
        }
      );
    }

    const body = await request.json();
    const { name, email, phone, project, message, honeypot } = body;

    // Check honeypot field (should be empty for humans)
    if (honeypot && honeypot.trim() !== '') {
      console.log('Bot detected via honeypot:', { ip, honeypot });
      return NextResponse.json(
        { error: 'Solicitud sospechosa detectada.' },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return NextResponse.json(
        { error: 'El nombre es requerido y debe tener al menos 2 caracteres.' },
        { status: 400 }
      );
    }

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'El email es requerido.' },
        { status: 400 }
      );
    }

    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return NextResponse.json(
        { error: 'El mensaje es requerido y debe tener al menos 10 caracteres.' },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = sanitizeInput(name);
    const sanitizedEmail = email.toLowerCase().trim();
    const sanitizedPhone = phone ? sanitizeInput(phone) : '';
    const sanitizedProject = project ? sanitizeInput(project) : '';
    const sanitizedMessage = sanitizeInput(message);

    // Validate email format
    if (!isValidEmail(sanitizedEmail)) {
      return NextResponse.json(
        { error: 'Formato de email inválido.' },
        { status: 400 }
      );
    }

    // Validate phone if provided
    if (sanitizedPhone && !isValidPhone(sanitizedPhone)) {
      return NextResponse.json(
        { error: 'Formato de teléfono inválido.' },
        { status: 400 }
      );
    }

    // Additional security checks
    if (sanitizedName.length > 100) {
      return NextResponse.json(
        { error: 'El nombre es demasiado largo.' },
        { status: 400 }
      );
    }

    if (sanitizedMessage.length > 2000) {
      return NextResponse.json(
        { error: 'El mensaje es demasiado largo (máximo 2000 caracteres).' },
        { status: 400 }
      );
    }

    // Create nodemailer transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Verify transporter configuration
    await transporter.verify();

    // Email content
    const mailOptions = {
      from: `"Formulario de Contacto - ${sanitizedName}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL || 'ingenieria.inspira@gmail.com',
      subject: `Nueva consulta desde el sitio web - ${sanitizedName}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Nueva Consulta - Inspira Ingeniería</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #1e40af, #3b82f6); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
            .content { background: #f8fafc; padding: 20px; border: 1px solid #e2e8f0; }
            .field { margin-bottom: 15px; }
            .label { font-weight: bold; color: #374151; }
            .value { background: white; padding: 8px 12px; border-radius: 4px; border: 1px solid #d1d5db; }
            .footer { background: #1e40af; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; }
            .security-info { background: #fef3c7; border: 1px solid #f59e0b; padding: 10px; border-radius: 4px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏗️ Nueva Consulta - Inspira Ingeniería</h1>
              <p>Has recibido una nueva consulta desde el formulario de contacto del sitio web.</p>
            </div>

            <div class="content">
              <div class="security-info">
                <strong>✅ Validación de Seguridad:</strong> Esta consulta ha pasado todas las validaciones de seguridad automáticas.
              </div>

              <div class="field">
                <div class="label">👤 Nombre:</div>
                <div class="value">${sanitizedName}</div>
              </div>

              <div class="field">
                <div class="label">📧 Email:</div>
                <div class="value"><a href="mailto:${sanitizedEmail}">${sanitizedEmail}</a></div>
              </div>

              ${sanitizedPhone ? `
              <div class="field">
                <div class="label">📱 Teléfono:</div>
                <div class="value"><a href="https://wa.me/${sanitizedPhone.replace(/\D/g, '')}">${sanitizedPhone}</a></div>
              </div>
              ` : ''}

              ${sanitizedProject ? `
              <div class="field">
                <div class="label">🏗️ Tipo de Proyecto:</div>
                <div class="value">${sanitizedProject}</div>
              </div>
              ` : ''}

              <div class="field">
                <div class="label">💬 Mensaje:</div>
                <div class="value" style="white-space: pre-line;">${sanitizedMessage}</div>
              </div>
            </div>

            <div class="footer">
              <p>Esta consulta fue enviada desde el formulario de contacto de Inspira Ingeniería</p>
              <p>Para responder, puedes hacer clic en el email del remitente.</p>
            </div>
          </div>
        </body>
        </html>
      `,
      replyTo: sanitizedEmail,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Consulta enviada exitosamente. Te contactaremos pronto.' },
      { status: 200 }
    );

  } catch (error) {
    console.error('Error sending contact form:', error);

    // Provide more specific error messages
    let errorMessage = 'Error interno del servidor';

    if (error instanceof Error) {
      if (error.message.includes('Authentication failed')) {
        errorMessage = 'Error de configuración del correo electrónico';
      } else if (error.message.includes('connect ECONNREFUSED')) {
        errorMessage = 'Error de conexión al servidor de correo';
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
