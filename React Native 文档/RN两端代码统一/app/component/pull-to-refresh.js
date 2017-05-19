'use strict';

import React, { Component } from 'react';
import {
  View,
  Image,
  Animated,
  StyleSheet
} from 'react-native';

export default class PullToRefresh extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rotateValue: new Animated.Value(0)
    };
  }
  componentDidUpdate() {
    if (this.props.refreshing) {
      this._startCycleAnimation();
    }
  }
  render() {
    var cycle_transform = {transform: [{rotateZ: this.state.rotateValue.interpolate({
      inputRange: [0,1],
      outputRange: ['0deg', '360deg']
    })}]};
    var cover_top = this.props.refreshing ? {top: 32} : {top: (20 + Math.abs(this.props.offset)) / 50 * 32};
    var arrow_transform = this.props.refreshing ? {transform: [{rotate: '270deg'}]}:  {transform: [{rotate: '90deg'}]};
    return (
      <View style={styles.container}>
        <View style = {styles.content}>
          <Animated.Image source = {{uri: 'loading_cycle'}} style = {[styles.image_circle, cycle_transform]} />
          <Animated.View style = {[styles.image_cover, cover_top]} />
          <Animated.Image source = {{uri: 'loading_arrow'}} style = {[styles.image_arrow, arrow_transform]} />
        </View>
      </View>
    );
  }
  _startCycleAnimation() {
    this.state.rotateValue.setValue(0);
    Animated.timing(this.state.rotateValue, {
        toValue: 1,
        duration: 1000
    }).start(() => this._startCycleAnimation());
  }
}

PullToRefresh.propTypes = {
  refreshing: React.PropTypes.bool,
  offset: React.PropTypes.number
}

var styles = StyleSheet.create({
  container: {
    height:40,
    alignItems:'center',
    justifyContent:'center',
    flexDirection: 'row'
  },
  content: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  image_circle: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 32,
    height: 32
  },
  image_cover: {
    position: 'absolute',
    left: 0,
    width: 32,
    height: 32,
    backgroundColor: '#f5f5f5'
  },
  image_arrow: {
    width: 20,
    height: 20
  }
});
