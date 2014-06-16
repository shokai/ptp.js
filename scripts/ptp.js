/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define */

define([
    './data-factory', './main-loop', './connection', './command',
    './set-device-property', './get-device-property', './connection-settings',
    './capture', './logger', './util'
], function (dataFactory, mainLoop, connection,
             command, setDeviceProperty, getDeviceProperty,
             connectionSettings, capture, logger, util) {
    'use strict';

    return Object.create(null, {
        connect: {value: connection.connect},
        capture: {value: capture},
        onNoConnection: {set: function (x) {
            connection.onNoConnection = x;
        }},
        onError: {set: function (x) {
            connection.onError = x;
        }},
        onConnected: {set: function (x) {
            connection.onConnected = x;
        }},
        ip: {set: function (x) {
            connectionSettings.ip = x;
        }},
        port: {set: function (x) {
            connectionSettings.port = x;
        }},
        clientGuid: {set: function (x) {
            mainLoop.clientGuid = x;
        }},
        clientName: {set: function (x) {
            mainLoop.clientName = x;
        }},
        devicePropCodes: {get: function () {
            return command.devicePropCodes;
        }},
        setDeviceProperty: {value: setDeviceProperty},
        getDeviceProperty: {value: getDeviceProperty},
        dataFactory: {get: function () {
            return dataFactory;
        }},
        loggerOutputIsEnabled: {
            set: function (x) {
                logger.outputIsEnabled = x;
            },
            get: function () {
                return logger.outputIsEnabled;
            }
        },
        dateTimeString: {value: util.dateTimeString}
    });
});
