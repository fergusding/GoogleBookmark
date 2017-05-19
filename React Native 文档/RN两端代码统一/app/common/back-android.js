/**
 * Created by prototype on 16-11-4.
 * ReactNative　返回键处理
 */

import {NativeModules} = require('react-native');
var DeepLink = NativeModules.DeepLink;

export default function (navigator) {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
    }
    DeepLink.exitPage();
    return false;
}
