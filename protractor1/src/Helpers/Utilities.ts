
export module Utils {
     var webdriver = require('selenium-webdriver');

    const EC = protractor.ExpectedConditions;
    // Dictionary of test status: true if passed, undefined if not run or failed
    export var Status: { [test: string]: boolean } = {};

    // Helper method for checking dependencies - ensures a test has run and passed before it is used
    export function DependsOn(test: string): boolean {
        var fullName = test;
        if (!Status[fullName]) {
            console.log('Dependency missing: ' + fullName);
            fail('Dependency missing: ' + fullName);
            return false;
        } else {
            console.log('Checked dependency: ' + fullName);
            return true;
        }
    }

    export function CheckWait(condition: (dr) => webdriver.promise.Promise<boolean>,
        timeout?: number, opt_message?: string): webdriver.promise.Promise<any> {
        var gl = global["logs"];
        var errorCheckFunc = (dr) => { gl.verify(); return condition(dr); };
        return browser.wait(errorCheckFunc, timeout, opt_message);
    }
}
