'use strict';

import { ScreenWidth } from '../common/constant';

export function accMul(arg1, arg2) {
    var m = 0, s1 = String(arg1), s2 = String(arg2);
    try {
        m += s1.split(".")[1].length;
    }
    catch (e) {
    }
    try {
        m += s2.split(".")[1].length;
    }
    catch (e) {
    }

    // 处理相乘结果为NaN的情况
    var value = Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    if (isNaN(value)) {
      value = 0;
    }

    return value;
}

export function scaledLength(length) {
  return length / 375 * ScreenWidth;
}
