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
exports.CoverageService = void 0;
const vscode_1 = require("vscode");
const coverageparser_1 = require("../files/coverageparser");
const filesloader_1 = require("../files/filesloader");
const renderer_1 = require("./renderer");
const sectionfinder_1 = require("./sectionfinder");
var Status;
(function (Status) {
    Status["ready"] = "READY";
    Status["initializing"] = "INITIALIZING";
    Status["loading"] = "LOADING";
    Status["rendering"] = "RENDERING";
    Status["error"] = "ERROR";
})(Status || (Status = {}));
class CoverageService {
    constructor(configStore, outputChannel, statusBar) {
        this.configStore = configStore;
        this.outputChannel = outputChannel;
        this.updateServiceState(Status.initializing);
        this.cache = new Map();
        this.filesLoader = new filesloader_1.FilesLoader(configStore);
        this.sectionFinder = new sectionfinder_1.SectionFinder(configStore, this.outputChannel);
        this.renderer = new renderer_1.Renderer(configStore, this.sectionFinder);
        this.coverageParser = new coverageparser_1.CoverageParser(this.outputChannel);
        this.statusBar = statusBar;
    }
    dispose() {
        if (this.coverageWatcher) {
            this.coverageWatcher.dispose();
        }
        if (this.editorWatcher) {
            this.editorWatcher.dispose();
        }
        this.cache = new Map(); // reset cache to empty
        this.renderer.renderCoverage(this.cache, vscode_1.window.visibleTextEditors);
    }
    displayForFile() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.loadCacheAndProcess();
        });
    }
    watchWorkspace() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.displayForFile();
            this.listenToFileSystem();
            this.listenToEditorEvents();
        });
    }
    removeCoverageForCurrentEditor() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.statusBar.setLoading(true);
                this.renderer.renderCoverage(new Map(), vscode_1.window.visibleTextEditors);
            }
            finally {
                this.statusBar.setLoading(false);
            }
        });
    }
    loadCache() {
        return __awaiter(this, void 0, void 0, function* () {
            this.updateServiceState(Status.loading);
            const files = yield this.filesLoader.findCoverageFiles();
            this.outputChannel.appendLine(`[${Date.now()}][coverageservice]: Loading ${files.size} file(s)`);
            this.outputChannel.appendLine(`[${Date.now()}][coverageservice]: ${Array.from(files.values())}`);
            const dataFiles = yield this.filesLoader.loadDataFiles(files);
            this.outputChannel.appendLine(`[${Date.now()}][coverageservice]: Loaded ${dataFiles.size} data file(s)`);
            const dataCoverage = yield this.coverageParser.filesToSections(dataFiles);
            this.outputChannel.appendLine(`[${Date.now()}][coverageservice]: Caching ${dataCoverage.size} coverage(s)`);
            this.cache = dataCoverage;
            this.updateServiceState(Status.ready);
        });
    }
    updateServiceState(state) {
        this.outputChannel.appendLine(`[${Date.now()}][coverageservice]: ${state}`);
    }
    loadCacheAndProcess() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                this.statusBar.setLoading(true);
                yield this.loadCache();
                this.updateServiceState(Status.rendering);
                this.renderer.renderCoverage(this.cache, vscode_1.window.visibleTextEditors);
                this.setStatusBarCoverage(this.cache, vscode_1.window.activeTextEditor);
                this.updateServiceState(Status.ready);
            }
            finally {
                this.statusBar.setLoading(false);
            }
        });
    }
    listenToFileSystem() {
        let blobPattern;
        // Monitor only manual coverage files if the user has defined them
        if (this.configStore.manualCoverageFilePaths.length) {
            // Paths outside of workspace folders will not be watchable,
            // but those that are inside workspace will still work as expected
            blobPattern = `{${this.configStore.manualCoverageFilePaths}}`;
        }
        else {
            const fileNames = this.configStore.coverageFileNames.toString();
            let baseDir = this.configStore.coverageBaseDir;
            if (vscode_1.workspace.workspaceFolders) {
                // Prepend workspace folders glob to the folder lookup glob
                // This allows watching within all the workspace folders
                const workspaceFolders = vscode_1.workspace.workspaceFolders.map((wf) => wf.uri.fsPath);
                baseDir = `{${workspaceFolders}}/${baseDir}`;
            }
            // Creates a BlobPattern for all coverage files.
            // EX: `{/path/to/workspace1, /path/to/workspace2}/**/{cov.xml, lcov.info}`
            blobPattern = `${baseDir}/{${fileNames}}`;
        }
        const outputMessage = `[${Date.now()}][coverageservice]: Listening to file system at ${blobPattern}`;
        this.outputChannel.appendLine(outputMessage);
        this.coverageWatcher = vscode_1.workspace.createFileSystemWatcher(blobPattern);
        this.coverageWatcher.onDidChange(this.loadCacheAndProcess.bind(this));
        this.coverageWatcher.onDidCreate(this.loadCacheAndProcess.bind(this));
        this.coverageWatcher.onDidDelete(this.loadCacheAndProcess.bind(this));
    }
    setStatusBarCoverage(sections, textEditor) {
        var _a, _b;
        try {
            if (!textEditor) {
                return this.statusBar.setCoverage(undefined);
            }
            const [fileCoverage] = this.sectionFinder.findSectionsForEditor(textEditor, sections);
            const covered = (_a = fileCoverage === null || fileCoverage === void 0 ? void 0 : fileCoverage.lines) === null || _a === void 0 ? void 0 : _a.hit;
            const total = (_b = fileCoverage === null || fileCoverage === void 0 ? void 0 : fileCoverage.lines) === null || _b === void 0 ? void 0 : _b.found;
            return this.statusBar.setCoverage(Math.round((covered / total) * 100));
        }
        catch (_c) {
            return this.statusBar.setCoverage(undefined);
        }
    }
    handleEditorEvents() {
        try {
            this.updateServiceState(Status.rendering);
            this.statusBar.setLoading(true);
            this.renderer.renderCoverage(this.cache, vscode_1.window.visibleTextEditors || []);
            this.setStatusBarCoverage(this.cache, vscode_1.window.activeTextEditor);
            this.updateServiceState(Status.ready);
        }
        finally {
            this.statusBar.setLoading(false);
        }
    }
    listenToEditorEvents() {
        this.editorWatcher = vscode_1.window.onDidChangeActiveTextEditor(this.handleEditorEvents.bind(this));
    }
}
exports.CoverageService = CoverageService;
//# sourceMappingURL=coverageservice.js.map