# Implementation Plan: Portfolio Dashboard

## Overview

This implementation plan builds the Next.js portfolio dashboard incrementally, starting with project setup and core types, then building the data layer, followed by UI components, and finally the admin panel with keyboard shortcut access.

## Tasks

- [x] 1. Project Setup and Core Infrastructure

  - [x] 1.1 Initialize Next.js project with TypeScript and Tailwind CSS

    - Create Next.js 14+ app with App Router
    - Configure Tailwind with custom design tokens (colors, spacing, typography)
    - Install dependencies: framer-motion, uuid
    - Set up folder structure as per design
    - _Requirements: 8.1, 8.2, 8.4_

  - [x] 1.2 Create type definitions and interfaces

    - Create `types/project.ts` with Project and ProjectFormData interfaces
    - Define status type as union: 'live' | 'wip' | 'archived'
    - _Requirements: 1.2, 4.2_

  - [x] 1.3 Create seed data
    - Create `lib/seed.ts` with 3 sample projects (Flow, Notes, Archive)
    - Include all required fields with realistic data
    - _Requirements: 5.5_

- [x] 2. Firebase Setup and Data Layer

  - [x] 2.1 Set up Firebase configuration

    - Install firebase package
    - Create `lib/firebase.ts` with Firebase app initialization
    - Configure environment variables for Firebase credentials
    - _Requirements: 5.1_

  - [x] 2.2 Implement Firestore operations

    - Create `lib/firestore.ts` with CRUD operations
    - Implement getProjects, addProject, updateProject, deleteProject
    - Add error handling for network and permission errors
    - _Requirements: 5.1, 5.2, 5.3_

  - [x] 2.3 Implement Firebase Storage operations

    - Create `lib/storage.ts` with image upload/delete functions
    - Implement uploadImage and deleteImage functions
    - Handle image compression and validation
    - _Requirements: 5.4, 5.5_

  - [x] 2.4 Implement validation utilities

    - Create `lib/validation.ts` with URL validation and form validation functions
    - Implement required field checks for name, description, websiteUrl
    - _Requirements: 6.1, 6.2, 6.3, 6.4_

  - [ ]\* 2.5 Write property tests for validation

    - **Property 10: Required Field Validation**
    - **Property 11: URL Format Validation**
    - **Validates: Requirements 6.1, 6.2, 6.3**

  - [x] 2.6 Update ProjectContext for Firebase

    - Update `context/ProjectContext.tsx` to use Firestore operations
    - Implement async addProject, updateProject, deleteProject operations
    - Add loading and error states
    - _Requirements: 4.3, 4.5, 4.7, 5.3_

  - [ ]\* 2.7 Write property tests for project operations
    - **Property 6: Project Creation Persistence**
    - **Property 7: Project Update Persistence**
    - **Property 8: Project Deletion Behavior**
    - **Validates: Requirements 4.3, 4.5, 4.7, 4.8, 5.3**

- [x] 3. Checkpoint - Firebase Data Layer Complete

  - Ensure Firebase is configured and all CRUD operations work
  - Verify image upload to Firebase Storage works
  - Ask the user if questions arise.

- [x] 4.  UI Components - Public Dashboard

- [x] 4.1 Create StatusBadge component

  - Create `components/StatusBadge.tsx`
  - Implement color mapping: live→green, wip→yellow, archived→gray
  - Style as pill with colored dot and label
  - _Requirements: 2.4, 2.5, 2.6, 2.7_

- [ ]\* 4.2 Write property test for StatusBadge

  - **Property 3: Status Badge Color Mapping**
  - **Validates: Requirements 2.4, 2.5, 2.6, 2.7**

- [x] 4.3 Create ProjectCard component

  - Create `components/ProjectCard.tsx`
  - Display thumbnail (16:9), favicon, name, description, StatusBadge
  - Implement as anchor with href={websiteUrl} target="\_blank"
  - Add Framer Motion hover animation (scale, glow, elevation)
  - _Requirements: 1.2, 2.1, 2.2, 2.3, 2.4_

- [ ]\* 4.4 Write property test for ProjectCard link behavior

  - **Property 2: Project Card Link Behavior**
  - **Validates: Requirements 2.2**

- [x] 4.5 Create EmptyState component

  - Create `components/EmptyState.tsx`
  - Display message indicating no projects yet
  - Maintain dark theme aesthetic
  - _Requirements: 7.1, 7.3_

- [x] 4.6 Create ProjectGrid component

  - Create `components/ProjectGrid.tsx`
  - Implement responsive grid layout with auto-fill
  - Handle empty state by rendering EmptyState component
  - Add stagger animation for card entrance
  - _Requirements: 1.1, 1.3, 1.4, 7.1_

- [ ]\* 4.7 Write property test for ProjectGrid rendering

  - **Property 1: Project Rendering Completeness**
  - **Validates: Requirements 1.1, 1.2**

- [x] 5. Public Dashboard Page

  - [x] 5.1 Implement root layout

    - Create `app/layout.tsx` with ProjectContext provider
    - Set up dark theme body styles
    - Configure Inter font
    - _Requirements: 1.5, 8.1, 8.2_

  - [x] 5.2 Implement public dashboard page

    - Create `app/page.tsx`
    - Render header with site title "anshul.space"
    - Render ProjectGrid with projects from context
    - _Requirements: 1.1, 1.6_

  - [ ]\* 5.3 Write property test for admin route non-discoverability
    - **Property 4: Admin Route Non-Discoverability**
    - **Validates: Requirements 3.3, 3.4**

- [x] 6. Checkpoint - Public Dashboard Complete

  - Ensure all tests pass, ask the user if questions arise.

- [x] 7. Keyboard Shortcut and Admin Access

  - [x] 7.1 Create useKeyboardShortcut hook

    - Create `hooks/useKeyboardShortcut.ts`
    - Listen for Ctrl + Shift + Alt + A combination
    - Validate all modifier keys are pressed simultaneously
    - Return callback trigger function
    - _Requirements: 3.1, 3.2, 3.5_

  - [ ]\* 7.2 Write property test for partial shortcut rejection

    - **Property 5: Partial Keyboard Shortcut Rejection**
    - **Validates: Requirements 3.5**

  - [x] 7.3 Create KeyboardShortcut component
    - Create `components/KeyboardShortcut.tsx`
    - Use useKeyboardShortcut hook
    - Navigate to /admin on successful shortcut
    - Mount in root layout
    - _Requirements: 3.1, 3.2, 3.6_

- [x] 8. Admin Panel Implementation

  - [x] 8.1 Create AdminForm component

    - Create `components/AdminForm.tsx`
    - Implement controlled form with all project fields
    - Add validation using validation utilities
    - Support create and edit modes
    - Display inline validation errors
    - _Requirements: 4.2, 4.3, 4.4, 4.5, 6.1, 6.2, 6.3, 6.4_

  - [x] 8.2 Create AdminProjectList component

    - Create `components/AdminProjectList.tsx`
    - Display list of all projects with edit/delete buttons
    - Implement delete confirmation dialog
    - _Requirements: 4.1, 4.6, 4.7, 4.8_

  - [x] 8.3 Implement admin page
    - Create `app/admin/page.tsx`
    - Render AdminProjectList and AdminForm
    - Implement add/edit/delete flow
    - Style with dark theme matching public dashboard
    - _Requirements: 3.6, 4.1, 4.2, 8.5_

- [x] 9. Final Polish and Integration

  - [x] 9.1 Add page transitions

    - Implement subtle fade transitions between pages
    - Add loading states where appropriate
    - _Requirements: 8.3_

  - [x] 9.2 Add image error handling

    - Implement fallback for failed project images
    - Implement fallback for failed favicons
    - _Requirements: 2.3_

  - [x] 9.3 Final integration testing
    - Verify all CRUD operations work end-to-end
    - Verify keyboard shortcut works from homepage
    - Verify admin route is not discoverable
    - _Requirements: All_

- [ ] 10. Final Checkpoint
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties
- Unit tests validate specific examples and edge cases
