//
// =====
// Hooks
// =====
// WebdriverIO provides a several hooks you can use to interfere the test process in order to
// enhance it and build services around it. You can either apply a single function to it or
// an array of methods. If one of them returns with a promise,
// WebdriverIO will wait until that promise is resolved to continue.

//
import { generateToken } from "authenticator";
import { isConstructorDeclaration } from "typescript";
const fs = require("fs");

import { ReportAggregator, HtmlReporter } from "wdio-html-nice-reporter";
let reportAggregator: ReportAggregator;

//import users = require('users.json');

export const hooks = {
  /**
   * Gets executed once before all workers get launched.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  onPrepare: function (config, capabilities) {
    // directory path
    const dirJunit = "./test/results";
    const dirAllureRes = "./allure-results";
    const dirHtmlRep = "./reports/html-reports";

    // delete directory recursively
    try {
      fs.rmdirSync(dirJunit, { recursive: true });
      console.log(`${dirJunit} is deleted!`);
    } catch (err) {
      console.error(`Error while deleting ${dirJunit}.`);
    }
    try {
      fs.rmdirSync(dirAllureRes, { recursive: true });
      console.log(`${dirAllureRes} is deleted!`);
    } catch (err) {
      console.error(`Error while deleting ${dirAllureRes}.`);
    }
    try {
      fs.rmdirSync(dirHtmlRep, { recursive: true });
      console.log(`${dirHtmlRep} is deleted!`);
    } catch (err) {
      console.error(`Error while deleting ${dirHtmlRep}.`);
    }

    reportAggregator = new ReportAggregator({
      outputDir: "./reports/html-reports/",
      filename: "index.html",
      reportTitle: "SEMA e2e tests",
      browserName: capabilities.browserName,
      showInBrowser: true,
      collapseTests: true,
    });
    reportAggregator.clean();
    reportAggregator = reportAggregator;
  },

  /**
   * Gets executed before a worker process is spawned & can be used to initialize specific service
   * for that worker as well as modify runtime environments in an async fashion.
   * @param  {String} cid    capability id (e.g 0-0)
   * @param  {[type]} caps   object containing capabilities for session
   * @param  {[type]} specs  specs to be run in the worker process
   * @param  {[type]} args   object that will be merged with the main
   *                         configuration once worker is initialized
   * @param  {[type]} execArgv list of string arguments passed to the worker process
   */
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {
  // },
  /**
   * Gets executed just before initializing the webdriver session and test framework.
   * It allows you to manipulate configurations depending on the capability or spec.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  //   beforeSession: function (config, capabilities, specs) {
  //   },
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   */
  before: async function (capabilities, specs) {
    try {
      // This secret should be changed once we have defined which device to use
      // const SECRET_KEY = 'AXISDW77DODT233C';
      const SECRET_KEY = 'CFUL2XGHWAMAVAQS';
      const otp = generateToken(SECRET_KEY);

      console.log(otp);

      await browser.maximizeWindow();

      await browser.url('/login');
      await browser.pause(2000);
      const signupBtn = await browser
        .$$("//button/span[contains(text(), 'Sign in with GitHub')]")
        .find((el) => el.isClickable());
      await signupBtn.click();

      await $('#login_field').setValue(
        'qateam+automationadmin@semasoftware.com'
      );
      await $('#password').setValue('Automation1Tester2#');
      await $('.js-sign-in-button').click();
      await $('#otp').setValue(otp);
      await $('button*=Verify');

      if ((await $$('button*=Authorize Sema').length) > 0) {
        console.log(`Authorizing Smart Code Reviews...`);
        await browser.pause(2000);
        await $('button*=Authorize Sema').click();
        await browser.pause(2000);
      }
      await browser.pause(2000);
    } catch (e) {
      throw new Error(`Failed to log in in #before# hook. Url: ${await browser.getUrl()} Details: ${e}`);
    }
  },
  /**
   * Gets executed before the suite starts.
   * @param {Object} suite suite details
   */
  //beforeSuite: async function () {
  //},
  /**
   * This hook gets executed _before_ every hook within the suite starts.
   * (For example, this runs before calling `before`, `beforeEach`, `after`)
   *
   * (`stepData` and `world` are Cucumber-specific.)
   *
   */
  // beforeHook: function (test, context, stepData, world) {
  // },
  /**
   * Hook that gets executed _after_ every hook within the suite ends.
   * (For example, this runs after calling `before`, `beforeEach`, `after`, `afterEach` in Mocha.)
   *
   * (`stepData` and `world` are Cucumber-specific.)
   */
  // afterHook:function(test,context,{error, result, duration, passed, retries}, stepData,world) {
  // },
  /**
   * Function to be executed before a test (in Mocha/Jasmine) starts.
   */
  // beforeTest: async function (test, context) {
  //
  // },
  /**
   * Runs before a WebdriverIO command is executed.
   * @param {String} commandName hook command name
   * @param {Array} args arguments that the command would receive
   */
  // beforeCommand: function (commandName, args) {
  // },
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {String} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {Number} result 0 - command success, 1 - command error
   * @param {Object} error error object, if any
   */
  // afterCommand: function (commandName, args, result, error) {
  // },
  /**
   * Function to be executed after a test (in Mocha/Jasmine)
   */
  // afterTest: async function (
  //   test,
  //   context,
  //   { error, result, duration, passed, retries }
  // ) {
  //   if (error) {
  //     await browser.takeScreenshot();
  //   }
  // },
  /**
   * Hook that gets executed after the suite has ended.
   * @param {Object} suite suite details
   */
  // afterSuite: async function (suite) {
  // },
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {Number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // after: function (result, capabilities, specs) {
  // },
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {
  // },
  /**
   * Gets executed after all workers have shut down and the process is about to exit.
   * An error thrown in the `onComplete` hook will result in the test run failing.
   * @param {Object} exitCode 0 - success, 1 - fail
   * @param {Object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  onComplete: function (exitCode, config, capabilities, results) {
    (async () => {
      await reportAggregator.createReport();
    })();
  },
  /**
   * Gets executed when a refresh happens.
   * @param {String} oldSessionId session ID of the old session
   * @param {String} newSessionId session ID of the new session
   */
  // onReload: function (oldSessionId, newSessionId) {
  // },
  /**
   * Cucumber-specific hooks
   */
  // beforeFeature: function (uri, feature, scenarios) {
  // },
  // beforeScenario: function (uri, feature, scenario, sourceLocation) {
  // },
  // beforeStep: function ({uri, feature, step}, context) {
  // },
  afterStep: async function ({ uri, feature, step }, context, { error, result, duration, passed }) {
    if (await error) {
      await browser.takeScreenshot();
    }
  },

  /**
   *
   * Runs after a Cucumber Scenario.
   * @param {ITestCaseHookParameter} world            world object containing information on pickle and test step
   * @param {Object}                 result           results object containing scenario results `{passed: boolean, error: string, duration: number}`
   * @param {boolean}                result.passed    true if scenario has passed
   * @param {string}                 result.error     error stack if scenario failed
   * @param {number}                 result.duration  duration of scenario in milliseconds
   * @param {Object}                 context          Cucumber World object
   */
  // afterScenario: async function (world, result, context) {
  //   if (await world.result.status === "FAILED") {
  //     console.log("FAILED TEST!");
  //     await browser.takeScreenshot();
  //   }
  // },

  // afterFeature: function (uri, feature, scenarios) {
  // }
};
