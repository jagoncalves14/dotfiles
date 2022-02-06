"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
const vscode_1 = require("vscode");
class Config {
    constructor(context) {
        this.context = context;
        this.setup();
        // Reload the cached values if the configuration changes
        vscode_1.workspace.onDidChangeConfiguration(this.setup.bind(this));
    }
    setup() {
        const rootCustomConfig = vscode_1.workspace.getConfiguration("coverage-gutters.customizable");
        // Customizable UI configurations
        const configsCustom = Object.keys(rootCustomConfig);
        for (const element of configsCustom) {
            vscode_1.commands.executeCommand("setContext", "config.coverage-gutters.customizable." + element, rootCustomConfig.get(element));
        }
        const rootConfig = vscode_1.workspace.getConfiguration("coverage-gutters");
        // Basic configurations
        this.reportFileName = rootConfig.get("coverageReportFileName");
        this.coverageBaseDir = rootConfig.get("coverageBaseDir");
        this.coverageFileNames = rootConfig.get("coverageFileNames");
        this.coverageFileNames = this.coverageFileNames.filter((name) => !!name.trim());
        // Make fileNames unique
        this.coverageFileNames = [...new Set(this.coverageFileNames)];
        // Load ignored paths
        this.ignoredPathGlobs = rootConfig.get("ignoredPathGlobs");
        const STATUS_BAR_TOGGLER = "status-bar-toggler-watchCoverageAndVisibleEditors-enabled";
        this.showStatusBarToggler = rootCustomConfig.get(STATUS_BAR_TOGGLER);
        // Themes and icons
        const coverageLightBackgroundColour = rootConfig.get("highlightlight");
        const coverageDarkBackgroundColour = rootConfig.get("highlightdark");
        const partialCoverageLightBackgroundColour = rootConfig.get("partialHighlightLight");
        const partialCoverageDarkBackgroundColour = rootConfig.get("partialHighlightDark");
        const noCoverageLightBackgroundColour = rootConfig.get("noHighlightLight");
        const noCoverageDarkBackgroundColour = rootConfig.get("noHighlightDark");
        const showGutterCoverage = rootConfig.get("showGutterCoverage");
        const showLineCoverage = rootConfig.get("showLineCoverage");
        const showRulerCoverage = rootConfig.get("showRulerCoverage");
        const defaultIcons = {
            gutterIconPathDark: "./app_images/gutter-icon-dark.svg",
            gutterIconPathLight: "./app_images/gutter-icon-light.svg",
            noGutterIconPathDark: "./app_images/no-gutter-icon-dark.svg",
            noGutterIconPathLight: "./app_images/no-gutter-icon-light.svg",
            partialGutterIconPathDark: "./app_images/partial-gutter-icon-dark.svg",
            partialGutterIconPathLight: "./app_images/partial-gutter-icon-light.svg",
        };
        const getIcon = (name) => rootConfig.get(name) ||
            this.context.asAbsolutePath(defaultIcons[name]);
        // Setup info for decorations
        const fullDecoration = {
            dark: {
                backgroundColor: showLineCoverage ? coverageDarkBackgroundColour : "",
                gutterIconPath: showGutterCoverage ? getIcon("gutterIconPathDark") : "",
                overviewRulerColor: showRulerCoverage ? coverageDarkBackgroundColour : "",
            },
            isWholeLine: true,
            light: {
                backgroundColor: showLineCoverage ? coverageLightBackgroundColour : "",
                gutterIconPath: showGutterCoverage ? getIcon("gutterIconPathLight") : "",
                overviewRulerColor: showRulerCoverage ? coverageLightBackgroundColour : "",
            },
            overviewRulerLane: vscode_1.OverviewRulerLane.Full,
        };
        const partialDecoration = {
            dark: {
                backgroundColor: showLineCoverage ? partialCoverageDarkBackgroundColour : "",
                gutterIconPath: showGutterCoverage ? getIcon("partialGutterIconPathDark") : "",
                overviewRulerColor: showRulerCoverage ? partialCoverageDarkBackgroundColour : "",
            },
            isWholeLine: true,
            light: {
                backgroundColor: showLineCoverage ? partialCoverageLightBackgroundColour : "",
                gutterIconPath: showGutterCoverage ? getIcon("partialGutterIconPathLight") : "",
                overviewRulerColor: showRulerCoverage ? partialCoverageLightBackgroundColour : "",
            },
            overviewRulerLane: vscode_1.OverviewRulerLane.Full,
        };
        const noDecoration = {
            dark: {
                backgroundColor: showLineCoverage ? noCoverageDarkBackgroundColour : "",
                gutterIconPath: showGutterCoverage ? getIcon("noGutterIconPathDark") : "",
                overviewRulerColor: showRulerCoverage ? noCoverageDarkBackgroundColour : "",
            },
            isWholeLine: true,
            light: {
                backgroundColor: showLineCoverage ? noCoverageLightBackgroundColour : "",
                gutterIconPath: showGutterCoverage ? getIcon("noGutterIconPathLight") : "",
                overviewRulerColor: showRulerCoverage ? noCoverageLightBackgroundColour : "",
            },
            overviewRulerLane: vscode_1.OverviewRulerLane.Full,
        };
        this.cleanupEmptyGutterIcons(fullDecoration, partialDecoration, noDecoration);
        // Generate decorations
        this.noCoverageDecorationType = vscode_1.window.createTextEditorDecorationType(noDecoration);
        this.partialCoverageDecorationType = vscode_1.window.createTextEditorDecorationType(partialDecoration);
        this.fullCoverageDecorationType = vscode_1.window.createTextEditorDecorationType(fullDecoration);
        // Assign the key and resolved fragment
        this.remotePathResolve = rootConfig.get("remotePathResolve");
        // Add the manual coverage file path(s) if present
        this.manualCoverageFilePaths = rootConfig.get("manualCoverageFilePaths");
    }
    /**
     * removes empty gutter icons to allow for break point usage
     * @param full
     * @param partial
     * @param no
     */
    cleanupEmptyGutterIcons(full, partial, no) {
        if (full && full.dark && !full.dark.gutterIconPath) {
            delete full.dark.gutterIconPath;
        }
        if (full && full.light && !full.light.gutterIconPath) {
            delete full.light.gutterIconPath;
        }
        if (partial && partial.dark && !partial.dark.gutterIconPath) {
            delete partial.dark.gutterIconPath;
        }
        if (partial && partial.light && !partial.light.gutterIconPath) {
            delete partial.light.gutterIconPath;
        }
        if (no && no.dark && !no.dark.gutterIconPath) {
            delete no.dark.gutterIconPath;
        }
        if (no && no.light && !no.light.gutterIconPath) {
            delete no.light.gutterIconPath;
        }
    }
}
exports.Config = Config;
//# sourceMappingURL=config.js.map