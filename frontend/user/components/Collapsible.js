"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Collapsible = Collapsible;
var Ionicons_1 = __importDefault(require("@expo/vector-icons/Ionicons"));
var react_1 = require("react");
var react_native_1 = require("react-native");
var ThemedText_1 = require("@/components/ThemedText");
var ThemedView_1 = require("@/components/ThemedView");
var Colors_1 = require("@/constants/Colors");
function Collapsible(_a) {
    var _b;
    var children = _a.children, title = _a.title;
    var _c = (0, react_1.useState)(false), isOpen = _c[0], setIsOpen = _c[1];
    var theme = (_b = (0, react_native_1.useColorScheme)()) !== null && _b !== void 0 ? _b : 'light';
    return (React.createElement(ThemedView_1.ThemedView, null,
        React.createElement(react_native_1.TouchableOpacity, { style: styles.heading, onPress: function () { return setIsOpen(function (value) { return !value; }); }, activeOpacity: 0.8 },
            React.createElement(Ionicons_1.default, { name: isOpen ? 'chevron-down' : 'chevron-forward-outline', size: 18, color: theme === 'light' ? Colors_1.Colors.light.icon : Colors_1.Colors.dark.icon }),
            React.createElement(ThemedText_1.ThemedText, { type: "defaultSemiBold" }, title)),
        isOpen && React.createElement(ThemedView_1.ThemedView, { style: styles.content }, children)));
}
var styles = react_native_1.StyleSheet.create({
    heading: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    content: {
        marginTop: 6,
        marginLeft: 24,
    },
});
