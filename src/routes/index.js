"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const role_route_1 = __importDefault(require("./role.route"));
function route(app) {
    app.use('/api/role', role_route_1.default);
}
exports.default = route;
