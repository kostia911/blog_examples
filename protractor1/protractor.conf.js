var reporters = require('jasmine-reporters'),
    specReporter = require('jasmine-spec-reporter'),
    fs = require('fs'),
    path = require('path'),
    BL = require('./dist/Helpers/Logs'),
    e2eResultFolder = 'out';

exports.config = {
    suites: {
        suite1: 'dist/Suites/MSHomePageTest.js'
    },
    exclude: [],
    framework: 'jasmine2',
    allScriptsTimeout: 110000,
    jasmineNodeOpts: {
        showTiming: true,
        showColors: true,
        isVerbose: true,
        includeStackTrace: true,
        //spec timeout = 3 min
        defaultTimeoutInterval: 180000
    },
    directConnect: true,
    capabilities: {
        'browserName': 'chrome',
        "chromeOptions": {
            binary: 'packages/SFT.Service.Merch.E2E.Chrome53.1.0.0/chrome.exe',
            args: ["--no-sandbox", '--disable-extensions']
        },

        // IMPORTANT!!! this setting let restart chrome on every suite(describe)
        'shardTestFiles': true,
        'maxInstances': 1
    },
    // Special option for Angular2, to test against all Angular2 applications
    // on the page. This means that Protractor will wait for every app to be
    // stable before each action, and search within all apps when finding
    // elements.
    //useAllAngular2AppRoots: true,
    params: {
        env: ''
    },

    onPrepare: function () {
        //add jasmine reporters
        var junitReporter = new reporters.JUnitXmlReporter({
            savePath: e2eResultFolder,
            consolidateAll: false
        });
        //this reporter for vso
        jasmine.getEnv().addReporter(junitReporter);
        //this is console reporter
        jasmine.getEnv().addReporter(new specReporter({ displayStacktrace: 'all' }));
        //this is for tracking spec's dependencies so we can check if particular spec is passed from another spec
        jasmine.getEnv().addReporter({
            specDone: function (result) {
                if (result.status == 'passed') {
                    util.Utils.Status[result.description] = true;
                }
            }
        });
        
        //clean, maximize and disable angular detecting feature for now
        browser.ignoreSynchronization = true;
        browser.driver.manage().window().maximize();
        browser.driver.manage().deleteAllCookies();

        //add logs
        var logs = BL.consoleLogs.log(browser);

        global.logs = logs;

        beforeEach(function () {
            logs.reset();
            logs.ignore('favicon.ico');
            logs.ignore('jquery');
            logs.ignore(logs.DEBUG);
            logs.ignore(logs.INFO);
        });

        // afterEach(function () {
        //     return logs.verify();
        // });
    }
};
