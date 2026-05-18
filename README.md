# 📱 PocketBuddy

**PocketBuddy** is a mobile application designed to help you manage your personal finances effortlessly. Track your income, expenses, and transfers with ease.

## 🚀 Features

- **Authentication**: Secure login, registration, and password recovery using Supabase Auth.
- **Transaction Records**: Record your expenses and income. Each transaction features a category-specific icon (e.g., Transport 🚌, Foods 🍔, Bills 💧).
- **Profile Management**:
  - Upload and update profile pictures to Supabase Storage.
  - Edit username and bio.
  - Change password.
- **Modern Notifications**: Uses `react-native-flash-message` for smooth user feedback (e.g., "Successfully Registered" or "Update Failed").
- **Clean UI**: Simple and intuitive design powered by NativeWind (Tailwind CSS for React Native).

## 🛠️ Tech Stack

- **Framework**: [Expo](https://expo.dev/) (React Native)
- **Backend/Database**: [Supabase](https://supabase.com/)
- **Styling**: [NativeWind](https://www.nativewind.dev/) (Tailwind CSS)
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **Icons**: [Ionicons](https://ionicons.com/)
- **Notifications**: [React Native Flash Message](https://github.com/lucasferreira/react-native-flash-message)

## 📦 Installation

1.  **Clone the repository**:

    ```bash
    git clone <repository-url>
    cd PocketBuddy
    ```

2.  **Install dependencies**:

    ```bash
    npm install
    ```

3.  **Setup Environment Variables**:
    Create a `.env` file in the root directory and add your Supabase credentials:
    ```env
    EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
    EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
    ```

## 🏃 Getting Started

To start the development server:

```bash
npx expo start
```

To run on your mobile device (Development Build):

- **Android**: `npx expo run:android`
- **iOS**: `npx expo run:ios`

## 📂 Project Structure

- `app/`: Expo Router routes and layouts.
- `screens/`: Core UI components for each screen.
- `src/components/`: Reusable UI components (buttons, inputs, etc.).
- `src/hooks/`: Custom React hooks for authentication and data fetching.
- `src/lib/`: Configuration for Supabase client.
- `assets/`: Images and fonts used in the app.

---

Built with ❤️ for better financial management!
