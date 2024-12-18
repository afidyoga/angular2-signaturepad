const MockBrowser = require('mock-browser').mocks.MockBrowser;
const browser = new MockBrowser();
import 'localstorage-polyfill'

global['localStorage'] = localStorage;
global['window'] = browser.getWindow();
global['document'] = browser.getDocument();
global['navigator'] = browser.getNavigator();
