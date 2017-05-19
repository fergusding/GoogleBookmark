'use strict';

import { NativeModules, Platform } from 'react-native';

var BaseManager = NativeModules.BLBaseManager;
var PresentManager = NativeModules.BLPresentManager;
var ServiceCenterManager = NativeModules.BLServiceCenterManager;
var DeepLink = NativeModules.DeepLink;
var Share = NativeModules.Share;

export default class Native {
	static backToNative(backToMain) {
		Platform.select({
  			ios: () => {
  				if (backToMain) {
  					BaseManager.goToMainVC();
  				} else {
  					BaseManager.backBtnPress();
  				}
  			},
  			android: () => DeepLink.exitPage(),
		})();
	}
	static quickServicePressed(index, type, value) {
		Platform.select({
  			ios: () => ServiceCenterManager.quickServicePressed(index),
  			android: () => DeepLink.switchPage(type, value, false),
		})();
	}
	static gotoRule() {
    	Platform.select({
      		ios: () => PresentManager.gotoRule(),
      		android: () => DeepLink.go2GiftRule(),
    	})();
  	}
  	static sharePresent(benediction, pwdKey, productImg) {
   		Platform.select({
      		ios: () => PresentManager.sharePresent({benediction: benediction, pwdKey: pwdKey, productImg: productImg}),
     		android: () => Share.goShare(productImg, benediction, pwdKey),
    	})();
  	}
}