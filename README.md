<a id="readme-top"></a>

# Event Management Platform

A full-stack event management application built with Next.js, allowing users to create, browse, and register for events with integrated payment processing.

## 🌐 Live Demo

**[View Live Project →](https://tech-returners-project.vercel.app/)**

*Experience the full functionality of the event management platform*

## 📋 Table of Contents

- [About The Project](#about-the-project)
- [Built With](#built-with)
- [Features](#features)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## About The Project

This event management platform enables users to discover, create, and manage events. It includes user authentication, payment processing via Stripe, image uploads, and a comprehensive event browsing system with categories and search functionality.

### Built With

* [![Next][Next.js]][Next-url]
* [![React][React.js]][React-url]
* [![TypeScript][TypeScript]][TypeScript-url]
* [![MongoDB][MongoDB]][MongoDB-url]
* [![Tailwind CSS][TailwindCSS]][Tailwind-url]
* [![Clerk][Clerk]][Clerk-url]
* [![Stripe][Stripe]][Stripe-url]
* [![UploadThing][UploadThing]][UploadThing-url]

## ✨ Features

- 🔐 **Authentication**: Secure user authentication with Clerk
- 📅 **Event Management**: Create, update, and delete events
- 🎫 **Event Registration**: Browse and register for events
- 💳 **Payment Processing**: Integrated Stripe checkout for paid events
- 📤 **File Uploads**: Image upload functionality with UploadThing
- 🔍 **Search & Filter**: Search events and filter by categories
- 📱 **Responsive Design**: Mobile-friendly interface
- 👤 **User Profiles**: Personal profile with event history
- 📊 **Event Categories**: Organized event categorization

## 🚀 Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:
* Node.js (v18 or higher)
* npm or yarn
* MongoDB database
* Clerk account
* Stripe account
* UploadThing account

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/BigSlayWai/tech-returners-project.git
   cd tech-returners-project
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables (see [Environment Variables](#environment-variables))

4. Run the development server
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# UploadThing
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# App URL
NEXT_PUBLIC_SERVER_URL=http://localhost:3000
```

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (auth)/            # Authentication routes
│   ├── (root)/            # Main application routes
│   └── api/               # API routes
├── components/            # React components
│   ├── shared/           # Shared components
│   └── ui/               # UI components
├── lib/                   # Utility functions and configurations
│   ├── actions/          # Server actions
│   ├── database/         # Database models and connection
│   ├── utils.ts          # Helper functions
│   └── validator.ts      # Form validation schemas
├── constants/            # Application constants
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 💻 Usage

### Creating an Event
1. Sign in to your account
2. Navigate to "Create Event"
3. Fill in event details (title, description, location, date, price)
4. Upload an event image
5. Select a category
6. Submit the form

### Registering for an Event
1. Browse available events
2. Click on an event to view details
3. Click "Get Ticket" or "Buy Ticket"
4. Complete the Stripe checkout process (for paid events)

### Managing Your Events
1. Go to your profile
2. View events you've created under "Events Organized"
3. View tickets you've purchased under "My Tickets"
4. Edit or delete events you've created

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🚀 Coming Soon

**Enhanced Payment Experience** - We're working on optimizing the Stripe payment workflow for even smoother user interactions! Alternative hosting solutions are being explored to provide the best possible checkout experience.

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- MARKDOWN LINKS & IMAGES -->
[Next.js]: https://img.shields.io/badge/next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white
[Next-url]: https://nextjs.org/
[React.js]: https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB
[React-url]: https://reactjs.org/
[TypeScript]: https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white
[TypeScript-url]: https://www.typescriptlang.org/
[MongoDB]: https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white
[MongoDB-url]: https://www.mongodb.com/
[TailwindCSS]: https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white
[Tailwind-url]: https://tailwindcss.com/
[Clerk]: https://img.shields.io/badge/Clerk-6C47FF?style=for-the-badge&logo=clerk&logoColor=white
[Clerk-url]: https://clerk.dev/
[Stripe]: https://img.shields.io/badge/Stripe-008CDD?style=for-the-badge&logo=stripe&logoColor=white
[Stripe-url]: https://stripe.com/
[UploadThing]: https://img.shields.io/badge/UploadThing-000000?style=for-the-badge
[UploadThing-url]: https://uploadthing.com/
