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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FilesLoader = void 0;
const fs_1 = require("fs");
const glob_1 = __importDefault(require("glob"));
const vscode_1 = require("vscode");
class FilesLoader {
    constructor(configStore) {
        this.configStore = configStore;
    }
    /**
     * Finds all coverages files by xml and lcov and returns them
     * Note: Includes developer override via "manualCoverageFilePaths"
     */
    findCoverageFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            // Developers can manually define their absolute coverage paths
            if (this.configStore.manualCoverageFilePaths.length) {
                return new Set(this.configStore.manualCoverageFilePaths);
            }
            else {
                const fileNames = this.configStore.coverageFileNames;
                const files = yield this.findCoverageInWorkspace(fileNames);
                if (!files.size) {
                    vscode_1.window.showWarningMessage("Could not find a Coverage file! Searched for " + fileNames.join(", "));
                    return new Set();
                }
                return files;
            }
        });
    }
    /**
     * Takes files and converts to data strings for coverage consumption
     * @param files files that are to turned into data strings
     */
    loadDataFiles(files) {
        return __awaiter(this, void 0, void 0, function* () {
            // Load the files and convert into data strings
            const dataFiles = new Map();
            for (const file of files) {
                dataFiles.set(file, yield this.load(file));
            }
            return dataFiles;
        });
    }
    load(path) {
        return new Promise((resolve, reject) => {
            fs_1.readFile(path, (err, data) => {
                if (err) {
                    return reject(err);
                }
                return resolve(data.toString());
            });
        });
    }
    findCoverageInWorkspace(fileNames) {
        return __awaiter(this, void 0, void 0, function* () {
            let files = new Set();
            for (const fileName of fileNames) {
                const coverage = yield this.findCoverageForFileName(fileName);
                files = new Set([...files, ...coverage]);
            }
            return files;
        });
    }
    findCoverageForFileName(fileName) {
        let actions = new Array();
        if (vscode_1.workspace.workspaceFolders) {
            actions = vscode_1.workspace.workspaceFolders.map((workspaceFolder) => {
                return this.globFind(workspaceFolder, fileName);
            });
        }
        return Promise.all(actions)
            .then((coverageInWorkspaceFolders) => {
            let totalCoverage = new Set();
            coverageInWorkspaceFolders.forEach((coverage) => {
                totalCoverage = new Set([...totalCoverage, ...coverage]);
            });
            return totalCoverage;
        });
    }
    globFind(workspaceFolder, fileName) {
        return new Promise((resolve) => {
            glob_1.default(`${this.configStore.coverageBaseDir}/${fileName}`, {
                cwd: workspaceFolder.uri.fsPath,
                dot: true,
                ignore: this.configStore.ignoredPathGlobs,
                realpath: true,
                strict: false,
            }, (err, files) => {
                if (!files || !files.length) {
                    // Show any errors if no file was found.
                    if (err) {
                        vscode_1.window.showWarningMessage(`An error occured while looking for the coverage file ${err}`);
                    }
                    return resolve(new Set());
                }
                const setFiles = new Set();
                files.forEach((file) => setFiles.add(file));
                return resolve(setFiles);
            });
        });
    }
}
exports.FilesLoader = FilesLoader;
//# sourceMappingURL=filesloader.js.map