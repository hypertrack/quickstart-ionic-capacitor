# Ionic Quickstart for Hypertrack Capacitor Plugin

![GitHub](https://img.shields.io/github/license/hypertrack/quickstart-ios.svg)
![Android SDK](https://img.shields.io/badge/Android%20SDK-6.2.0-brightgreen.svg)

[HyperTrack](https://www.hypertrack.com) lets you add live location tracking to your mobile app.
Live location is made available along with ongoing activity, tracking controls and tracking outage with reasons.
This repo contains an example ionic app that has everything you need to get started in minutes.

## Create HyperTrack Account

[Sign up](https://dashboard.hypertrack.com/signup) for HyperTrack and
get your publishable key from the [Setup page](https://dashboard.hypertrack.com/setup).

## Set up Firebase

1. [Set up Firebase Project for quickstart-ionic-capacitor](https://console.firebase.google.com/u/0/)
2. Sign up for HyperTrack and [fill the FCM Key section in Android paragraph](https://dashboard.hypertrack.com/setup)

## Build the app

Install dependepcies
```npm i```

Prepare Ionic build by running [build command](https://ionicframework.com/docs/cli/commands/capacitor-build):
```ionic capacitor build```

Build the app for each platform using corresponding native IDE (Android Studio / Xcode)

This command will open the IDE. If it didn't happen you need to do it manually. 



## Dashboard

Once your app is running, go to the [dashboard](https://dashboard.hypertrack.com/devices) where you can see a list of all your devices and their live location with ongoing activity on the map.

## Support
Join our [Slack community](https://join.slack.com/t/hypertracksupport/shared_invite/enQtNDA0MDYxMzY1MDMxLTdmNDQ1ZDA1MTQxOTU2NTgwZTNiMzUyZDk0OThlMmJkNmE0ZGI2NGY2ZGRhYjY0Yzc0NTJlZWY2ZmE5ZTA2NjI) for instant responses. You can also email us at help@hypertrack.com.
