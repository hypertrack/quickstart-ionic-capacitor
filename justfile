alias al := add-plugin-local
alias ag := add-plugin-from-github
alias oi := open-ios
alias r := refresh-plugin-in-node_modules
alias ra := run-android
alias s := sync
alias si := sync-ios

add-plugin-local: hooks
    #!/usr/bin/env sh
    LOCAL_PLUGIN_PATH="../sdk-ionic-capacitor"
    npm i $LOCAL_PLUGIN_PATH --save
    cd $LOCAL_PLUGIN_PATH
    npm run build

add-plugin-from-github branch: hooks
    @echo "Adding plugin from github does not work for Ionic Capacitor. Use 'just al' to use local dependency"
    @exit 1 


check-outdated:
    npm outdated

compile: hooks
    npx tsc

hooks:
    chmod +x .githooks/pre-push
    git config core.hooksPath .githooks

open-ios: hooks
    open ios/App/App.xcworkspace

refresh-deps: hooks
    rm -r node_modules
    rm package-lock.json
    npm i

refresh-plugin-in-node_modules:
    rm -r node_modules/hypertrack-sdk-ionic-capacitor
    npm i

run-android: sync-android hooks
    ionic capacitor run android

sync: hooks
    ionic capacitor sync

sync-ios: hooks
    ionic capacitor sync ios

sync-android: hooks
    ionic capacitor sync android

update-deps: hooks
    npx npm-check-updates -u
