/**
 * @author Nicholas C. Zakas
 * See LICENSE file in root directory for full license.
 */
"use strict"

const RuleTester = require("#eslint-rule-tester").RuleTester
const rule = require("../../../lib/rules/no-process-exit")
const ruleTester = new RuleTester()

ruleTester.run("no-process-exit", rule, {
    valid: ["Process.exit()", "var exit = process.exit;", "f(process.exit)"],

    invalid: [
        {
            code: "process.exit(0);",
            errors: [
                {
                    messageId: "noProcessExit",
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "process.exit(1);",
            errors: [
                {
                    messageId: "noProcessExit",
                    type: "CallExpression",
                },
            ],
        },
        {
            code: "f(process.exit(1));",
            errors: [
                {
                    messageId: "noProcessExit",
                    type: "CallExpression",
                },
            ],
        },
    ],
})
