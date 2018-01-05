# log4js-aliyun

修改自log4js-aliyun-log，适配log4js 2.0以上

# 安装

    npm install log4js-aliyun --save

# 配置

```javascript

{
      "type": "log4js-aliyun-log",
      "layout": {
        "type": "pattern",
        "pattern": "%p %c %m"
      },
      "aliyunKey":"aliyunKey",
      "aliyunSecret":"aliyunSecrect",
      "endpoint":"http://cn-hangzhou.sls.aliyuncs.com",
      "slsProject":"porjectname",
      "logStoreName":"logStoreName",
      "topic":"",
      "category": "test"
}

```

更多配置请参考[aliyun sdk's js](https://github.com/aliyun-UED/aliyun-sdk-js).

# 示例

```javascript
var log4js=require('log4js');
var cfg={
    appenders:{
      "type": "log4js-aliyun-log",
      "layout": {
        "type": "pattern",
        "pattern": "%p %c %m"
      },
      "aliyunKey":"aliyunKey",
      "aliyunSecret":"aliyunSecrect",
      "endpoint":"http://cn-hangzhou.sls.aliyuncs.com",
      "slsProject":"porjectname",
      "logStoreName":"logStoreName",
      "topic":"",
      "category": "test"
    }
}
log4js.configure({
    appenders: { console: { type: 'console' }, sls: cfg.appenders },
    categories: { default: { appenders: ['console', 'sls'], level: "TRACE" }}
});
```
