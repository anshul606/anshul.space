# Implementation Plan: Timeline and Hire Me Features

## Overview

This implementation plan breaks down the Timeline and Hire Me features into discrete, sequential coding tasks. The Timeline feature replaces the static "Current Active Engagement" section with a dynamic, admin-manageable timeline. The Hire Me page provides a dedicated contact interface with form submission and WhatsApp integration.

The implementation follows the existing architecture patterns for Firestore data management, admin panel components, and responsive design used in the projects and achievements features.

## Tasks

- [x] 1. Create Timeline data model and types
  - Create `types/timeline.ts` file with TypeScript interfaces
  - Define `TimelineEntry`, `TimelineFormData`, and `TimelineStatus` types
  - Ensure ISO 8601 date format for `startDate` and `endDate` fields
  - Define status as computed field: "ongoing" when no endDate, "completed" when endDate exists
  - _Requirements: 7.1, 7.2, 7.3, 7.4, 7.5, 7.6_

- [x] 2. Implement Timeline Firestore service functions
  - [x] 2.1 Create `lib/timeline-firestore.ts` with CRUD operations
    - Implement `getTimelineEntries()` to fetch all entries ordered by startDate DESC
    - Implement `addTimelineEntry()` to create new entries with computed status
    - Implement `updateTimelineEntry()` to update entries and recompute status
    - Implement `deleteTimelineEntry()` to remove entries
    - Follow patterns from `lib/firestore.ts` and `lib/achievements-firestore.ts`
    - Include proper error handling with try-catch blocks
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 1.8, 1.10, 1.12_
  - [ ]\* 2.2 Write unit tests for Timeline Firestore service
    - Test successful CRUD operations
    - Test error handling scenarios
    - Test status computation logic (ongoing vs completed)
    - Test date ordering in queries
    - _Requirements: 7.1, 7.2, 7.5, 7.6_

- [x] 3. Build Timeline display component for homepage
  - [ ] 3.1 Create `components/Timeline.tsx` component
    - Implement data fetching with `useEffect` calling `getTimelineEntries()`
    - Add loading state with `LoadingSpinner` component
    - Add error state with fallback message
    - Render timeline entries with title, description, date range, and status badge
    - Use responsive grid layout: single column on mobile, multi-column on desktop
    - Format dates in human-readable format (e.g., "Jan 2025", "June 2025")
    - Reuse `StatusBadge` component for status display
    - Use design system styling: `border border-white/8 bg-white/[0.01]` for cards
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 2.10, 9.1, 9.2, 9.5_
  - [ ]\* 3.2 Write unit tests for Timeline component
    - Test loading state rendering
    - Test error state rendering
    - Test successful data display
    - Test date formatting
    - Test responsive layout classes
    - _Requirements: 2.2, 2.3, 2.8, 2.9, 2.10_

- [x] 4. Integrate Timeline component into homepage
  - Update `app/page.tsx` to import and render `Timeline` component
  - Replace existing static "Current Active Engagement" section (lines ~460-495)
  - Maintain section structure and styling consistency
  - Preserve responsive layout behavior
  - _Requirements: 2.1, 2.2_

- [x] 5. Create admin Timeline list component
  - [x] 5.1 Create `components/AdminTimelineList.tsx`
    - Follow pattern from `AdminProjectList.tsx` for consistency
    - Display timeline entries with title, date range, and status
    - Add Edit and Delete buttons for each entry
    - Implement delete confirmation modal before deletion
    - Show loading state while fetching data
    - Display empty state message when no entries exist
    - Sort entries by startDate DESC for display
    - _Requirements: 1.1, 8.3, 8.4_
  - [ ]\* 5.2 Write unit tests for AdminTimelineList
    - Test entry rendering with different status values
    - Test delete confirmation flow
    - Test empty state display
    - Test loading state display
    - _Requirements: 1.1, 1.11_

- [x] 6. Create admin Timeline form component
  - [ ] 6.1 Create `components/AdminTimelineForm.tsx`
    - Follow pattern from `AdminForm.tsx` for consistency
    - Add input fields: title (text), description (textarea), startDate (date picker), endDate (date picker, optional)
    - Implement client-side validation: title min 1 char, description min 1 char, startDate required, endDate optional
    - Display inline error messages on validation failures
    - Compute and display status badge based on endDate presence
    - Handle both create and edit modes with pre-populated values
    - Disable submit button during submission with loading indicator
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.9, 1.10, 8.3, 8.5_
  - [ ]\* 6.2 Write unit tests for AdminTimelineForm
    - Test validation rules for all fields
    - Test status computation (ongoing vs completed)
    - Test create mode (empty form)
    - Test edit mode (pre-populated form)
    - Test form submission flow
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

- [x] 7. Integrate Timeline management into admin panel
  - Update `app/admin/page.tsx` to add Timeline tab/section
  - Wire `AdminTimelineList` and `AdminTimelineForm` components together
  - Implement state management for list refresh after create/update/delete
  - Add navigation option for Timeline management in admin UI
  - Follow existing admin panel layout and styling patterns
  - _Requirements: 8.1, 8.2, 8.3, 8.6_

- [ ] 8. Checkpoint - Ensure Timeline feature works end-to-end
  - Verify timeline entries can be created, edited, and deleted in admin panel
  - Verify timeline displays correctly on homepage with proper formatting
  - Verify responsive behavior on mobile and desktop
  - Ensure all tests pass, ask the user if questions arise

- [ ] 9. Create Contact form data model and validation
  - Create `types/contact.ts` with `ContactFormData` and `ContactFormErrors` interfaces
  - Extend `lib/validation.ts` with `validateContactForm()` function
  - Implement validation rules: name (required, min 1 char), email (required, valid format), subject (required, min 1 char), message (required, min 10 chars)
  - Add `isValidEmail()` helper using regex `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
  - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6_

- [ ] 10. Build Contact form component
  - [ ] 10.1 Create `components/ContactForm.tsx`
    - Implement form with fields: name, email, subject, message
    - Add client-side validation on submit using `validateContactForm()`
    - Display inline error messages for invalid fields
    - Implement submit handler that posts to `/api/contact` endpoint
    - Show loading state during submission (disable button, show spinner)
    - Display success message and clear form on successful submission
    - Display error message on submission failure with retry option
    - Use design system styling consistent with admin forms
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5, 5.6, 5.7, 5.8, 5.9, 5.10_
  - [ ]\* 10.2 Write unit tests for ContactForm component
    - Test field validation rules
    - Test error message display
    - Test form submission flow
    - Test success and error states
    - Test form clearing after success
    - _Requirements: 5.2, 5.3, 5.4, 5.5, 5.6, 5.9, 5.10_

- [ ] 11. Create WhatsApp contact component
  - Create `components/WhatsAppContact.tsx`
  - Implement WhatsApp click-to-chat link using `https://wa.me/<number>?text=<message>`
  - Read phone number from `NEXT_PUBLIC_WHATSAPP_NUMBER` environment variable
  - Use pre-filled message template: "Hi! I'd like to discuss a project opportunity."
  - Open link in new tab with `target="_blank"` and `rel="noopener noreferrer"`
  - Style with WhatsApp brand color (#25D366) and hover effect
  - Include WhatsApp icon SVG in button
  - _Requirements: 6.1, 6.2, 6.4, 6.5, 6.6_

- [ ] 12. Implement Contact API route for email routing
  - [ ] 12.1 Create `app/api/contact/route.ts` API endpoint
    - Implement POST handler to receive contact form data
    - Add server-side validation using `validateContactForm()`
    - Return 400 error response for validation failures
    - Integrate with email service (Resend, SendGrid, or EmailJS)
    - Format email with sender name, email, subject, and message
    - Send email to admin address from environment variable `ADMIN_EMAIL`
    - Set reply-to header to sender's email for easy response
    - Return success/error JSON response
    - Add proper error handling and logging
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5, 10.6_
  - [ ]\* 12.2 Write integration tests for Contact API route
    - Test successful email submission
    - Test validation error responses
    - Test error handling when email service fails
    - Test proper email formatting
    - _Requirements: 10.3, 10.4, 10.5_

- [ ] 13. Create Hire Me page structure
  - [ ] 13.1 Create `app/hire-me/page.tsx`
    - Implement page layout with hero section displaying page title
    - Add contact information section with LinkedIn URL and email
    - Display availability status from `generalSettings` Firestore configuration
    - Integrate `ContactForm` component
    - Integrate `WhatsAppContact` component
    - Wrap in `PageTransition` and add `FilmGrain` for consistency
    - Use responsive layout: stacked on mobile, multi-column on desktop
    - Apply design system styling with proper spacing and borders
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 9.3, 9.4, 9.5_
  - [ ]\* 13.2 Write unit tests for Hire Me page
    - Test page renders all sections
    - Test responsive layout classes
    - Test contact information display
    - Test component integration
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 9.3, 9.4_

- [ ] 14. Update navigation to include Hire Me page
  - Update `components/Navbar.tsx` to add "Hire Me" link
  - Add navigation entry: `{ name: "Hire Me", href: "/hire-me" }`
  - Ensure link styling matches existing navigation items
  - Test navigation works from all pages
  - _Requirements: 4.8_

- [ ] 15. Configure environment variables
  - Document required environment variables in `.env.local.example`
  - Add `NEXT_PUBLIC_WHATSAPP_NUMBER` for WhatsApp integration
  - Add `ADMIN_EMAIL` for contact form recipient
  - Add email service API keys (e.g., `RESEND_API_KEY`, `SENDGRID_API_KEY`, or EmailJS credentials)
  - Ensure environment variables are excluded from version control via `.gitignore`
  - _Requirements: 6.7, 10.1, 10.6_

- [ ] 16. Add initial Timeline content (seed data)
  - Create seed script or manual admin entries for initial timeline content
  - Add "GDG Jaipur Organizer" entry with ongoing status
  - Add "LeadCRM Client Portal Internship" entry with details: 2-month internship, June 2025 start, React + Vite + PWA tech stack
  - Verify entries display correctly on homepage
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [ ] 17. Ensure responsive design for Timeline and Hire Me features
  - Test Timeline component on mobile (< 640px): verify single column layout
  - Test Timeline component on tablet/desktop (≥ 640px): verify grid layout
  - Test Hire Me page on mobile: verify vertical stacking
  - Test Hire Me page on desktop: verify multi-column layout
  - Verify touch targets are at least 44x44 pixels on touch devices
  - Test responsive typography scaling across breakpoints
  - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6_

- [ ] 18. Final checkpoint - End-to-end verification
  - Run all tests and verify they pass
  - Test Timeline CRUD operations in admin panel
  - Test Timeline display on homepage with multiple entries (ongoing and completed)
  - Test Contact form submission with valid and invalid data
  - Test WhatsApp link opens correctly
  - Test navigation to Hire Me page from all routes
  - Test responsive behavior on mobile, tablet, and desktop viewports
  - Ensure all features work together without errors
  - Ask the user if any issues or questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP delivery
- Each task references specific requirements for traceability (format: `Requirements: X.Y`)
- The implementation follows existing patterns from projects and achievements features for consistency
- Timeline status is computed automatically based on endDate presence (no manual status selection needed)
- Email service choice (Resend, SendGrid, EmailJS) can be decided during task 12 implementation
- WhatsApp integration uses click-to-chat API (no bot required) for simplicity
- All components use TypeScript for type safety
- Responsive design uses Tailwind CSS breakpoints: `sm:` (640px), `md:` (768px), `lg:` (1024px)
- Property-based testing is not included as the design focuses on CRUD operations and UI components without complex business logic requiring universal properties

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1"] },
    { "id": 1, "tasks": ["2.1", "9"] },
    { "id": 2, "tasks": ["2.2", "3.1", "10.1", "11"] },
    { "id": 3, "tasks": ["3.2", "4", "5.1", "6.1", "10.2", "12.1"] },
    { "id": 4, "tasks": ["5.2", "6.2", "7", "12.2", "13.1"] },
    { "id": 5, "tasks": ["13.2", "14", "15", "16", "17"] }
  ]
}
```
