"use strict";
/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.useThemeColor = useThemeColor;
var react_native_1 = require("react-native");
var Colors_1 = require("@/constants/Colors");
function useThemeColor(props, colorName) {
    var _a;
    var theme = (_a = (0, react_native_1.useColorScheme)()) !== null && _a !== void 0 ? _a : 'light';
    var colorFromProps = props[theme];
    if (colorFromProps) {
        return colorFromProps;
    }
    else {
        return Colors_1.Colors[theme][colorName];
    }
}
