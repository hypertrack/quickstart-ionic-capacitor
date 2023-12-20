## Install global dependencies

The base requirements are [Node](https://nodejs.org/en/) v8.6.0 or later, and NPM version 5.6.0 or later (which is usually automatically installed with the required version of Node).

```
npm install -g @capacitor/core @capacitor/cli
```

## Build plugin

```bash
clone the repo git@github.com:hypertrack/sdk-ionic-capacitor.git
cd sdk-ionic-capacitor/
npm i
npm run verify:android
npm run build
```

## Add plugin to Ionic app as a local dependency

```bash
cd ionic-app/
npm i <local-dir>/sdk-ionic-capacitor
npx cap sync
```

### Configuring the build for Android

Change the build config variables defined in `variables.gradle` file
