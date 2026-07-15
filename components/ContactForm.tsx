"use client";

import { useState, FormEvent } from "react";
import { ContactFormData, ContactFormErrors } from "@/types/contact";
import {
  validateContactForm,
  hasContactValidationErrors,
} from "@/lib/validation";

export default function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error for this field if it exists
    if (errors[name as keyof ContactFormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof ContactFormErrors];
        return newErrors;
      });
    }

    // Clear submit status when user starts editing after success/error
    if (submitStatus !== "idle") {
      setSubmitStatus("idle");
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));

    // Validate this field
    const validationErrors = validateContactForm(formData);
    if (validationErrors[name as keyof ContactFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: validationErrors[name as keyof ContactFormErrors],
      }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);

    // Mark all fields as touched
    setTouched({
      name: true,
      email: true,
      subject: true,
      message: true,
    });

    // Stop if there are validation errors
    if (hasContactValidationErrors(validationErrors)) {
      return;
    }

    // Submit form
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Success - clear form and show success message
      setSubmitStatus("success");
      setFormData({
        name: "",
        email: "",
        subject: "",
        message: "",
      });
      setTouched({});
      setErrors({});
    } catch (error) {
      console.error("Contact form submission error:", error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses =
    "w-full px-4 py-3 bg-[#1a1a1a] border border-[rgba(255,255,255,0.12)] rounded-lg text-white placeholder-[#6b7280] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4] transition-colors";
  const labelClasses = "block text-sm font-medium text-[#a1a1a1] mb-2";
  const errorClasses = "text-red-500 text-sm mt-1";

  return (
    <div className="max-w-2xl">
      <h2 className="text-2xl md:text-3xl font-semibold text-white mb-2">
        Get in Touch
      </h2>
      <p className="text-[#a1a1a1] mb-8">
        Have a project in mind? Fill out the form below and I&apos;ll get back
        to you as soon as possible.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name Field */}
        <div>
          <label htmlFor="name" className={labelClasses}>
            Name *
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Your name"
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.name && errors.name && (
            <p className={errorClasses}>{errors.name}</p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label htmlFor="email" className={labelClasses}>
            Email *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="your.email@example.com"
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.email && errors.email && (
            <p className={errorClasses}>{errors.email}</p>
          )}
        </div>

        {/* Subject Field */}
        <div>
          <label htmlFor="subject" className={labelClasses}>
            Subject *
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Project inquiry, collaboration, etc."
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.subject && errors.subject && (
            <p className={errorClasses}>{errors.subject}</p>
          )}
        </div>

        {/* Message Field */}
        <div>
          <label htmlFor="message" className={labelClasses}>
            Message *
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Tell me about your project or inquiry..."
            rows={6}
            className={inputClasses}
            disabled={isSubmitting}
          />
          {touched.message && errors.message && (
            <p className={errorClasses}>{errors.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex flex-col gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-6 py-3 bg-[#06b6d4] text-black font-medium rounded-lg hover:bg-[#22d3ee] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg
                  className="animate-spin h-5 w-5 text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                <span>Sending...</span>
              </>
            ) : (
              "Send Message"
            )}
          </button>

          {/* Success Message */}
          {submitStatus === "success" && (
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <p className="text-green-400 text-sm">
                ✓ Message sent successfully! I&apos;ll get back to you soon.
              </p>
            </div>
          )}

          {/* Error Message */}
          {submitStatus === "error" && (
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm mb-2">
                ✗ Failed to send message. Please try again.
              </p>
              <button
                type="button"
                onClick={() => setSubmitStatus("idle")}
                className="text-[#06b6d4] text-sm hover:underline"
              >
                Dismiss
              </button>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
