/**
 * Contact form data model
 * Represents the data collected from the contact form on the Hire Me page
 */
export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

/**
 * Contact form validation errors
 * Maps form fields to their respective error messages
 */
export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}
