/**
 * electangular.js
 * AngularJS Module for Atom Electron
 * (c) 2016-2019 develephant @develephant
 * license MIT
 * version 1.0.0
 */
'use strict';

angular.module('electangular', [])

    .run(['$rootScope', 'electron', function ($rootScope, ele) {
        ele.ipcRenderer.on('electron-msg', (event, arg) => {
            $rootScope.$emit('electron-msg', arg);
        });
    }])

    .value("electron_core", require('electron'))

    .service("ipc", ['electron_core', function (ele) {
        const ipcRenderer = ele.ipcRenderer;
        return {
            send: function (msg) {
                ipcRenderer.send('electron-msg', msg);
            },
            sendToHost: function (msg) {
                ipcRenderer.sendToHost('electron-msg', msg);
            }
        }
    }])

    .service("electron", ['$q', 'electron_core', function ($q, core) {
        const remote = core.remote;
        const version = parseInt(process.versions.electron.split('.', 1)[0], 10);
        return {
            Accelerator: remote.Accelerator,
            app: remote.app,
            autoUpdater: remote.autoUpdater,
            BrowserWindow: remote.BrowserWindow,
            contentTracing: remote.contentTracing, //TODO Promise
            dialog: {
                showErrorBox: remote.dialog.showErrorBox,
                showOpenDialog: function (bw, options) {
                    if (!options) {
                        options = bw;
                        bw = remote.BrowserWindow.getFocusedWindow();
                    }
                    let deferred = $q.defer();
                    remote.dialog.showOpenDialog(bw, options, (result) => {
                        if (!result) {
                            deferred.reject();
                        } else {
                            deferred.resolve(result);
                        }
                    });
                    return deferred.promise;
                },
                showSaveDialog: function (bw, options) {
                    if (!options) {
                        options = bw;
                        bw = remote.BrowserWindow.getFocusedWindow();
                    }
                    let deferred = $q.defer();
                    remote.dialog.showSaveDialog(bw, options, (result) => {
                        if (!result) {
                            deferred.reject();
                        } else {
                            deferred.resolve(result);
                        }
                    });
                    return deferred.promise;
                },
                showMessageBox: function (bw, options) {
                    if (!options) {
                        options = bw;
                        bw = remote.BrowserWindow.getFocusedWindow();
                    }
                    let deferred = $q.defer();
                    remote.dialog.showMessageBox(bw, options, (result) => {
                        if (!result) {
                            deferred.reject();
                        } else {
                            deferred.resolve(result);
                        }
                    });
                    return deferred.promise;
                }
            },
            globalShortcut: remote.globalShortcut,
            Menu: remote.Menu,
            MenuItem: remote.MenuItem,
            powerMonitor: remote.powerMonitor,
            powerSaveBlocker: remote.powerSaveBlocker,
            protocol: remote.protocol,
            session: remote.session,
            systemPreferences: remote.systemPreferences,
            Tray: remote.Tray,
            desktopCapturer: core.desktopCapturer,
            webFrame: core.webFrame,
            clipboard: core.clipboard,
            crashReporter: core.crashReporter,
            nativeImage: core.nativeImage,
            process: core.process,
            screen: version < 5 ? core.screen : remote.screen,
            shell: core.shell,
            ipcRenderer: core.ipcRenderer
        }
    }]);