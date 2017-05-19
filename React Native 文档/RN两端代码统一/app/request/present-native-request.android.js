/**
 * Created by prototype on 16-11-2.
 */

import {
  ToastAndroid,
  NativeModules
} from 'react-native';

var HttpRequest = NativeModules.HttpRequest;
var BLDialog = NativeModules.BLDialog;

export default class PresentNativeRequest {

    static requestLoadPresentOrder(sysno, callback) {
        this._showDialog();
        HttpRequest.LoadPresentOrder(sysno,
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

    static requestAddProductQty(sysno, qty, callback) {
        this._showDialog();
        HttpRequest.AddProductQty('' + sysno, qty,
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

    static requestAddBuyNum(qty, callback) {
        this._showDialog();
        HttpRequest.AddBuyNum(qty,
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

    static requestModifyPayType(paytype, callback) {
        this._showDialog();
        HttpRequest.ModifyPayType(paytype,
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

    static requestUseScore(type, callback) {
        this._showDialog();
        HttpRequest.UseScore(type,
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

    static requestUseBalance(type, callback) {
        this._showDialog();
        HttpRequest.UseBalance(type,
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

    static requestUseGiftCard(type, callback) {
        this._showDialog();
        HttpRequest.UseGiftCard(type,
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

    static requestBindGiftCard(cardid, pwd, callback) {
        this._showDialog();
        HttpRequest.BindGiftCard(cardid, pwd,
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

    static requestSubmitOrder(contect, benediction, pws, scallback, ecallback) {
        this._showDialog();
        HttpRequest.SubmitOrder(contect, benediction, pws,
            (successMsg) => {
                let _httpdata = JSON.parse(successMsg);
                this._dismissDialog();
                scallback(_httpdata);
            },
            (errorMsg) => {
                let _errorbean = JSON.parse(errorMsg);
                this._dismissDialog();
                ecallback(_errorbean);
            }
        );
    }

    static requestIsNeedPwd(callback) {
        this._showDialog();
        HttpRequest.IsNeedPwd(
            (successMsg) => {
                let isNeedPayPwd = successMsg =='true' ? true : false
                this._dismissDialog();
                callback(isNeedPayPwd);
            },
            (errorMsg) => {
                this._dismissDialog()
                this._dismissDialogShowMsg(errorMsg);
            }
        );
    }

    static requestIsSetPwd(callback) {
        HttpRequest.IsSetPwd(
            (successMsg) => {
                let isSet = successMsg == '1' ? true : false;
                callback(isSet);
            },
            (errorMsg) => {
                this._dismissDialogShowMsg(errorMsg);
            }
        );
    }

    static requestGetOrderList(_offset, _limit, scallback, ecallback) {
        this._showDialog();
        HttpRequest.getOrderList(_offset, _limit,
            (successMsg)=> {
                let _httpdata = JSON.parse(successMsg);
                this._dismissDialog();
                scallback(_httpdata);
            },
            (errorMsg)=> {
                this._dismissDialogShowMsg(errorMsg);
                ecallback();
            });
    }

    static requestGetOrderDetail(sysno, callback) {
        this._showDialog();
        HttpRequest.getOrderDetail(sysno,
            (successMsg)=> {
                let _httpdata = JSON.parse(successMsg);
                this._dismissDialog();
                callback(_httpdata);
            },
            (errorMsg)=> {
                this._dismissDialogShowMsg(errorMsg);
            });
    }

    static requestCancelOrder(sysno, callback) {
        this._showDialog();
        HttpRequest.cancelOrder(sysno,
            (successMsg)=> {
                let _httpdata = JSON.parse(successMsg);
                this._dismissDialog();
                callback(_httpdata);
            },
            (errorMsg)=> {
                this._dismissDialogShowMsg(errorMsg);
            });
    }

    static requestReceiveLog(_sysno, _offset, _limit, callback) {
        HttpRequest.getReceiveLog(_sysno, _offset, _limit,
            (successMsg)=> {
                let _httpdata = JSON.parse(successMsg);
                callback(_httpdata);
            },
            (errorMsg)=> {

            });
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

