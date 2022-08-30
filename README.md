# Ionic Capacitor Quickstart for HyperTrack SDK

![GitHub](https://img.shields.io/github/license/hypertrack/quickstart-ionic-capacitor.svg) 
![hypertrack-sdk-ionic-capacitor](https://img.shields.io/npm/v/hypertrack-sdk-ionic-capacitor?label=hypertrack-sdk-ionic-capacitor) 

[HyperTrack](https://www.hypertrack.com/) lets you add live location tracking to your mobile app. Live location is made available along with ongoing activity, tracking controls and tracking outage with reasons. 

This repo contains an example Ionic Capacitor app that has everything you need to get started.

For information about how to get started with Ionic Capacitor SDK, please check this [Guide](https://www.hypertrack.com/docs/install-sdk-ionic-capacitor).

## How to get started?

### Create HyperTrack Account

[Sign up](https://dashboard.hypertrack.com/signup) for HyperTrack and get your publishable key from the [Setup page](https://dashboard.hypertrack.com/setup).

### Set up the environment

Run
`npm i -g @ionic/cli`

[Environment setup](https://capacitorjs.com/docs/getting-started/environment-setup)
[Getting started with Ionic Capacitor](https://capacitorjs.com/docs/getting-started/with-ionic)

### Clone Quickstart app

### Install Dependencies

#### General Dependencies

Run:
`npm install`

#### iOS dependencies

Quickstart app uses [CocoaPods](https://cocoapods.org/) dependency manager to install the latest version of the iOS SDK. Using the latest version of CocoaPods is advised.

If you don't have CocoaPods, [install it first](https://guides.cocoapods.org/using/getting-started.html#installation).

```sh
cd ios/App
pod install
```

### Update the publishable key

Insert your HyperTrack publishable key to `const PUBLISHABLE_KEY` in `src/app/home/home.page.ts`

### [Set up silent push notifications](https://hypertrack.com/docs/install-sdk-ionic-capacitor/#set-up-silent-push-notifications)

HyperTrack SDK needs Firebase Cloud Messaging to manage on-device tracking as well as enable using HyperTrack cloud APIs from your server to control the tracking.

### Run the app

Run
```ionic capacitor sync```

#### Android

1. Run
`ionic capacitor run android` 
(Android Studio will be opened)
2. Run the app from Android Studio.

#### iOS

Open the app's workspace file (`/ios/***.xcworkspace`) with Xcode. 

Select your device (SDK requires real device, it won't work using simulator) and hit Run.

### Grant permissions

Grant location and activity permissions (choose "Always Allow" for location).

### Start tracking

Press `Start tracking` button.

To see the device on a map, open the [HyperTrack dashboard](https://dashboard.hypertrack.com/).

## Support

Join our [Slack community](https://join.slack.com/t/hypertracksupport/shared_invite/enQtNDA0MDYxMzY1MDMxLTdmNDQ1ZDA1MTQxOTU2NTgwZTNiMzUyZDk0OThlMmJkNmE0ZGI2NGY2ZGRhYjY0Yzc0NTJlZWY2ZmE5ZTA2NjI) for instant responses. You can also email us at help@hypertrack.com
