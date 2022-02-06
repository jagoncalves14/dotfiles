"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
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
exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const coverage_1 = require("./coverage-system/coverage");
const config_1 = require("./extension/config");
const gutters_1 = require("./extension/gutters");
const statusbartoggler_1 = require("./extension/statusbartoggler");
function activate(context) {
    const outputChannel = vscode.window.createOutputChannel("coverage-gutters");
    const configStore = new config_1.Config(context);
    const statusBarToggler = new statusbartoggler_1.StatusBarToggler(configStore);
    const coverage = new coverage_1.Coverage(configStore);
    const gutters = new gutters_1.Gutters(configStore, coverage, outputChannel, statusBarToggler);
    const previewCoverageReport = vscode.commands.registerCommand("coverage-gutters.previewCoverageReport", gutters.previewCoverageReport.bind(gutters));
    const display = vscode.commands.registerCommand("coverage-gutters.displayCoverage", gutters.displayCoverageForActiveFile.bind(gutters));
    const watch = vscode.commands.registerCommand("coverage-gutters.watchCoverageAndVisibleEditors", gutters.watchCoverageAndVisibleEditors.bind(gutters));
    const removeWatch = vscode.commands.registerCommand("coverage-gutters.removeWatch", gutters.removeWatch.bind(gutters));
    const remove = vscode.commands.registerCommand("coverage-gutters.removeCoverage", gutters.removeCoverageForActiveFile.bind(gutters));
    context.subscriptions.push(previewCoverageReport);
    context.subscriptions.push(remove);
    context.subscriptions.push(display);
    context.subscriptions.push(watch);
    context.subscriptions.push(removeWatch);
    context.subscriptions.push(gutters);
    context.subscriptions.push(outputChannel);
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map