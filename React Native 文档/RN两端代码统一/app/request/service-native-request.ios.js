'use strict';

import {
  AlertIOS,
  NativeModules
} from 'react-native';

var ServiceCenterManager = NativeModules.BLServiceCenterManager;

export default class ServiceNativeRequest {
	static async fetchFAQ(callback) {
    	try {
      		var datas = await ServiceCenterManager.fetchFAQ();
      		callback(datas);
    	} catch (e) {
      		ServiceCenterManager.showHudAndHide(e.message);
    	} finally {
    	}
  	}
  	static async fetchFAQDetail(catalogSysNo, contentSysNo, callback) {
  		try {
  			var data = await ServiceCenterManager.fetchFAQDetail(catalogSysNo, contentSysNo);
  			callback(data);
  		} catch (e) {
      		ServiceCenterManager.showHudAndHide(e.message);
    	} finally {
    	}
  	}
  	static async feedbackFAQ(contentSysNo, flag, callback) {
  		try {
  			var data = await ServiceCenterManager.feedbackFAQ(contentSysNo, flag);
  			callback(data);
  		} catch (e) {
      		ServiceCenterManager.showHudAndHide(e.message);
    	} finally {
    	}
  	}
}
