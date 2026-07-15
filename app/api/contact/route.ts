import { NextRequest, NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validation";
import { ContactFormData } from "@/types/contact";

/**
 * Contact form API route
 * Handles POST requests from the contact form with server-side validation
 * and email routing to the admin address
 *
 * Environment variables required:
 * - ADMIN_EMAIL: The recipient email address
 * - RESEND_API_KEY: API key for Resend email service (if using Resend)
 * - SENDGRID_API_KEY: API key for SendGrid (alternative)
 */

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "anshulbansal2406@gmail.com";

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body: ContactFormData = await request.json();

    // Server-side validation
    const errors = validateContactForm(body);
    if (Object.keys(errors).length > 0) {
      console.log("Validation errors:", errors);
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Log the contact attempt
    console.log("Contact form submission received:", {
      name: body.name,
      email: body.email,
      subject: body.subject,
      timestamp: new Date().toISOString(),
    });

    // Email service integration
    await sendEmail(body);

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message. Please try again later.",
      },
      { status: 500 },
    );
  }
}

/**
 * Send email using configured email service
 * This function can be adapted to use different email providers
 */
async function sendEmail(data: ContactFormData): Promise<void> {
  // Check which email service is configured
  const resendApiKey = process.env.RESEND_API_KEY;
  const sendGridApiKey = process.env.SENDGRID_API_KEY;

  if (resendApiKey) {
    await sendEmailViaResend(data, resendApiKey);
  } else if (sendGridApiKey) {
    await sendEmailViaSendGrid(data, sendGridApiKey);
  } else {
    // Fallback: Log to console if no email service is configured
    console.warn("No email service configured. Email would have been sent:");
    console.log({
      to: ADMIN_EMAIL,
      from: data.email,
      subject: `Portfolio Contact: ${data.subject}`,
      message: data.message,
    });

    // For development: Accept the submission without actually sending email
    // In production, you should throw an error here
    if (process.env.NODE_ENV === "production") {
      throw new Error("Email service not configured");
    }
  }
}

/**
 * Send email using Resend API
 */
async function sendEmailViaResend(
  data: ContactFormData,
  apiKey: string,
): Promise<void> {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from: "Portfolio Contact <onboarding@resend.dev>", // Use verified sender
      to: ADMIN_EMAIL,
      reply_to: data.email,
      subject: `Portfolio Contact: ${data.subject}`,
      html: formatEmailHTML(data),
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    console.error("Resend API error:", errorData);
    throw new Error("Failed to send email via Resend");
  }
}

/**
 * Send email using SendGrid API
 */
async function sendEmailViaSendGrid(
  data: ContactFormData,
  apiKey: string,
): Promise<void> {
  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: ADMIN_EMAIL }],
          subject: `Portfolio Contact: ${data.subject}`,
        },
      ],
      from: {
        email: "noreply@yourdomain.com", // Use verified sender
        name: "Portfolio Contact Form",
      },
      reply_to: {
        email: data.email,
        name: data.name,
      },
      content: [
        {
          type: "text/html",
          value: formatEmailHTML(data),
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error("SendGrid API error:", errorData);
    throw new Error("Failed to send email via SendGrid");
  }
}

/**
 * Format email content as HTML
 */
function formatEmailHTML(data: ContactFormData): string {
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 10px 10px 0 0;
            text-align: center;
          }
          .content {
            background: #f9f9f9;
            padding: 30px;
            border-radius: 0 0 10px 10px;
          }
          .field {
            margin-bottom: 20px;
          }
          .label {
            font-weight: 600;
            color: #555;
            display: block;
            margin-bottom: 5px;
          }
          .value {
            color: #333;
            padding: 10px;
            background: white;
            border-radius: 5px;
            border: 1px solid #e0e0e0;
          }
          .message {
            white-space: pre-wrap;
            word-wrap: break-word;
          }
          .footer {
            text-align: center;
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #e0e0e0;
            color: #888;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1 style="margin: 0; font-size: 24px;">New Contact Form Submission</h1>
          <p style="margin: 10px 0 0 0; opacity: 0.9;">From your portfolio website</p>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span>
            <div class="value">${escapeHtml(data.name)}</div>
          </div>
          
          <div class="field">
            <span class="label">Email:</span>
            <div class="value">
              <a href="mailto:${escapeHtml(data.email)}" style="color: #667eea; text-decoration: none;">
                ${escapeHtml(data.email)}
              </a>
            </div>
          </div>
          
          <div class="field">
            <span class="label">Subject:</span>
            <div class="value">${escapeHtml(data.subject)}</div>
          </div>
          
          <div class="field">
            <span class="label">Message:</span>
            <div class="value message">${escapeHtml(data.message)}</div>
          </div>
        </div>
        
        <div class="footer">
          <p>This message was sent from your portfolio contact form.</p>
          <p>Reply directly to this email to respond to ${escapeHtml(data.name)}.</p>
        </div>
      </body>
    </html>
  `;
}

/**
 * Escape HTML special characters to prevent XSS
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}
