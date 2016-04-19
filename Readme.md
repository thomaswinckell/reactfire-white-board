A real time white board using ReactJS and Firebase.


Version 0.0.3-beta1
 ===========
Refactor the way widgets are stored
- now it is /widgets/${boardKey}/${widgetKey}/
- instead of /board/${key}/widgets/${widgetKey}/

Version 0.0.2-beta1
===========

A boardKey can be passed as a props to the board (one is given by default)


Compatibility
=============

/!\ This application has been tested on the latest version of Chrome only.

Enable Blur effect for Chrome
=============================

- Go to chrome://flags/#enable-experimental-web-platform-features
- Click on enable experimental web platform features

Demo
====

See http://board.winckell.com

Contribution
============

The source can be refactored a lot and I know there's bugs, especially
on other browser than Chrome. If you want to do a pull request, you're welcome :-)

Build the app
=============

Requirements
------------

Install NodeJS
Install AWS-Cli (if you want to publish on Amazon Web Services)

Configuration
------------
See the config object in the package.json

Dependencies Installation
------------
npm install

Dev
------------
npm run start

Release
------------
npm run build

Publish
------------
npm run build
cd build
npm publish
