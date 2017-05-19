'use strict';

import PresentNativeRequest from './present-native-request';
import { Platform } from 'react-native';

export default class PresentRequest {
  static fetchPresentOrder(productBasicSysNo, callback) {
  	Platform.select({
  		ios: () => PresentNativeRequest.fetchPresentOrder(productBasicSysNo, callback),
  		android: () => PresentNativeRequest.requestLoadPresentOrder(productBasicSysNo, callback),
	})();
  }
  static addProductQty(productBasicSysNo, quantity, callback) {
  	Platform.select({
  		ios: () => PresentNativeRequest.addProductQty(productBasicSysNo, quantity, callback),
  		android: () => PresentNativeRequest.requestAddProductQty(productBasicSysNo, quantity, callback),
	})();
  }
  static addBuyNum(productBasicSysNo, quantity, callback) {
  	Platform.select({
  		ios: () => PresentNativeRequest.addBuyNum(productBasicSysNo, quantity, callback),
  		android: () => PresentNativeRequest.requestAddBuyNum(quantity, callback),
	})();
  }
  static useGiftCardWithType(type, callback) {
  	Platform.select({
  		ios: () => PresentNativeRequest.useGiftCardWithType(type, callback),
  		android: () => PresentNativeRequest.requestUseGiftCard(Number(type), callback),
	})();
  }
  static useBalanceWithType(type, callback) {
  	Platform.select({
  		ios: () => PresentNativeRequest.useBalanceWithType(type, callback),
  		android: () => PresentNativeRequest.requestUseBalance(Number(type), callback),
	})();
  }
  static useScoreWithType(type, callback) {
  	Platform.select({
  		ios: () => PresentNativeRequest.useScoreWithType(type, callback),
  		android: () => PresentNativeRequest.requestUseScore(Number(type), callback),
	})();
  }
  static submitOrder(contect, benediction, payPwd, scallback, ecallback) {
  	Platform.select({
  		ios: () => PresentNativeRequest.submitOrder(contect, benediction, payPwd, scallback, null),
  		android: () => PresentNativeRequest.requestSubmitOrder(contect, benediction, payPwd, scallback, ecallback),
	})();
  }
  static bindGiftCard(cardId, password, callback) {
  	Platform.select({
  		ios: () => PresentNativeRequest.bindGiftCard(cardId, password, callback),
  		android: () => PresentNativeRequest.requestBindGiftCard(cardId, password, callback),
	})();
  }
  static checkIsSetPayPwd(callback) {
  	Platform.select({
  		ios: () => PresentNativeRequest.checkIsSetPayPwd(callback),
  		android: () => PresentNativeRequest.requestIsSetPwd(callback),
	})();
  }
  static checkIsNeedPayPwd(callback) {
   	Platform.select({
  		ios: () => PresentNativeRequest.checkIsNeedPayPwd(callback),
  		android: () => PresentNativeRequest.requestIsNeedPwd(callback),
	})();
  }
  static checkOrderPayStatus(sysNo, soType, callback) {
    Platform.select({
  		ios: () => PresentNativeRequest.checkOrderPayStatus(sysNo, soType, callback),
  		android: () => {}
	})();
  }
  static checkApplePayAvailable(payTypeList, callback) {
    Platform.select({
  		ios: () => PresentNativeRequest.checkApplePayAvailable(payTypeList, callback),
  		android: () => {},
	})();
  }
  static fetchMyPresentOrderList(offset, limit, showLoading, callback) {
    Platform.select({
  		ios: () => PresentNativeRequest.fetchMyPresentOrderList(offset, limit, showLoading, callback),
  		android: () => PresentNativeRequest.requestGetOrderList(offset, limit, callback, null),
	})();
  }
  static abandonPresentOrder(soSysNo, callback) {
    Platform.select({
  		ios: () => PresentNativeRequest.abandonPresentOrder(soSysNo, callback),
  		android: () => PresentNativeRequest.requestCancelOrder(soSysNo, callback),
	})();
  }
  static payOrder(sysNo, orderType, payType, callback) {
    Platform.select({
  		ios: () => PresentNativeRequest.payOrder(sysNo, orderType, payType, callback),
  		android: () => {},
	})();
  }
  static loadPresentOrderDetail(soSysNo, callback) {
    Platform.select({
  		ios: () => PresentNativeRequest.loadPresentOrderDetail(String(soSysNo), callback),
  		android: () => PresentNativeRequest.requestGetOrderDetail(soSysNo, callback),
	})();
  }
  static loadPresentReceiveLog(soSysNo, offset, limit, showLoading, callback) {
    Platform.select({
  		ios: () => PresentNativeRequest.loadPresentReceiveLog(String(soSysNo), offset, limit, showLoading, callback),
  		android: () => PresentNativeRequest.requestReceiveLog(soSysNo, offset, limit, callback),
	})();
  }
}