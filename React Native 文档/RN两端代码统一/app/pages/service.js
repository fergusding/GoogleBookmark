'use strict';

import React, { Component } from 'react';
import {
  Text,
  Image,
  ScrollView,
  ListView,
  StyleSheet,
  View,
  NativeModules,
  Platform
} from 'react-native';
import Dimensions from 'Dimensions';
import NavBar from '../component/navigator';
import Segment from '../component/segment';
import Answer from './answer';
import Button from '../component/button';
import Native from '../native/native'
import ServiceRequest from '../request/service-request';
import { ScreenWidth } from '../common/constant';

var services = [
  {
    name: '物流查询',
    type: 101,
    img: require('../img/logistical.png'),
    value: '3'
  },
  {
    name: '退换货',
    type: 6,
    img: require('../img/exchange.png'),
    value: ''
  },
  {
    name: '在线客服',
    type: 110,
    img: require('../img/service.png'),
    value: ''
  },
  {
    name: '电话客服',
    type: 109,
    img: require('../img/telephone.png'),
    value: ''
  }
];

export default class ServiceCenter extends Component {
  constructor(props) {
    super(props);
    this.currentSegment = 0;
    this.state = {
      datas: [],
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2})
    };
  }
  componentDidMount() {
    this._fetchFAQ();
  }
  render() {
    return (
      <View style = {styles.container}>
        <NavBar title = '客服中心' onBackPress = {() => Native.backToNative()} >
          <Text>adsfhjkasdfklasdlkjflasjdfjkasdflj</Text>
        </NavBar>
        <ScrollView automaticallyAdjustContentInsets = {false}>
          <Image source = {require('../img/banner.png')} style = {styles.top_image} />
          {this.renderQuickSerive()}
          {this.renderCommonProblems()}
        </ScrollView>
      </View>
    );
  }
  renderQuickSerive() {
    var items = [];
    services.map((service, index) => {
      items.push(
        <Button key = {index} onPress = {() => Native.quickServicePressed(index, service.type, service.value)}>
          <View style = {styles.quick_item}>
            <Image source = {service.img} style = {styles.quick_image} />
            <Text style = {styles.quick_text}>{service.name}</Text>
          </View>
        </Button>
      );
      if (index < services.length - 1) {
        items.push(
          <View key = {services.length + index} style = {styles.quick_item_seperator}></View>
        );
      }
    });
    return (
      <View style = {styles.quick_view}>
        <View style = {styles.title_view}>
          <Text style = {styles.title}>快捷服务</Text>
        </View>
        <View style = {styles.quick_container}>
          {items}
        </View>
      </View>
    );
  }
  renderCommonProblems() {
    if (this.state.datas.length == 0) {
      return null;
    }
    return (
      <View style = {styles.common_view}>
        <View style = {styles.title_view}>
          <Text style = {styles.title}>常见问题</Text>
        </View>
        {this.renderSegment()}
        <ListView dataSource = {this.state.dataSource} renderRow = {this.renderRow.bind(this)} renderSeparator = {this.renderSeparator.bind(this)} style = {styles.listview} automaticallyAdjustContentInsets = {false} enableEmptySections = {true} />
      </View>
    );
  }
  renderSegment() {
    var segments = [];
    this.state.datas.map((data, index) => {
      segments.push(data.CatalogName);
    });
    return (
      <View style = {styles.header}>
        <Segment items = {segments} onSegmentItemPressed = {(index) => this._segmentItemPressed(index)} />
        <View key = {2} style = {styles.seperator} />
      </View>
    );
  }
  renderRow(data, sectionId, rowId) {
    return (
      <Button key = {rowId} onPress = {() => this._rowPressed(data.ContentSysNo)}>
        <View style = {styles.row}>
          <Text style = {styles.row_title}>{data.Title}</Text>
          <Image source = {require('../img/ic_arrow.png')} style = {styles.arrow_image} />
        </View>
      </Button>
    );
  }
  renderSeparator(sectionId, rowId) {
    return (
      <View key = {rowId} style = {styles.seperator} />
    );
  }
  _segmentItemPressed(index) {
    this.currentSegment = index;
    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(this.state.datas[index].Contents)
    });
  }
  _fetchFAQ() {
    ServiceRequest.fetchFAQ((datas) => {
      this.setState({
        datas: datas,
        dataSource: this.state.dataSource.cloneWithRows(datas[this.currentSegment].Contents)
      });
    });
  }
  _rowPressed(contentSysNo) {
    this.props.navigator.push({
      name: '',
      component: Answer,
      params: {
        catalogSysNo: this.state.datas[this.currentSegment].CatalogSysNo,
        contentSysNo: contentSysNo
      }
    });
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f2f2f2'
  },
  top_image: {
    width: ScreenWidth,
    height: 124
  },
  title_view: {
    height: 40,
    backgroundColor: '#f2f2f2',
    justifyContent: 'center'
  },
  title: {
    marginLeft: 16,
    color: '#999999'
  },
  quick_view: {
    marginTop: 0
  },
  quick_container: {
    flex: 1,
    flexDirection: 'row'
  },
  quick_item: {
    flex: 1,
    width: (ScreenWidth - 1.5) / 4,
    height: 98,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white'
  },
  quick_item_seperator: {
    width: 0.5,
    backgroundColor: '#dddddd'
  },
  quick_image: {
    width: 25,
    height: 25
  },
  quick_text: {
    marginTop: 10,
    color: '#999999'
  },
  common_view: {
    marginTop: 0,
    backgroundColor: 'white'
  },
  header: {
    height: 70,
  },
  listview: {
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 57
  },
  row_title: {
    left: 16,
    fontSize: 15,
    color: '#333333'
  },
  arrow_image: {
    right: 16,
    width: 12,
    height: 12
  },
  seperator: {
    marginLeft: 10,
    height: 0.5,
    backgroundColor: '#dddddd'
  }
});
