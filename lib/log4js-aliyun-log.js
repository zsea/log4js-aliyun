"use strict";
var os = require('os'),
    ALY = require('aliyun-sdk');

var _projectName;
var _logStoreName;
var _sls;
var _topic;

var logError = false;
function slsAppender(config, layout,layouts) {

    if (!config.aliyunKey || !config.aliyunSecret || !config.endpoint || !config.slsProject || !config.logStoreName) {
        console.error("aliyun sls config is not ok.");
        return null;
    }
    _topic = config.topic || "";
    logError = !!config.logError;
    layout = layout || layouts.colouredLayout;
    if (!_sls) {
        _projectName = config.slsProject;
        _logStoreName = config.logStoreName;
        _sls = initSls(config.aliyunKey, config.aliyunSecret, config.endpoint);
    }
    return function (loggingEvent) {
        sendLog(_logStoreName, _topic, layout(loggingEvent));
    };
}

function initSls(aliyunKey, aliyunSecret, endpoint) {
    var sls = new ALY.SLS({
        accessKeyId: aliyunKey,
        secretAccessKey: aliyunSecret,
        endpoint: endpoint,
        apiVersion: '2015-06-01'
    });
    return sls;
}

function sendLog(logStoreName, topic, msg) {
    if (!_sls) {
        console.log("sls is null");
        return;
    }
    var msgData = makeSlsData(topic, msg);
    _sls.putLogs({
        projectName: _projectName,
        logStoreName: logStoreName,
        logGroup: {
            logs: msgData,
            topic: topic,
            source: os.hostname()
        }
    }, function (err, data) {
        if (err) {
            if (logError) {
                console.log('error:', err);
            }
            return;
        }

        //console.log('success:', data);
    });
}

function makeSlsData(topic, msg) {
    var contents = [];
    if (msg) {
        var msgs = msg.split('\n');
        if (msgs.length > 0) {
            for (var i = 0; i < msgs.length; i += 2) {
                contents.push({key: msgs[i], value: msgs[i + 1]});
            }
        }
    }

    if (contents.length == 0) {
        contents.push({key: topic, value: msg});
    }

    var result = [{
        time: Math.floor(new Date().getTime() / 1000),
        contents: contents
    }];
    return result;
}


function configure(config,layouts) {
    var layout;
    if (config.layout) {
        layout = layouts.layout(config.layout.type, config.layout);
    }
    return slsAppender(config, layout,layouts);
}

exports.appender = slsAppender;
exports.configure = configure;