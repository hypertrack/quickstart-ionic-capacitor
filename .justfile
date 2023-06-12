alias ra := run-android
alias s := sync
alias si := sync-ios
alias r := refresh-plugin-in-node_modules
alias ag := add-plugin-from-github
alias oi := open-ios

sync:
    ionic capacitor sync

sync-ios:
    ionic capacitor sync ios

sync-android:
    ionic capacitor sync android

run-android:
    ionic capacitor run android

check-outdated:
    npm outdated

update-deps:
    npx npm-check-updates -u

refresh-deps:
    rm -r node_modules
    rm package-lock.json
    npm i

refresh-plugin-in-node_modules:
    rm -r node_modules/hypertrack-sdk-ionic-capacitor
    npm i

add-plugin-from-github branch:
    npm i https://github.com/hypertrack/sdk-ionic-capacitor#{{branch}}

open-ios:
    open ios/App/App.xcworkspace
