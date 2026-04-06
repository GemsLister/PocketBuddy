# RULES.md - PocketBuddy (Expo React Native App)

This document defines the core guidelines, overview, technology stack, and structure for the **PocketBuddy** project. This should serve as the primary reference for development, ensuring consistency across the codebase.

---

## 1. Project Overview

**PocketBuddy** is a mobile application designed for personal finance and record tracking. Its focus is to provide users with a clean, intuitive, and dynamic interface to input transactions (like income and expenses), view their monetary records, and visualize their financial data through charts.

### Key Modules:
- **Authentication:** Secure login and registration.
- **Transactions:** Quick logging of income and (eventually) expenses.
- **Records:** A detailed history of user transactions.
- **Charts:** Visual representations and summaries of financial health.
- **Profile:** User settings and personalization.

---

## 2. Tech Stack

- **Framework:** Expo & React Native
- **Language:** TypeScript
- **Routing:** Expo Router (File-based routing)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **UI Components:** React Native Paper, custom components
- **Animations:** React Native Reanimated
- **Icons:** Expo Vector Icons

---

## 3. Project Structure & Architecture

The project strictly follows a customized Expo Router architecture separated into atomic-like design patterns:

- `/app`: Contains all routing logic. 
  - `/(auth)`: Unauthenticated routes (Login, Register, Forgot Password).
  - `/(tabs)`: Authenticated bottom tab navigation (Records, Charts, Profile).
  - `/(transaction)`: Standalone transactional screens (e.g., adding Income).
- `/screens`: Contains the actual UI view assemblies. The files in `app/` should generally be lightweight wrappers that import full screens from here.
- `/components`: Reusable UI elements (buttons, inputs, cards, segmented controls).
- `/assets`: Images, fonts, and static resources.

---

## 4. Coding Standards & Guidelines

### 4.1. TypeScript
- **Always** use TypeScript.
- Explicitly define prop types and interfaces for all components.
- Avoid the use of `any`; favor `unknown` or strictly typed definitions.

### 4.2. Styling (NativeWind)
- Use **Tailwind CSS classes** via NativeWind (`className="..."`) for the vast majority of styling.
- Reserve the `style={{...}}` prop ONLY for dynamic styling or highly complex sizing that requires `react-native-size-matters` (e.g., `ms`, `vs`, `mvs`).
- Stick to predefined Tailwind colors configured in `tailwind.config.js` to ensure a consistent theme (e.g., `text-moss`, `text-leaf`).

### 4.3. UI / UX Design
- Maintain a **vibrant, modern, and rich aesthetic**.
- Utilize robust padding/margins to let the UI "breathe."
- Incorporate subtle haptics (`expo-haptics`) and micro-animations for interactions (buttons, tabs, form submissions).
- Handle Keyboard behavior gracefully using `KeyboardAvoidingView` on all forms.

### 4.4. Component Design
- Design components to be reusable and independent.
- Keep business logic OUT of UI components as much as possible.
- Wrap buttons and pressables logically, providing active feedback to the user.

---

## 5. Development Workflow

- Run the server using `npx expo start`.
- Clear cache when tweaking deep configurations or NativeWind tailwind rules using `npx expo start -c`.
- Regularly format code (utilize Prettier).
- Always verify changes on both iOS (Simulator) and Android (Emulator) to ensure cross-platform UI harmony.

---

## 6. Future Implementations (Roadmap)
- **State Management:** Integration of Redux Toolkit, Zustand, or React Context for global state (User Data, Balances, Theme).
- **Backend/API:** Integration with a robust backend service (e.g., Laravel API or Firebase) for persistent cloud data.
- **Local Storage:** Caching data using `AsyncStorage` or `expo-sqlite` for offline support.
