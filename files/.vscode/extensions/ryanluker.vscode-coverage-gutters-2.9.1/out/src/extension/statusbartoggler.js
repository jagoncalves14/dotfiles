"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StatusBarToggler = void 0;
const vscode_1 = require("vscode");
class StatusBarToggler {
    constructor(configStore) {
        this.statusBarItem = vscode_1.window.createStatusBarItem();
        this.statusBarItem.command = StatusBarToggler.watchCommand;
        this.statusBarItem.text = StatusBarToggler.watchText;
        this.statusBarItem.tooltip = StatusBarToggler.watchToolTip;
        this.configStore = configStore;
        this.isLoading = false;
        this.lineCoverage = undefined;
        if (this.configStore.showStatusBarToggler) {
            this.statusBarItem.show();
        }
    }
    get statusText() {
        return this.statusBarItem.text;
    }
    /**
     * Toggles the status bar item from watch to remove and vice versa
     */
    toggle(active) {
        this.isActive = active;
        this.update();
    }
    setLoading(loading = !this.isLoading) {
        this.isLoading = loading;
        this.update();
    }
    setCoverage(linePercentage) {
        if (Number.isFinite(linePercentage)) {
            this.lineCoverage = `${linePercentage}%`;
        }
        else {
            this.lineCoverage = undefined;
        }
        this.update();
    }
    /**
     * Cleans up the statusBarItem if asked to dispose
     */
    dispose() {
        this.statusBarItem.dispose();
    }
    getStatusBarText() {
        if (this.isLoading) {
            return StatusBarToggler.loadingText;
        }
        if (this.isActive) {
            return [StatusBarToggler.idleIcon, this.lineCoverage || "No", StatusBarToggler.coverageText].join(" ");
        }
        return StatusBarToggler.watchText;
    }
    /**
     * update
     * @description Updates the text and tooltip displayed by the StatusBarToggler
     */
    update() {
        this.statusBarItem.text = this.getStatusBarText();
        if (this.isActive) {
            this.statusBarItem.command = StatusBarToggler.removeCommand;
            this.statusBarItem.tooltip = StatusBarToggler.removeWatchToolTip;
        }
        else {
            this.statusBarItem.command = StatusBarToggler.watchCommand;
            this.statusBarItem.tooltip = StatusBarToggler.watchToolTip;
        }
    }
}
exports.StatusBarToggler = StatusBarToggler;
StatusBarToggler.coverageText = "Coverage";
StatusBarToggler.loadingText = ["$(loading~spin)", StatusBarToggler.coverageText].join(" ");
StatusBarToggler.idleIcon = "$(circle-large-outline)";
StatusBarToggler.watchCommand = "coverage-gutters.watchCoverageAndVisibleEditors";
StatusBarToggler.watchText = [StatusBarToggler.idleIcon, "Watch"].join(" ");
StatusBarToggler.watchToolTip = "Coverage Gutters: Click to watch workspace.";
StatusBarToggler.removeCommand = "coverage-gutters.removeWatch";
StatusBarToggler.removeWatchToolTip = "Coverage Gutters: Click to remove watch from workspace.";
//# sourceMappingURL=statusbartoggler.js.map