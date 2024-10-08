"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Index;
var ctx_1 = require("@/contexts/ctx");
var react_native_1 = require("react-native");
function Index() {
    var signOut = (0, ctx_1.useSession)().signOut;
    return (React.createElement(react_native_1.View, { style: { flex: 1, justifyContent: 'center', alignItems: 'center' } },
        React.createElement(react_native_1.Text, { onPress: function () {
                // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
                signOut();
            } }, "Sign Out")));
}
