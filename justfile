alias a := add-plugin
alias ag := add-plugin-from-github
alias al := add-plugin-local
alias ap := add-plugin
alias oi := open-ios
alias os := open-src
alias r := refresh-plugin-in-node_modules
alias ra := run-android
alias s := sync
alias sa := sync-android
alias si := sync-ios
alias us := update-sdk

REPOSITORY_NAME := "quickstart-ionic-capacitor"
SDK_NAME := "HyperTrack SDK Ionic Capacitor"

# Source: https://semver.org/#is-there-a-suggested-regular-expression-regex-to-check-a-semver-string
# \ are escaped
SEMVER_REGEX := "(0|[1-9]\\d*)\\.(0|[1-9]\\d*)\\.(0|[1-9]\\d*)(?:-((?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\\.(?:0|[1-9]\\d*|\\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\\+([0-9a-zA-Z-]+(?:\\.[0-9a-zA-Z-]+)*))?"

LOCAL_PLUGIN_PATH := "../sdk-ionic-capacitor"

add-plugin version: hooks
    npm i --save-exact hypertrack-sdk-ionic-capacitor@{{version}} --save
    just pod-install

add-plugin-local: hooks
    npm i {{LOCAL_PLUGIN_PATH}} --save
    just build-local
    just pod-install

add-plugin-from-github branch: hooks
    @echo "Adding plugin from github does not work for Ionic Capacitor. Use 'just al' to use local dependency"
    @exit 1 

build-local:
    #!/usr/bin/env sh
    if cat package.json | grep -q  {{LOCAL_PLUGIN_PATH}}; then \
        cd {{LOCAL_PLUGIN_PATH}}; \
        npm run build; \
    else \
        echo "No local dependency"; \
    fi
    
check-outdated:
    npm outdated

compile: hooks
    npx tsc

hooks:
    chmod +x .githooks/pre-push
    git config core.hooksPath .githooks

open-ios: hooks
    open ios/App/App.xcworkspace

open-src: hooks
    code src/app/home/home.page.ts

pod-install:
    #!/usr/bin/env sh
    set -euo pipefail
    cd ios/App
    rm -f Podfile.lock
    pod install --repo-update
    cd ../..

refresh-deps: hooks
    rm -r node_modules
    rm package-lock.json
    npm i

refresh-plugin-in-node_modules:
    rm -r node_modules/hypertrack-sdk-ionic-capacitor
    npm i

run-android target="": sync-android hooks
    #!/usr/bin/env sh
    set -euo pipefail
    if [ -z "{{target}}" ]; then \
        ionic capacitor run android; \
    else \
        ionic capacitor run android --target {{target}}; \
    fi

sync: hooks build-local
    ionic capacitor sync

sync-ios: hooks build-local
    ionic capacitor sync ios

sync-android: hooks build-local
    ionic capacitor sync android

update-deps: hooks
    npx npm-check-updates -u

update-sdk version: hooks
    git checkout -b update-sdk-{{version}}
    just add-plugin {{version}}
    git commit -am "Update {{SDK_NAME}} to {{version}}"
    just open-github-prs

version:
    @cat package.json | grep hypertrack-sdk-ionic-capacitor | head -n 1 | grep -o -E '{{SEMVER_REGEX}}'
