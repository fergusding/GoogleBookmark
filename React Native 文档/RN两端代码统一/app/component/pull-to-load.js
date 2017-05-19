'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet
} from 'react-native';
import Button from './button';

const LOAD_STATE_IDLE = 0;  // 闲置
const LOAD_STATE_LOADING = 1; // 加载中
const LOAD_STATE_NOMOREDATA = 2;  // 暂无更多

export default class PullToLoad extends Component {
  render() {
    var indicator = this.props.loadState != LOAD_STATE_LOADING ? null : <ActivityIndicator size = 'small' />;
    var text = this.props.loadState == LOAD_STATE_IDLE ? '查看更多' : this.props.loadState == LOAD_STATE_LOADING ? '加载中，请稍后' : '没有更多了';
    var content = (
      <View style={styles.container}>
        {indicator}
        <Text style={styles.load_text}>{text}</Text>
      </View>
    );
    if (this.props.loadState == LOAD_STATE_IDLE) {
      return (
        <Button onPress = {this.props.loadMorePressed}>
          {content}
        </Button>
      );
    } else {
      return content;
    }
  }
}

PullToLoad.propTypes = {
  loadState: React.PropTypes.number.isRequired,
  loadMorePressed: React.PropTypes.func
}

var styles = StyleSheet.create({
  container: {
    height:40,
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row'
  },
  load_text: {
    marginLeft: 10,
    color:'#999999',
    fontSize:12
  }
});
