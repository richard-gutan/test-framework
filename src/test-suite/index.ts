export type TestResult = SuccessfulTestResult | FailedTestResult;

export interface SuccessfulTestResult {
    name: string | keyof TestSuite;
    success: true;
}

export interface FailedTestResult {
    name: string | keyof TestSuite;
    success: false;
    error: string;
}

export interface TestSuite {
    setup?(): void;
    suiteSetup?(): void;
    teardown?(): void;
    suiteTeardown?(): void;
}

export abstract class TestSuite {
    async run(): Promise<TestResult[]> {
        const testNames = this.getMethods();

        await this.suiteSetup?.();

        const testResults = await this.getTestResults(testNames);

        await this.suiteTeardown?.();

        return testResults;
    }

    private async getTestResults(testNames: (keyof TestSuite)[]) {
        let testResults: TestResult[] = [];
        for (const t of testNames) {
            const result = await this.runSingleTest(t);
            testResults.push(result);
        }
        return testResults;
    }

    private async runSingleTest(
        testName: keyof TestSuite
    ): Promise<TestResult> {
        try {
            await this.setup?.();
            await this[testName]?.();
            await this.teardown?.();

            return {
                name: testName,
                success: true,
            };
        } catch (err) {
            let error = err;
            try {
                await this.teardown?.();
            } catch (tearDownErr) {
                error = tearDownErr;
            }

            return {
                name: testName,
                success: false,
                error: this.stringifyError(error),
            };
        }
    }

    private getMethods(): (keyof TestSuite)[] {
        const prototype = Object.getPrototypeOf(this);
        const methods = Object.getOwnPropertyNames(prototype).filter(
            (prop) =>
                prop !== "constructor" &&
                prop !== "setup" &&
                prop !== "suiteSetup" &&
                prop !== "teardown" &&
                prop !== "suiteTeardown"
        );
        return methods as (keyof TestSuite)[];
    }

    private stringifyError(err: unknown): string {
        if (err instanceof Error) {
            return err.toString();
        } else if (typeof err === "string") {
            return err;
        }
        return JSON.stringify(err);
    }
}
