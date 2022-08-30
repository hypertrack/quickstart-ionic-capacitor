alias a := run-android
alias s := sync
alias si := sync-ios
alias r := refresh-ht

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

refresh-ht:
    rm -r node_modules/hypertrack-sdk-ionic-capacitor
    npm i

