"use strict";

function SmartEventBus() {
    this.handlers = {};
}

SmartEventBus.prototype.subscribe = function (message, callback) {
    if (!message) {
        throw "Message is null or empty or not defined.";
    }

    if (!callback) {
        throw "Callback is null or empty or not defined.";
    }

    this.handlers[message] = this.handlers[message] || [];
    this.handlers[message].push(callback);
};

SmartEventBus.prototype.publish = function (message, data) {
    if (!message) {
        throw "Message is null or empty or not defined.";
    }

    // Data and rest arguments could be empty

    var callbacks = this.handlers[message];

    if (callbacks && callbacks.length) {
        var args = Array.from(arguments).slice(1);

        callbacks.forEach(function (c) {
            c.apply(null, args);
        });
    }
};

// Register subscribers and publishers for object methods.
// Each method started with on<MessageName> will be registered as subscriber for MessageName.
// Each method started with publish<MessageName> will be replaced with method which publishes MessageName on call.
SmartEventBus.prototype.fulfill = function (object) {
    if (object === null || object === undefined) {
        throw "Object is null or undefined.";
    }

    Object.keys(object)
        .filter(prop => prop.startsWith("on") || prop.startsWith("publish"))
        .forEach(prop => {
            if (prop.startsWith("on")) {
                const messageName = prop.substring(2);
                this.subscribe(messageName, data => {
                    object[prop].call(object, data);
                });
            }

            if (prop.startsWith("publish")) {
                const messageName = prop.substring(7);
                object[prop] = (data) => {
                    this.publish(messageName, data);
                };
            }
        });
};

module.exports = SmartEventBus;