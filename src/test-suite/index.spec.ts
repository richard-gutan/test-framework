import { TestSuite } from ".";
import { assert } from "../assert";

class FailingTestSuite extends TestSuite {
    testSuccess() {
        return true;
    }

    testFailure() {
        throw new Error("failure");
    }
}

class PassingTestSuite extends TestSuite {
    success1() {
        return true;
    }

    success2() {
        return "Pass!";
    }
}

class SetupTeardownSuite extends TestSuite {
    value = 0;
    setupCount = 0;
    teardownCount = 0;

    setup() {
        this.setupCount += 1;
        this.value = 2;
    }

    teardown(): void {
        this.teardownCount += 1;
        this.value = 0;
    }

    test1() {
        assert(this.value).toBe(2);
    }

    test2() {
        throw new Error("Test2 failed");
    }
}

const delayed = async (cb: () => void) => {
    await new Promise<void>((resolve) => {
        setTimeout(() => {
            cb();
            resolve();
        }, 5);
    });
};
class AsyncSetupTeardownSuite extends TestSuite {
    calls: string[] = [];

    async suiteSetup(): Promise<void> {
        await delayed(() => {
            this.calls.push("suiteSetup");
        });
    }

    async setup(): Promise<void> {
        await delayed(() => {
            this.calls.push("setup");
        });
    }

    async teardown(): Promise<void> {
        await delayed(() => {
            this.calls.push("teardown");
        });
    }

    async suiteTeardown(): Promise<void> {
        await delayed(() => {
            this.calls.push("suiteTeardown");
        });
    }

    test1() {
        this.calls.push("test1");
    }

    async test2() {
        this.calls.push("test2");
        throw new Error("test2 error");
    }
}

class FaultySetupSuite extends TestSuite {
    setup(): void {
        throw new Error("setup error");
    }

    test1() {
        assert(true).toBe(true);
    }
}

class FaultyTeardownSuite extends TestSuite {
    test1() {
        assert(true).toBe(true);
    }

    teardown(): void {
        throw new Error("teardown error");
    }
}

class FaultySetupTeardownSuite extends TestSuite {
    calls: string[] = [];

    setup(): void {
        this.calls.push("setUp");
        throw new Error("setup error");
    }

    test() {
        this.calls.push("test function");
        assert(true).toBe(true);
    }

    teardown(): void {
        this.calls.push("tearDown");
        throw new Error("teardown error");
    }
}

class SuiteSetupTest extends TestSuite {
    value = "";
    count = 0;

    suiteSetup() {
        this.count += 1;
        this.value = "suite setup run";
    }

    test1() {
        return true;
    }

    test2() {
        return true;
    }

    test3() {
        return true;
    }
}

class FaultySuiteSetupTest extends TestSuite {
    suiteSetup(): void {
        throw new Error("suite setup error");
    }

    test1() {
        return true;
    }
}

class SuiteTeardownTest extends TestSuite {
    value = "";
    count = 0;

    suiteTeardown() {
        this.value = "suite teardown run";
    }

    test1() {
        return true;
    }

    test2() {
        return true;
    }

    test3() {
        return true;
    }
}

class FaultySuiteTeardownTest extends TestSuite {
    suiteTeardown(): void {
        throw new Error("suite teardown error");
    }

    test1() {
        return true;
    }
}

class AsyncTestSuite extends TestSuite {
    test1() {
        return true;
    }

    async test2() {
        return true;
    }
}

class FaultyAsyncTestSuite extends TestSuite {
    test1() {
        return true;
    }

    test2() {
        throw new Error("sync failure");
    }

    async test3() {
        return true;
    }

    async test4() {
        throw new Error("async failure");
    }
}

class TestSuiteTest extends TestSuite {
    async testFailingSuite() {
        const suite = new FailingTestSuite();
        const results = await suite.run();
        assert(results.length).toBe(2);
        const res1 = results.find((result) => result.name === "testSuccess");
        const res2 = results.find((result) => result.name === "testFailure");
        assert(res1?.success).toBe(true);
        assert(res2?.success).toBe(false);
        const res2Error = !res2?.success && res2?.error;
        assert(res2Error).toBe("Error: failure");
    }

    async testPassingSuite() {
        const suite = new PassingTestSuite();
        const results = await suite.run();
        assert(results.length).toBe(2);
        const res1 = results.find((result) => result.name === "success1");
        const res2 = results.find((result) => result.name === "success2");
        assert(res1?.success).toBe(true);
        assert(res2?.success).toBe(true);
    }

    async testSetupTeardown() {
        const suite = new SetupTeardownSuite();
        assert(suite.setupCount).toBe(0);
        assert(suite.teardownCount).toBe(0);

        const results = await suite.run();
        assert(results.length).toBe(2);
        assert(results[0].success).toBe(true);
        assert(results[1].success).toBe(false);
        assert(suite.value).toBe(0);
        assert(suite.setupCount).toBe(2);
        assert(suite.teardownCount).toBe(2);
    }

    async testAsyncSetupTeardown() {
        const suite = new AsyncSetupTeardownSuite();
        const results = await suite.run();
        assert(suite.calls).toEqual([
            "suiteSetup",
            "setup",
            "test1",
            "teardown",
            "setup",
            "test2",
            "teardown",
            "suiteTeardown",
        ]);
        assert(results[0].success).toBe(true);
        assert(results[1].success).toBe(false);
    }

    async testFaultySetup() {
        const suite = new FaultySetupSuite();
        const results = await suite.run();

        if (results[0].success) {
            throw new Error(
                "FaultySetupSuite was expected to fail but succeeded"
            );
        }
        assert(results[0].success).toBe(false);
        assert(results[0].error).toBe("Error: setup error");
    }

    async testFaultyTeardown() {
        const suite = new FaultyTeardownSuite();
        const results = await suite.run();

        if (results[0].success) {
            throw new Error(
                "FaultyTeardownSuite was expected to fail but succeeded"
            );
        }
        assert(results[0].success).toBe(false);
        assert(results[0].error).toBe("Error: teardown error");
    }

    async testFaultySetupTeardown() {
        const suite = new FaultySetupTeardownSuite();
        const results = await suite.run();

        if (results[0].success) {
            throw new Error(
                "FaultySetupTeardownSuite was expected to fail but succeeded"
            );
        }
        assert(results[0].success).toBe(false);
        assert(results[0].error).toBe("Error: teardown error");
        assert(suite.calls.length).toBe(2);
        assert(suite.calls).toEqual(["setUp", "tearDown"]);
    }

    async testSuiteSetup() {
        const suite = new SuiteSetupTest();
        assert(suite.value).toBe("");
        assert(suite.count).toBe(0);

        const results = await suite.run();
        assert(suite.value).toBe("suite setup run");
        assert(suite.count).toBe(1);

        assert(results.length).toBe(3);
        assert(results[0].success).toBe(true);
        assert(results[1].success).toBe(true);
        assert(results[2].success).toBe(true);
    }

    async testFaultySuiteSetup() {
        const suite = new FaultySuiteSetupTest();
        const error = await suite.run().catch((err) => err);
        assert(error.message).toBe("suite setup error");
    }

    async testSuiteTeardown() {
        const suite = new SuiteTeardownTest();
        assert(suite.value).toBe("");
        assert(suite.count).toBe(0);

        const results = await suite.run();
        assert(suite.value).toBe("suite teardown run");

        assert(results.length).toBe(3);
        assert(results[0].success).toBe(true);
        assert(results[1].success).toBe(true);
        assert(results[2].success).toBe(true);
    }

    async testFaultySuiteTeardown() {
        const suite = new FaultySuiteTeardownTest();
        const error = await suite.run().catch((err) => err);
        assert(error.message).toBe("suite teardown error");
    }

    async testAsyncTest() {
        const suite = new AsyncTestSuite();
        const results = await suite.run();

        assert(results.length).toBe(2);
        assert(results[0].success).toBe(true);
        assert(results[1].success).toBe(true);
    }

    async testFaultyAsyncTest() {
        const suite = new FaultyAsyncTestSuite();
        const results = await suite.run();
        assert(results.length).toBe(4);
        assert(results[0].success).toBe(true);
        assert(results[1].success).toBe(false);
        assert(results[2].success).toBe(true);
        assert(results[3].success).toBe(false);
    }
}

export default new TestSuiteTest();
