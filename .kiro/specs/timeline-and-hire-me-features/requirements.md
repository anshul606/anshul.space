# Requirements Document

## Introduction

This document specifies requirements for two new features in the portfolio website: a Timeline Feature that replaces the current "Current Active Engagement" section with a dynamic, admin-manageable timeline of professional engagements, and a Hire Me Page that provides dedicated contact and hiring information with secure communication methods.

## Glossary

- **Portfolio_Website**: The Next.js-based portfolio application for showcasing projects, achievements, and professional information
- **Timeline_Component**: The frontend component that displays professional engagements in chronological order
- **Timeline_Entry**: A data record representing a single professional engagement, role, or activity with temporal information
- **Admin_Panel**: The existing administrative interface for managing content in the Portfolio_Website
- **Timeline_Manager**: The admin interface module for creating, editing, and deleting Timeline_Entry records
- **Firestore**: Firebase's NoSQL cloud database used for data storage
- **Hire_Me_Page**: A dedicated page route displaying contact information and hiring details
- **Contact_Form**: A form component that collects and routes messages from potential clients or employers
- **Status_Tag**: A label indicating whether a Timeline_Entry is "ongoing" or "completed"
- **WhatsApp_Integration**: The secure communication method for WhatsApp contact without exposing direct phone numbers

## Requirements

### Requirement 1: Timeline Data Management

**User Story:** As a portfolio administrator, I want to manage timeline entries through the admin panel, so that I can keep my professional history up-to-date without code changes.

#### Acceptance Criteria

1. WHEN the administrator accesses the Admin_Panel, THE Timeline_Manager SHALL display all existing Timeline_Entry records sorted by start date in descending order
2. WHEN the administrator creates a new Timeline_Entry, THE Timeline_Manager SHALL require a title with at least 1 character
3. WHEN the administrator creates a new Timeline_Entry, THE Timeline_Manager SHALL require a description with at least 1 character
4. WHEN the administrator creates a new Timeline_Entry, THE Timeline_Manager SHALL require a valid start date in ISO 8601 format
5. WHEN the administrator creates a new Timeline_Entry, THE Timeline_Manager SHALL accept an optional end date in ISO 8601 format
6. WHEN the administrator creates a new Timeline_Entry without an end date, THE Timeline_Manager SHALL set the Status_Tag to "ongoing"
7. WHEN the administrator creates a new Timeline_Entry with an end date, THE Timeline_Manager SHALL set the Status_Tag to "completed"
8. WHEN the administrator submits a valid Timeline_Entry, THE Timeline_Manager SHALL store the entry in Firestore with a unique identifier, timestamps for creation and update, and all provided fields
9. WHEN the administrator edits an existing Timeline_Entry, THE Timeline_Manager SHALL populate the form with current values and allow modification of all fields
10. WHEN the administrator updates a Timeline_Entry, THE Timeline_Manager SHALL validate all fields using the same rules as creation and update the updatedAt timestamp
11. WHEN the administrator deletes a Timeline_Entry, THE Timeline_Manager SHALL prompt for confirmation before deletion
12. WHEN the administrator confirms deletion, THE Timeline_Manager SHALL remove the Timeline_Entry from Firestore

### Requirement 2: Timeline Display

**User Story:** As a portfolio visitor, I want to see professional engagements in a timeline, so that I can understand the professional history and current activities.

#### Acceptance Criteria

1. WHEN the Portfolio_Website home page loads, THE Timeline_Component SHALL replace the existing "Current Active Engagement" section
2. WHEN the Timeline_Component renders, THE Timeline_Component SHALL fetch all Timeline_Entry records from Firestore ordered by start date in descending order
3. WHEN Timeline_Entry records are retrieved, THE Timeline_Component SHALL display each entry with title, description, start date, end date if present, and Status_Tag
4. WHEN a Timeline_Entry has Status_Tag "ongoing", THE Timeline_Component SHALL display the Status_Tag with visual distinction from "completed" entries
5. WHEN a Timeline_Entry has Status_Tag "completed", THE Timeline_Component SHALL display both start date and end date
6. WHEN a Timeline_Entry has Status_Tag "ongoing", THE Timeline_Component SHALL display start date and a visual indicator for ongoing status instead of end date
7. WHEN multiple Timeline_Entry records have Status_Tag "ongoing", THE Timeline_Component SHALL display all ongoing entries
8. WHEN the Timeline_Component displays dates, THE Timeline_Component SHALL format dates in a human-readable format such as "Jan 2025" or "June 2025"
9. WHILE the Timeline_Component is fetching data, THE Timeline_Component SHALL display a loading indicator consistent with the Portfolio_Website design system
10. IF Timeline_Entry records fail to load, THEN THE Timeline_Component SHALL display an error message and fallback content

### Requirement 3: Timeline Initial Content

**User Story:** As a portfolio administrator, I want to pre-populate the timeline with initial entries, so that visitors see relevant professional history immediately after deployment.

#### Acceptance Criteria

1. WHEN the Timeline_Manager is first deployed, THE Timeline_Manager SHALL support creation of a Timeline_Entry for Google Developer Group involvement with title "GDG Jaipur Organizer"
2. WHEN the Timeline_Manager is first deployed, THE Timeline_Manager SHALL support creation of a Timeline_Entry for LeadCRM Client Portal internship with title "LeadCRM Client Portal Internship"
3. WHEN creating the LeadCRM Timeline_Entry, THE Timeline_Manager SHALL accept a description including details about the 2-month internship starting June 2025, React and Vite technology stack, and mobile-first PWA focus
4. WHEN creating the LeadCRM Timeline_Entry, THE Timeline_Manager SHALL accept a start date of June 2025
5. WHEN creating the LeadCRM Timeline_Entry with a 2-month duration, THE Timeline_Manager SHALL accept an end date of August 2025 and Status_Tag "completed" or accept no end date with Status_Tag "ongoing" depending on current time

### Requirement 4: Hire Me Page Structure

**User Story:** As a potential client or employer, I want to access a dedicated page with contact information, so that I can easily reach out for collaboration or hiring opportunities.

#### Acceptance Criteria

1. WHEN a user navigates to "/hire-me" route, THE Portfolio_Website SHALL render the Hire_Me_Page
2. WHEN the Hire_Me_Page renders, THE Hire_Me_Page SHALL display a page title indicating the purpose is contact and hiring information
3. WHEN the Hire_Me_Page renders, THE Hire_Me_Page SHALL display public contact information including LinkedIn URL and email address
4. WHEN the Hire_Me_Page renders, THE Hire_Me_Page SHALL display availability status from the existing generalSettings configuration
5. WHEN the Hire_Me_Page renders, THE Hire_Me_Page SHALL include the Contact_Form component
6. WHEN the Hire_Me_Page renders, THE Hire_Me_Page SHALL include the WhatsApp_Integration component
7. WHEN the Hire_Me_Page renders, THE Hire_Me_Page SHALL use consistent styling with the Portfolio_Website design system including typography, spacing, colors, and borders
8. WHEN the Navbar component renders, THE Navbar SHALL include a navigation link to the Hire_Me_Page

### Requirement 5: Contact Form

**User Story:** As a potential client or employer, I want to submit a contact message through a form, so that I can communicate my inquiry without directly using email clients.

#### Acceptance Criteria

1. WHEN the Contact_Form renders, THE Contact_Form SHALL display input fields for name, email, subject, and message
2. WHEN a user submits the Contact_Form, THE Contact_Form SHALL validate that name contains at least 1 character
3. WHEN a user submits the Contact_Form, THE Contact_Form SHALL validate that email is a valid email address format
4. WHEN a user submits the Contact_Form, THE Contact_Form SHALL validate that subject contains at least 1 character
5. WHEN a user submits the Contact_Form, THE Contact_Form SHALL validate that message contains at least 10 characters
6. WHEN validation fails, THE Contact_Form SHALL display inline error messages for each invalid field
7. WHEN validation passes, THE Contact_Form SHALL submit the form data to a designated email routing endpoint or service
8. WHEN the form submission is in progress, THE Contact_Form SHALL disable the submit button and display a loading indicator
9. WHEN form submission succeeds, THE Contact_Form SHALL display a success message and clear the form fields
10. IF form submission fails, THEN THE Contact_Form SHALL display an error message and allow the user to retry

### Requirement 6: WhatsApp Contact Integration

**User Story:** As a potential client or employer, I want to contact via WhatsApp without seeing the direct phone number, so that I can communicate through my preferred channel while respecting privacy.

#### Acceptance Criteria

1. WHEN the Hire_Me_Page renders, THE WhatsApp_Integration SHALL display a WhatsApp contact option
2. WHEN a user clicks the WhatsApp contact option, THE WhatsApp_Integration SHALL open a WhatsApp conversation interface without exposing the phone number in the UI
3. WHERE a free WhatsApp bot service is available, THE WhatsApp_Integration SHALL use a custom bot to route messages
4. WHERE a free WhatsApp bot service is not available, THE WhatsApp_Integration SHALL use WhatsApp click-to-chat API with a business link
5. WHEN using WhatsApp click-to-chat API, THE WhatsApp_Integration SHALL pre-populate the message with a professional greeting template
6. WHEN the user initiates WhatsApp contact, THE WhatsApp_Integration SHALL open the conversation in a new browser tab or the WhatsApp application if installed
7. WHEN the WhatsApp_Integration is configured, THE WhatsApp_Integration SHALL allow the administrator to update the WhatsApp contact method through admin settings without code changes

### Requirement 7: Timeline Data Model and Storage

**User Story:** As a system, I need to store timeline data with appropriate structure and indexing, so that queries are efficient and data integrity is maintained.

#### Acceptance Criteria

1. THE Firestore SHALL store Timeline_Entry records in a collection named "timeline"
2. WHEN a Timeline_Entry is created, THE Firestore SHALL store fields including id, title, description, startDate, endDate, status, createdAt, and updatedAt
3. WHEN a Timeline_Entry is created, THE Firestore SHALL generate a unique identifier for the id field
4. WHEN Timeline_Entry records are queried, THE Firestore SHALL support ordering by startDate in descending order
5. WHEN a Timeline_Entry has Status_Tag "ongoing", THE Firestore SHALL store the status field with value "ongoing" and endDate as null or undefined
6. WHEN a Timeline_Entry has Status_Tag "completed", THE Firestore SHALL store the status field with value "completed" and endDate as a valid ISO 8601 date string
7. WHEN Timeline_Entry records are retrieved, THE Firestore query SHALL return all entries efficiently without pagination for the initial implementation

### Requirement 8: Admin Panel Integration

**User Story:** As a portfolio administrator, I want to access timeline management within the existing admin panel, so that all content management is centralized in one location.

#### Acceptance Criteria

1. WHEN the administrator accesses the Admin_Panel at "/admin", THE Admin_Panel SHALL display a navigation option for Timeline management
2. WHEN the administrator selects Timeline management, THE Admin_Panel SHALL render the Timeline_Manager component
3. WHEN the Timeline_Manager renders, THE Timeline_Manager SHALL use the same visual design patterns as existing admin components including form styling, button styling, and list styling
4. WHEN the Timeline_Manager displays the list of Timeline_Entry records, THE Timeline_Manager SHALL use a layout consistent with the existing AdminProjectList component
5. WHEN the Timeline_Manager displays the entry form, THE Timeline_Manager SHALL use form controls and validation patterns consistent with the existing AdminForm component
6. WHEN the administrator submits a Timeline_Entry form, THE Timeline_Manager SHALL provide feedback using the same patterns as project and achievement management

### Requirement 9: Responsive Design for Timeline and Hire Me

**User Story:** As a portfolio visitor on any device, I want the timeline and hire me page to display properly, so that I can access information regardless of screen size.

#### Acceptance Criteria

1. WHEN the Timeline_Component renders on mobile devices with viewport width less than 640 pixels, THE Timeline_Component SHALL display entries in a single column layout
2. WHEN the Timeline_Component renders on tablet and desktop devices with viewport width 640 pixels or greater, THE Timeline_Component SHALL display entries in a responsive grid or column layout as appropriate
3. WHEN the Hire_Me_Page renders on mobile devices, THE Hire_Me_Page SHALL stack Contact_Form and contact information vertically
4. WHEN the Hire_Me_Page renders on desktop devices, THE Hire_Me_Page SHALL use a multi-column layout for Contact_Form and contact information
5. WHEN Timeline_Component or Hire_Me_Page elements render, THE elements SHALL use responsive typography scaling consistent with the Portfolio_Website Tailwind configuration
6. WHEN interactive elements render on touch devices, THE elements SHALL have touch targets of at least 44 pixels by 44 pixels for accessibility

### Requirement 10: Email Routing Configuration

**User Story:** As a portfolio administrator, I want to configure where contact form submissions are sent, so that I can receive inquiries at the appropriate email address.

#### Acceptance Criteria

1. THE Contact_Form SHALL send submissions to a configurable email address stored in environment variables or Firestore settings
2. WHERE the Portfolio_Website uses a serverless email service such as SendGrid, Resend, or EmailJS, THE Contact_Form SHALL integrate with the chosen service API
3. WHEN the Contact_Form submits data to the email service, THE Contact_Form SHALL include sender name, sender email, subject, and message in the email payload
4. WHEN the email service processes a submission, THE email service SHALL deliver a formatted email to the administrator's configured email address
5. WHEN the email is delivered, THE email SHALL include sender contact information clearly formatted for easy reply
6. IF the email service requires API keys, THEN THE Portfolio_Website SHALL store API keys securely in environment variables not committed to version control
