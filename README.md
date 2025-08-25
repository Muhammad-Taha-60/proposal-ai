# AI Proposal Generator (MVP v1) ✨

![Project Screenshot](![alt text](image.png)) <!-- Replace with an actual screenshot of your deployed app -->
![Project Screenshot](![alt text](image-1.png))
![Project Screenshot](![alt text](image-2.png))

---

## Table of Contents

- [About the Project](#about-the-project)
- [Live Demo](#live-demo)
- [Features (MVP v1)](#features-mvp-v1)
- [Technologies Used](#technologies-used)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Future Enhancements](#future-enhancements)
- [License](#license)
- [Contact](#contact)

---

## About the Project

The AI Proposal Generator is a web application designed to empower users to quickly create professional and persuasive proposals using Artificial Intelligence. Users can describe their proposal needs, select a desired tone, and instantly generate a polished document. This MVP (Minimum Viable Product) focuses on core functionality, user authentication, and a clean, modern user interface.

It aims to streamline the proposal writing process, saving time and helping users present their ideas effectively.

---

## Live Demo

🚀 **[Access the Live Application Here](YOUR_VERCEL_DEPLOYMENT_URL)** 🚀
*(Replace `YOUR_VERCEL_DEPLOYMENT_URL` with the actual URL from your Vercel deployment)*

---

## Features (MVP v1)

This initial version includes the following key functionalities:

* **User Authentication:** Secure sign-up and login powered by Supabase.
* **Password Reset:** Functionality to reset forgotten passwords.
* **AI Proposal Generation:** Users input a prompt and select a tone to generate a proposal using the Gemini API.
* **Tone Selection:** Choose from various tones (Formal, Friendly, Technical, Persuasive, Concise) for generation.
* **Past Proposals:** View a history of all previously generated proposals.
* **Copy/View Proposals:** Easily copy generated proposal content or view individual proposals.
* **Responsive Design:** Optimized for a seamless experience across desktop and mobile devices.
* **Aesthetic UI with Animations:** Modern landing page with subtle 3D abstract animations using Three.js for an engaging user experience.

---

## Technologies Used

* **Frontend:**
    * [Next.js](https://nextjs.org/) (React Framework)
    * [Tailwind CSS](https://tailwindcss.com/) (Styling Framework)
    * [Three.js](https://threejs.org/) (3D Graphics Library for background animations)
* **Backend / API:**
    * [Gemini API](https://ai.google.dev/) (for AI text generation)
    * [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) (for server-side AI calls)
* **Authentication & Database:**
    * [Supabase](https://supabase.com/) (Authentication and PostgreSQL database)
* **Deployment:**
    * [Vercel](https://vercel.com/)

---

## Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

Before you begin, ensure you have met the following requirements:

* Node.js (v18 or later)
* npm or Yarn
* Git
* A Supabase project (with table setup for `proposals` and `user_generation_limits`)
* A Gemini API Key

### Installation

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/Muhammad-Taha-60/proposal-ai.git](https://github.com/Muhammad-Taha-60/proposal-ai.git)
    cd proposal-ai
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

### Environment Variables

Create a `.env.local` file in the root of your project and add the following environment variables: