Test app for cordova-plugin-inappbrowser-wkwebview 
==================================================

This repo contains a [Cordova](http://cordova.apache.org/) project which builds an app to test functionality of [cordova-plugin-inappbrowser-wkwebview ](https://github.com/dpa99c/cordova-plugin-inappbrowser-wkwebview)

`cordova-plugin-inappbrowser-wkwebview` is a fork of [cordova-plugin-inappbrowser](https://github.com/apache/cordova-plugin-inappbrowser) that uses the the newer [WKWebview](https://developer.apple.com/documentation/webkit/wkwebview) to power the InAppBrowser, in contrast to `cordova-plugin-inappbrowser` which still currently uses the legacy [UIWebView](https://developer.apple.com/documentation/uikit/uiwebview).

# Supported platform versions
This test app supports iOS 9.0+


# Test app functionality
- The app consists of a simple, single page Cordova app written with basic HTML5
- It enables you to open an InappBrowser window and validates the various functionality provided by the plugin.

# Pre-requisites
The instructions below presume you have a Cordova-capable development environment setup.
If not, see the [Cordova Getting Started guide](http://cordova.apache.org/#getstarted).

# Building and running
- Clone this repo: `git clone https://github.com/dpa99c/cordova-plugin-inappbrowser-wkwebview-test` 
- From the root directory, add the iOS platform: `cordova platform add ios`
- Connect a test device
- Run the app: `cordova run ios --device --developmentTeam=TEAM_ID`
    - Note: if you don't specify your Apple Team ID on the command line, you'll need to open the iOS project `platforms/ios/WKWebView Test.xcodeproj` in Xcode and manually configure signing.