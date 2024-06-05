import { TestSuite } from "../test-suite";
import { assert } from ".";

class AssertSuite extends TestSuite {
    testToBeTruthy() {
        assert(true).toBeTruthy();
        assert(12).toBeTruthy();
        assert("test").toBeTruthy();
        assert([]).toBeTruthy();
        assert({}).toBeTruthy();
        assert(() => assert({}).toBeFalsy()).toThrow();
    }

    testNotToBeTruthy() {
        assert(false).not.toBeTruthy();
        assert(0).not.toBeTruthy();
        assert("").not.toBeTruthy();
        assert(undefined).not.toBeTruthy();
        assert(null).not.toBeTruthy();
        assert(() => assert(true).not.toBeTruthy()).toThrow();
    }

    testToBeFalsy() {
        assert(false).toBeFalsy();
        assert(undefined).toBeFalsy();
        assert(null).toBeFalsy();
        assert("").toBeFalsy();
        assert(0).toBeFalsy();
        assert(() => assert(0).toBeTruthy()).toThrow();
    }

    testNotToBeFalsy() {
        assert(true).not.toBeFalsy();
        assert(123).not.toBeFalsy();
        assert({}).not.toBeFalsy();
        assert(() => assert(false).not.toBeFalsy()).toThrow();
    }

    testThrow() {
        assert(() => {
            throw "err";
        }).toThrow();
        assert(() => assert(123).toThrow()).toThrow();
        assert(() => assert(123).not.toThrow()).toThrow();
        assert(() => null).not.toThrow();

        assert(() => {
            throw new Error("err thrown");
        }).toThrow("err thrown");

        assert(() =>
            assert(() => {
                throw new Error("err thrown");
            }).not.toThrow("err thrown")
        ).toThrow(
            'Expected error message "err thrown" is equal to received message "err thrown".'
        );

        assert(() =>
            assert(() => {
                throw new Error("err thrown");
            }).toThrow("err")
        ).toThrow(
            'Expected error message "err" is not equal to received message "err thrown".'
        );
    }

    testToBe() {
        assert(123).toBe(123);
        assert(true).toBe(true);
        assert(null).toBe(null);
        assert(typeof null).toBe("object");
        assert(() => assert(123).toBe(321)).toThrow();
    }

    testNotToBe() {
        assert(123).not.toBe(321);
        assert(true).not.toBe(false);
        assert(123).not.toBe(true);
        assert([]).not.toBe([]);
        assert({}).not.toBe({});
        assert(() => assert(123).not.toBe(123)).toThrow();
    }

    testToEqual() {
        assert({ name: "test" }).not.toBe({ name: "test" });
        assert({ name: "test" }).toEqual({ name: "test" });
        assert({}).toEqual({});
        assert([]).toEqual([]);
        assert([1, 2, 3]).toEqual([1, 2, 3]);
        assert({ nested: { name: "test" } }).toEqual({
            nested: { name: "test" },
        });
        assert(1).toEqual(1);
        assert("2").toEqual("2");
        assert([1, [2], [3, [4]]]).toEqual([1, [2], [3, [4]]]);
        assert({ name: null }).toEqual({ name: null });
        assert({}).toEqual({});
        assert(() => assert(123).toEqual(321)).toThrow(
            'Value "123" is not equal to "321".'
        );
        assert(() => assert("123").toEqual("321")).toThrow(
            'Value "123" is not equal to "321".'
        );
        assert(() => assert({ name: "a" }).toEqual({ name: "b" })).toThrow(
            'Value "{"name":"a"}" is not equal to "{"name":"b"}".'
        );
        assert(() => assert(() => {}).toEqual(() => {})).toThrow(
            'Value "() => { }" is not equal to "() => { }".'
        );

        assert([{}, {}, {}]).toEqual([{}, {}, {}]);
    }

    testNotToEqual() {
        assert(123).not.toEqual(321);
        assert([1, 2, 3]).not.toEqual([3, 2, 1]);
        assert(["1", "2"]).not.toEqual([1, 2]);
        assert([1, "2"]).not.toEqual(["1", 2]);
        assert({ name: "test" }).not.toEqual({ name: "test", name2: "test2" });
        assert({ name: "test" }).not.toEqual({ name: "test2" });
        assert({ name: "test" }).not.toEqual({ name2: "test" });
        assert({ name: "" }).not.toEqual({ name: null });
        assert({ name: null }).not.toEqual({ name: undefined });
        assert({ name: 0 }).not.toEqual({ name: null });
        assert(() => assert(123).not.toEqual(123)).toThrow();
        assert([{}, { name: "a" }, {}]).not.toEqual([{}, { name: "b" }, {}]);
        assert([{}, {}, { name: "3" }]).not.toEqual([{}, {}, { name: "4" }]);

        assert(["yo", {}, () => {}]).not.toEqual(["yo", {}, () => {}]);
    }
}

export default new AssertSuite();
