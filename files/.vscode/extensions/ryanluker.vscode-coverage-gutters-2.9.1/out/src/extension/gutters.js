"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gutters = void 0;
const vscode_1 = require("vscode");
const coverageservice_1 = require("../coverage-system/coverageservice");
const webview_1 = require("./webview");
class Gutters {
    constructor(configStore, coverage, outputChannel, statusBar) {
        this.coverage = coverage;
        this.outputChannel = outputChannel;
        this.statusBar = statusBar;
        this.coverageService = new coverageservice_1.CoverageService(configStore, this.outputChannel, statusBar);
    }
    previewCoverageReport() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const coverageReports = yield this.coverage.findReports();
                const pickedReport = yield this.coverage.pickFile(coverageReports, "Choose a Coverage Report to preview.");
                if (!pickedReport) {
                    vscode_1.window.showWarningMessage("Could not show Coverage Report file!");
                    return;
                }
                const previewPanel = new webview_1.PreviewPanel(pickedReport);
                yield previewPanel.createWebView();
            }
            catch (error) {
                this.handleError("previewCoverageReport", error);
            }
        });
    }
    displayCoverageForActiveFile() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.coverageService.displayForFile();
            }
            catch (error) {
                this.handleError("displayCoverageForActiveFile", error);
            }
        });
    }
    watchCoverageAndVisibleEditors() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.statusBar.toggle(true);
                yield this.coverageService.watchWorkspace();
            }
            catch (error) {
                this.handleError("watchCoverageAndVisibleEditors", error);
            }
        });
    }
    removeWatch() {
        try {
            this.coverageService.removeCoverageForCurrentEditor();
            this.statusBar.toggle(false);
            this.coverageService.dispose();
        }
        catch (error) {
            this.handleError("removeWatch", error);
        }
    }
    removeCoverageForActiveFile() {
        try {
            this.coverageService.removeCoverageForCurrentEditor();
        }
        catch (error) {
            this.handleError("removeCoverageForActiveFile", error);
        }
    }
    dispose() {
        try {
            this.coverageService.dispose();
            this.statusBar.dispose();
        }
        catch (error) {
            this.handleError("dispose", error);
        }
    }
    handleError(area, error) {
        const message = error.message ? error.message : error;
        const stackTrace = error.stack;
        this.outputChannel.appendLine(`[${Date.now()}][${area}]: ${message}`);
        this.outputChannel.appendLine(`[${Date.now()}][${area}]: ${stackTrace}`);
    }
}
exports.Gutters = Gutters;
//# sourceMappingURL=gutters.js.map