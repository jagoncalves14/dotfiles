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
exports.Coverage = void 0;
const fs_1 = require("fs");
const glob_1 = __importDefault(require("glob"));
const path_1 = require("path");
const vscode_1 = require("vscode");
class Coverage {
    constructor(configStore) {
        this.configStore = configStore;
    }
    /**
     * Takes an array of file strings and a placeHolder message.
     * Displays the quick picker vscode modal and lets the user choose a file path
     * Note: if only one path is given it will return early and not prompt.
     */
    pickFile(filePaths, placeHolder) {
        return __awaiter(this, void 0, void 0, function* () {
            let pickedFile;
            if (typeof filePaths === "string") {
                pickedFile = filePaths;
            }
            else if (filePaths.length === 1) {
                pickedFile = filePaths[0];
            }
            else {
                const fileQuickPicks = filePaths.map((filePath) => {
                    return {
                        description: filePath,
                        label: path_1.basename(filePath),
                    };
                });
                const item = yield vscode_1.window.showQuickPick(fileQuickPicks, { placeHolder });
                if (!item) {
                    vscode_1.window.showWarningMessage("Did not choose a file!");
                    return;
                }
                pickedFile = item.description;
            }
            return pickedFile;
        });
    }
    findReports() {
        let actions = new Array();
        const workspaceFolders = vscode_1.workspace.workspaceFolders;
        if (workspaceFolders) {
            actions = workspaceFolders.map((workspaceFolder) => {
                return this.globFind(workspaceFolder, this.configStore.reportFileName);
            });
        }
        return Promise.all(actions)
            .then((coverageInWorkspaceFolders) => {
            // Spread first array to properly concat the file arrays from the globFind
            return new Array().concat(...coverageInWorkspaceFolders);
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
    globFind(workspaceFolder, fileName) {
        return new Promise((resolve) => {
            glob_1.default(`**/${fileName}`, {
                cwd: workspaceFolder.uri.fsPath,
                dot: true,
                ignore: this.configStore.ignoredPathGlobs,
                realpath: true,
            }, (_err, files) => {
                if (!files || !files.length) {
                    return resolve([]);
                }
                return resolve(files);
            });
        });
    }
}
exports.Coverage = Coverage;
//# sourceMappingURL=coverage.js.map