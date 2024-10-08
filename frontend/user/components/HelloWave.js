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
exports.HelloWave = HelloWave;
var react_native_1 = require("react-native");
var react_native_reanimated_1 = __importStar(require("react-native-reanimated"));
var ThemedText_1 = require("@/components/ThemedText");
function HelloWave() {
    var rotationAnimation = (0, react_native_reanimated_1.useSharedValue)(0);
    rotationAnimation.value = (0, react_native_reanimated_1.withRepeat)((0, react_native_reanimated_1.withSequence)((0, react_native_reanimated_1.withTiming)(25, { duration: 150 }), (0, react_native_reanimated_1.withTiming)(0, { duration: 150 })), 4 // Run the animation 4 times
    );
    var animatedStyle = (0, react_native_reanimated_1.useAnimatedStyle)(function () { return ({
        transform: [{ rotate: "".concat(rotationAnimation.value, "deg") }],
    }); });
    return (React.createElement(react_native_reanimated_1.default.View, { style: animatedStyle },
        React.createElement(ThemedText_1.ThemedText, { style: styles.text }, "\uD83D\uDC4B")));
}
var styles = react_native_1.StyleSheet.create({
    text: {
        fontSize: 28,
        lineHeight: 32,
        marginTop: -6,
    },
});
