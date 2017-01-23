//Customized https://github.com/wix/protractor-browser-logs

export module consoleLogs {
    function or(a, b) {
        return message => a(message) || b(message);
    }

    function and(a, b) {
        return message => a(message) && b(message);
    }

    function byLevel(expectedLevel) {
        return message => message.level.name === expectedLevel;
    }

    function byText(text) {
        return message => message.message.indexOf(text) !== -1;
    }

    function byRegExp(re) {
        return message => message.message.match(re);
    }

    function zip(a, b) {
        return (a.length > b.length ? a : b).map((x, i) => [a[i], b[i]]);
    }

    function matcherFor(args) {
        let matchers = args.map(arg => {
            if (typeof arg === 'string') {
                return byText(arg);
            } else if (arg instanceof RegExp) {
                return byRegExp(arg);
            } else {
                return arg;
            }
        });
        return message => matchers.every(curr => curr(message));
    }

    function removeMatching(messages, filters) {
        return messages.filter(message => {
            return filters.filter(filter => filter(message)).length === 0;
        });
    }

    export function log(browser, options?) {
        let ignores, expects, log;

        function logs() {
            return browser.manage().logs().get('browser').then(function(result) {
                log = log.concat(result);
                return log;
            });
        }

        function reset() {
            ignores = [];
            expects = [];
            log = [];
        }

        function resetLogs(): any {
            log = [];
            //getting logs erasing console
            return browser.manage().logs().get('browser');
        }

        reset();

        return {
            ERROR: byLevel('SEVERE'),
            WARNING: byLevel('WARNING'),
            DEBUG: byLevel('DEBUG'),
            INFO: byLevel('INFO'),
            LOG: byLevel('INFO'),

            or,
            and,
            reset,
            resetLogs,

            ignore: (...args) => ignores.push(matcherFor(args)),
            expect: (...args) => expects.push(matcherFor(args)),

            verify: () => browser.getCapabilities().then(cap => {
                if (cap.get('browserName') === 'chrome') {
                    let errors = '';
                    let errorsCount = 0;
                    return logs().then(messages => {
                        ((options || {}).reporters || []).forEach(reporter => {
                            reporter(messages);
                        });
                        zip(expects, removeMatching(messages, ignores)).forEach(([expected, actual]) => {
                            if (!actual) {
                                throw new Error('NO MESSAGE TO EXPECT');
                            }
                            if (!expected || !expected(actual)) {
                                errorsCount++;
                                errors += '\n' + actual.message;
                            }
                        });
                        if (errorsCount) {
                            throw new Error('UNEXPECTED ERROR(S):' + errors);
                        }
                    });
                }
            })
        };
    }
}