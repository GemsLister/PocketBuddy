# RULES.md - PocketBuddy (Expo React Native App)

This document defines the core guidelines, overview, technology stack, and structure for the **PocketBuddy** project. This should serve as the primary reference for development, ensuring consistency across the codebase.

---

## 1. Project Overview

**PocketBuddy** is a mobile application designed for personal finance and record tracking. Its focus is to provide users with a clean, intuitive, and dynamic interface to input transactions (like income and expenses), view their monetary records, and visualize their financial data through charts.

### Key Modules:
- **Authentication:** Secure login and registration using Supabase.
- **Transactions:** Quick logging of income, expenses, and transfers.
- **Records:** A detailed history of user transactions.
- **Charts:** Visual representations and summaries of financial health.
- **Profile:** User settings and personalization.

### Current Status:
- ✅ Authentication screens built (Login, Register, Forgot Password)
- ✅ Transaction screens implemented (Income, Expense, Transfer)
- ✅ Tab navigation structure in place (Records, Charts, Profile)
- ✅ Supabase integration for authentication
- 🔄 Backend data models and database setup needed
- 🔄 State management for global data
- 🔄 Chart visualization implementation

---

## 2. Tech Stack

- **Framework:** Expo & React Native
- **Language:** TypeScript
- **Routing:** Expo Router (File-based routing)
- **Styling:** NativeWind (Tailwind CSS for React Native)
- **UI Components:** React Native Paper, @rneui/themed, custom components
- **Authentication:** Supabase (PostgreSQL database + auth)
- **Icons:** Expo Vector Icons (Ionicons)
- **Responsive Sizing:** react-native-size-matters
- **Haptics:** expo-haptics (for tactile feedback)
- **Google Sign-In:** @react-native-google-signin/google-signin
- **Animations:** React Native Reanimated

---

## 3. Project Structure & Architecture

The project strictly follows a customized Expo Router architecture separated into atomic-like design patterns:

- `/app`: Contains all routing logic using Expo Router.
  - `/(auth)`: Unauthenticated routes (Login, Register, Forgot Password).
  - `/(tabs)`: Authenticated bottom tab navigation (Records, Charts, Profile).
  - `/(transaction)`: Standalone transactional screens (Income, Expense, Transfer).
- `/screens`: Contains the actual UI view assemblies. The files in `app/` should generally be lightweight wrappers that import full screens from here.
- `/components`: Reusable UI elements organized by type:
  - `/buttons`: Button components (Primary, Secondary, Google, Save, Cancel, Add, Transaction, Segmented)
  - `/container`: Screen container components (Auth, Screen, TransactionScreen, Categories)
  - `/inputs`: Form input components
- `/hooks`: Custom React hooks (currently: `useSignUp` for authentication)
- `/lib`: Library configurations (`supabase.ts` for Supabase client)
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
- Stick to predefined Tailwind colors configured in `tailwind.config.js` to ensure a consistent theme:
  - `text-moss`, `bg-moss` (#385a41)
  - `text-leaf`, `bg-leaf` (#588157)
  - `text-cream`, `bg-cream` (#dcd8cc)
  - `text-beige`, `bg-beige` (#a0b089)
- Use Nunito font family: `font-nunito`, `font-nunito-semibold`, `font-nunito-bold`

### 4.3. UI / UX Design
- Maintain a **vibrant, modern, and rich aesthetic** with green/earth tone color palette.
- Utilize robust padding/margins to let the UI "breathe."
- Incorporate subtle haptics (`expo-haptics`) and micro-animations for interactions (buttons, tabs, form submissions).
- Handle Keyboard behavior gracefully using `KeyboardAvoidingView` on all forms.
- Provide active feedback on all pressable elements (`activeOpacity={0.7}`).

### 4.4. Component Design
- Design components to be reusable and independent.
- Keep business logic OUT of UI components as much as possible.
- Wrap buttons and pressables logically, providing active feedback to the user.
- Use custom hooks for business logic (see `/hooks` directory).

### 4.5. Authentication & Data
- All authentication handled through Supabase (`lib/supabase.ts`)
- Environment variables required: `EXPO_PUBLIC_SUPABASE_URL` and `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Store sensitive configuration in `.env` file (gitignored)

---

## 5. Development Workflow

- Run the server using `npx expo start`.
- Clear cache when tweaking deep configurations or NativeWind tailwind rules using `npx expo start -c`.
- Install dependencies with `npm install --legacy-peer-deps` (due to React 19 compatibility).
- Regularly format code (utilize Prettier).
- Always verify changes on both iOS (Simulator) and Android (Emulator) to ensure cross-platform UI harmony.

### Environment Setup:
1. Clone repository and run `npm install --legacy-peer-deps`
2. Create `.env` file with Supabase credentials:
   ```
   EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```
3. Run `npx expo start` to start development server

---

## 6. Implementation Roadmap

### ✅ **Completed:**
- Project structure and routing
- Authentication UI screens
- Transaction input screens (Income, Expense, Transfer)
- Custom component library
- Supabase client configuration
- NativeWind styling system

### 🚧 **In Progress / Next Steps:**
1. **Supabase Database Setup:**
   - Create PostgreSQL tables for users, transactions, categories
   - Implement transaction CRUD operations
   - Set up database relationships

2. **State Management:**
   - Implement global state management (Redux Toolkit, Zustand, or React Context)
   - Manage user session state
   - Handle transaction data state

3. **Chart Visualization:**
   - Implement chart components for financial data
   - Connect charts to transaction data
   - Add filtering and time period selection

4. **Records Screen:**
   - Display transaction history
   - Add filtering and sorting
   - Implement search functionality

5. **Profile Screen:**
   - User settings and preferences
   - Account management
   - Statistics and insights

### 🔮 **Future Enhancements:**
- **Offline Support:** Caching data using `AsyncStorage` or `expo-sqlite`
- **Notifications:** Transaction reminders and financial alerts
- **Budgeting:** Budget creation and tracking
- **Reports:** Export financial reports
- **Multi-currency Support:** Handle multiple currencies
- **Bank Integration:** Connect to bank accounts (via Plaid or similar)