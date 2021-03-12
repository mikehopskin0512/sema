import React, { useState } from 'react';
import { MAX_CHARACTER_LENGTH } from './constants';

const searchResults = [
  {
    comment:
      'Accessible test applications can pose a variety of security risks. Since developers or administrators rarely consider that someone besides themselves would even know about the existence of these applications, it is common for them to contain sensitive information or functions.',
    sourceName: 'mitre',
    sourceUrl: 'https://cwe.mitre.org/index.html',
    title: 'Inclusion of Sensitive Information in Test Code',
  },
  {
    comment:
      "<p>The system field <code>SY-SUBRC</code> must be tested immediately after any statement setting this variable. Reading this variable informs on\nprevious operation success or errors. Such errors should be handled properly so that the program continues in a consistent state.</p>\n<p>This rule raises an issue when the field <code>SY-SUBRC</code> is not checked just after performing one of the following operations:</p>\n<p> * Calling a function or method which can throw exceptions.</p>\n<p> * Calling one of the file access operation <code>OPEN DATASET</code>, <code>READ DATASET</code> or <code>DELETE DATASET</code>.</p>\n<p><code>SY-SUBRC</code> check must be done either with the <code>CASE</code>, <code>IF</code> or <code>CHECK</code> statement.</p>\n<h2>Noncompliant Code Example</h2>\n<p>In the following case nothing happens if the exceptions <code>NOT_FOUND</code> or <code>OTHERS</code> are raised:</p>\n<pre>\nCALL FUNCTION 'STRING_SPLIT'\n  EXPORTING\n    DELIMITER = ':'\n    STRING = FELD\n  IMPORTING\n    HEAD =   HEAD\n    TAIL = TAIL\n  EXCEPTIONS\n    NOT_FOUND = 1\n    OTHERS = 2.\n</pre>\n<h2>Compliant Solution</h2>\n<pre>\nCALL FUNCTION 'STRING_SPLIT'\n  EXPORTING\n    DELIMITER = ':'\n    STRING = FELD\n  IMPORTING\n    HEAD =   HEAD\n    TAIL = TAIL\n  EXCEPTIONS\n    NOT_FOUND = 1\n    OTHERS = 2.\nCASE SY-SUBRC.\n  WHEN 1. ...\n  WHEN 2. ...\n  WHEN OTHER.\nENDCASE.\n</pre>\n<h2>Exceptions</h2>\n<p>No issue will be raised in the following cases:</p>\n<p> * One or more <code>WRITE</code> operation are performed between the statement setting <code>SY-SUBRC</code> and its check. An exception will be\nhowever raised if the <code>WRITE</code> operation is a <code>WRITE ... TO</code>, as this will set <code>SY-SUBRC</code> too.</p>\n<p> * <code>SY-SUBRC</code>'s value is assigned to a variable. We then assume that it will be checked later.</p>\n<pre>\nOPEN DATASET my_dataset FOR INPUT IN TEXT MODE ENCODING DEFAULT. \" Compliant\nWRITE 'Test'. \" WRITE is accepted before checking SY-SUBRC\nIF SY-SUBRC &lt;&gt; 0.\n    EXIT.\nENDIF.\n\nOPEN DATASET my_dataset FOR INPUT IN TEXT MODE ENCODING DEFAULT. \" Compliant\nTmp = SY-SUBRC. \" Assigning SY-SUBRC value to a variable. We assume that it will be checked later.\nIF Tmp &lt;&gt; 0.\n    EXIT.\nENDIF.\n</pre>\n\n",
    sourceName: 'sonarsource',
    sourceUrl: 'https://rules.sonarsource.com',
    title: '"SY-SUBRC" should be tested after each statement setting it.',
  },
  {
    comment:
      '<p><code>SeeAllData=true</code> should not be used because it gives your tests access to all data in your organization. Activating this option makes\nyour test dependent on existing data and more difficult to maintain. Tests should create their own data.</p>\n<p>This rule raises an issue when it sees <code>@isTest(SeeAllData=true)}.</code></p>\n<code> <h2>Noncompliant Code Example</h2> <pre>\n@isTest(SeeAllData=true) // Noncompliant\npublic class MyTestClass {\n    @isTest(SeeAllData=true) // Noncompliant\n    static void myTestMethod() {\n        // Can access all data in the organization.\n    }\n}\n</pre> <h2>See</h2>\n  <ul>\n    <li> <a href="https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_testing_seealldata_using.htm">Salesforce documentation\n    - Using the isTest(SeeAllData=True) Annotation</a> </li>\n  </ul> </code>\n\n',
    sourceName: 'sonarsource',
    sourceUrl: 'https://rules.sonarsource.com',
    title:
      'Test methods should not be annotated with "@isTest(SeeAllData=true)"',
  },
  {
    comment:
      '<p>Moving the business logic out of Trigger functions and into dedicated "Trigger Handler" classes improves the application\'s design:</p>\n<ul>\n  <li> the code is easier to test and maintain. </li>\n  <li> it helps avoiding some bugs such as trigger recursion. </li>\n</ul>\n<p>The Trigger functions should only dispatch calls to the corresponding Trigger Handler classes. See the links below for examples of Trigger Handler\ndesigns.</p>\n<p>This rule raises an issue when a Trigger function contains one of the following syntax elements: loops, switch-case, try blocks, SOQL queries, DML\nqueries, SOSL queries. The goal is to detect Trigger functions which have a complex logic. In practice method calls and if statements are enough to\ndispatch records for processing.</p>\n<h2>Noncompliant Code Example</h2>\n<pre>\ntrigger MyTrigger on Account(after insert, after update) { // Noncompliant. The trigger is processing records itself instead of using a Trigger Handler.\n    for(Account a : Trigger.New) {\n        // ...\n    }\n}\n</pre>\n<h2>See</h2>\n<ul>\n  <li> <a href="http://chrisaldridge.com/triggers/lightweight-apex-trigger-framework/">Lightweight Apex Trigger Framework</a> </li>\n  <li> <a href="https://meltedwires.com/2013/06/05/trigger-pattern-for-tidy-streamlined-bulkified-triggers-revisited/">Trigger Pattern for Tidy,\n  Streamlined, Bulkified Triggers Revisited</a> </li>\n</ul>\n\n',
    sourceName: 'sonarsource',
    sourceUrl: 'https://rules.sonarsource.com',
    title: 'Business logic should not be implemented inside Triggers',
  },
  {
    comment:
      '<p>By default tests will run in system mode, i.e. without taking into account users permissions. In order to be realistic, a test needs to run\nBusiness logic code in User context. This is done by encapsulating the tested code in <a\nhref="https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_testing_tools_runas.htm"><code>System.runAs()</code></a>.</p>\n<p>This rule raises an issue when a test function, i.e. a function annotated with <code>@isTest</code> or <code>testMethod</code>, does not contain a\n<code>System.runAs()</code> call.</p>\n<h2>Noncompliant Code Example</h2>\n<pre>\n@isTest\nprivate class TestClass {\n    @isTest\n    public static void testMethod() { // NonCompliant\n        // Setup test data\n        User u = new User(...);\n        Case c = new Case (Name = \'Test\');\n        Test.startTest();\n            Insert c;\n        Test.stopTest();\n    }\n}\n</pre>\n<h2>Compliant Solution</h2>\n<pre>\n@isTest\nprivate class TestClass {\n    @isTest\n    public static void testMethod() {\n        // Setup test data\n        User u = new User(...);\n        Case c = new Case (Name = \'Test\');\n        System.runAs(u) {\n            Test.startTest();\n            Insert c;\n            Test.stopTest();\n        }\n    }\n}\n</pre>\n<h2>Exceptions</h2>\n<p>No issue will be raised if the test class, i.e. the class annotated with <code>@isTest</code>, contains helper methods, i.e. methods\n<strong>not</strong> annotated with <code>@isTest</code> or <code>testmethod</code>, which contain calls to <code>System.runAs()</code>. This\nindicates that the test code has been factorized and the rule would raise false positives.</p>\n<h2>See</h2>\n<ul>\n  <li> <a href="https://developer.salesforce.com/docs/atlas.en-us.apexcode.meta/apexcode/apex_testing_tools_runas.htm">Using the runAs Method</a>\n  </li>\n</ul>\n\n',
    sourceName: 'sonarsource',
    sourceUrl: 'https://rules.sonarsource.com',
    title: 'System.runAs should be used to test user permissions',
  },
];

const truncate = (content) => {
  const contentLength = content.length;
  const shouldTruncate = contentLength > MAX_CHARACTER_LENGTH;
  if (shouldTruncate) {
    content =
      content.substring(0, Math.min(MAX_CHARACTER_LENGTH, contentLength)) +
      '...';
  }
  return content;
};

function SuggestionModal({ searchValue, onInputChanged }) {
  return (
    <div className="sema-panel">
      <div className="panel-block">
        <div className="sema-control">
          <input
            className="sema-input"
            type="text"
            placeholder="Search.."
            value={searchValue}
            onChange={onInputChanged}
          ></input>
        </div>
      </div>
      {searchResults.map((searchResult) => {
        const { comment, sourceName, sourceUrl, title } = searchResult;
        return (
          <React.Fragment key={title}>
            <div>
              <span>{title}</span> via {sourceName}
            </div>
            <div className="sema-card">
              <div className="sema-card-content">
                <div className="sema-content">{truncate(comment)}</div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

export default SuggestionModal;
