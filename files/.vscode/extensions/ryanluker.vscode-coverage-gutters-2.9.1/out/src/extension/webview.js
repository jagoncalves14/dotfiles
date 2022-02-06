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
exports.PreviewPanel = void 0;
const vscode_1 = require("vscode");
class PreviewPanel {
    constructor(pickedReport) {
        this.pickedReport = pickedReport;
    }
    createWebView() {
        return __awaiter(this, void 0, void 0, function* () {
            // Read in the report html and send it to the webview
            const reportUri = vscode_1.Uri.file(this.pickedReport);
            const reportHtml = yield vscode_1.workspace.openTextDocument(reportUri);
            const reportHtmlWithPolicy = this.addContentSecurityPolicy(reportHtml.getText());
            // Construct the webview panel for the coverage report to live in
            this.previewPanel = vscode_1.window.createWebviewPanel("coverageReportPreview", "Preview Coverage Report", vscode_1.ViewColumn.One);
            this.previewPanel.webview.html = reportHtmlWithPolicy;
        });
    }
    dispose() {
        this.previewPanel.dispose();
    }
    addContentSecurityPolicy(text) {
        const securityPolicyHeader = `<meta http-equiv="Content-Security-Policy" content="default-src 'none';">\n`;
        let tag = text.indexOf("<meta");
        if (tag < 0) {
            tag = text.indexOf("</head");
        }
        const newText = `${text.substring(0, tag)}${securityPolicyHeader}${text.substring(tag)}`;
        return newText;
    }
}
exports.PreviewPanel = PreviewPanel;
//# sourceMappingURL=webview.js.map