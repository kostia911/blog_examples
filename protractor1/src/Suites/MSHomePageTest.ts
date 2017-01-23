import {Utils } from '../Helpers/Utilities';

describe('example with override wait method', () => {


    it('1. Searches for ms logo on ms home page', function() {
        browser.get('https://www.microsoft.com/en-us/');
        browser.wait(() => element(by.id('nonExistLogoID')).isPresent())
            .then((callback) => {
                element(by.id('srv_shellHeaderMicrosoftLogo')).getInnerHtml().then((val) =>
                    expect(val).not.toBeNull('shouldn be empty'));
            });
    });

    it('2. Searches for non exist ms logo on ms home page', function() {
        browser.get('https://www.microsoft.com/en-us/');
        Utils.CheckWait(() => element(by.id('nonExistLogoID')).isPresent())
            .then((callback) => {
                element(by.id('srv_shellHeaderMicrosoftLogo')).getInnerHtml().then((val) =>
                    expect(val).not.toBeNull('shouldn be empty'));
            });
    });
});
