# Stockroom — Inventory Management App

A React Native (Expo) inventory app: item tracking, barcode scanning, stock in/out logging, low-stock alerts, and search/filter.

## Building the APK — phone-only workflow (no computer needed)

Since this app needs native camera access for barcode scanning, it can't run as a plain web page — it needs to be compiled into a real Android app. Expo's **EAS Build** service does that compiling in the cloud, so you never need Android Studio or a laptop.

### Step 1 — Get the code onto GitHub
1. Create a free account at github.com if you don't have one (the GitHub mobile app works fine for this).
2. Create a new repository, e.g. `stockroom`.
3. Upload all the files from this project into that repository (GitHub's mobile web view lets you upload files/folders directly, or use the GitHub mobile app's "Add file" option).

### Step 2 — Connect to Expo (EAS)
1. Create a free account at expo.dev.
2. From your phone browser, go to your Expo dashboard and choose **Create a project** → **Import from GitHub**, and select your `stockroom` repo.
3. Expo will detect it's an Expo/React Native project automatically.

### Step 3 — Trigger the build
1. On the project page on expo.dev, find **EAS Build**.
2. Choose **Android** as the platform and **APK** as the build type (not AAB — APK installs directly on a phone without the Play Store).
3. Start the build. This runs entirely on Expo's servers — you can close your browser and come back later.
4. When it finishes (usually 10–20 minutes), you'll get a download link for the `.apk` file right on the build page.

### Step 4 — Install on your phone
1. Open the download link on your Android phone.
2. Download the `.apk`.
3. Tap the downloaded file to install (you may need to allow "install unknown apps" for your browser in Android settings — this is a one-time permission).
4. Open **Stockroom** from your app drawer.

## What's included
- `App.js` — main screen, state, and navigation logic
- `src/storage.js` — local persistent storage (AsyncStorage) for items and stock history
- `src/components/ItemCard.js` — inventory list item
- `src/components/AddItemModal.js` — add/edit item form
- `src/components/ItemDetailModal.js` — item detail, stock in/out, history log
- `src/components/AdjustStockModal.js` — quantity entry for stock movements
- `src/components/ScannerModal.js` — camera barcode scanner (expo-camera)
- `src/theme.js` — shared colors and design tokens

## Notes
- All data is stored locally on the device (not in the cloud) — it stays even if you close the app, but won't sync across devices.
- Barcode scanning requires camera permission, which the app will prompt for on first use.
