'use strict';

import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import DashLine from "./dashline";
import Dimensions from 'Dimensions';
import { ScreenWidth } from '../common/constant';

export default class MessageCard extends Component {
  render() {
    return (
      <View style = {[this.props.style, styles.container]}>
        <Image source = {require('../img/card_msg.png')} style = {styles.msg_card} />
        <Image source = {require('../img/logo.png')} style = {styles.logo} />
        <Text style = {styles.benediction_label}>寄语</Text>
        <TextInput style = {styles.text_field} maxLength = {15} defaultValue = {this.props.benediction} editable = {this.props.editable} onChangeText={(text) => this.props.onChangeBenediction(text)} />
        <Text style = {styles.contect_label}>送礼人名称</Text>
        <TextInput style = {styles.text_field} maxLength = {16} defaultValue = {this.props.contect} editable = {this.props.editable} onChangeText={(text) => this.props.onChangeContect(text)} />
        <DashLine style = {styles.dash_line} />
      </View>
    );
  }
}

MessageCard.propTypes = {
  contect: React.PropTypes.string,
  benediction: React.PropTypes.string,
  editable: React.PropTypes.bool,
  onChangeContect: React.PropTypes.func,
  onChangeBenediction: React.PropTypes.func
}

var styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    height: 180
  },
  msg_card: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: 65,
    height: 65
  },
  logo: {
    position: 'absolute',
    right: 15,
    top: 10,
    width: 43,
    height: 18
  },
  benediction_label: {
    marginLeft: 50,
    marginTop: 23,
    height: 16,
    fontSize: 13,
    color: '#C69A39'
  },
  contect_label: {
    marginLeft: 50,
    marginTop: 14,
    height: 16,
    fontSize: 13,
    color: '#C69A39'
  },
  text_field: {
    marginLeft: 50,
    marginTop: 10,
    marginRight: 50,
    paddingLeft: 12,
    height: 33,
    fontSize: 13,
    color: '#333333',
    borderColor: '#dddddd',
    borderWidth: 0.5,
    borderRadius: 10,
    ...Platform.select({
      ios: {
      },
      android: {
        padding: 0,
        textAlignVertical: 'center'
      },
    })
  },
  dash_line: {
    marginTop: 24
  }
});
