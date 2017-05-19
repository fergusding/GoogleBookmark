/**
 * Created by prototype on 16-11-18.
 */
import React from "react";
import {Text, View, StyleSheet, Dimensions, ART, Platform} from "react-native";

const {Surface, Shape, Path} = ART;
import { ScreenWidth } from '../common/constant';

export default class DashLine extends React.Component {
    render() {
        const dashLine = Platform.select({
            ios: () => this.renderForIOS(),
            android: () => this.renderForAndroid(),
        })();
        return dashLine;
    }
    renderForIOS() {
        const path = Path()
            .moveTo(1,1)
            .lineTo(ScreenWidth,1);
        return (
                <Surface width={ScreenWidth} height={2} style = {this.props.style}>
                    <Shape d={path} stroke="#c69a39" strokeWidth={0.5} strokeDash={[6,3]}/>
                </Surface>
            );
    }
    renderForAndroid() {
        var len = Math.ceil(ScreenWidth / 4);
        var arr = [];
        for (let i = 0; i < len; i++) {
            arr.push(i);
        }

        return (
            <View style={[styles.dashLine, this.props.style]}>
                {
                    arr.map((item, index)=> {
                        return <Text style={styles.dashItem} key={'dash' + index}> </Text>
                    })
                }
            </View>);
    }
}

var styles = StyleSheet.create({
    dashLine: {
        flexDirection: 'row',
    },
    dashItem: {
        height: 1,
        width: 2,
        marginRight: 2,
        flex: 1,
        backgroundColor: '#e8d2a2',
    }
})
