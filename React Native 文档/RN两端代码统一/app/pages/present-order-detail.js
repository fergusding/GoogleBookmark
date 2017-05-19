'use strict';

import React, { Component } from 'react';
import {
  Text,
  TextInput,
  Image,
  Switch,
  ScrollView,
  View,
  ListView,
  Platform,
  StyleSheet,
  NativeModules
} from 'react-native';
import Dimensions from 'Dimensions';
import NavBar from '../component/navigator';
import Broadcast from '../component/broadcast';
import PullToLoad from '../component/pull-to-load';
import MessageCard from '../component/message-card';
import PresentRequest from '../request/present-request';
import Native from '../native/native';

var PresentManager = NativeModules.BLPresentManager;
var Share = NativeModules.Share;
var offset = 0;
var limit = 20;

export default class PresentOrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      foot: 0,
      data: {},
      records: [],
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    };
  }
  componentDidMount() {
    PresentRequest.loadPresentOrderDetail(this.props.sysNo, (data) => {
      this.setState({
        data: data
      });
    });
    this._fetchPresentReceiveLog(offset, limit, true);
  }
  render() {
    const { wenXinTip, totalQty, sendNum, pwd, contect, benediction, productImg, isOver } = this.state.data;
    var buttonTitle = typeof(isOver) != "undefined" && !isOver ? '立即分享' : null;
    return (
      <View style = {styles.container}>
        <NavBar title = '礼品购订单详情'
          shadow = {true}
          buttonTitle = {buttonTitle}
          buttonBorder = {true}
          onBackPress = {() => this.props.navigator.pop()}
          onButtonPress = {() => Native.sharePresent(benediction, pwd, productImg)} />
        <ScrollView style = {{flex: 1, backgroundColor: '#f2f2f2'}} automaticallyAdjustContentInsets = {false}>
          <Broadcast message = {wenXinTip} style = {styles.broadcast} />
          {this.renderGiftInfo()}
          <MessageCard style = {styles.message_card}  contect = {contect} benediction = {benediction} editable = {false} />
          <View style = {styles.gift_record}>
            <ListView dataSource = {this.state.dataSource}
              renderRow = {this.renderRow.bind(this)}
              renderSeparator = {this.renderSeparator.bind(this)}
              automaticallyAdjustContentInsets = {false}
              enableEmptySections = {true}
              renderHeader = {this.renderHeader.bind(this)}
              renderFooter = {this.renderFooter.bind(this)} />
          </View>
        </ScrollView>
      </View>
    );
  }
  renderGiftInfo() {
    const { soId, productName, productImg, totalAmt, totalQty, sendNum } = this.state.data;
    let sendText = null;
    if (sendNum > 0) {
      sendText = <Text>，已领{sendNum}件</Text>;
    }
    return (
      <View style = {styles.gift_info}>
        <Text style = {styles.order_title}>订单编号:
          <Text style = {styles.order_number}>  {soId}</Text>
        </Text>
        <View style = {styles.gift}>
          <Image defaultSource = {{uri: 'placeHolderImage'}} source = {{uri: productImg}} style = {styles.gift_image} />
          <View style = {styles.gift_detail}>
            <Text numberOfLines = {2} style = {styles.gift_name}>{productName}</Text>
            <View style = {styles.gift_detail_bottom}>
              <Text style = {styles.gift_detail_record}>共{totalQty}件{sendText}</Text>
              <Text style = {styles.gift_total_price}>总价：{totalAmt}</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }
  renderHeader() {
    if (!this.state.records.length) {
      return null;
    }
    const { totalQty, sendNum } = this.state.data;
    let remainQty = !isNaN(totalQty - sendNum) ? totalQty - sendNum : 0;
    return (
      <View style = {styles.gift_top}>
        <Text style = {styles.gift_top_title}>领取记录</Text>
        <Text style = {styles.gift_top_content}>{sendNum}人已领取，剩余{remainQty}份未领取</Text>
      </View>
    );
  }
  renderRow(data, sectionId, rowId) {
    return (
      <View key = {rowId} style = {styles.record}>
        <Image defaultSource = {{uri: 'placeHolderImage'}} source = {{uri: data.receiveCustomerHeadImg}} style = {styles.record_person_image} />
        <View style = {styles.record_right_view}>
          <Text style = {styles.record_person_name}>{data.receiveContent}</Text>
          <Text style = {styles.record_word_time}>{data.remark}</Text>
          <Text style = {styles.record_word_time}>{data.receiveTime}</Text>
          <Text style = {styles.record_order_state}>订单状态：{data.statusName}</Text>
        </View>
      </View>
    );
  }
  renderFooter() {
    if (!this.state.records.length || this.state.records.length < limit) {
      return null;
    }

    if (this.state.foot == 0) {
      return <PullToLoad loadState = {this.state.foot} loadMorePressed = {() => this._loadMore()} />;
    } else {
      return <PullToLoad loadState = {this.state.foot} />
    }
  }
  renderSeparator(sectionId, rowId) {
    return (
      <View key = {rowId} style = {styles.gift_record_seperator} />
    );
  }
  _fetchPresentReceiveLog(offset, limit, showLoading) {
    PresentRequest.loadPresentReceiveLog(this.props.sysNo, offset, limit, showLoading, (data) => {
      if (!data || data.length < limit) {
        this.setState({
          foot: 2
        });
      }
      let newRecords = data ? data : [];
      if (offset != 0) {
        newRecords = [...this.state.records, ...data];
      }
      this.setState({
        records: newRecords,
        dataSource: this.state.dataSource.cloneWithRows(newRecords)
      });
    });
  }
  _loadMore() {
    offset = this.state.records.length;
    this.setState({
      foot: 1
    });
    this._fetchPresentReceiveLog(offset, limit, false)
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
  gift_info: {
    height: 138,
    backgroundColor: '#ffffff'
  },
  order_title: {
    marginLeft: 16,
    marginTop: 14,
    color: '#999999',
    fontSize: 14
  },
  order_number: {
    color: '#333333',
    fontSize: 14
  },
  gift: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 6,
    height: 103,
    backgroundColor: '#ffffff'
  },
  gift_image: {
    marginLeft: 16,
    marginTop: 17,
    width: 45,
    height: 45
  },
  gift_detail: {
    flex: 1,
    marginTop: 0,
    marginRight: 0,
    justifyContent: 'space-between'
  },
  gift_name: {
    marginLeft: 14,
    marginRight: 14,
    marginTop: 12,
    fontSize: 13,
    color: '#333333',
    lineHeight: 20
  },
  gift_detail_bottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15
  },
  gift_detail_record: {
    marginLeft: 14,
    fontSize: 14,
    color: '#999999'
  },
  gift_total_price: {
    marginRight: 14,
    fontSize: 14,
    color: '#ff9600'
  },
  message_card: {
    marginTop: 10
  },
  gift_record: {
    marginTop: 10,
    backgroundColor: '#ffffff'
  },
  gift_top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 20,
    height: 44,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1
  },
  gift_top_title: {
    fontSize: 15,
    color: '#333333'
  },
  gift_top_content: {
    marginRight: 5,
    fontSize: 15,
    color: '#333333'
  },
  record: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 20,
    height: 90
  },
  record_person_image: {
    marginLeft: 5,
    marginTop: 11,
    width: 40,
    height: 40
  },
  record_right_view: {
    flex: 1
  },
  record_person_name: {
    marginLeft: 23,
    marginTop: 11,
    fontSize: 15,
    color: '#333333'
  },
  record_word_time: {
    marginLeft: 23,
    marginTop: 9,
    fontSize: 13,
    color: '#999999'
  },
  record_order_state: {
    position: 'absolute',
    top: 11,
    right: 13,
    fontSize: 15,
    color: '#333333'
  },
  gift_record_seperator: {
    marginLeft: 20,
    marginRight: 0,
    backgroundColor: '#dddddd',
    height: 0.5
  }
});
