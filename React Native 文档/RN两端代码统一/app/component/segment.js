'use strict';

import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform
} from 'react-native';
import Dimensions from  'Dimensions';
import { ScreenWidth } from '../common/constant';
import Button from './button';

export default class Segment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedIndex: 0
    };
  }
  render() {
    if (this.props.items.length == 0) {
      return null;
    }
    return (
      <View key = {1} style = {styles.segment}>
        {this.renderItems()}
      </View>
    );
  }
  renderItems() {
    var segmentItems = [];
    this.props.items.map((segment, index) => {
      var style_border = index != this.props.items.length - 1 ? {borderRightWidth: 1, borderRightColor: '#abd13e'} : null;
      var style_bgcolor = index == this.state.selectedIndex ? {backgroundColor: '#abd13e'} : {backgroundColor: 'white'};
      var style_color = index == this.state.selectedIndex ? {color: 'white'} : {color: '#999999'};
      var style_width = {width: (ScreenWidth - 33) / this.props.items.length};
      var style_first_left_border = index == 0 ? styles.first_left_border : null;
      var style_last_right_border = index == this.props.items.length - 1 ? styles.last_right_border : null;
      var disabled = index == this.state.selectedIndex ? true : false;

      segmentItems.push(
        <Button key = {index} disabled = {disabled} onPress = {() => {
          this.props.onSegmentItemPressed(index);
          this.setState({selectedIndex: index});
        }}>
          <View style = {[styles.segment_item, style_first_left_border, style_last_right_border, style_border, style_bgcolor, style_width]}>
            <Text style = {styles.segment_title, style_color}>{segment}</Text>
          </View>
        </Button>
      );
    });
    return segmentItems;
  }
}

Segment.PropTypes = {
  items: React.PropTypes.arrayOf(React.PropTypes.string.isRequired).isRequired,
  onSegmentItemPressed:React.PropTypes.func.isRequired
}

var styles = StyleSheet.create({
  segment: {
    flex: 1,
    flexDirection: 'row',
    marginLeft: 16,
    marginRight: 16,
    marginTop: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#abd13e',
    borderRadius: 5,
    ...Platform.select({
      ios: {
        overflow: 'hidden'
      },
      android: {
      },
    })
  },
  segment_item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 0,
    marginBottom: 0
  },
  segment_title: {
    fontSize: 12
  },
  first_left_border: {
  	...Platform.select({
      ios: {
      },
      android: {
      	borderTopLeftRadius: 5,
    	borderBottomLeftRadius: 5
      },
    })
  },
  last_right_border: {
  	...Platform.select({
      ios: {
      },
      android: {
      	borderTopRightRadius: 5,
    	borderBottomRightRadius: 5
      },
    })
  }
});
