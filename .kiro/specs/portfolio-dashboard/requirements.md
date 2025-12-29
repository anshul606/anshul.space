# Requirements Document

## Introduction

A Next.js portfolio dashboard for the domain anshul.space that serves as a central hub for multiple sub-projects. The system includes a public-facing portfolio dashboard and a hidden admin dashboard accessible only via a secret keyboard shortcut. The design follows a dark-themed, minimal aesthetic with a "personal command center" vibe.

## Glossary

- **Dashboard**: The main public-facing page displaying all projects in a grid layout
- **Project_Card**: A visual component displaying project information including name, description, thumbnail, favicon, link, and status
- **Admin_Panel**: A hidden administrative interface for managing projects
- **Keyboard_Shortcut_Handler**: A global listener that detects the secret key combination to unlock admin access
- **Project_Store**: The data layer managing project CRUD operations
- **Status_Badge**: A visual indicator showing project state (Live, WIP, Archived)

## Requirements

### Requirement 1: Public Portfolio Dashboard Display

**User Story:** As a visitor, I want to view all projects in an organized grid layout, so that I can quickly browse and access different sub-projects.

#### Acceptance Criteria

1. WHEN a visitor navigates to the root URL (/) THEN THE Dashboard SHALL display all projects in a responsive grid layout
2. WHEN the Dashboard loads THEN THE Dashboard SHALL render Project_Cards with name, description, thumbnail, favicon, website link, and status badge
3. WHEN fewer than 4 projects exist THEN THE Dashboard SHALL display them in a single row that remains visually balanced
4. WHEN 10-20 projects exist THEN THE Dashboard SHALL scale the grid cleanly without layout breaking
5. THE Dashboard SHALL use a dark theme with shades of black/gray and one accent color
6. THE Dashboard SHALL display clean typography with appropriate hierarchy

### Requirement 2: Project Card Interactions

**User Story:** As a visitor, I want interactive project cards with hover effects, so that I can have an engaging browsing experience.

#### Acceptance Criteria

1. WHEN a visitor hovers over a Project_Card THEN THE Project_Card SHALL display subtle motion effects (elevation, glow, or scale)
2. WHEN a visitor clicks a Project_Card THEN THE Dashboard SHALL open the project URL in a new browser tab
3. THE Project_Card SHALL display the project favicon alongside the project name
4. THE Project_Card SHALL display a Status_Badge indicating Live, WIP, or Archived state
5. WHEN a project has status "Live" THEN THE Status_Badge SHALL display with a green indicator
6. WHEN a project has status "WIP" THEN THE Status_Badge SHALL display with a yellow/amber indicator
7. WHEN a project has status "Archived" THEN THE Status_Badge SHALL display with a gray indicator

### Requirement 3: Hidden Admin Access via Keyboard Shortcut

**User Story:** As the site owner, I want to access the admin panel through a secret keyboard combination, so that the admin interface remains hidden from regular visitors.

#### Acceptance Criteria

1. THE Keyboard_Shortcut_Handler SHALL listen globally for a specific key combination (Ctrl + Shift + Alt + A)
2. WHEN the correct key combination is pressed on the homepage THEN THE Dashboard SHALL navigate to the /admin route
3. THE /admin route SHALL NOT be linked or referenced in any visible UI element
4. THE /admin route SHALL NOT appear in navigation, footer, or any discoverable location
5. IF a partial key combination is pressed THEN THE Keyboard_Shortcut_Handler SHALL NOT trigger navigation
6. WHEN the admin panel is accessed THEN THE Admin_Panel SHALL display a protected admin UI

### Requirement 4: Admin Dashboard - Project Management

**User Story:** As the site owner, I want to add, edit, and delete projects from the admin panel, so that I can manage my portfolio content.

#### Acceptance Criteria

1. WHEN the admin panel loads THEN THE Admin_Panel SHALL display a list of all existing projects
2. WHEN the owner clicks "Add Project" THEN THE Admin_Panel SHALL display a form with fields for name, description, website URL, image URL, favicon URL, and status
3. WHEN the owner submits a valid new project form THEN THE Project_Store SHALL create a new project entry
4. WHEN the owner clicks "Edit" on a project THEN THE Admin_Panel SHALL populate the form with existing project data
5. WHEN the owner submits an edited project form THEN THE Project_Store SHALL update the existing project entry
6. WHEN the owner clicks "Delete" on a project THEN THE Admin_Panel SHALL prompt for confirmation
7. WHEN the owner confirms deletion THEN THE Project_Store SHALL remove the project entry
8. IF the owner cancels deletion THEN THE Project_Store SHALL retain the project entry unchanged

### Requirement 5: Data Persistence

**User Story:** As the site owner, I want project data to persist in a cloud database, so that I can manage my portfolio from any device.

#### Acceptance Criteria

1. THE Project_Store SHALL persist project data to Firebase Firestore
2. WHEN the Dashboard loads THEN THE Project_Store SHALL retrieve projects from Firestore
3. WHEN a project is created, updated, or deleted THEN THE Project_Store SHALL immediately sync changes to Firestore
4. THE Project_Store SHALL use Firebase Storage for storing project images and favicons
5. WHEN uploading an image THEN THE Project_Store SHALL store it in Firebase Storage and save the resulting URL to Firestore

### Requirement 6: Form Validation

**User Story:** As the site owner, I want form validation when adding/editing projects, so that I can ensure data integrity.

#### Acceptance Criteria

1. WHEN the owner submits a project form with empty required fields THEN THE Admin_Panel SHALL display validation errors
2. THE Admin_Panel SHALL require name, description, and website URL fields
3. WHEN the owner enters an invalid URL format THEN THE Admin_Panel SHALL display a URL format error
4. WHEN all validations pass THEN THE Admin_Panel SHALL allow form submission

### Requirement 7: Empty State Handling

**User Story:** As a visitor, I want to see a meaningful empty state when no projects exist, so that the page doesn't appear broken.

#### Acceptance Criteria

1. WHEN no projects exist in the Project_Store THEN THE Dashboard SHALL display an empty state message
2. THE empty state SHALL maintain the dark theme aesthetic
3. THE empty state SHALL indicate that projects will appear here

### Requirement 8: Visual Design System

**User Story:** As a visitor, I want a cohesive visual experience, so that the portfolio feels premium and professional.

#### Acceptance Criteria

1. THE Dashboard SHALL use a consistent color palette with dark backgrounds (#000000 to #1a1a1a range)
2. THE Dashboard SHALL use one accent color consistently throughout the interface
3. THE Dashboard SHALL implement subtle animations using Framer Motion or CSS transitions
4. THE Dashboard SHALL use consistent spacing and typography scale
5. THE Admin_Panel SHALL follow the same dark theme as the public dashboard
