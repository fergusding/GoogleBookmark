'use strict';

import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet
} from 'react-native';

export default class Broadcast extends Component {
  render() {
    return (
      <View style = {styles.container}>
        <Image source = {require('../img/horn.png')} style = {styles.horn} />
        <View style = {styles.v_seperator} />
        <Text style = {styles.message} numberOfLines = {2}>{this.props.message}</Text>
      </View>
    );
  }
}

Broadcast.propTypes = {
  message: React.PropTypes.string
}

var styles = StyleSheet.create({
  container: {
    height: 45,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomColor: '#dddddd',
    borderBottomWidth: 0.5
  },
  horn: {
    marginLeft: 15,
    width: 20,
    height: 20
  },
  v_seperator: {
    marginLeft: 7,
    width: 1,
    height: 20,
    backgroundColor: '#dddddd'
  },
  message: {
    flex: 1,
    marginLeft: 10,
    marginRight: 15,
    fontSize: 12,
    color: '#333333',
    lineHeight: 16
  },
});
