'use strict';

import {
  AlertIOS,
  NativeModules
} from 'react-native';

var PresentManager = NativeModules.BLPresentManager;

export default class PresentNativeRequest {
  static async fetchPresentOrder(productBasicSysNo, callback) {
    try {
      var data = await PresentManager.loadPresentOrderWithProduct(productBasicSysNo);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async addProductQty(productBasicSysNo, quantity, callback) {
    try {
      var data = await PresentManager.addProductQtyWithProduct(productBasicSysNo, quantity);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async addBuyNum(productBasicSysNo, quantity, callback) {
    try {
      var data = await PresentManager.addBuyNumWithProduct(productBasicSysNo, quantity);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async useGiftCardWithType(type, callback) {
    try {
      var data = await PresentManager.useGiftCardWithType(type);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async useBalanceWithType(type, callback) {
    try {
      var data = await PresentManager.useBalanceWithType(type);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async useScoreWithType(type, callback) {
    try {
      var data = await PresentManager.useScoreWithType(type);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async bindGiftCard(cardId, password, callback) {
    if (!password.length) {
      PresentManager.showHudAndHide('请输入礼金卡密码!');
      return;
    }

    try {
      var data = await PresentManager.bindGiftCardWithCardId(cardId, password);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async submitOrder(contect, benediction, payPwd, callback) {
    if (!contect || !contect.length) {
      PresentManager.showHudAndHide('请输入送礼人名字!');
      return;
    }
    if (!benediction || !benediction.length) {
      PresentManager.showHudAndHide('请输入祝福语!');
      return;
    }

    try {
      var data = await PresentManager.submitOrderWithContect(contect, benediction, payPwd);
      callback(data);
    } catch (e) {
      var errCode = Number(e.code);
      if (errCode == 100) { //未登录
        PresentManager.showLoginVC();
        return;
      }
      if (errCode == 9) { //库存不足
        AlertIOS.alert(
          '商品库存不足',
          e.message,
          [
            {text: '回到商品详情', onPress: () => PresentManager.backBtnPress()}
          ]
        );
        return;
      }
      if (errCode == 1001) {  // 商品价格变动
        AlertIOS.alert(
          '温馨提示',
          e.message,
          [
            {text: '确定'}
          ]
        );
        return;
      }
      if (errCode == 1003) { // 支付密码输入错误
        PresentManager.clearAndHintInZCTradeView(e.message);
        return;
      }
      if (errCode == 1002) { // 支付密码输入错误超过5次
        PresentManager.hideZCTradeViewKeyboard();
        AlertIOS.alert(
          '温馨提示',
          e.message,
          [
            {text: '确定'}
          ]
        );
        return;
      }
      PresentManager.hideZCTradeViewKeyboard();
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async checkIsSetPayPwd(callback) {
    try {
      var data = await PresentManager.checkIsSetPayPwdSuccess();
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async checkIsNeedPayPwd(callback) {
    try {
      var data = await PresentManager.checkIsNeedPayPwdSuccess();
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async checkOrderPayStatus(sysNo, soType, callback) {
    try {
      var data = await PresentManager.checkOrderPayStatusWithSysNo(sysNo, soType);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async checkApplePayAvailable(payTypeList, callback) {
    try {
      var data = await PresentManager.checkApplePayAvailable(payTypeList);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async fetchMyPresentOrderList(offset, limit, showLoading, callback) {
    try {
      var data = await PresentManager.fetchMyPresentOrderListWithOffset(offset, limit, showLoading);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async abandonPresentOrder(soSysNo, callback) {
    try {
      var data = await PresentManager.abandonPresentOrderWithSoSysNo(String(soSysNo));
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async payOrder(sysNo, orderType, payType, callback) {
    try {
      var data = await PresentManager.payOrderWithSysNo(String(sysNo), orderType, payType);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async loadPresentOrderDetail(soSysNo, callback) {
    try {
      var data = await PresentManager.loadPresentOrderDetailWithSoSysNo(soSysNo);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
  static async loadPresentReceiveLog(soSysNo, offset, limit, showLoading, callback) {
    try {
      var data = await PresentManager.loadPresentReceiveLogWithSoSysNo(soSysNo, offset, limit, showLoading);
      callback(data);
    } catch (e) {
      PresentManager.showHudAndHide(e.message);
    } finally {
    }
  }
}
