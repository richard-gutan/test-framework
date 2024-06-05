import assertSpec from "./assert/index.spec";
import testSuiteSpec from "./test-suite/index.spec";
import devServerSpec from "./dev-server/index.spec";
import mockSpec from "./mock/index.spec";
import utilSpec from "./util/index.spec";

const runTests = async () => {
    const tests = [
        utilSpec,
        assertSpec,
        testSuiteSpec,
        mockSpec,
        devServerSpec,
    ];

    let testResults = [];
    for (let test of tests) {
        const result = await test.run();
        testResults.push(...result);
    }

    const failedTests = testResults.filter((result) => !result.success);
    if (failedTests.length) {
        console.log("\x1b[0;31mTests Failed\x1b[0m");
        console.log(failedTests);
    } else {
        console.log("\x1b[0;32mTests Passed!\x1b[0m");
    }
};

runTests();
