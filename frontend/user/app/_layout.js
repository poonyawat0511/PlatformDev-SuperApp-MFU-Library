"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Root;
var ctx_1 = require("@/contexts/ctx");
var tamagui_config_1 = __importDefault(require("@/tamagui.config"));
var native_1 = require("@react-navigation/native");
var expo_router_1 = require("expo-router");
var react_native_1 = require("react-native");
var tamagui_1 = require("tamagui");
function Root() {
    var colorScheme = (0, react_native_1.useColorScheme)();
    // Set up the auth context and render our layout inside of it.
    return (React.createElement(tamagui_1.TamaguiProvider, { config: tamagui_config_1.default, defaultTheme: colorScheme },
        React.createElement(native_1.ThemeProvider, { value: colorScheme === 'dark' ? native_1.DarkTheme : native_1.DefaultTheme },
            React.createElement(ctx_1.SessionProvider, null,
                React.createElement(expo_router_1.Slot, null)))));
}
