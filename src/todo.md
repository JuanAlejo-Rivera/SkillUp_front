I need you to restyle my entire React application using TailwindCSS, Chakra UI, and my current component structure, but without modifying any functionality, logic, data flow, hooks, or APIs.
Do NOT touch the logic. Only visual styling.

Please apply the following unified design system across ALL pages, forms, cards, modals, buttons, lists, spinners, and headers.

🎨 1. General Theme (Dark + Elegant + Comfortable)

Use a dark and eye-friendly palette based on:

Dark navy backgrounds (#0D1522, #111B2E)

Soft dark blue surfaces (#1A2537, #1E2A3F)

Desaturated blue accents (#3A5A80, #4A6A90)

Neutral light tones for contrast (#E4E7EB, #F2F3F5)

Soft white text (#F4F7FA)

Muted secondary text (#AEB7C4)

Do NOT use:

Pure black

Pure white

Neon or saturated colors

Random color choices

The palette must stay consistent with the navbar colors.

🏠 2. Dashboard View

Turn each course into a card component

Cards must have dark surfaces, rounded corners, soft shadows, and subtle hover animations

Layout should feel modern, clean, and dynamic

📚 3. SectionView & LessonView
Course title header:

Remove the giant background feeling

Use a moderate-height dark-blue background

Title should be clear but not overwhelming

Rounded corners, soft shadow

Cards inside these views:

Dark surface cards (#1A2537)

Rounded corners

Soft shadows

Hover transitions

Upload boxes (images, videos, docs):

Restyle with dark surfaces

Clear icons and text

Hover states and rounded corners

📝 4. Forms Across the App

Apply consistent styling to:

Add Lesson form

Edit Section form

Edit Lesson form

Create Department form

Login

Create Account

Forgot Password

Confirm Account

Forms should include:

Dark surfaces (#111B2E)

Rounded inputs

Tailwind or Chakra focus borders using #4A6A90

Good spacing and clean hierarchy

Buttons with rounded corners and smooth animations

🗂️ 5. Department Management Modal

Restyle this modal to match all other dark components

Use dark surfaces with soft dividers

List items should be styled like mini-cards

Smooth hover animations

Rounded containers and consistent spacing

⚠️ 6. Delete Course Modal

Use the dark palette

Apply soft red (#C95F5F) ONLY for the delete button

Minimal, elegant, and not flashy

Rounded layout with shadow and fade-in animation

🌀 7. Loading Spinner

Create a custom loading spinner that:

Uses the same palette

Has a circular border spinner with #4A6A90 accents

Replaces all isLoading indicators

Must be minimal and modern

🎞️ 8. Animations (Subtle Only)

Apply:

Fade-in

Soft scaling on hover (1.02)

200ms transitions

No bouncing or flashy animations

🧱 9. Consistency Rules

Across ALL views:

Same colors

Same radius sizes

Same shadow softness

Same typography

Same component style language

❗ 10. Do NOT Modify Functionality

Do NOT change:

API calls

State logic

Hooks

Component behavior

Form submission

Data bindings

ONLY modify UI styling using Tailwind, Chakra, or small structural adjustments that do not affect logic.

Apply this design system across:

Dashboard

SectionView

LessonView

All forms

All modals

Login / Create Account / Forgot Password / Confirm Account

Department management modal

Delete course modal

Spinners

Buttons

Cards

Upload boxes

Lists