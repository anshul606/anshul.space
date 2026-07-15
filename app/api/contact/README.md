# Contact Form API Endpoint

This API endpoint handles contact form submissions from the Hire Me page.

## Endpoint

`POST /api/contact`

## Features

- ✅ Server-side validation using shared validation library
- ✅ Support for multiple email services (Resend, SendGrid)
- ✅ XSS protection with HTML escaping
- ✅ Reply-to header set to sender's email for easy responses
- ✅ Professional HTML email formatting
- ✅ Detailed error logging
- ✅ Graceful fallback in development mode

## Request Format

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a web development project..."
}
```

## Validation Rules

| Field   | Required | Rules              |
| ------- | -------- | ------------------ |
| name    | Yes      | Min 1 character    |
| email   | Yes      | Valid email format |
| subject | Yes      | Min 1 character    |
| message | Yes      | Min 10 characters  |

## Response Format

### Success (200)

```json
{
  "success": true,
  "message": "Message sent successfully"
}
```

### Validation Error (400)

```json
{
  "success": false,
  "errors": {
    "name": "Name is required",
    "email": "Please enter a valid email address",
    "subject": "Subject is required",
    "message": "Message must be at least 10 characters"
  }
}
```

### Server Error (500)

```json
{
  "success": false,
  "error": "Failed to send message. Please try again later."
}
```

## Email Service Configuration

### Option 1: Resend (Recommended)

1. Sign up at [resend.com](https://resend.com)
2. Create an API key
3. Add to `.env.local`:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=your-email@example.com
```

**Note:** With Resend's free tier, you can send up to 100 emails per day using their testing domain (`onboarding@resend.dev`). For production, you'll need to verify your own domain.

### Option 2: SendGrid

1. Sign up at [sendgrid.com](https://sendgrid.com)
2. Create an API key with "Mail Send" permissions
3. Verify a sender email address
4. Add to `.env.local`:

```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
ADMIN_EMAIL=your-email@example.com
```

**Note:** You must verify a sender email or domain in SendGrid before sending emails.

### Development Mode (No Email Service)

If neither `RESEND_API_KEY` nor `SENDGRID_API_KEY` is configured:

- **Development**: Form submissions will be logged to console and return success
- **Production**: Form submissions will fail with a 500 error

This allows you to test the form without configuring an email service during development.

## Email Format

The API sends professionally formatted HTML emails with:

- Contact name and email
- Subject line
- Full message content
- Reply-to header set to sender's email
- Responsive design
- XSS protection (all user input is escaped)

## Security Features

1. **Server-side validation**: All inputs are validated on the server
2. **XSS protection**: HTML special characters are escaped
3. **Email validation**: Validates email format using regex
4. **Error handling**: Comprehensive try-catch blocks with logging
5. **CORS protection**: Next.js API routes are server-side only

## Testing

You can test the API endpoint using curl:

```bash
# Valid submission
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "subject": "Test Subject",
    "message": "This is a test message with more than 10 characters"
  }'

# Invalid submission (validation errors)
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "",
    "email": "invalid-email",
    "subject": "",
    "message": "short"
  }'
```

## Integration

The API is already integrated with the `ContactForm` component located at `/components/ContactForm.tsx`. The form:

1. Performs client-side validation before submission
2. Shows loading state during API call
3. Displays success/error messages
4. Clears form on successful submission

## Requirements Satisfied

This implementation satisfies the following requirements:

- **10.1**: Configurable email address via environment variables
- **10.2**: Integration with email service (Resend/SendGrid)
- **10.3**: Server-side validation with error responses
- **10.4**: Formatted email with all sender information
- **10.5**: Reply-to header for easy responses
- **10.6**: Secure API key storage in environment variables

## Troubleshooting

### Emails not sending in development

This is expected if no email service is configured. Check the server console logs to see the email content that would have been sent.

### "Email service not configured" error in production

Add either `RESEND_API_KEY` or `SENDGRID_API_KEY` to your production environment variables.

### Resend returns 400 error

Make sure you're using a verified sender domain in production. The testing domain `onboarding@resend.dev` only works with Resend's free tier and has limitations.

### SendGrid returns 403 error

Verify that:

1. Your API key has "Mail Send" permissions
2. You've verified your sender email address in SendGrid
3. Your account is in good standing (not suspended)

## Future Enhancements

Potential improvements for future iterations:

- Rate limiting to prevent spam
- Honeypot field for bot detection
- reCAPTCHA integration
- Email templates with design customization
- Auto-responder email to sender
- Save submissions to Firestore for backup
- Email delivery status tracking
