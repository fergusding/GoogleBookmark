'use strict';

import React, { Component } from 'react';
import { View, Platform, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';

export default class Button extends Component {
	render() {
		const button = Platform.select({
  			ios: () => <TouchableOpacity style={this.props.style} disabled={this.props.disabled} onPress={this.props.onPress}>
  						{this.props.children}
  					   </TouchableOpacity>,
  			android: () => <TouchableWithoutFeedback disabled={this.props.disabled} onPress={this.props.onPress}>
  							<View style={this.props.style}>
  								{this.props.children}
  							</View>
  						   </TouchableWithoutFeedback>,
		})();
		
		return button;
	}
}

Button.PropTypes = {
	disabled:React.PropTypes.bool,
	onPress:React.PropTypes.func
};