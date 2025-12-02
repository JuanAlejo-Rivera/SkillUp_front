1. Admin-only Access

Create a new feature that is ONLY visible and accessible when the logged-in user has the "admin" role.

If the user is not admin, hide and block the UI and the request.

🧩 2. Backend — Add a new route

Create a backend route (Node/Express or the existing server setup) with the following behavior:

Route:
PATCH /api/users/update-role

Request body:

{
  "email": "user@example.com",
  "newRole": "user" | "admin" | "teacher"
}


Requirements:

Only allow role updates if the requester has the "admin" role.

Validate incoming data.

Update the user’s role in the database.

Return success or error.

DO NOT change existing authentication logic.

🌐 3. Frontend — API function

Create a function (React + whatever API utility I already use) that calls the backend:

updateUserRole(email, newRole)

Use existing API patterns only.

DO NOT modify unrelated API calls.

Handle success and errors using my existing toast/notification system.

🖥 4. Dashboard — Add a “Manage Roles” button

In the Dashboard view, add a new button visible ONLY to admins:

Button text: “Manage User Roles”

Place it in a clean, visible but non-intrusive location.

Style it using my current dark + elegant palette.

Rounded corners, subtle hover, consistent spacing.

When clicked → opens the Role Management Modal.

🪟 5. Modal — Role Management UI

Create a modal component that contains:

A list or searchable input of all user emails registered in the system (use existing API to fetch them).

A dropdown/select to choose a new role.

A “Save Changes” button that calls the API updateUserRole.

Good error and success feedback (using my toast).

Should NOT break layout or push other UI elements.

Must match my existing design system:

Dark navy surfaces

Rounded corners

Soft shadows

Subtle animations

Consistent typography

Clean spacing

🎨 6. Styling Requirements (MUST FOLLOW)

Use Tailwind + Chakra UI as already used in the project.

Do NOT invent random colors.

Use the same palette already used in my dark UI design system.

Buttons must have transitions, soft glowing hover, and rounded corners.

Modal background: #111B2E

Cards/list items: #1A2537

Highlights: #3A5A80

Do NOT change the styles of existing components.

🚫 7. Non-negotiable Rules

DO NOT touch other components.

DO NOT change authentication flow.

DO NOT alter the dashboard functionality.

DO NOT modify user login, register, or session logic.

ONLY add new components and routes needed for this feature.

All new code must integrate cleanly with the existing structure.

📦 8. Deliverables Copilot Must Produce

Backend route file or code block

API request function

Admin-only dashboard button

Modal component with UI + logic

Styling code that matches my design system

Optional: small refactors ONLY if absolutely necessary and NOT affecting functionality