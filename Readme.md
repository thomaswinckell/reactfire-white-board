A real time white board using ReactJS and Firebase.


This module was at first a full project which is now a module.

This module can not work without Firebase (version 2.X) not compatible with Firebase3

Known problems
==============

 - This module is using [normalize](https://necolas.github.io/normalize.css/) so it might interfere with your css.


Installation
============

`npm install reactfire-white-board --save`


How to use
==========

See the folder demo for an example.

You must use Firebase to get this module work and activate Google authentication

Props
-----

| Name         | Type              | Default   | Description                                                                                                                                                               |
|------------  |---------------    |---------  |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------  |
| firebaseURl  | string - Required | null      | your firebase url                                                                                                                                                |
| boardKey     | string - Required | null      | Path where to store the board |
| gmapsApiKey  | string            | null      | gmap api key to use google map widget|
| locale       | string            | 'en'      | language of the module - currently support english and french |
| elements     | Array of Element  | all widgets | widget you want to use in your board. import Elements to get the list |


Compatibility
=============

/!\ This application has been tested on the latest version of Chrome only.

Enable Blur effect for Chrome
=============================

- Go to chrome://flags/#enable-experimental-web-platform-features
- Click on enable experimental web platform features

Demo
====

See https://whiteboardtest.firebaseapp.com/boards/-KJ_LLIeJjvPDVS8Xcma

Contribution
============

The source can be refactored a lot and I know there's bugs, especially
on other browser than Chrome. If you want to do a pull request, you're welcome :-)

Build the app (Standalone)
==========================

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
