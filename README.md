# Lumena — iOS Mesh Gradient Creator

![Project Status: Live](https://img.shields.io/badge/Status-Live-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-Framework-black?style=for-the-badge\&logo=next.js)
![React](https://img.shields.io/badge/React-Frontend-61DAFB?style=for-the-badge\&logo=react)
![Firebase](https://img.shields.io/badge/Firebase-Backend-FFCA28?style=for-the-badge\&logo=firebase)

**Lumena** is a web-based iOS-style mesh gradient creator built for creating beautiful, customizable visual backgrounds, wallpapers, logos, artwork, and other creative assets.

The application provides an interactive canvas where users can experiment with colors, gradients, positioning, and visual composition in real time, while maintaining a minimal interface inspired by modern Apple design.

**Live Demo:** [lumena-app.vercel.app](https://lumena-app.vercel.app?utm_source=chatgpt.com)

---

## 📸 Screenshots & Demo

### Main Editor

<img width="1454" height="709" alt="Screenshot 2026-09-15 at 10 38 44 AM" src="https://github.com/user-attachments/assets/15c99b5a-8305-441d-9aa3-fcdc15951c2a" />


*Lumena's main gradient editor for creating and customizing mesh gradients.*

### Gradient Customization

<img width="1443" height="706" alt="Screenshot 2026-09-15 at 10 40 41 AM" src="https://github.com/user-attachments/assets/2467f344-85db-4472-a3df-c4d8d5745ee5" />

*Interactive controls allow users to modify colors, positions, and the overall appearance of the gradient.*

### Saved / Generated Designs

<img width="1920" height="1080" alt="gradii-1920x1080" src="https://github.com/user-attachments/assets/304393af-f1c9-41f0-aa49-683c4bc60ba1" />


*Generated gradients can be used as wallpapers, backgrounds, logos, and other creative assets.*

### 🎥 Demo Video

https://res.cloudinary.com/dhzomnepn/video/upload/v1754500999/preview-video.mp4

---

## ✨ Features

* **Interactive Mesh Gradients** — Create smooth, multi-point gradients inspired by Apple's visual language.
* **Real-Time Preview** — See visual changes immediately while editing the gradient.
* **Custom Color Controls** — Experiment with different colors and gradient combinations.
* **Creative Canvas** — Designed for wallpapers, logos, artwork, backgrounds, and other visual assets.
* **Responsive Interface** — Works across desktop and smaller screen sizes.
* **Reusable Components** — UI functionality is separated into reusable React components.
* **Global State Management** — Centralized application state makes complex editor interactions easier to manage.
* **Authentication & Data Persistence** — Firebase is used for user authentication and storing application data.
* **Optimized Rendering** — Next.js rendering and route-level optimization help keep the application responsive.
* **Loading & Error States** — API interactions are handled with explicit loading and error states instead of leaving the UI in an uncertain state.

---

## 🧠 Technologies & Architecture

Lumena is built as a modern React/Next.js application with a component-driven frontend and Firebase-powered backend services.

### 1. Frontend (`app/` & `components/`)

The user interface is built with **Next.js and React**.

The application follows a component-based architecture where the editor, controls, navigation, and visual elements are separated into reusable components.

Key responsibilities include:

* Rendering the gradient editor.
* Managing user interactions.
* Updating the gradient in real time.
* Handling responsive layouts.
* Rendering application pages and routes.
* Providing reusable UI primitives.

**Next.js** is also used for rendering and application-level optimizations.

---

### 2. State Management (`store/`)

Lumena uses **Redux** for managing global application state.

This is particularly useful for the gradient editor because multiple UI controls need access to the same underlying state.

The store manages shared state such as:

* Gradient configuration.
* Selected colors.
* Editor state.
* User-related application state.
* Generated/saved designs.

Centralizing this state prevents individual components from becoming tightly coupled and makes the editor easier to extend.

---

### 3. Custom Hooks (`hooks/`)

Reusable **React Hooks** are used to encapsulate interaction and application logic.

Instead of placing complex logic directly inside UI components, hooks provide reusable behavior while keeping components focused on presentation.

This helps keep the codebase modular and easier to maintain.

---

### 4. Firebase (`lib/`)

**Firebase** provides the backend services required by Lumena.

It is used for:

* User authentication.
* Communicating with backend services.
* Managing user-specific data.

Keeping backend functionality behind a dedicated `lib/` layer allows the rest of the application to interact with Firebase without tightly coupling UI components to backend implementation details.

---

## ⚡ Performance & Engineering

Lumena was designed not only as a visual experiment but also as a practical frontend engineering project.

### Server-Side Rendering

Next.js rendering capabilities are used where appropriate to improve initial page delivery and application performance.

### Route-Based Code Splitting

The application benefits from Next.js's route-level code splitting so that users don't need to download the entire application bundle before interacting with a particular page.

### Memoization

Memoization techniques are used in performance-sensitive UI areas to avoid unnecessary recalculations and renders.

This is particularly important for an interactive editor where small state changes can otherwise cause large parts of the interface to re-render.

### Reusable Architecture

Instead of building the editor as one large component, Lumena separates responsibilities across:

```text
components/
hooks/
lib/
store/
app/
```

This makes individual pieces easier to modify and reuse.

---

## 🎨 Design Philosophy

Lumena was designed around a simple idea:

> **Make creating beautiful gradients feel effortless.**

The interface takes inspiration from Apple's visual language, focusing on:

* Minimal controls.
* Smooth visual transitions.
* Large visual previews.
* Clean typography.
* Subtle UI elements.
* Color-focused interaction.

The goal is to keep the interface out of the way while the gradient remains the primary focus.

---

## 📊 Core Application Flow

A simplified version of Lumena's workflow looks like this:

```text
            ┌─────────────────┐
            │      User       │
            └────────┬────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │   Gradient Editor   │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │  React Components   │
          └──────────┬──────────┘
                     │
                     ▼
          ┌─────────────────────┐
          │   Redux Store       │
          └──────────┬──────────┘
                     │
             ┌───────┴────────┐
             ▼                ▼
      ┌─────────────┐   ┌─────────────┐
      │ Live Preview│   │ Firebase    │
      └─────────────┘   │ Persistence │
                        └─────────────┘
```

A user's interactions update the centralized application state, which then updates the visual editor and preview.

When persistent functionality is required, the relevant data is communicated through the Firebase layer.

---

## 📁 Repository Structure

```text
Lumena/
├── app/                    # Next.js application routes and pages
│
├── assets/                 # Project assets and visual resources
│
├── components/             # Reusable React UI components
│
├── hooks/                  # Custom React Hooks
│
├── lib/                    # Firebase and application utilities
│
├── public/                 # Static assets
│
├── store/                  # Redux global state
│
├── components.json         # UI component configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind configuration
├── tsconfig.json           # TypeScript configuration
└── README.md
```

---

## 🚀 How to Run Locally

### 1. Clone the Repository

```bash
git clone https://github.com/dropps07/Lumena.git
cd Lumena
```

### 2. Install Dependencies

Using npm:

```bash
npm install
```

Or using pnpm:

```bash
pnpm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the project root.

Add the Firebase configuration values required by the application.

```env
# Firebase configuration

NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

> Never commit private credentials or production secrets to the repository.

### 4. Start the Development Server

```bash
npm run dev
```

Or:

```bash
pnpm dev
```

### 5. Open Lumena

Navigate to:

```text
http://localhost:3000
```

---

## 🛠️ Development

The project uses the standard Next.js development workflow.

To create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm run start
```

To run linting:

```bash
npm run lint
```

---

## 🌐 Deployment

Lumena is deployed using **Vercel**, with the production application available at:

[lumena-app.vercel.app](https://lumena-app.vercel.app?utm_source=chatgpt.com)

The project can also be deployed to other platforms capable of running Next.js applications.

---

## ⚠️ Known Limitations

Lumena is primarily focused on the creative gradient-generation experience.

Some areas that can be improved further include:

1. **Advanced Export Options**
   Additional export formats and higher-resolution output could make the tool more useful for professional design workflows.

2. **More Gradient Controls**
   More advanced controls for gradient points, blending, opacity, and distortion could provide greater creative freedom.

3. **Design Organization**
   A more extensive system for organizing, searching, and managing saved gradients could be added.

4. **Advanced Sharing**
   Public gradient links and collaborative sharing could make it easier to share designs with other users.

---

## 🔮 Future Improvements

Potential future additions include:

* PNG / SVG export.
* Higher-resolution wallpaper generation.
* Gradient presets.
* Gradient history and undo/redo.
* Public gradient sharing.
* Design collections.
* More advanced mesh controls.
* Gradient interpolation and animation.
* Social/community features.
* Improved mobile editing experience.

---

## 🎯 Why Lumena?

Lumena started as a visual experiment but evolved into a full-stack application combining **creative UI engineering, state management, authentication, persistent data, and performance optimization**.

The project provided practical experience in building an interactive application where frontend architecture and user experience directly affect how the product feels.

---

## 👨‍💻 Author

**Ajey Awasthi**

Built with Next.js, React, Redux, Firebase, and a lot of experimentation with gradients.

**GitHub:** [github.com/dropps07](https://github.com/dropps07?utm_source=chatgpt.com)

**Project:** [Lumena Repository](https://github.com/dropps07/Lumena?utm_source=chatgpt.com)

---

## 📄 License

This project is available for personal and educational use.
