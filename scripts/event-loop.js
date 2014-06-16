/*jslint browser: true, maxerr: 50, maxlen: 80 */

/*global define, Uint8Array */

define([
    './packet', './loop-factory', './util'
], function (packet, loopFactory, util) {
    'use strict';

    var onInitialized = util.nop, sessionId, eventCodes,
        loop = loopFactory.create('event'),
        captureCompleteCallbacks = {}, // by transaction ID
        eventHandlers = {}; // by event code

    eventCodes = {
        objectAdded: 0x4002,
        captureComplete: 0x400D
    };

    eventHandlers[eventCodes.captureComplete] = function (content) {
        var transactionId = content.parameters[0],
            callback = captureCompleteCallbacks[transactionId];

        if (callback !== undefined) {
            callback();
            delete captureCompleteCallbacks[transactionId];
        }
    };

    Object.freeze(eventCodes);

    loop.onDataCallbacks[packet.types.initEventAck] = function () {
        onInitialized();
    };

    loop.onDataCallbacks[packet.types.event] = function (content) {
        var handler = eventHandlers[content.eventCode];

        if (handler !== undefined) {
            handler(content);
        }
    };

    loop.onSocketOpened = function () {
        if (sessionId !== undefined) {
            loop.scheduleSend(packet.createInitEventRequest(sessionId));
        }
    };

    return Object.create(null, {
        initialize: {value: loop.openSocket},
        onInitialized: {set: function (x) {
            onInitialized = x;
        }},
        onNoConnection: {set: function (x) {
            loop.onNoConnection = x;
        }},
        onError: {set: function (x) {
            loop.onError = x;
        }},
        scheduleSend: {value: loop.scheduleSend},
        sessionId: {set: function (x) {
            sessionId = x;
        }},
        eventCodes: {get: function () {
            return eventCodes;
        }},
        captureCompleteCallbacks: {get: function () {
            return captureCompleteCallbacks;
        }}
    });
});
