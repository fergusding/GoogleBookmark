/**
 * Created by prototype on 16-11-5.
 */

import React, {PropTypes} from "react";
import {StyleSheet, Switch, Image, Platform} from "react-native";
import Button from './button';

export default class SwitchCommon extends React.Component {
    render() {
        const switchCommon = Platform.select({
            ios: () => <Switch style = {this.props.style} disabled = {this.props.disabled} value = {this.props.value} onValueChange = {(value) => this.props.onValueChange(value)}/>,
            android: () => <Button onPress={() => this._onSwitchPress()}>
                            <Image resizeMode={'contain'} style={styles.switch} source={this._chooseImage()}/>
                           </Button>,
        })();
        
        return switchCommon;
    }

    _chooseImage() {
        if (this.props.disabled) {
            return require('../img/switch_over.png')
        }

        if (this.props.value) {
            return require('../img/switch_on.png')
        } else {
            return require('../img/switch_off.png')
        }
    }
    _onSwitchPress() {
        if (this.props.disabled) {
            return;
        }

        this.props.onValueChange(!this.props.value);
    }
}


const styles = StyleSheet.create({
    switch: {
        marginRight: 14,
        width: 42,
        height: 24,
    },
});

SwitchCommon.PropTypes = {
    disabled: PropTypes.bool,
    value: PropTypes.bool,
    onValueChange: PropTypes.func
};