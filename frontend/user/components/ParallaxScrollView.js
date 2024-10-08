"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = ParallaxScrollView;
var react_native_1 = require("react-native");
var react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
var ThemedView_1 = require("@/components/ThemedView");
var HEADER_HEIGHT = 250;
function ParallaxScrollView(_a) {
    var _b;
    var children = _a.children, headerImage = _a.headerImage, headerBackgroundColor = _a.headerBackgroundColor;
    var colorScheme = (_b = (0, react_native_1.useColorScheme)()) !== null && _b !== void 0 ? _b : 'light';
    var scrollRef = (0, react_native_reanimated_1.useAnimatedRef)();
    var scrollOffset = (0, react_native_reanimated_1.useScrollViewOffset)(scrollRef);
    var headerAnimatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () {
        return {
            transform: [
                {
                    translateY: (0, react_native_reanimated_1.interpolate)(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [-HEADER_HEIGHT / 2, 0, HEADER_HEIGHT * 0.75]),
                },
                {
                    scale: (0, react_native_reanimated_1.interpolate)(scrollOffset.value, [-HEADER_HEIGHT, 0, HEADER_HEIGHT], [2, 1, 1]),
                },
            ],
        };
    });
    return (React.createElement(ThemedView_1.ThemedView, { style: styles.container },
        React.createElement(react_native_reanimated_1.default.ScrollView, { ref: scrollRef, scrollEventThrottle: 16 },
            React.createElement(react_native_reanimated_1.default.View, { style: [
                    styles.header,
                    { backgroundColor: headerBackgroundColor[colorScheme] },
                    headerAnimatedStyle,
                ] }, headerImage),
            React.createElement(ThemedView_1.ThemedView, { style: styles.content }, children))));
}
var styles = react_native_1.StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        height: 250,
        overflow: 'hidden',
    },
    content: {
        flex: 1,
        padding: 32,
        gap: 16,
        overflow: 'hidden',
    },
});
