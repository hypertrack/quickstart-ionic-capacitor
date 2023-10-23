alias ra := run-android
alias s := sync
alias si := sync-ios
alias r := refresh-plugin-in-node_modules
alias ag := add-plugin-from-github
alias al := add-plugin-local
alias oi := open-ios

sync:
    ionic capacitor sync

sync-ios:
    ionic capacitor sync ios

sync-android:
    ionic capacitor sync android

run-android: sync-android
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

add-plugin-local:
    #!/usr/bin/env sh
    LOCAL_PLUGIN_PATH="../sdk-ionic-capacitor"
    npm i $LOCAL_PLUGIN_PATH --save
    cd $LOCAL_PLUGIN_PATH
    npm run build

add-plugin-from-github branch:
    @echo "Adding plugin from github does not work for Ionic Capacitor. Use 'just al' to use local dependency"
    @exit 1 

open-ios:
    open ios/App/App.xcworkspace
