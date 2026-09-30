# Gururaj Professional Portfolio — React + Firebase

## Included
- React + Vite
- Tailwind CSS v4
- Framer Motion animations
- Responsive premium portfolio UI
- Project slider
- Hero animation / glassmorphism / gradients
- Firebase Authentication for admin login
- Firestore-powered dynamic content
- Admin CRUD for Projects, Experience and Testimonials
- Admin editing for Profile
- Firebase security rules
- Environment variable template

## 1. Install
npm install

## 2. Create Firebase project
In Firebase Console:
1. Create a project.
2. Enable Authentication → Email/Password.
3. Create Firestore Database.
4. Add a web app and copy its config.
5. Create an admin user in Authentication.
6. Put the Firebase config values into `.env` using `.env.example`.
7. `firebase.json` and `.firebaserc` connect the Firebase CLI to the included rules and configured project. Firestore writes are restricted to the admin email in `firebase.rules`.

## 3. Run
npm run dev

Open the local URL and use `/admin` for the admin dashboard.

## 4. Firestore collections
The app expects:
- `site/profile` — profile document
- `projects` — project documents
- `experience` — experience documents
- `testimonials` — testimonial documents

The public site includes useful fallback demo data until Firebase has content.

## 5. Important production notes
- Do NOT put Firebase service-account/private keys in React.
- Firebase web API keys are not secret credentials; Firestore/Auth rules protect your data.
- Keep admin access restricted through Firebase Authentication.
- Add Storage rules before enabling public image uploads.
- Add App Check for additional abuse protection.
- For real contact messages, create a `messages` collection with a restricted write policy or use a backend/serverless function.
- Replace demo social links, email, resume and project content.

## Suggested next upgrades
- Firebase Storage image uploader
- Admin editor for every homepage section
- Drag-and-drop project ordering
- Blog CMS
- Contact inbox
- Analytics dashboard
- SEO editor
- Theme/color controls
- Rich text editor
