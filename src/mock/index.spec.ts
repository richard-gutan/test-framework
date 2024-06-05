import { TestSuite } from "../test-suite";
import { assert } from "../assert";
import { MockFunction, mock } from "./index";
import defaultExport, {
    fn1,
    fn2,
    value1,
    bucket,
    TestClass,
    oldStyleFn,
} from "./test-module";

class MockSpec extends TestSuite {
    async testMockFn() {
        const mockedFn = mock.fn();
        assert(mockedFn()).toBe(undefined);
        assert(mockedFn.originalImplementation).toBeFalsy();

        mockedFn.mockImplementation(() => 666);
        assert(mockedFn()).toBe(666);

        mockedFn.mockImplementation(() => {
            throw new Error("error mock");
        });
        assert(() => mockedFn()).toThrow();

        mockedFn.mockImplementation(() => Promise.resolve("yay"));
        const result = mockedFn();
        assert(result.then).toBeTruthy();
        assert(await result).toBe("yay");

        const mockedFn2 = mock.fn(() => 123);
        assert(mockedFn2()).toBe(undefined);
        assert(mockedFn2.originalImplementation).toBeTruthy();
        assert(mockedFn2.originalImplementation?.()).toBe(123);

        mockedFn2.mockImplementation(() => 0);
        assert(mockedFn2()).toBe(0);
        assert(mockedFn2.originalImplementation?.()).toBe(123);
    }

    async testMockCallRecording() {
        const fn = mock.fn();
        fn();
        assert(fn.calls).toEqual([{ args: [] }]);
        fn("yo");
        fn([1, 2, 3], "yo");
        assert(fn.calls).toEqual([
            { args: [] },
            { args: ["yo"] },
            { args: [[1, 2, 3], "yo"] },
        ]);
        fn.mockImplementation(async () => null);
        await fn(1, 2, 3);
        assert(fn.calls).toEqual([
            { args: [] },
            { args: ["yo"] },
            { args: [[1, 2, 3], "yo"] },
            { args: [1, 2, 3] },
        ]);
        assert(fn().then).toBeTruthy();
        assert(await fn()).toBe(null);
        fn.mockReset();
        assert(fn.calls).toEqual([]);
        assert(fn()?.then).toBeFalsy();
        assert(fn()).toBe(undefined);
    }

    testMockModule() {
        assert(fn1()).toBe(33);
        assert(fn2()).toBe(22);
        assert(value1).toBe(1);
        assert(defaultExport()).toBe(55);
        assert(bucket.fn1()).toBe(11);
        assert(bucket.innerBucket.fn2()).toBe(22);
        assert(oldStyleFn()).toBe(999);
        assert(new TestClass()).toEqual({ value: 1 });

        mock.module("./test-module");
        assert(fn1()).toBe(undefined);
        assert((fn1 as MockFunction).originalImplementation?.()).toBe(33);

        assert(fn2()).toBe(undefined);
        assert((fn2 as MockFunction).originalImplementation?.()).toBe(22);

        assert(value1).toBe(1);
        assert(
            (value1 as unknown as MockFunction).originalImplementation
        ).toBeFalsy();

        assert(defaultExport()).toBe(undefined);
        assert((defaultExport as MockFunction).originalImplementation?.()).toBe(
            55
        );

        assert(bucket.fn1()).toBe(undefined);
        assert((bucket.fn1 as MockFunction).originalImplementation?.()).toBe(
            11
        );

        assert(bucket.innerBucket.fn2()).toBe(undefined);
        assert(
            (bucket.innerBucket.fn2 as MockFunction).originalImplementation?.()
        ).toBe(22);

        assert(new TestClass()).toEqual({ value: 1 });
        assert(oldStyleFn()).toBe(undefined);
        assert((oldStyleFn as MockFunction).originalImplementation?.()).toBe(
            999
        );
    }
}

export default new MockSpec();
