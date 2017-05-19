'use strict';

import {
  ToastAndroid,
  NativeModules
} from 'react-native';

var HttpRequest = NativeModules.HttpRequest;
var BLDialog = NativeModules.BLDialog;

export default class ServiceNativeRequest {
	static getFAQList(callback) {
        this._showDialog();
        HttpRequest.getFAQList(
            (successMsg) => {
                let _httpdata = JSON.parse(successMsg);
                this._dismissDialog()
                callback(_httpdata);
            },
            (errorMsg) => {
                this._dismissDialogShowMsg(errorMsg);
            }
        );
    }
    static getFAQDetail(catalogSysNo, contentSysNo, callback) {
        this._showDialog();
        HttpRequest.getFAQDetail(catalogSysNo, contentSysNo,
            (successMsg) => {
                let _httpdata = JSON.parse(successMsg);
                this._dismissDialog()
                callback(_httpdata);
            },
            (errorMsg) => {
                this._dismissDialogShowMsg(errorMsg);
            }
        );
    }
    static setFAQFeedack(contentSysNo, type, callback) {
        this._showDialog();
        HttpRequest.setFAQFeedack(contentSysNo, type,
            (successMsg) => {
            	this._dismissDialog();
                callback(null);
            },
            (errorMsg) => {
            	this._dismissDialogShowMsg(errorMsg);
            }
        );
    }
    static _showDialog(){
        BLDialog.showLoading();
    }

    static _dismissDialog(){
        BLDialog.dismissLoading();
    }

    static _dismissDialogShowMsg(errorMsg){
        BLDialog.dismissLoading();
        if(errorMsg != null || errorMsg != ""){
            ToastAndroid.show(errorMsg, ToastAndroid.SHORT);
        }else{
            ToastAndroid.show("网络请求错误", ToastAndroid.SHORT);
        }
    }
}
