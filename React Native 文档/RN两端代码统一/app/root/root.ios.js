'use strict';

import React, { Component } from 'react';
import { Navigator, NativeModules } from 'react-native';
import ServiceCenter from '../pages/service';
import PresentSettlement from '../pages/present-settlement';
import PresentOrder from '../pages/present-order';

var BaseManager = NativeModules.BLBaseManager;

const SERVICE_CENTER = 1; // 客服中心
const PRESENT_SETTLEMENT = 2; // 礼品购下单
const PRESENT_ORDER = 3;  // 礼品购订单

export default class BenLaiApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      properties: {}
    };
  }
  componentWillMount() {
    BaseManager.getProperties((error, properties) => {
      this.setState({
        properties: properties
      });
    });
  }
  render () {
    let initPage;
    let params = {};

    switch (this.state.properties.pageType) {
      case SERVICE_CENTER:
        initPage = ServiceCenter;
        break;
      case PRESENT_SETTLEMENT:
        initPage = PresentSettlement;
        params = {productBasicSysNo: this.state.properties.productBasicSysNo};
        break;
      case PRESENT_ORDER:
        initPage = PresentOrder;
        break;
      default:
        break;
    }

    if (!initPage) {
      return null;
    }

    return (
      <Navigator
          style= {{flex: 1}}
          initialRoute= {{
            component: initPage,
            params: params
          }}
          renderScene={(route, navigator) => {
            let Component = route.component;
            if(route.component) {
              return <Component {...route.params} navigator={navigator} />
            }
          }} />
    );
  }
}
