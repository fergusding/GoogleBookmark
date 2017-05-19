'use strict';

import { Platform } from 'react-native';
import ServiceNativeRequest from './service-native-request';

export default class ServiceRequest {
	static fetchFAQ(callback) {
		Platform.select({
  			ios: () => ServiceNativeRequest.fetchFAQ(callback),
  			android: () => ServiceNativeRequest.getFAQList(callback),
		})();
	}
	static fetchFAQDetail(catalogSysNo, contentSysNo, callback) {
		Platform.select({
  			ios: () => ServiceNativeRequest.fetchFAQDetail(catalogSysNo, contentSysNo, callback),
  			android: () => ServiceNativeRequest.getFAQDetail(catalogSysNo, contentSysNo, callback),
		})();
	}
	static feedbackFAQ(contentSysNo, flag, callback) {
		Platform.select({
  			ios: () => ServiceNativeRequest.feedbackFAQ(contentSysNo, flag, callback),
  			android: () => ServiceNativeRequest.setFAQFeedack(contentSysNo, flag ? 1 : 0, callback),
		})();
	}
}