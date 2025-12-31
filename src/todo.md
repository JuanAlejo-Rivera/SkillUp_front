I am working on a job training / learning platform.
The application design and functionality are already finalized and must not be altered.

Tech stack:

React (frontend)

Tailwind CSS

Node.js + Express (backend)

Cloudinary for file storage

🔒 STRICT RULES (VERY IMPORTANT)

DO NOT change existing UI design or styles

DO NOT modify existing functionality

DO NOT refactor unrelated components

ONLY add the minimum required code

Ask for confirmation before any breaking or structural change

🎯 Feature to Implement

I need to add a red “X” delete icon to each uploaded file inside the Lessons component.

This delete icon:

Triggers a request to delete the file from Cloudinary

Must only be visible to:

The teacher who created the lesson, OR

Users with admin role

Must be hidden for all other users

🧠 Current Backend State

The backend already has Cloudinary deletion logic

Files are deleted when a course, section, or lesson is deleted

Each file stores:

public_id

resource_type (image, video, or raw)

🧩 Required Backend Addition

Implement a new secure API endpoint that:

Deletes a single Cloudinary file

Validates user permissions (teacher owner or admin)

Uses public_id and resource_type

Does NOT expose Cloudinary credentials

Example (conceptual):

DELETE /api/lessons/:lessonId/files/:fileId

🎨 Frontend Requirements

Add a small red X icon on each file item

Icon must be subtle and non-intrusive

Use existing styles and spacing

Show the icon only if the user has permission

On click:

Ask for confirmation

Send DELETE request to backend

Update UI state without reloading the page

🔐 Security Requirements

Authorization must be enforced in the backend

Frontend visibility checks are not enough

Prevent deletion of files from other lessons or users

🛡️ Error Handling

Show a clear error message if deletion fails

Do not break the lesson view

Log backend errors safely

📌 Expected Output

Minimal frontend changes

New backend endpoint with permission checks

Explanation of where code was added

No changes to existing behavior or UI

Proceed step by step and confirm before making changes.