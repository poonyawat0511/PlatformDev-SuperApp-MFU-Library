"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
// apiEndpoints.ts
var apiServiceTypes_1 = require("./apiServiceTypes");
var API_URLS = (_a = {},
    _a[apiServiceTypes_1.ApiService.AUTH] = process.env.API_URL_AUTH || "http://localhost:8080/auth",
    _a);
exports.default = API_URLS;
