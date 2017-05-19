'use strict';

import React, { Component } from 'react';
import {
  Text,
  TextInput,
  Image,
  AlertIOS,
  ScrollView,
  View,
  StyleSheet,
  NativeModules,
  Keyboard,
  Platform,
  NativeAppEventEmitter
} from 'react-native';
import NavBar from '../component/navigator';
import Broadcast from '../component/broadcast';
import MessageCard from '../component/message-card';
import Button from '../component/button';
import SwitchCommon from '../component/switch-common';
import PresentOrder from './present-order';
import PresentOrderCommited from './present-order-commited';
import PresentRequest from '../request/present-request';
import Native from '../native/native';

import { accMul } from '../util/util';
import { ScreenWidth, ScreenHeight } from '../common/constant';

const GIFTCARD = 1; //礼金卡
const BALANCE = 2; //余额
const POINT = 3;  //积分

var PresentManager = NativeModules.BLPresentManager;
var DeepLink = NativeModules.DeepLink;
var NumberKeyboard = NativeModules.NumberKeyboard;
var GiftSubOrder = NativeModules.GiftSubOrder;
var ToastAndroid = NativeModules.ToastAndroid;

export default class PresentSettlement extends Component {
  constructor(props) {
    super(props);
    this.benediction = '恭贺新禧，大家有礼';
    this.promptValue = null;
    this.state = {
      loading: false,
      productInputing: false,
      presentInputing: false,
      productQuantity: 1,
      presentQuantity: 1,
      giftCardIsUsed: false,
      balanceIsUsed: false,
      pointIsUsed: false,
      data: {}
    };
  }
  componentDidMount() {
    this.orderCallback = (data) => {
      if (!this.contect) {
        this.contect = data.customerNickName;
      }
      this.setState({
        productInputing: false,
        presentInputing: false,
        loading: false,
        data: data
      });
      PresentRequest.checkApplePayAvailable(data.payTypeList, this.orderCallback);
    };
    this.alertButtons = [
      {text: '确定', onPress: (password) => PresentRequest.bindGiftCard(null, password, this.orderCallback)},
      {text: '取消'}
    ];
    this.subscription = NativeAppEventEmitter.addListener('PayPwdInput', (reminder) => this._submitOrder(reminder.password));
    this.keyboardShow = Keyboard.addListener('keyboardWillShow', (frames) => this._updateKeyboardSpace(frames));
    PresentRequest.fetchPresentOrder(this.props.productBasicSysNo, this.orderCallback);
  }
  componentWillUnmount() {
    this.subscription.remove();
    this.keyboardShow.remove();
  }
  render() {
    var contect = this.contect != this.state.data.customerNickName ? this.contect : this.state.data.customerNickName;
    return (
      <View style = {styles.container}>
        <NavBar title = '礼品订购单' shadow = {true} buttonTitle = "规则说明" onBackPress = {() => Native.backToNative()} onButtonPress = {() => PresentManager.gotoRule()} />
        <ScrollView
          style = {{flex: 1, backgroundColor: '#f2f2f2'}}
          automaticallyAdjustContentInsets = {false}
          ref = {(scrollView) => this.scrollView = scrollView}
          onScroll = {this.onScroll.bind(this)} >
          <Broadcast message = {this.state.data.wenXinTip} style = {styles.broadcast} />
          {this.renderProductInfo()}
          <MessageCard
            style = {styles.message_card}
            contect = {contect}
            benediction = {this.benediction}
            editable = {true}
            onChangeContect = {(text) => this.contect = text}
            onChangeBenediction = {(text) => this.benediction = text} />
          {this.renderAccountRows()}
          {this.renderInvoice()}
          {this.renderAmountDetail()}
        </ScrollView>
        {this.renderBottomBar()}
      </View>
    );
  }
  renderProductInfo() {
    var { productName, productImg, productPrice, productQty, presentOty, matters } = this.state.data;
    productQty = this.state.productInputing ? this.state.productQuantity : (productQty ? productQty : 1);
    presentOty = this.state.presentInputing ? this.state.presentQuantity : (presentOty ? presentOty : 1);

    return (
      <View key = {2} style = {styles.product_info}>
        <View key = {1} style = {styles.steps}>
          <View style = {styles.step_one_bg}>
            <Image key = {1} source = {require('../img/step_one.png')} style = {styles.step_image_one} />
          </View>
          <Text key = {2} style = {styles.step_text}>选购商品</Text>
          <Image key = {3} source = {require('../img/ic_arrow.png')} style = {styles.step_arrow_image} />
          <View style = {styles.step_two_bg}>
            <Image key = {4} source = {require('../img/step_two.png')} style = {styles.step_image_two} />
          </View>
          <Text key = {5} style = {styles.step_text}>设定礼品{'\n'}领取方式</Text>
          <Image key = {6} source = {require('../img/ic_arrow.png')} style = {styles.step_arrow_image} />
          <Image key = {7} source = {require('../img/step_three_orange.png')} style = {styles.step_image_three} />
          <Text key = {8} style = {styles.step_text}>分享</Text>
        </View>
        {this.renderProductSeperator(2)}
        <View key = {3} style = {styles.product}>
          <Image defaultSource = {{uri: 'placeHolderImage'}} source = {{uri: productImg}} style = {styles.product_image} />
          <View style = {styles.product_detail}>
            <Text key = {1} numberOfLines = {2} style = {styles.product_name}>{productName}</Text>
            <Text key = {2} style = {styles.product_price}>¥{productPrice}</Text>
            <View style = {styles.product_count_view}>
              <Button key = {1} onPress = {() => this._modifyProductQty(--productQty)}>
                <Text style = {styles.product_count_calculate}>－</Text>
              </Button>
              <View style = {styles.product_count_area}>
                <TextInput
                  style = {styles.product_count_field}
                  underlineColorAndroid = 'transparent'
                  keyboardType = 'numeric'
                  maxLength = {4}
                  value = {String(productQty)}
                  onChangeText = {(text) => this._changeText(1, text)}
                  onEndEditing = {() => this._modifyProductQty(this.state.productQuantity)}
                  onSubmitEditing = {() => this._modifyProductQty(this.state.productQuantity)} />
              </View>
              <Button key = {2} onPress = {() => this._modifyProductQty(++productQty)}>
                <Text style = {styles.product_count_calculate}>＋</Text>
              </Button>
            </View>
          </View>
        </View>
        {this.renderProductSeperator(4)}
        <View key = {5} style = {styles.gift_area}>
          <Text key = {1} style = {styles.gift_count_title}>购买礼品份数</Text>
          <View style = {styles.gift_count_view}>
            <Button key = {1} onPress = {() => this._modifyPresentQty(--presentOty)}>
              <Text style = {styles.product_count_calculate}>－</Text>
            </Button>
            <View style = {styles.product_count_area}>
              <TextInput
                style = {styles.product_count_field}
                underlineColorAndroid = 'transparent'
                keyboardType = 'numeric'
                maxLength = {4}
                value = {String(presentOty)}
                onChangeText = {(text) => this._changeText(2, text)}
                onEndEditing = {() => this._modifyPresentQty(this.state.presentQuantity)}
                onSubmitEditing = {() => this._modifyPresentQty(this.state.presentQuantity)} />
            </View>
            <Button key = {2} onPress = {() => this._modifyPresentQty(++presentOty)}>
              <Text style = {styles.product_count_calculate}>＋</Text>
            </Button>
          </View>
          <Text key = {2} style = {styles.gift_info}> 礼品每份礼包
            <Text key = {1} style = {styles.gift_price}>{accMul(productPrice, productQty)}</Text>
            <Text key = {2} style = {styles.gift_info_suffix}>元，内含{productQty}件商品</Text>
          </Text>
          {this.renderGiftExtra(matters)}
        </View>
      </View>
    );
  }
  renderGiftExtra(matters) {
    if (!matters) {
      return null;
    }

    var extras = [];
    matters.map((matter, index) => {
      extras.push(
        <Text key = {index} style = {styles.gift_info_extra}>* {matter}</Text>
      );
    });
    return extras;
  }
  renderProductSeperator(number) {
    return (
      <View key = {number} style = {styles.product_seperator}/>
    );
  }
  renderAccountRows() {
    const { giftCardCanUse, giftCardIsUsed, balanceCanUse, balanceIsUsed, pointCanUse, pointIsUsed } = this.state.data;
    let giftCardUsed = this.state.loading ? this.state.giftCardIsUsed: giftCardIsUsed;
    let balanceUsed = this.state.loading ? this.state.balanceIsUsed: balanceIsUsed;
    let pointUsed = this.state.loading ? this.state.pointIsUsed : pointIsUsed;
    return (
      <View key = {5} style = {styles.acount_rows}>
        <View key = {1} style = {styles.row_view}>
          <View style = {styles.coupon_leftview}>
            <Text style = {styles.row_title}>礼金卡
              <Text key = {1} style = {styles.row_title_normal}>（可用</Text>
              <Text key = {2} style = {styles.row_title_highlight}>￥{giftCardCanUse}</Text>
              <Text key = {3} style = {styles.row_title_normal}>）</Text>
            </Text>
            <Button onPress = {() => this._bindGiftCard()}>
              <Text style = {styles.coupon_bind}>绑定</Text>
            </Button>
          </View>
          <SwitchCommon
            style = {styles.switch}
            disabled = {!giftCardCanUse}
            value = {giftCardUsed}
            onValueChange = {(value) => this._useDiscount(GIFTCARD, value)} />
        </View>
        {this.renderAcountSeperator(2)}
        <View key = {3} style = {styles.row_view}>
          <Text style = {styles.row_title}>余额
            <Text key = {1} style = {styles.row_title_normal}>（可用</Text>
            <Text key = {2} style = {styles.row_title_highlight}>￥{balanceCanUse}</Text>
            <Text key = {3} style = {styles.row_title_normal}>）</Text>
          </Text>
          <SwitchCommon
            style = {styles.switch}
            disabled = {!balanceCanUse}
            value = {balanceUsed}
            onValueChange = {(value) => this._useDiscount(BALANCE, value)} />
        </View>
        {this.renderAcountSeperator(4)}
        <View key = {5} style = {styles.row_view}>
          <Text style = {styles.row_title}>积分
            <Text key = {1} style = {styles.row_title_normal}>（可用</Text>
            <Text key = {2} style = {styles.row_title_highlight}>￥{pointCanUse}</Text>
            <Text key = {3} style = {styles.row_title_normal}>）</Text>
          </Text>
          <SwitchCommon
            style = {styles.switch}
            disabled = {!pointCanUse}
            value = {pointUsed}
            onValueChange = {(value) => this._useDiscount(POINT, value)} />
        </View>
      </View>
    );
  }
  renderAcountSeperator(number) {
    return (
      <View key = {number} style = {styles.acount_seperator} />
    );
  }
  renderInvoice() {
    return (
      <View key = {6} style = {[styles.row_view, {marginTop: 10}]}>
        <Text style = {styles.row_title}>发票</Text>
        <Text style = {styles.invoice_text}>{this.state.data.invoiceTip}</Text>
      </View>
    );
  }
  renderAmountDetail() {
    const { giftCardPay, balancePay, pointPay, productTotalAmt, discountAmt, riskAmt, shipPrice } = this.state.data;
    var ds = [{title: '应付金额', amount: productTotalAmt},
              {title: '运费', amount: shipPrice},
              {title: '促销折扣', amount: discountAmt},
              {title: '会员专享折扣', amount: riskAmt},
              {title: '礼金卡', amount: giftCardPay},
              {title: '账户余额', amount: balancePay},
              {title: '积分', amount: pointPay}];
    var details = [];
    ds.map((detail, index) => {
      var sign = index > 1 ? '-' : '+';
      if (detail.amount > 0) { //金额大于0才做相应的展示
        details.push(
          <View key = {index} style = {[styles.row_view, {height: 30}]}>
            <Text key = {1} style = {styles.row_title}>{detail.title}</Text>
            <Text key = {2} style = {styles.productamount_text}>{sign}￥{detail.amount}</Text>
          </View>
        );
      }
    });
    return (
      <View key = {7} style = {styles.productamount}>
        {details}
      </View>
    );
  }
  renderBottomBar() {
    return (
      <View key = {8} style = {styles.bottombar}>
        <View style = {styles.bottombar_leftview}>
          <Text key = {1} style = {styles.payamount_title}>应付金额：</Text>
          <Text key = {2} style = {styles.payamount_text}>¥{this.state.data.presentOrderNeedPay}</Text>
        </View>
        <Button onPress = {() => this._submitPress()}>
          <View style = {styles.bottombar_rightview}>
            <Text style = {styles.settle_title}>去支付</Text>
          </View>
        </Button>
      </View>
    );
  }
  onScroll(e) {
    this.scrollOffsetY = e.nativeEvent.contentOffset.y;
  }
  _showNumberKeyboard(type, quantity) {
    Platform.select({
        ios: () => null,
        android: () => {
          if (type == 1) {
            NumberKeyboard.showKeyboard(quantity, (qty) => {
              if (!isNaN(qty) && qty > 0) {
                this._modifyProductQty(qty);
              }
            });
          } else {
            NumberKeyboard.showKeyboard(quantity, (qty) => {
              if (!isNaN(qty) && qty > 0) {
                this._modifyPresentQty(qty);
              }
            });
          }
        },
    })();
  }
  _changeText(type, text) {
    if (isNaN(text)) {
      return;
    }

    if (type == 1) {
      this.setState({productQuantity: Number(text), productInputing: true});
    } else {
      this.setState({presentQuantity: Number(text), presentInputing: true});
    }
  }
  _modifyProductQty(productQty) {
    if (productQty == this.state.data.productQty) {
      return;
    }

    PresentRequest.addProductQty(this.props.productBasicSysNo, productQty, this.orderCallback);
  }
  _modifyPresentQty(presentQty) {
    if (presentQty == this.state.data.presentOty) {
      return;
    }

    PresentRequest.addBuyNum(this.props.productBasicSysNo, presentQty, this.orderCallback);
  }
  _bindGiftCard() {
    Platform.select({
        ios: () => AlertIOS.prompt('绑定新的礼金卡', '输入密码', this.alertButtons, 'plain-text', ''),
        android: () =>  GiftSubOrder.bindCardClick((password)=> {
                          PresentRequest.bindGiftCard(null, password, this.orderCallback)
                        }),
    })();
  }
  _useDiscount(type, value) {
    switch (type) {
      case GIFTCARD:
        this.setState({giftCardIsUsed: value, loading: true});
        PresentRequest.useGiftCardWithType(value, this.orderCallback);
        break;
      case BALANCE:
        this.setState({balanceIsUsed: value, loading: true});
        PresentRequest.useBalanceWithType(value, this.orderCallback);
        break;
      case POINT:
        this.setState({pointIsUsed: value, loading: true});
        PresentRequest.useScoreWithType(value, this.orderCallback);
        break;
      default:
        break;
    }
  }
  _submitPress() {
    PresentRequest.checkIsNeedPayPwd((isNeedPayPwd) => {
      if (!isNeedPayPwd) {
        this._submitOrder(null);
      } else {
        PresentRequest.checkIsSetPayPwd((isSet) => {
          if (!isSet) {
            Platform.select({
              ios: () => AlertIOS.alert(
                          '资金安全提示',
                          '尊敬的顾客朋友，为保护您的资金安全，本网在使用余额和礼金卡支付时，必须先设置支付密码。\n\n您暂未设置支付密码，请先去设置',
                          [
                            {text: '取消'},
                            {text: '去设置', onPress: () => PresentManager.gotoSetPayPwd()},
                          ]
                        ),
              android: () => GiftSubOrder.showSetPayDialog(),
            })();
            
          } else {
            Platform.select({
              ios: () => PresentManager.showZCTradeView(),
              android: () =>  GiftSubOrder.showPayPwdDialog('', (password)=> {
                                this._submitOrder(password);
                              }),
            })();
          }
        });
      }
    });
  }
  _submitOrder(password) {
    PresentRequest.submitOrder(this.contect, this.benediction, password, (data) => {
      if (!data.isNeedPay) {
        Platform.select({
          ios: () => PresentManager.hideZCTradeViewKeyboard(),
          android: () => {},
        })();
        this.props.navigator.push({
          name: '',
          component: PresentOrderCommited,
          params: {data: data}
        });
      } else {
        Platform.select({
          ios: () => PresentManager.gotoPayWithSysNo(String(data.order.soSysNo), data.order.soType, true, (error, events) => {
                      if (!error) {
                        PresentManager.hideZCTradeViewKeyboard();
                        this.props.navigator.push({
                          name: '',
                          component: PresentOrderCommited,
                          params: {data: data}
                        });
                      }
                    }),
          android: () =>  DeepLink.go2OrderSuccessPage(data.order.soType, data.order.soSysNo, (payStatus)=>{
                            //成功支付
                            if(payStatus == 1){
                              this.props.navigator.push({
                                name: '',
                                component: PresentOrderCommited,
                                params: {data: data}
                              });
                            }
                            //取消支付
                            if(payStatus == -1){
                              this.props.navigator.push({
                                name: '',
                                component: PresentOrder
                              });
                            }
                          }),
        })();
      }
    }, (bean) => {
      Platform.select({
        ios: () => {},
        android: () => this._submitOrderFailureForAndroid(bean),
      })();
    });
  }
  _submitOrderFailureForAndroid(bean) {
    if ('1002' == bean.error) {
      GiftSubOrder.showPayErrorDialog(bean.message);
    } else if ('1003' == bean.error) {
      GiftSubOrder.showPayPwdDialog(bean.message, (psw)=> {
        this._submitOrder(psw);
      });
    } else {
      ToastAndroid.show(bean.message, ToastAndroid.SHORT);
    }
  }
  _updateKeyboardSpace(frames){
    if(!frames.endCoordinates){
       return;
    }
    let keyboardSpace = frames.endCoordinates.height;//获取键盘高度
    let y = 330 + 180 + keyboardSpace - ScreenHeight + 64;
    if (this.scrollOffsetY >= y) {  // 显示键盘遮挡不住输入框
      return;
    }
    this.scrollView.scrollTo({x: 0, y: y, animated: true});
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  broadcast: {
    marginLeft: 0,
    marginTop: 0,
    marginRight: 0
  },
  product_info: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    backgroundColor: '#ffffff'
  },
  steps: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 75
  },
  step_one_bg: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e2c78b'
  },
  step_image_one: {
    width: 30,
    height: 30
  },
  step_text: {
    marginLeft: 3,
    fontSize: 12,
    color: '#4a4a4a'
  },
  step_arrow_image: {
    marginLeft: 6,
    width: 12,
    height: 12
  },
  step_two_bg: {
    marginLeft: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#c69a39'
  },
  step_image_two: {
    width: 30,
    height: 30,
  },
  step_image_three: {
    marginLeft: 14,
    width: 30,
    height: 30,
    backgroundColor: '#ffffff',
    borderColor: '#c69a39',
    borderWidth: 1,
    borderRadius: 15
  },
  product_seperator: {
    marginLeft: 15,
    marginRight: 0,
    height: 0.5,
    backgroundColor: '#dddddd'
  },
  product: {
    flex: 1,
    flexDirection: 'row',
    height: 110
  },
  product_image: {
    marginLeft: 15,
    marginTop: 15,
    width: 80,
    height: 80
  },
  product_detail: {
    flex: 1,
    marginTop: 0,
    marginRight: 0,
    justifyContent: 'space-between',
    height: 110
  },
  product_name: {
    marginLeft: 10,
    marginRight: 10,
    marginTop: 15,
    fontSize: 13,
    color: '#333333',
    lineHeight: 20
  },
  product_price: {
    marginLeft: 10,
    marginBottom: 15,
    fontSize: 14,
    color: '#ff9600'
  },
  product_count_view: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    right: 15,
    bottom: 17,
    height: 29,
    borderColor: '#dddddd',
    borderWidth: 1,
    borderRadius: 3
  },
  product_count_calculate: {
    width: 29,
    fontSize: 14,
    textAlign: 'center',
    color: '#333333'
  },
  product_count_area: {
    marginTop: 0,
    marginBottom: 0,
    width: 45,
    borderLeftColor: '#dddddd',
    borderLeftWidth: 1,
    borderRightColor: '#dddddd',
    borderRightWidth: 1
  },
  product_count_field: {
    flex: 1,
    fontSize: 14,
    color: '#333333',
    textAlign: 'center',
    ...Platform.select({
      ios: {
      },
      android: {
        padding: 0,
        textAlignVertical: 'center'
      },
    })
  },
  gift_area: {
    marginLeft: 0,
    marginRight: 0
  },
  gift_count_title: {
    marginLeft: 15,
    marginTop: 15,
    fontSize: 13,
    color: '#333333'
  },
  gift_count_view: {
    position: 'absolute',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    top: 10,
    right: 15,
    height: 29,
    borderColor: '#dddddd',
    borderWidth: 1,
    borderRadius: 3
  },
  gift_info: {
    marginLeft: 15,
    marginTop: 18,
    fontSize: 13,
    color: '#333333'
  },
  gift_price: {
    marginLeft: 0,
    marginTop: 18,
    fontSize: 13,
    color: '#ff9600'
  },
  gift_info_suffix: {
    marginLeft: 0,
    marginTop: 18,
    fontSize: 13,
    color: '#333333'
  },
  gift_info_extra: {
    marginLeft: 15,
    marginTop: 5,
    marginBottom: 5,
    fontSize: 13,
    color: '#333333'
  },
  message_card: {
    marginTop: 10
  },
  row_view: {
    flexDirection: 'row',
    height: 44,
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff'
  },
  row_title: {
    marginLeft: 15,
    fontSize: 15,
    color: '#333333'
  },
  payway_text: {
    marginRight: 16,
    fontSize: 13,
    color: '#333333'
  },
  acount_rows: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10
  },
  acount_seperator: {
    marginLeft: 10,
    marginRight: 10,
    height: 0.5,
    backgroundColor: '#dddddd'
  },
  row_title_normal: {
    marginLeft: 5,
    fontSize: 13,
    color: '#999999'
  },
  row_title_highlight: {
    marginLeft: 0,
    fontSize: 13,
    color: '#ff9600'
  },
  coupon_leftview: {
    marginLeft: 0,
    flex: 1,
    flexDirection: 'row'
  },
  coupon_bind: {
    marginLeft: 10,
    fontSize: 13,
    color: '#dab45f',
    textDecorationLine: 'underline'
  },
  switch: {
    marginRight: 15,
    width: 51,
    height: 31
  },
  invoice_text: {
    marginRight: ScreenWidth < 375 ? 10 : 16,
    fontSize: 13,
    color: '#999999'
  },
  productamount:{
    flex: 1,
    marginLeft: 0,
    marginRight: 0,
    marginTop: 10,
    marginBottom: 10
  },
  productamount_text: {
    marginRight: 13,
    fontSize: 15,
    color: '#333333'
  },
  bottombar: {
    marginLeft: 0,
    marginRight: 0,
    marginTop: 0,
    marginBottom: 0,
    height: 49,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  },
  bottombar_leftview: {
    flex: 1,
    flexDirection: 'row'
  },
  payamount_title: {
    marginLeft: 16,
    fontSize: 15,
    color: '#333333'
  },
  payamount_text: {
    marginLeft: 5,
    fontSize: 14,
    color: '#ff9600'
  },
  bottombar_rightview: {
    width: 98,
    height: 49,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dab45f'
  },
  settle_title: {
    fontSize: 14,
    color: '#ffffff'
  },
  alert_background: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: ScreenWidth,
    height: ScreenHeight,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  alert_content: {
    width: 351 / 414 * ScreenWidth,
    backgroundColor: '#ffffff',
    borderRadius: 8 / 414 * ScreenWidth
  },
  alert_title_area: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alert_title: {
    fontSize: 17,
    color: '#333333'
  },
  discount_area: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center'
  },
  discount_tag: {
    marginLeft: 30,
    fontSize: 15,
    color: '#333333'
  },
  discount_amount: {
    marginLeft: 50,
    fontSize: 15,
    color: '#ff9600'
  },
  discount_unit: {
    fontSize: 15,
    color: '#333333'
  },
  alert_buttons_area: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 40,
    height: 44,
    borderTopColor: '#dddddd',
    borderTopWidth: 1
  },
  alert_button_left: {
    flex: 1,
    borderRightColor: '#dddddd',
    borderRightWidth: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  alert_button_title: {
    fontSize: 17,
    color: '#0479fa'
  },
  alert_button_right: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
