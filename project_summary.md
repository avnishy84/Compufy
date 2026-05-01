# Project Summary: Compufy Technology Website

This document provides a summary of the Compufy Technology website project, including its purpose, architecture, and key features.

## 1. Project Overview

Compufy Technology is a corporate marketing website for a technology company. It serves to present the company's brand, services, and contact information with a modern, high-performance, dark-mode user interface. The website is an Angular 18 single-page application (SPA) with Server-Side Rendering (SSR) enabled for performance and SEO.

### Key Features

-   **Modern UI/UX**: A dark-mode-first design with glassmorphism accents and smooth animations.
-   **SSR Enabled**: Fast initial page loads and improved SEO via Angular Universal.
-   **Interactive Easter Egg**: A hidden rocket game where users can fly a rocket and "destroy" DOM elements on the page.
-   **Feature-Rich**: Includes pages for services, contact (with a Firebase-backed form), careers (with an application form), company information, and more.
-   **Responsive Design**: Optimized for desktop, tablet, and mobile devices.

## 2. Tech Stack

| Layer                 | Technology                                       |
| --------------------- | ------------------------------------------------ |
| Framework             | Angular 18.2 (using standalone components)       |
| Language              | TypeScript 5.5 (strict mode)                     |
| Styling               | Tailwind CSS 3.4                                 |
| Backend & DB          | Firebase (Firestore for forms, Analytics)        |
| SSR                   | Angular Universal with an Express.js server      |
| State Management      | Angular Signals                                  |
| Forms                 | Angular Typed Reactive Forms                     |
| Testing               | Jasmine, Karma, and `fast-check` for PBTs        |
| Icons                 | Lucide-Angular (tree-shakeable SVG icons)        |

## 3. Project Structure

The project follows a feature-based structure within the `src/app` directory.

```
src/app/
├── core/            # Singleton services (Firebase, HTTP, Error Handling)
├── data/            # Data models, constants, and static data (no Angular dependencies)
├── features/        # Lazy-loaded page components (Home, Services, Contact, etc.)
├── shared/          # Reusable, stateless UI components (buttons, cards, etc.)
├── app.component.ts # Root component/shell
├── app.config.ts    # App-level providers and configuration
└── app.routes.ts    # Application routes
```

## 4. Architecture

The application uses Angular's latest features, including standalone components, which simplifies the architecture by removing the need for NgModules.

-   **Server-Side Rendering (SSR)**: An Express server (`server.ts`) handles initial requests, rendering the page on the server for faster perceived load times and better SEO. The application then "hydrates" in the browser to a full SPA.
-   **Component-Based**: The UI is built with a hierarchy of components, starting from the root `AppComponent` which contains the main navigation and router outlet.
-   **Lazy Loading**: All page-level components are lazy-loaded via the router (`app.routes.ts`), which means the code for a specific page is only downloaded when the user navigates to it.
-   **Signal-Based State Management**: The app uses Angular Signals for reactive state management, which provides a fine-grained and efficient way to track and update state.
-   **Centralized Services**: Core functionalities like Firebase integration, HTTP requests, and error handling are managed by singleton services provided at the root level.

## 5. Pages & Routes

The main pages and their routes are defined in `src/app/app.routes.ts`:

| Route                 | Component                     | Description                               |
| --------------------- | ----------------------------- | ----------------------------------------- |
| `/` or `/home`        | `HomeComponent`               | The main landing page.                    |
| `/services`           | `ServicesComponent`           | Lists the company's services.             |
| `/services/:id`       | `ServiceDetailsComponent`     | Shows details for a specific service.     |
| `/contact`            | `ContactComponent`            | A contact form that submits to Firebase.  |
| `/careers`            | `CareersComponent`            | A careers page with an application form.  |
| `/who-we-are`         | `WhoWeAreComponent`           | Information about the company and team.   |
| `/ai-approach`        | `AiApproachComponent`         | Details on the company's AI philosophy.   |
| `/privacy-policy`     | `PrivacyPolicyComponent`      | The privacy policy page.                  |
| `/terms-of-service`   | `TermsOfServiceComponent`     | The terms of service page.                |
| `**`                  | `NotFoundComponent`           | A 404 page for any other routes.          |

## 6. Key Feature: Rocket Game Easter Egg

A unique feature of this website is a hidden interactive game.

-   **Activation**: Accessed via a controller icon in the main navigation.
-   **Gameplay**: The user can fly a rocket over the current page, and all the visible HTML elements (text, images, cards) become destructible targets.
-   **Technology**: The game is rendered on an HTML5 Canvas and is carefully designed to be SSR-safe (it only runs in the browser). It has its own game loop, physics, and collision detection.

## 7. Testing

The project has a robust testing strategy:

-   **Unit Tests (`*.spec.ts`)**: Written with Jasmine and run with Karma to test individual components and services.
-   **Property-Based Tests (`*.pbt.spec.ts`)**: Uses the `fast-check` library to test functions with a wide range of generated inputs, ensuring correctness under many conditions.

## 8. Build & Deployment

The project is configured with standard Angular CLI commands.

-   `npm start`: Runs the development server.
-   `npm run build`: Creates a production-ready build with SSR and browser assets.
-   `npm test`: Executes all tests.

The application is designed to be deployed on a platform that supports Node.js for the SSR server (like Firebase Hosting with Cloud Functions, or other similar platforms).
