# MITRA Website: Complete Setup Guide

This guide will walk you through setting up and running the MITRA NGO website project from scratch, even if you have limited technical knowledge.

## What This Project Is

MITRA (Mitra for inception of technologies in rural areas ) is a non-profit website that showcases the organization's mission to empower rural communities through education. The website includes:

- Public pages for visitors (Home, About, Gallery, News, Get Involved, Contact)
- Admin dashboard for content management
- News & Events system
- Gallery management
- User/contact submissions tracking

## Prerequisites

You'll need to have these installed on your computer:

- [Node.js](https://nodejs.org/) (version 18 or newer)
- [npm](https://www.npmjs.com/) (comes with Node.js)
- [Git](https://git-scm.com/) (optional, for version control)

## Setup Instructions

### Step 1: Clone or Download the Project

Either download the project as a ZIP file and extract it, or if you're using Git:

```bash
git clone [repository-url]
cd MITRA
```

### Step 2: Install Dependencies

Open a terminal/command prompt in the project directory and run:

```bash
npm install --legacy-peer-deps
```

This will install all the required packages. It might take a few minutes.

### Step 3: Set Up Environment Variables

1. Make a copy of the `.env.local` file in the root directory (this contains the Firebase credentials)
2. If you want to use your own Firebase project and Cloudinary account:
   - Create a Firebase project at [firebase.google.com](https://firebase.google.com/)
   - Create a Cloudinary account at [cloudinary.com](https://cloudinary.com/)
   - Update the credentials in your `.env.local` file

.env.local Example:
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your api key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your auth domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your project id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your storage bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your sender id
NEXT_PUBLIC_FIREBASE_APP_ID=your app id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your cloud name
CLOUDINARY_API_KEY=your api key
CLOUDINARY_API_SECRET=your secret key
CLOUDINARY_UPLOAD_PRESET=your preset name


### Step 4: Run the Development Server

```bash
npm run dev
```

This will start the development server. Open [http://localhost:3000](http://localhost:3000) in your browser to see the website.

## Project Structure Overview

Here's a quick breakdown of the important folders:

- `/pages` - All website pages (both public-facing and admin)
- `/components` - Reusable UI components
- `/styles` - CSS styles
- `/lib` - Utility functions and service connectors
- `/public` - Static assets like images

## Admin Access

To access the admin dashboard:

1. Go to [http://localhost:3000/admin/login](http://localhost:3000/admin/login)
2. Use these credentials:(Do not work after integrating firebase auth)
   - Email: `mitra@test.com`
   - Password: `admin123`

## Firebase Setup (If Using Your Own)

If you're using your own Firebase project:

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable Authentication (Email/Password)
4. Create Firestore Database
5. Set up Storage
6. Update Security Rules (copy from `firestore.rules` and `storage.rules`)
7. Go to Project Settings → Service Accounts → Generate new private key, and save it as `private-key.json` in the root directory
8. Run the admin setup script:
   ```bash
   node scripts/setup-admin.js
   ```

## Cloudinary Setup (If Using Your Own)

If using your own Cloudinary account:

1. Sign up at [cloudinary.com](https://cloudinary.com/)
2. Get your Cloud Name, API Key, and API Secret from the dashboard
3. Create an upload preset named "mitra-news" (or update the name in the code)
4. Update the values in `.env.local`

## Features and How to Use Them

### Content Management

- **News & Events**: Add, edit, and manage news articles through the admin panel
- **Gallery**: Upload and organize images in the admin panel
- **User Submissions**: View and manage contact form submissions

### Public Pages

- **Home**: Organization introduction and highlights
- **About**: Organization history, team, and details
- **Get Involved**: Donation, volunteering, and sponsorship information
- **News & Events**: Latest updates and upcoming events
- **Gallery**: Photo collection of the organization's activities
- **Contact**: Contact form for visitor inquiries

## Building for Production

When you're ready to deploy to a production server:

```bash
npm run build
npm start
```

## Deployment Options

You can deploy this website to various platforms:

1. **Vercel** (Easiest)
   - Sign up at [vercel.com](https://vercel.com/)
   - Install the Vercel CLI: `npm i -g vercel`
   - Run `vercel` in the project directory

2. **Firebase Hosting**
   - Install Firebase CLI: `npm i -g firebase-tools`
   - Login: `firebase login`
   - Initialize: `firebase init`
   - Deploy: `firebase deploy`

3. **Netlify**
   - Sign up at [netlify.com](https://netlify.com/)
   - Connect your GitHub repository or upload build files

## Troubleshooting

### Common Issues

1. **"Module not found" errors**
   - Make sure you've run `npm install --legacy-peer-deps`
   - Check if the package is in `package.json`

2. **Firebase Authentication Issues**
   - Check if Firebase Authentication is enabled in your Firebase Console
   - Verify that the email/password provider is turned on

3. **Image Upload Problems**
   - Check Cloudinary credentials
   - Ensure your browser allows file access

4. **API Routes Not Working**
   - Make sure you're running `npm run dev` and not just opening HTML files

## Customization

### Changing Colors and Theme

Edit the files in:
- `styles/theme.js` - Main color scheme and design variables
- `styles/globals.css` - Global CSS variables

### Adding New Pages

1. Create a new file in the `/pages` directory
2. Follow the pattern of existing pages
3. Add the link to the navigation in `components/Header.js`

### Modifying Content

Most text content can be edited directly in the component files:
- Organization information is in component files
- Team members are in `/pages/about.js`
- Sponsorship tiers are in `/components/get-involved/data/sponsorTiers.js`

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Styled Components Documentation](https://styled-components.com/docs)

## Support

For questions or issues:
- Check the [issues section] of the repository
- Reach out to the repository maintainer

---

Good luck with your MITRA website project! This guide should help you get up and running quickly, even with limited technical experience.