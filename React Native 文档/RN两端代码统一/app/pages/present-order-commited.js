'use strict';

import React, { Component } from 'react';
import {
  Text,
  Image,
  View,
  ScrollView,
  StyleSheet,
  NativeModules,
  Platform
} from 'react-native';
import { accMul, scaledLength } from '../util/util';
import Dimensions from 'Dimensions';
import NavBar from '../component/navigator';
import PresentRequest from '../request/present-request';
import Button from '../component/button';
import Native from '../native/native';
import { ScreenWidth, ScreenHeight } from '../common/constant';

var PresentManager = NativeModules.BLPresentManager;
var DeepLink = NativeModules.DeepLink;
var Share = NativeModules.Share;

export default class PresentOrderCommited extends Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    const { soSysNo, soType } = this.props.data.order
    PresentRequest.checkOrderPayStatus(String(soSysNo), soType, (data) => {
      // Do nothing
    });
    const { benediction, order } = this.props.data;
    this.timer = setTimeout(
      () => Native.sharePresent(benediction, order.pwdKey, order.productImg),
      1000
    );
  }
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  render() {
    const { productImg, productName, presentOty, productQty, productPrice, matters, pwdKey } = this.props.data.order;
    return (
      <View style = {styles.container}>
        <NavBar title = '订单已提交' buttonTitle = "规则说明" onBackPress = {() => Native.backToNative(true)} onButtonPress = {() => Native.gotoRule()} />
        <View style = {styles.background}>
          <Image source = {require('../img/commit_bg.png')} style = {styles.background_image}>
            <ScrollView style = {styles.scrollview} automaticallyAdjustContentInsets = {false}>
              <View style = {styles.orange_background} />
              <View style = {styles.gift_content}>
                {this.renderSteps()}
                <Image defaultSource = {{uri: 'placeHolderImage'}} source = {{uri: productImg}} style = {styles.gift_image} />
                <Text numberOfLines = {2} style = {styles.gift_name}>{productName}</Text>
                <View style = {styles.gift_bottom_area}>
                  <View style = {styles.gift_amount_info}>
                    <Text key = {1} style = {styles.gift_total_amount}>共计<Text style = {styles.gift_total_amount_value}>{presentOty}</Text>份礼品</Text>
                    <Text key = {2} style = {styles.gift_per_info}>每份内含<Text style = {styles.gift_per_info_value}>{productQty}</Text>件商品</Text>
                  </View>
                  <Text style = {styles.gift_price}>总价：
                    <Text style = {styles.gift_total_price_value}>¥{accMul(accMul(productPrice, productQty), presentOty)}</Text>
                  </Text>
                  {this.renderGiftExtra(matters)}
                </View>
              </View>
              <Image source = {require('../img/commit_arc.png')} style = {styles.arc_image}>
                <Button style = {styles.share_button} onPress = {() => Native.sharePresent(this.props.data.benediction, pwdKey, productImg)}>
                  <Text style = {styles.share_button_title}>立即分享</Text>
                </Button>
              </Image>
            </ScrollView>
          </Image>
        </View>
      </View>
    );
  }
  renderSteps() {
    return (
      <View style = {styles.steps}>
        <Image source = {require('../img/step_one.png')} style = {styles.step_image_one} />
        <Text style = {styles.step_text}>选购商品</Text>
        <Image source = {require('../img/ic_arrow.png')} style = {styles.step_arrow_image} />
        <Image source = {require('../img/step_two.png')} style = {styles.step_image_two} />
        <Text style = {styles.step_text}>设定礼品{'\n'}领取方式</Text>
        <Image source = {require('../img/ic_arrow.png')} style = {styles.step_arrow_image} />
        <Image source = {require('../img/step_three_white.png')} style = {styles.step_image_three} />
        <Text style = {styles.step_text}>分享</Text>
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
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff'
  },
  background: {
    flex: 1,
    backgroundColor: '#333333'
  },
  background_image: {
    width: ScreenWidth,
    height: ScreenHeight - 64
  },
  scrollview: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0)'
  },
  orange_background: {
    flex: 1,
    position: 'absolute',
    left: (ScreenWidth - Math.max(310, scaledLength(310))) / 2,
    top: ScreenWidth >= 375 ? 105 : 72,
    width: Math.max(310, scaledLength(310)),
    height: ScreenWidth >= 375 ? 416 : scaledLength(416),
    backgroundColor: '#efd192',
    borderRadius: 8
  },
  gift_content: {
    marginLeft: (ScreenWidth - Math.max(300, scaledLength(300))) / 2,
    marginTop: ScreenWidth > 375 ? 47 : ScreenWidth < 375 ? 5 : 38,
    width: Math.max(300, scaledLength(300)),
    backgroundColor: '#ffffff'
  },
  steps: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: scaledLength(67)
  },
  step_image_one: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e2c78b'
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
  step_image_two: {
    marginLeft: 14,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#e2c78b'
  },
  step_image_three: {
    marginLeft: 14,
    width: 30,
    height: 30,
    backgroundColor: '#c69a39',
    borderRadius: 15
  },
  gift_image: {
    marginLeft: (Math.max(300, scaledLength(300)) - Math.max(280, scaledLength(280))) / 2,
    width: Math.max(280, scaledLength(280)),
    height: Math.max(200, scaledLength(200))
  },
  gift_name: {
    marginLeft: 8,
    marginTop: ScreenWidth > 375 ? 16 : scaledLength(10),
    marginRight: 8,
    fontSize: 13,
    color: '#333333',
    lineHeight: 18
  },
  gift_bottom_area: {
    flex: 1,
    alignItems: 'center'
  },
  gift_amount_info: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: scaledLength(10),
  },
  gift_total_amount: {
    fontSize: 13,
    color: '#333333'
  },
  gift_total_amount_value: {
    color: '#ff9600',
    fontSize: 17
  },
  gift_per_info: {
    marginLeft: 15,
    fontSize: 13,
    color: '#333333'
  },
  gift_per_info_value: {
    fontSize: 17
  },
  gift_price: {
    marginTop: scaledLength(18),
    fontSize: 13,
    color: '#333333'
  },
  gift_total_price_value: {
    color: '#ff9600',
    fontSize: 18
  },
  gift_info_extra: {
    marginTop: scaledLength(10),
    marginBottom: Math.max(100, scaledLength(100)),
    fontSize: 13,
    color: '#333333'
  },
  arc_image: {
    marginLeft: (ScreenWidth - Math.max(310, scaledLength(310))) / 2,
    marginTop: -(125 / 310 * Math.max(310, scaledLength(310)) - 1),
    width: Math.max(310, scaledLength(310)),
    height: 125 / 310 * Math.max(310, scaledLength(310))
  },
  share_button: {
    position: 'absolute',
    bottom: 17,
    left: 40,
    right: 40,
    height: 42,
    backgroundColor: 'rgba(0, 0, 0, 0)',
    borderColor: '#333333',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10
  },
  share_button_title: {
    fontSize: 17,
    color: '#333333'
  }
});
