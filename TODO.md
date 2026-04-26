# Enable Real Phone Development Mode — TODO

## Plan (EAS Build — Recommended)

- [x] Step 1: Create `eas.json` with development build profiles
- [x] Step 2: Verify `app.json` — no changes needed (scheme, package, plugins OK)
- [ ] Step 3: Run EAS CLI commands (user terminal)
  - Install EAS CLI: `npm install -g eas-cli`
  - Login: `eas login`
  - Initialize project: `eas init` (if new project)
  - Build dev APK: `eas build --profile development --platform android`
- [x] Step 4: Metro bundler running in dev-client mode (`npx expo start --dev-client`)
  - Dev build URL: `exp+pocketbuddy://expo-development-client/?url=http%3A%2F%2F10.0.0.36%3A8081`
  - Duplicate processes cleaned up; running cleanly on port 8081
  - Next: Scan QR code from existing dev build, or complete Step 3 to build APK first

---
