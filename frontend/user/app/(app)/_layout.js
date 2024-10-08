"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = AppLayout;
var react_native_1 = require("react-native");
var expo_router_1 = require("expo-router");
var ctx_1 = require("@/contexts/ctx");
function AppLayout() {
    var _a = (0, ctx_1.useSession)(), session = _a.session, isLoading = _a.isLoading;
    // You can keep the splash screen open, or render a loading screen like we do here.
    if (isLoading) {
        return React.createElement(react_native_1.Text, null, "Loading...");
    }
    // Only require authentication within the (app) group's layout as users
    // need to be able to access the (auth) group and sign in again.
    if (!session) {
        // On web, static rendering will stop here as the user is not authenticated
        // in the headless Node process that the pages are rendered in.
        return React.createElement(expo_router_1.Redirect, { href: "/login" });
    }
    // This layout can be deferred because it's not the root layout.
    return React.createElement(expo_router_1.Stack, null);
}
