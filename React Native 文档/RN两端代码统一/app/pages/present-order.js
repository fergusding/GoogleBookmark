'use strict';

import React, { Component } from 'react';
import {
  Text,
  Image,
  ListView,
  View,
  AlertIOS,
  Platform,
  StyleSheet,
  PanResponder,
  NativeModules
} from 'react-native';
import NavBar from '../component/navigator';
import PullToRefresh from '../component/pull-to-refresh';
import PullToLoad from '../component/pull-to-load';
import PresentOrderDetail from './present-order-detail';
import PresentRequest from '../request/present-request';
import Button from '../component/button';
import Native from '../native/native'

var PresentManager = NativeModules.BLPresentManager;
var Dialog = NativeModules.BLDialog;
var DeepLink = NativeModules.DeepLink;
var Share = NativeModules.Share;

var offset = 0;
var limit = 20;
const PULL_DOWN_HEIGHT = 50;

export default class PresentOrder extends Component {
  constructor(props) {
    super(props);
    this.panResponder = {};
    this.state = { 
      contentOffsetY: 0,
      head: 0, //0-隐藏，1-下拉，2-刷新
      foot: 0, //0-隐藏，1-加载，3-暂无更多
      data: null,
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    };
  }
  componentDidMount() {
    this._fetchOrderList(offset, limit, true);
    this.panResponder = PanResponder.create({
      onPanResponderMove: this.onPanResponderMove.bind(this),
      onPanResponderRelease:this.onPanResponderRelease.bind(this)
    });
  }
  render() {
    return (
      <View style = {styles.container}>
        <NavBar title = '礼品购订单' shadow = {true} buttonTitle = "规则说明" onBackPress = {() => Native.backToNative()} onButtonPress = {() => Native.gotoRule()} />
        {this.renderContent()}
      </View>
    );
  }
  renderContent() {
    if (!this.state.data) { // 第一次进来只显示loading
      return (
        <View style = {{flex: 1, backgroundColor: '#f5f5f5'}} />
      );
    }

    if (!this.state.data.length) {  // 当返回无订单
      return (
        <View style = {styles.content_empty}>
          <View style = {styles.empty_area}>
            <Image source = {require('../img/order_empty.png')} style = {styles.empty_image} />
            <Text style = {styles.empty_message}>您还没有礼品购订单</Text>
          </View>
        </View>
      );
    }

    // 返回订单列表
    let threshold = Platform === 'ios' ? -10 : 40;
    return (
      <ListView
        style = {styles.listview}
        automaticallyAdjustContentInsets = {false}
        enableEmptySections = {true}
        dataSource = {this.state.dataSource}
        ref = {(listview) => this.listview = listview}
        renderRow = {this.renderRow.bind(this)}
        renderSeparator = {this.renderSeparator.bind(this)}
        renderFooter = {this.renderFooter.bind(this)}
        renderHeader = {this.renderHeader.bind(this)}
        onEndReachedThreshold = {threshold}
        onEndReached = {this.onEndReached.bind(this)}
        onScroll = {this.onScroll.bind(this)}
        {...this.panResponder.panHandlers} />
    );
  }
  renderRow(data, sectionId, rowId) {
    var title_button;
    switch (data.btnType) {
      case 1:
        title_button = '去支付';
        break;
      case 2:
        title_button = '立即分享';
        break;
      case 3:
        title_button = '再次送礼';
        break;
      default:
    }
    var watermarkImage = null;
    if (data.totalQty == data.hasSend) {
      watermarkImage = require('../img/receive_over.png');
    }
    if (data.isOver) {
      watermarkImage = require('../img/date_fire.png');
    }
    let cancelButton = null;
    if (data.canCannel) {
      cancelButton = (
        <Button onPress = {() => this._cancelOrderPress(data.sysNo)}>
          <View style = {[styles.row_content_button_left, styles.row_content_button_green]}>
            <Text style = {[styles.row_button_title, styles.row_button_title_green]}>取消订单</Text>
          </View>
        </Button>
      );
    }
    let sendText = null;
    if (data.hasSend != 0) {
      sendText = <Text>，已领{data.hasSend}件</Text>;
    }
    return (
      <Button key = {rowId} onPress = {() => this._rowPressed(data.sysNo, data.btnType)}>
        <View style = {styles.row}>
          <View style = {styles.row_top}>
            <Text style = {styles.row_top_date}>{data.orderDate}</Text>
            <View style = {styles.row_top_right}>
              <Text style = {styles.total_price}>总价：
                <Text style = {styles.total_price_highlight}>{data.totalAmt}</Text>
              </Text>
              <Image source = {require('../img/ic_arrow.png')} style = {styles.row_top_arrow} />
            </View>
          </View>
          <View style = {styles.row_content}>
            <View style = {styles.row_content_left}>
              <Image source = {require('../img/gift_order_list.png')} style = {styles.row_content_icon} />
              <View style = {styles.row_content_left_right}>
                <Image defaultSource = {{uri: 'placeHolderImage'}} source = {{uri: data.productImg}} style = {styles.row_content_image} />
                <Text style = {styles.row_content_state}>{data.payStatusName}</Text>
              </View>
            </View>
            <Text style = {styles.row_content_message}>共{data.totalQty}件{sendText}</Text>
            <View style = {styles.row_content_buttons}>
              {cancelButton}
              <Button onPress = {() => this._rightBtnPress(data)}>
                <View style = {[styles.row_content_button_right, styles.row_content_button_orange]}>
                  <Text style = {[styles.row_button_title, styles.row_button_title_white]}>{title_button}</Text>
                </View>
              </Button>
            </View>
          </View>
          <Image source = {watermarkImage} style = {styles.row_receive_state} />
        </View>
      </Button>
    );
  }
  renderHeader() {
    if (this.state.head == 0) {
      return null;
    } else if (this.state.head == 1) {
      return <PullToRefresh offset = {Math.max(this.state.contentOffsetY, -PULL_DOWN_HEIGHT)} />;
    } else {
      return <PullToRefresh refreshing = {true} />
    }
  }
  renderSeparator(sectionId, rowId) {
    return (
      <View key = {rowId} style = {styles.row_seperator} />
    );
  }
  renderFooter() {
    if (this.state.foot == 0) {
      return null;
    } else {
      return <PullToLoad loadState = {this.state.foot} />
    }
  }
  onEndReached() {
    if (this.state.data.length < limit) { //下拉，取消，支付等刷新时数据count小于limit时不作响应
      return;
    }

    if (this.state.foot != 0) { // 当foot是加载中或者加载完毕的状态时不做响应
      return;
    }

    this.setState({
      foot: 1
    });
    offset += this.state.data.length;
    this._fetchOrderList(offset, limit, false);
  }
  onScroll(e) {
    this.setState({
      contentOffsetY: e.nativeEvent.contentOffset.y
    });
  }
  onPanResponderMove(e, gestureState) {
    if (this.state.head == 0 && this.state.contentOffsetY < 0) {
      this.setState({
        head: 1
      });
    }
  }
  onPanResponderRelease(e, gestureState) {
    if (this.state.head = 1 && this.state.contentOffsetY <= -PULL_DOWN_HEIGHT) {
      this.setState({
        head: 2
      });
      offset = 0;
      this._fetchOrderList(offset, limit, false);
    } else {
      this.setState({
        head: 0
      });
    }
  }
  _rowPressed(sysNo, btnType) {
    this.props.navigator.push({
      name: '',
      component: PresentOrderDetail,
      params: {
        sysNo: sysNo
      }
    });
  }
  _fetchOrderList(offset, limit, showLoading) {
    PresentRequest.fetchMyPresentOrderList(offset, limit, showLoading, (data) => {
      let newData = data ? data : [];
      if (this.state.foot == 1 && newData.length < limit) {
        this.setState({
          foot: 2
        });
      } else {
        this.setState({
          foot: 0
        });
      }
      if (offset != 0) {
        newData = [...this.state.data, ...data];
      } else {
        if (this.listview) {
          this.listview.scrollTo({x: 0, y: 0, animated: false});
        }
        // 先将数据置空，避免刷新数据后上拉加载触发延时的bug
        this.setState({
          head: 0,
          dataSource: this.state.dataSource.cloneWithRows([])
        });
      }
      this.setState({
        data: newData,
        dataSource: this.state.dataSource.cloneWithRows(newData)
      });
    });
  }
  _cancelOrderPress(sysNo) {
    Platform.select({
      ios: () => AlertIOS.alert(
                  null,
                  '您确定取消订单？',
                  [
                    {text: '取消'},
                    {text: '确定', onPress: () => this._cancelOrder(sysNo)},
                  ]
                ),
      android: () =>  Dialog.showDialog('是否取消订单？', (bl)=>{
                        if (bl) {
                          this._cancelOrder(sysNo);
                        }
                      }),
    })();
  }
  _cancelOrder(sysNo) {
    PresentRequest.abandonPresentOrder(sysNo, (data) => {
      offset = 0;
      this._fetchOrderList(offset, limit, true);
    });

  }
  _rightBtnPress(data) {
    switch (data.btnType) {
      case 1: //去支付
        Platform.select({
          ios: () => PresentManager.gotoPayWithSysNo(String(data.sysNo), data.soType, true, (error, events) => {
                      if (!error) {
                        offset = 0;
                        this._fetchOrderList(offset, limit, true);
                      }
                    }),
          android: () =>  DeepLink.go2OrderSuccessPage(data.soType, data.sysNo, (payStatus)=>{
                            if (payStatus == 1) {//支付成功
                              offset = 0;
                              this._fetchOrderList(offset, limit, true);
                            }
                          }),
        })();
        break;
      case 2://立即分享
        Native.sharePresent(data.benediction, data.pwd, data.productImg);
        break;
      case 3://再次送礼
      Platform.select({
          ios: () => PresentManager.gotoProductDetail(String(data.productSysNo)),
          android: () => DeepLink.switchPage(1, data.productSysNo+'', true),
        })();
        break;
      default:
    }
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  content_empty: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  empty_area: {
    alignItems: 'center'
  },
  empty_image: {
    width: 70,
    height: 70
  },
  empty_message: {
    marginTop: 32,
    fontSize: 13,
    color: '#999999'
  },
  listview: {
    flex: 1,
    backgroundColor: '#f5f5f5'
  },
  row_seperator: {
    height: 10,
    backgroundColor: '#f5f5f5'
  },
  row:{
    height: 144,
    backgroundColor: '#ffffff'
  },
  row_top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 37,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 0.5
  },
  row_top_date: {
    marginLeft: 11,
    fontSize: 12,
    color: '#999999'
  },
  row_top_right: {
    marginRight: 20,
    flexDirection: 'row'
  },
  total_price: {
    marginRight: 24,
    fontSize: 12,
    color: '#999999'
  },
  total_price_highlight: {
    marginLeft: 0,
    fontSize: 12,
    color: '#ff9600'
  },
  row_top_arrow: {
    marginRight: 0,
    width: 8,
    height: 13
  },
  row_content: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  row_content_left: {
    flex: 1,
    flexDirection: 'row'
  },
  row_content_icon: {
    marginLeft: 12,
    marginTop: 12,
    width: 15,
    height: 17
  },
  row_content_left_right: {
    flex: 1
  },
  row_content_image: {
    marginLeft: 13,
    marginTop: 14,
    width: 45,
    height: 45
  },
  row_content_state: {
    marginLeft: 13,
    marginTop: 9,
    fontSize: 14,
    color: '#666666'
  },
  row_content_message: {
    position: 'absolute',
    right: 12,
    top: 25,
    fontSize: 12,
    color: '#999999'
  },
  row_content_buttons: {
    position: 'absolute',
    right: 16,
    bottom: 15,
    flexDirection: 'row'
  },
  row_content_button_left: {
    marginRight: 15,
    width: 75,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6
  },
  row_content_button_right: {
    marginRight: 0,
    width: 75,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6
  },
  row_content_button_green: {
    backgroundColor: '#ffffff',
    borderColor: '#b2d54e',
    borderWidth: 1
  },
  row_content_button_orange: {
    backgroundColor: '#dab45f'
  },
  row_button_title: {
    fontSize: 14
  },
  row_button_title_green: {
    color: '#b2d54e'
  },
  row_button_title_white: {
    color: '#ffffff'
  },
  row_receive_state: {
    position: 'absolute',
    left: 92,
    top: 6,
    width: 70,
    height: 70
  }
});
