'use strict';

import React, { Component } from 'react';
import {
  View,
  Image,
  Text,
  StyleSheet,
  Platform
} from 'react-native';
import Button from './button';

export default class NavBar extends Component {
  render() {
    var style_shadow = this.props.shadow ? styles.shadow : null;
    var right_button = null;
    if (this.props.buttonTitle) {
      var style_button = this.props.buttonBorder ? styles.button_border : null;
      right_button = (
        <Button key = {2} style = {[styles.button_area, styles.button_size, style_button]} onPress = {this.props.onButtonPress}>
          <View style = {styles.button_view}>
            <Text style = {styles.button_title}>{this.props.buttonTitle}</Text>
          </View>
        </Button>
      );
    }
    return (
      <View style = {[styles.container, style_shadow]}>
        <View style = {styles.title_view}>
          <Text style = {styles.title}>{this.props.title}</Text>
        </View>
        <Button key = {1} style = {styles.back} onPress = {this.props.onBackPress}>
          <Image source = {require('../img/icon_back.png')} style = {styles.image} />
        </Button>
        {right_button}
      </View>
    );
  }
}

NavBar.propTypes = {
  title: React.PropTypes.string.isRequired,
  shadow: React.PropTypes.bool,
  buttonTitle:React.PropTypes.string,
  buttonBorder:React.PropTypes.bool,
  onBackPress: React.PropTypes.func.isRequired,
  onButtonPress:React.PropTypes.func
}

var styles = StyleSheet.create({
  container: {
    ...Platform.select({
      ios: {
        height: 64
      },
      android: {
        height: 48
      },
    }),
    backgroundColor: 'white'
  },
  back: {
    ...Platform.select({
      ios: {
        top: 20,
        width: 62,
        height: 44
      },
      android: {
        width: 48,
        height: 48,
        alignItems: 'center'
      },
    })
  },
  image: {
    ...Platform.select({
      ios: {
        width: 62,
        height: 44
      },
      android: {
        marginLeft: 16,
        width: 48,
        height: 48
      },
    })
  },
  title_view: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    ...Platform.select({
      ios: {
        top: 20,
        height: 44,
      },
      android: {
        top: 0,
        height: 48,
      },
    })
  },
  title: {
    color: '#abd13e',
    fontSize: 18
  },
  button_area: {
    position: 'absolute',
    right: 10,
    bottom: 8,
    width: 70,
    height: 30
  },
  button_view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  button_title: {
    fontSize: 14,
    color: '#abd13e'
  },
  shadow: {
    borderBottomColor: '#dddddd',
    borderBottomWidth: 0.5
  },
  button_border: {
    borderColor: '#abd13e',
    borderWidth: 1,
    borderRadius: 6
  }
});
