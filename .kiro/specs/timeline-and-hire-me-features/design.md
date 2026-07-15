# Design Document: Timeline and Hire Me Features

## Overview

This document provides the technical design for two new features in the portfolio website:

1. **Timeline Feature**: Replaces the static "Current Active Engagement" section with a dynamic, admin-manageable timeline displaying professional engagements in chronological order
2. **Hire Me Page**: A dedicated page for contact and hiring information with form-based communication and WhatsApp integration

### Design Goals

- Maintain consistency with existing design patterns and component structure
- Reuse existing admin panel patterns for timeline management
- Follow the Firestore data access patterns established for projects and achievements
- Ensure responsive design across all screen sizes
- Integrate seamlessly with existing navigation and routing

### Technology Stack

- **Frontend**: Next.js 14+ App Router, TypeScript, React
- **Styling**: Tailwind CSS with custom design system tokens
- **Data Storage**: Firebase Firestore
- **Email Service**: To be configured (SendGrid, Resend, or EmailJS)
- **Communication**: WhatsApp click-to-chat API

## Architecture

### System Context

The features integrate into the existing portfolio application architecture:

```
┌─────────────────────────────────────────────────────────────┐
│                    Portfolio Website                         │
│  ┌────────────┐  ┌────────────┐  ┌────────────────────────┐ │
│  │            │  │            │  │                        │ │
│  │  Homepage  │  │ Admin Panel│  │   Hire Me Page (NEW)  │ │
│  │            │  │            │  │                        │ │
```

│ │ Timeline │ │ Timeline │ │ - Contact Form │ │
│ │ Display │ │ Manager │ │ - WhatsApp Integration │ │
│ │ (NEW) │ │ (NEW) │ │ - Contact Info │ │
│ │ │ │ │ │ │ │
│ └────┬───────┘ └────┬───────┘ └──────────┬─────────────┘ │
│ │ │ │ │
│ └───────────────┼─────────────────────┘ │
│ │ │
└───────────────────────┼─────────────────────────────────────┘
│
┌─────▼─────┐
│ │
│ Firestore │
│ │
│ timeline │
│ siteConfig│
│ projects │
│achievements│
└───────────┘

```

### Component Hierarchy

#### Timeline Feature

```

Homepage (app/page.tsx)
└── TimelineSection
└── TimelineComponent
├── TimelineEntry (repeated)
└── LoadingState / ErrorState

AdminPage (app/admin/page.tsx)
└── Timeline Tab
├── AdminTimelineList
│ └── TimelineListItem (repeated)
└── AdminTimelineForm

```

#### Hire Me Feature

```

HireMePage (app/hire-me/page.tsx)
├── HeroSection
├── ContactInfoSection
├── ContactForm
│ ├── FormField (repeated)
│ └── SubmitButton
└── WhatsAppSection

```

### Data Flow

#### Timeline Display Flow

1. Homepage component mounts
2. TimelineComponent calls `getTimeline()` from `lib/timeline-firestore.ts`
3. Firestore query retrieves entries ordered by `startDate DESC`
4. TimelineComponent renders entries with computed status badges
5. Loading and error states handled with consistent UI patterns

#### Timeline Management Flow

```

1. Admin navigates to Timeline tab
2. AdminTimelineList fetches and displays entries
3. Admin clicks "Add Timeline Entry" or "Edit"
4. AdminTimelineForm displays with validation
5. Admin submits form
6. Validation runs (client-side)
7. `addTimelineEntry()` or `updateTimelineEntry()` called
8. Firestore document created/updated
9. List refreshes to show changes

#### Contact Form Flow

1. User fills out contact form on /hire-me
2. Client-side validation runs on submit
3. Form data posted to API route `/api/contact`
4. API route validates server-side
5. Email service API called with formatted message
6. Success/error response returned to client
7. UI updates with appropriate feedback

## Components and Interfaces

### Timeline Components

#### TimelineComponent

**Location**: `components/Timeline.tsx`

**Purpose**: Display chronological list of professional engagements on the homepage

**Props**:

```typescript
// No props - fetches data internally
```

**State**:

```typescript
const [entries, setEntries] = useState<TimelineEntry[]>([]);
const [isLoading, setIsLoading] = useState(true);
const [error, setError] = useState<string | null>(null);
```

**Behavior**:

- Fetches timeline entries on mount using `useEffect`
- Displays loading spinner while fetching (consistent with existing patterns)
- Shows error message if fetch fails
- Renders entries with responsive grid layout
- Each entry shows: title, description, date range, status badge

**Styling**:

- Follows existing section structure with `[ 02 / BACKGROUND & EDUCATION ]` header pattern
- Uses `border border-white/8 bg-white/[0.01]` for cards
- Status badges styled with `StatusBadge` component (reused from projects)
- Responsive: single column on mobile, grid on desktop

#### AdminTimelineList

**Location**: `components/AdminTimelineList.tsx`

**Purpose**: Admin interface for viewing and managing timeline entries

**Props**:

```typescript
interface AdminTimelineListProps {
  entries: TimelineEntry[];
  onEdit: (entry: TimelineEntry) => void;
  onDelete: (id: string) => Promise<void>;
  isLoading?: boolean;
}
```

**Pattern**: Follows `AdminProjectList` component structure

**Features**:

- Lists entries with title, date range, status
- Edit and Delete buttons for each entry
- Delete confirmation modal
- Loading state with spinner
- Empty state message

#### AdminTimelineForm

**Location**: `components/AdminTimelineForm.tsx`

**Purpose**: Form for creating and editing timeline entries

**Props**:

```typescript
interface AdminTimelineFormProps {
  entry?: TimelineEntry | null;
  onSubmit: (data: TimelineFormData) => Promise<void>;
  onCancel: () => void;
  isSubmitting?: boolean;
}
```

**Pattern**: Follows `AdminForm` component structure

**Fields**:

- Title (text input, required, min 1 char)
- Description (textarea, required, min 1 char)
- Start Date (date picker, required, ISO 8601 format)
- End Date (date picker, optional, ISO 8601 format)
- Status (computed: "ongoing" if no end date, "completed" if end date present)

**Validation**:

- Client-side validation using validation library
- Real-time error display on blur
- All errors shown on submit attempt
- Validation follows `lib/validation.ts` patterns

### Hire Me Page Components

#### HireMePage

**Location**: `app/hire-me/page.tsx`

**Purpose**: Main page component for contact and hiring information

**Structure**:

```typescript
export default function HireMePage() {
  return (
    <PageTransition>
      <FilmGrain />
      <main className="min-h-screen bg-bg-primary text-text-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20">
          {/* Hero Section */}
          <HeroSection />

          {/* Contact Info Grid */}
          <section className="mb-24 md:mb-36">
            <ContactInfoDisplay />
          </section>

          {/* Contact Form */}
          <section className="mb-24 md:mb-36">
            <ContactForm />
          </section>

          {/* WhatsApp Integration */}
          <section className="mb-24">
            <WhatsAppContact />
          </section>
        </div>
      </main>
    </PageTransition>
  );
}
```

#### ContactForm

**Location**: `components/ContactForm.tsx`

**Purpose**: Form component for collecting contact messages

**State**:

```typescript
interface ContactFormState {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const [formData, setFormData] = useState<ContactFormState>({
  name: "",
  email: "",
  subject: "",
  message: "",
});
const [errors, setErrors] = useState<Record<string, string>>({});
const [isSubmitting, setIsSubmitting] = useState(false);
const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">(
  "idle",
);
```

**Validation Rules**:

- name: required, min 1 character
- email: required, valid email format (regex: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`)
- subject: required, min 1 character
- message: required, min 10 characters

**Submit Handler**:

```typescript
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();

  // Validate
  const validationErrors = validateContactForm(formData);
  if (Object.keys(validationErrors).length > 0) {
    setErrors(validationErrors);
    return;
  }

  setIsSubmitting(true);
  try {
    const response = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
```

    if (!response.ok) throw new Error('Failed to send message');

    setSubmitStatus('success');
    setFormData({ name: '', email: '', subject: '', message: '' });

} catch (error) {
setSubmitStatus('error');
} finally {
setIsSubmitting(false);
}
};

````

**Styling**: Follows admin form patterns with portfolio design tokens

#### WhatsAppContact

**Location**: `components/WhatsAppContact.tsx`

**Purpose**: Provides WhatsApp contact option without exposing phone number

**Implementation Strategy**:
- Use WhatsApp click-to-chat API: `https://wa.me/<number>?text=<pre-filled-message>`
- Phone number stored in environment variable `NEXT_PUBLIC_WHATSAPP_NUMBER`
- Pre-filled message template: "Hi! I'd like to discuss a project opportunity."
- Opens in new tab or WhatsApp app if installed

**Component Structure**:
```typescript
export function WhatsAppContact() {
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER;
  const message = encodeURIComponent("Hi! I'd like to discuss a project opportunity.");
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${message}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-3 px-6 py-4 bg-[#25D366] text-white rounded-lg hover:bg-[#20BA5A] transition-colors"
    >
      {/* WhatsApp Icon SVG */}
      <span className="font-medium">Contact via WhatsApp</span>
    </a>
  );
}
````

## Data Models

### Timeline Entry Model

**TypeScript Interface**:

```typescript
// types/timeline.ts

export type TimelineStatus = "ongoing" | "completed";

export interface TimelineEntry {
  id: string;
  title: string;
  description: string;
  startDate: string; // ISO 8601 format: "2025-06-01T00:00:00.000Z"
  endDate?: string; // ISO 8601 format, undefined for ongoing
  status: TimelineStatus;
  createdAt: string;
  updatedAt: string;
}

export interface TimelineFormData {
  title: string;
  description: string;
  startDate: string;
  endDate?: string;
}
```

**Firestore Schema**:

```javascript
// Collection: "timeline"
{
  // Document ID: auto-generated by Firestore
  "id": "abc123xyz",
  "title": "GDG Jaipur Organizer",
  "description": "Co-organizing Google Developer Group events...",
  "startDate": "2025-01-01T00:00:00.000Z",
  "endDate": null,  // or "2025-12-31T00:00:00.000Z"
  "status": "ongoing",  // or "completed"
  "createdAt": "2025-01-15T10:30:00.000Z",
  "updatedAt": "2025-01-15T10:30:00.000Z"
}
```

**Field Constraints**:

- `title`: string, required, min 1 char, max 200 chars
- `description`: string, required, min 1 char, max 1000 chars
- `startDate`: string (ISO 8601), required
- `endDate`: string (ISO 8601) or null, optional
- `status`: computed from presence of endDate
  - If `endDate` is null/undefined → `"ongoing"`
  - If `endDate` exists → `"completed"`

### Contact Form Model

**TypeScript Interface**:

```typescript
// types/contact.ts

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}
```

**API Request/Response**:

```typescript
// POST /api/contact
// Request Body:
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Project Inquiry",
  "message": "I'd like to discuss a web development project..."
}

// Response (Success):
{
  "success": true,
  "message": "Message sent successfully"
}

// Response (Error):
{
  "success": false,
  "error": "Failed to send message"
}
```

### WhatsApp Configuration

**Environment Variables**:

```bash
# .env.local
NEXT_PUBLIC_WHATSAPP_NUMBER=919876543210  # Format: country code + number (no + or spaces)
```

## API and Service Layer

### Timeline Firestore Service

**Location**: `lib/timeline-firestore.ts`

**Pattern**: Follows `lib/firestore.ts` and `lib/achievements-firestore.ts` patterns

**Functions**:

```typescript
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "./firebase";
import { TimelineEntry, TimelineFormData } from "@/types/timeline";

const COLLECTION_NAME = "timeline";

/**
 * Fetch all timeline entries ordered by start date (descending)
 */
export async function getTimelineEntries(): Promise<TimelineEntry[]> {
  try {
    const timelineRef = collection(db, COLLECTION_NAME);
    const q = query(timelineRef, orderBy("startDate", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as TimelineEntry[];
  } catch (error) {
    console.error("Firestore read error (timeline):", error);
    throw new Error("Failed to fetch timeline entries");
  }
}

/**
 * Add a new timeline entry
 */
export async function addTimelineEntry(
  data: TimelineFormData,
): Promise<TimelineEntry> {
  try {
    const now = new Date().toISOString();

    // Compute status based on endDate
    const status = data.endDate ? "completed" : "ongoing";

    const entryData = {
      ...data,
      endDate: data.endDate || null,
      status,
      createdAt: now,
      updatedAt: now,
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), entryData);
    return { id: docRef.id, ...entryData };
  } catch (error) {
    console.error("Firestore write error (timeline):", error);
    throw new Error("Failed to add timeline entry");
  }
}
```

/\*\*

- Update an existing timeline entry
  \*/
  export async function updateTimelineEntry(
  id: string,
  data: Partial<TimelineFormData>
  ): Promise<void> {
  try {
  const docRef = doc(db, COLLECTION_NAME, id);

      // Recompute status if endDate changed
      const updateData: any = {
        ...data,
        updatedAt: new Date().toISOString(),
      };

      if ('endDate' in data) {
        updateData.status = data.endDate ? "completed" : "ongoing";
        updateData.endDate = data.endDate || null;
      }

      await updateDoc(docRef, updateData);

  } catch (error) {
  console.error("Firestore update error (timeline):", error);
  throw new Error("Failed to update timeline entry");
  }
  }

/\*\*

- Delete a timeline entry
  \*/
  export async function deleteTimelineEntry(id: string): Promise<void> {
  try {
  await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
  console.error("Firestore delete error (timeline):", error);
  throw new Error("Failed to delete timeline entry");
  }
  }

````

### Contact Form Validation

**Location**: `lib/validation.ts` (extend existing file)

**Functions**:

```typescript
export interface ContactFormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

/**
 * Validates contact form data
 */
export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  // Name validation
  if (isEmptyOrWhitespace(data.name)) {
    errors.name = "Name is required";
  }

  // Email validation
  if (isEmptyOrWhitespace(data.email)) {
    errors.email = "Email is required";
  } else if (!isValidEmail(data.email)) {
    errors.email = "Please enter a valid email address";
  }

  // Subject validation
  if (isEmptyOrWhitespace(data.subject)) {
    errors.subject = "Subject is required";
  }

  // Message validation
  if (isEmptyOrWhitespace(data.message)) {
    errors.message = "Message is required";
  } else if (data.message.trim().length < 10) {
    errors.message = "Message must be at least 10 characters";
  }

  return errors;
}

/**
 * Validates email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
````

### Contact API Route

**Location**: `app/api/contact/route.ts`

**Purpose**: Server-side endpoint for processing contact form submissions

**Implementation**:

```typescript
import { NextRequest, NextResponse } from "next/server";
import { validateContactForm } from "@/lib/validation";
import { ContactFormData } from "@/types/contact";

// Email service integration (example with Resend)
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "anshulbansal2406@gmail.com";

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json();

    // Server-side validation
    const errors = validateContactForm(body);
    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ success: false, errors }, { status: 400 });
    }

    // Send email via service
    await resend.emails.send({
      from: "Portfolio Contact <noreply@yourdomain.com>",
      to: ADMIN_EMAIL,
      replyTo: body.email,
      subject: `Portfolio Contact: ${body.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${body.name}</p>
        <p><strong>Email:</strong> ${body.email}</p>
        <p><strong>Subject:</strong> ${body.subject}</p>
        <p><strong>Message:</strong></p>
        <p>${body.message.replace(/\n/g, "<br>")}</p>
      `,
    });

    return NextResponse.json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message" },
      { status: 500 },
    );
  }
}
```

**Environment Variables Required**:

```bash
# Email Service Configuration
RESEND_API_KEY=re_xxxxxxxxxxxxx
ADMIN_EMAIL=anshulbansal2406@gmail.com

# Alternative: SendGrid
# SENDGRID_API_KEY=SG.xxxxxxxxxxxxx

# Alternative: EmailJS (client-side)
# NEXT_PUBLIC_EMAILJS_SERVICE_ID=service_xxxxx
# NEXT_PUBLIC_EMAILJS_TEMPLATE_ID=template_xxxxx
# NEXT_PUBLIC_EMAILJS_PUBLIC_KEY=xxxxxxxxxxxxx
```

## Integration Points

### Navigation Integration

**Update Required**: `components/Navbar.tsx`

**Change**:

```typescript
const navLinks = [
  { name: "Journal/Home", href: "/" },
  { name: "Achievements", href: "/achievements" },
  { name: "Resume", href: "/resume" },
  { name: "Hire Me", href: "/hire-me" }, // ADD THIS LINE
];
```

### Homepage Integration

**Update Required**: `app/page.tsx`

**Current Section** (lines ~460-495):

```typescript
{/* Bottom Row Cell - GDG & LNMIIT Focus */}
<div className="p-8 border-t border-white/8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-white/[0.005]">
  <div className="flex items-center gap-3">
    <span className="relative flex h-2 w-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
    </span>
    <span className="font-mono text-xs text-text-secondary uppercase tracking-widest font-semibold">
      Current Active Engagement
    </span>
  </div>

  <div className="flex flex-wrap gap-3">
    <span className="font-mono text-xs border border-white/10 px-3 py-1.5 bg-white/[0.02] text-[#f5f5f7] rounded-md tracking-wider uppercase select-none hover:border-accent/40 transition-colors">
      GDG Jaipur Organizer
    </span>
    <span className="font-mono text-xs border border-white/10 px-3 py-1.5 bg-white/[0.02] text-[#f5f5f7] rounded-md tracking-wider uppercase select-none hover:border-accent/40 transition-colors">
      GDG LNMIIT Active Member
    </span>
  </div>
</div>
```

**Replace With**:

```typescript
import { Timeline } from '@/components/Timeline';

// In the return statement, replace the static section with:
<Timeline />
```
