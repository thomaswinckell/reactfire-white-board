Version 0.0.17
==============

  * New navigation Menu [see](https://github.com/thomaswinckell/reactfire-white-board/commit/748957906a635e3972c4e69445d099e1050fb830)
  * Widget Idea  [\#22](https://github.com/thomaswinckell/reactfire-white-board/issues/22)

Version 0.0.16-beta1
============

 * Widget shows when it is edited [\#15](https://github.com/thomaswinckell/reactfire-white-board/issues/15)
 * moved import main.scss to demo folder to prevent override css [\#18](https://github.com/thomaswinckell/reactfire-white-board/issues/18)
 * When a navigation item is selected it is now highlighted [\#9](https://github.com/thomaswinckell/reactfire-white-board/issues/9)
 * using react-notification-system to display notifications [\#4](https://github.com/thomaswinckell/reactfire-white-board/issues/4)

Version 0.0.15-beta1
============

 * Update [react-tooltip 3.0.0](https://github.com/wwayne/react-tooltip/pull/106) to get transformed elements fix

Version 0.0.14-beta1
============

  * Eraser cursor for eraser tool [\#8](https://github.com/thomaswinckell/reactfire-white-board/issues/8)
  * Widgets now displayed when they're locked [\#15](https://github.com/thomaswinckell/reactfire-white-board/issues/15)
  * Locked Widgets prevent user action [\#16](https://github.com/thomaswinckell/reactfire-white-board/issues/16)
  * Widget are unlocked when user disconnect properly or not [\#12](https://github.com/thomaswinckell/reactfire-white-board/issues/12)


Version 0.0.13-beta1
============

Presence stores name and UrlProfilePic to be displayed in the website

Version 0.0.12-beta1
============

Upgrade to react 15.1

Version 0.0.11-beta1
============

Fix FontLoader

Version 0.0.10-beta1
============

Store the user presence on a board

Version 0.0.9-beta1
============

Smooth D&D and react motion updated to 0.4.3

Version 0.0.8-beta1
============

Added a new notifications system


Version 0.0.7-beta1
============

Auth.currentUser only take uid now
drawingSurface componentWillUnmount method fixed

Version 0.0.6-beta1
============

Some test done with react-motion


Version 0.0.5-beta1
============

Added Eraser tool and text tool

Version 0.0.4-beta1
============

Fix Youtube video widget to load over https


Version 0.0.3-beta1
 ===========
Refactor the way widgets are stored
- now it is /widgets/${boardKey}/${widgetKey}/
- instead of /board/${key}/widgets/${widgetKey}/

Version 0.0.2-beta1
===========

A boardKey can be passed as a props to the board (one is given by default)
