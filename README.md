# Lumena — Interactive Mesh Gradient Creator

![Project Status: Live](https://img.shields.io/badge/Status-Live-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-Styling-06B6D4?style=for-the-badge&logo=tailwindcss)
![CI](https://github.com/dropps07/Lumena/actions/workflows/ci.yml/badge.svg)

Lumena is a web-based interactive mesh gradient creator designed for creating smooth, customizable visual backgrounds, wallpapers, artwork, and other creative assets.

The application provides an interactive editing experience where users can manipulate colors, gradient points, and visual composition in real time. The interface is designed around a minimal, Apple-inspired aesthetic while keeping the gradient itself as the primary focus.

**Live Demo:** [lumena-app.vercel.app](https://lumena-app.vercel.app)

**Repository:** [github.com/dropps07/Lumena](https://github.com/dropps07/Lumena)

---

## 📸 Screenshots & Demo

### Main Editor

<img width="1454" height="709" alt="Lumena Main Editor" src="https://github.com/user-attachments/assets/15c99b5a-8305-441d-9aa3-fcdc15951c2a" />

*The main Lumena editor for creating and customizing mesh gradients.*

### Gradient Customization

<img width="1174" height="693" alt="Screenshot 2026-09-15 at 6 10 56 PM" src="https://github.com/user-attachments/assets/2baa2792-d53c-45e8-92d4-6bbd3e4296e4" />

*Interactive controls for modifying gradient colors, points, and composition.*

### Generated Gradient

<img width="1920" height="1080" alt="Lumena Generated Gradient" src="https://github.com/user-attachments/assets/304393af-f1c9-41f0-aa49-683c4bc60ba1" />

*Example of a generated gradient suitable for wallpapers, backgrounds, and other creative uses.*

### Demo Video

https://github.com/user-attachments/assets/90f76a24-b321-4c61-be10-9fc16925f3e3

---

## ✨ Features

* **Interactive Mesh Gradients** — Create smooth multi-point gradients directly in the browser.
* **Real-Time Preview** — Gradient changes are reflected immediately as the user edits.
* **Custom Color Controls** — Select and manipulate colors through interactive controls.
* **Gradient Point Manipulation** — Adjust the position and behavior of gradient points.
* **Creative Canvas** — Generate backgrounds and visual assets for wallpapers, artwork, branding, and other creative projects.
* **Responsive Interface** — Designed to work across desktop and smaller screen sizes.
* **Drag-and-Drop Interactions** — Interactive elements can be repositioned using drag-and-drop interactions.
* **Animated UI** — Motion and transitions provide responsive visual feedback throughout the editor.
* **Reusable Components** — UI functionality is separated into modular React components.
* **Centralized State Management** — Zustand is used to manage shared editor state.
* **Procedural Gradient Generation** — Simplex Noise is used as part of the visual generation process.
* **Save & Share** — Gradients can be saved and retrieved via a generated short link.
* **Public Gallery** — Browse previously saved gradients in a paginated grid.

---

## 🧠 Technologies & Architecture

Lumena is built as a modern Next.js application using React and TypeScript. The project follows a component-driven architecture with dedicated layers for UI components, state management, reusable hooks, and application utilities.

### 1. Frontend (`app/` & `components/`)

The user interface is built using **Next.js, React, and TypeScript**.

The application is divided into reusable components rather than placing the entire editor inside a single component.

Key responsibilities include:

* Rendering the gradient editor.
* Handling user interactions.
* Updating gradient state in real time.
* Managing responsive layouts.
* Rendering application routes and pages.
* Providing reusable UI primitives.
* Handling drag-and-drop interactions.

This structure keeps visual components separated from application logic and makes individual parts of the editor easier to extend.

---

### 2. State Management (`store/`)

Lumena uses **Zustand** for global application state.

This is particularly useful for an interactive editor where multiple components need to access and modify the same gradient configuration.

The store is responsible for managing shared editor state such as:

* Gradient configuration.
* Colors.
* Gradient points.
* Positions.
* Editor settings.
* Other shared UI state.

Using a centralized state store prevents individual components from becoming tightly coupled and provides a single source of truth for the editor.

---

### 3. Custom Hooks (`hooks/`)

Reusable **React Hooks** encapsulate interaction and application logic that would otherwise be duplicated across components.

This allows UI components to remain focused on presentation while hooks handle reusable behavior.

The hooks layer helps separate:

```text
UI
 │
 ▼
Components
 │
 ▼
Custom Hooks
 │
 ▼
Application / Editor Logic
```

This structure also makes individual pieces of functionality easier to test and extend in the future.

---

### 4. Gradient Generation

The gradient-generation system is one of the core technical components of Lumena.

The application combines color manipulation, gradient positioning, interpolation, and procedural techniques to produce smooth visual results.

**Simplex Noise** is used as part of the procedural visual-generation process, allowing the output to move beyond simple static linear or radial gradients.

The rendering system is designed to update interactively as the user modifies the editor.

---

### 5. Interaction & Animation

Lumena uses modern interaction libraries to make the editor feel responsive and direct.

**Motion** is used for animations and transitions.

Drag-and-drop functionality is implemented using interaction libraries such as **dnd-kit**.

These are particularly useful for an editor where users directly manipulate visual elements rather than interacting exclusively through traditional form controls.

---

### 6. Analytics

The application integrates lightweight analytics and user-behavior tooling through:

* **Vercel Analytics**
* **Microsoft Clarity**

These tools provide insight into application usage and user interaction patterns, which can help identify areas for future UX and performance improvements.

---

### 7. Backend & Persistence

Gradients can be saved and shared via a generated short link, backed by a small API layer and a Postgres database.

**Stack:** Postgres (hosted on [Neon](https://neon.tech)) · Prisma ORM · Next.js API routes · Upstash Redis (rate limiting)

**Schema** (`prisma/schema.prisma`):

| Field | Type | Purpose |
|---|---|---|
| `id` | UUID | Internal primary key |
| `slug` | String | Short, public-facing identifier used in share URLs |
| `config` | JSONB | The full gradient state (colors, blur, text styling, position, etc.) |
| `createdAt` | DateTime | Used to order the gallery, newest first |
| `viewCount` | Int | Reserved for future analytics |

`config` is stored as a single JSONB blob rather than individual columns because the gradient's shape is still evolving — new editor controls can be added without a schema migration each time.

**API routes:**

| Method | Route | Purpose |
|---|---|---|
| `POST` | `/api/gradients` | Save the current editor state, returns a generated `slug` |
| `GET` | `/api/gradients/[slug]` | Fetch a single saved gradient by its slug |
| `GET` | `/api/gradients` | Paginated list of saved gradients (powers `/gallery`) |

**Rate limiting:** the save endpoint is limited to 5 requests per minute per IP (sliding window, via Upstash Redis) to prevent write-spam against the database.

**Pages built on this:**

* **`/g/[slug]`** — loads a saved config into the editor's store and renders a read-only preview, scaled to the gradient's original resolution.
* **`/gallery`** — paginated grid of saved gradients. Currently shows color/palette swatches rather than live-rendered canvas thumbnails — true live thumbnails would require either a separate canvas instance per card or snapshotting the image at save time, both larger changes scoped out for now.

---

## ⚡ Performance & Engineering

Lumena was designed as an interactive visual application where rendering performance directly affects the user experience.

### Client-Side Rendering

The gradient editor is primarily client-side because the application needs to respond immediately to user interaction.

Keeping the editor logic close to the client avoids unnecessary network round trips for every visual change.

### Component-Based Rendering

The editor is split into reusable components so that UI responsibilities remain isolated.

This makes it possible to optimize individual areas of the application without restructuring the entire editor.

### State Isolation

Shared editor state is managed through Zustand rather than being passed through deeply nested component trees.

This reduces unnecessary prop drilling and provides a predictable way for different editor controls to access the same state.

### Procedural Generation

Procedural techniques allow the application to generate visual variation without requiring every possible gradient to be stored as a static asset.

---

## 🎨 Design Philosophy

Lumena was built around a simple idea:

> Make creating beautiful gradients feel effortless.

The interface takes inspiration from modern Apple-style design principles, focusing on:

* Minimal controls.
* Smooth transitions.
* Large visual previews.
* Clean typography.
* Subtle interface elements.
* Direct manipulation.
* Color-focused interaction.

The goal is to keep the interface out of the way while making the generated gradient the primary visual element.

---

## 📊 Core Application Flow

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
                  │    Zustand Store    │
                  └──────────┬──────────┘
                             │
                ┌────────────┼────────────┐
                ▼            ▼            ▼
         ┌─────────────┐┌──────────┐┌─────────────┐
         │ Gradient    ││ UI/Motion││ Save & Share│
         │ Generation  ││Interact. ││   (API)     │
         └──────┬──────┘└──────────┘└──────┬──────┘
                │                          │
                ▼                          ▼
         ┌─────────────┐          ┌──────────────────┐
         │ Live Canvas │          │ Postgres (Neon)  │
         │   Preview   │          │ via Prisma       │
         └─────────────┘          └──────────────────┘
```

A user's interaction updates the centralized editor state. The updated state is then used by the gradient-generation and rendering logic to produce the new visual output.

Editing itself requires no network round trip — the API layer is only involved when a gradient is explicitly saved, fetched by slug, or listed in the gallery.

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
├── lib/                    # Application utilities and supporting logic
│
├── prisma/                 # Database schema (Prisma)
│
├── public/                 # Static assets
│
├── store/                  # Zustand global state
│
├── components.json         # UI component configuration
├── next.config.ts          # Next.js configuration
├── package.json            # Dependencies and scripts
├── tailwind.config.ts      # Tailwind CSS configuration
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

### 3. Start the Development Server

```bash
npm run dev
```

Or:

```bash
pnpm dev
```

### 4. Open Lumena

Navigate to:

```text
http://localhost:3000
```

The application should now be available locally.

---

## 🛠️ Development

The project uses the standard Next.js development workflow.

### Development Server

```bash
npm run dev
```

### Production Build

```bash
npm run build
```

### Production Server

```bash
npm run start
```

### Linting

```bash
npm run lint
```

### Tests

```bash
npm run test
```

---

## 🌐 Deployment

Lumena is deployed using **Vercel**.

The production application is available at:

**https://lumena-app.vercel.app**

The project can also be deployed to other platforms capable of running Next.js applications.

---

## ⚠️ Known Limitations

### 1. High-Resolution Rendering

Large exports can become computationally expensive because rendering work is performed on the main browser thread.

A Web Worker-based rendering system is planned for high-resolution exports.

### 2. Accessibility

The editor can be improved further with more comprehensive keyboard navigation, ARIA labels, focus management, and screen-reader support.

### 3. Gallery Thumbnails

The gallery currently renders color-swatch previews rather than live gradient thumbnails, since the live canvas is driven by a single global store not designed for rendering many gradients simultaneously. Proper live thumbnails would need either isolated per-card canvas state or a snapshot image generated at save time.

---

## ✅ Completed Since Initial Release

What follows was originally listed under "Future Improvements" — it's now shipped:

* **Unit testing with Vitest** — pure logic extracted and tested independently of the UI: `hslToHex` color conversion, `generateBlobGeometry` (with injectable randomness for deterministic tests), and `applyGrainToChannel` clamping behavior.
* **CI with GitHub Actions** — lint, test, and build run automatically on every push and pull request.
* **Backend, API & persistence** — see the [Backend & Persistence](#7-backend--persistence) section above for the full write-up: Postgres via Neon, Prisma ORM, three API routes, rate limiting, save/share/gallery pages.

---

## 🔮 Future Improvements

### 1. Web Worker-Based Rendering

High-resolution exports can require significantly more computation than the interactive editor.

A future implementation will move expensive rendering operations into a **Web Worker**.
Performance improvements will be measured using concrete benchmarks, such as comparing high-resolution export time before and after moving rendering work into a worker.
---

### 2. Accessibility

A dedicated accessibility pass will improve the editor's usability for keyboard and assistive-technology users.
improvements include:
* Keyboard controls for sliders and color controls.
* Full keyboard navigation.
* ARIA labels for interactive controls.
* Improved focus states.
* Accessible button and input semantics.
* Screen-reader-friendly controls.
* Reduced-motion support where appropriate.

---

## 📌 Engineering Roadmap

Th evolution of Lumena can be summarized as:

```text
Current
  │
  ├── Interactive Gradient Editor
  ├── Client-Side Rendering
  ├── Zustand State Management
  ├── Procedural Gradient Generation
  └── Responsive UI
        │
        ▼
Phase 1 — Reliability ✅ Done
  │
  ├── Vitest Unit Tests
  └── GitHub Actions CI
        │
        ▼
Phase 2 — Full Stack ✅ Done
  │
  ├── API (Next.js route handlers)
  ├── PostgreSQL (Neon) via Prisma
  ├── Saved Gradients
  ├── Shareable URLs (/g/[slug])
  ├── Public Gallery (/gallery)
  ├── Pagination
  └── Rate Limiting (Upstash)

```

---

## 🎯 Why Lumena?

Lumena started as an interactive visual experiment and evolved into a frontend engineering project centered around real-time rendering, state management, interaction design, and procedural graphics.

This stage of the project focused on the engineering concerns that sit behind a production application — most of which are now implemented:

* Reliable automated tests.
* Continuous integration.
* API design.
* Database persistence.
* Input validation.
* Rate limiting.
* Pagination.
* Background computation.
* Accessibility.
* Performance benchmarking.

The goal is to evolve Lumena from a polished interactive frontend into a **complete, production-oriented full-stack application**.

---

## 👨‍💻 Author

**Ajey Awasthi**

Built with Next.js, React, TypeScript, Zustand, Tailwind CSS, Motion, and a lot of experimentation with gradients.

**GitHub:** [github.com/dropps07](https://github.com/dropps07)

**Project Repository:** [github.com/dropps07/Lumena](https://github.com/dropps07/Lumena)

---

## 📄 License

This project is available for personal and educational use.
