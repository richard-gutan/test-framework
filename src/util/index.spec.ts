import { isObject, isClass, toString } from ".";
import { assert } from "../assert";
import { TestSuite } from "../test-suite";

class Test {
    test() {
        return true;
    }
}

class UtilSpec extends TestSuite {
    testIsObject() {
        assert(isObject({})).toBe(true);
        assert(isObject({ name: "test" })).toBe(true);
        assert(isObject([])).toBe(true);
        assert(isObject([1, 2, 3])).toBe(true);
        assert(isObject({ 1: "test1", 2: "test2" })).toBe(true);
        assert(isObject(Test)).toBe(false);
        assert(isObject(new Test())).toBe(true);
        assert(isObject(new Boolean("123"))).toBe(true);
        assert(isObject(new Boolean("123").valueOf())).toBe(false);
        assert(isObject(Function)).toBe(false);
        assert(isObject(new Function())).toBe(false);
        assert(isObject(Object.prototype)).toBe(true);
        assert(isObject(Date)).toBe(false);
        assert(isObject(new Date())).toBe(true);
    }

    testIsClass() {
        const fn1 = () => 111;
        assert(isClass(fn1)).toBe(false);

        function fn2() {
            return 222;
        }
        assert(isClass(fn2)).toBe(false);

        class Test {}
        assert(isClass(Test)).toBe(true);
    }

    testToString() {
        assert(toString(undefined)).toBe("undefined");
        assert(toString(null)).toBe("null");
        assert(toString(123)).toBe("123");
        assert(toString(true)).toBe("true");
        assert(toString(false)).toBe("false");
        assert(toString([])).toBe("[]");
        assert(toString([1, 2, 3])).toBe("[1,2,3]");
        assert(toString({})).toBe("{}");
        assert(toString({ name: "yo" })).toBe('{"name":"yo"}');
        assert(toString(() => {})).toBe("() => { }");
        assert(toString(() => 50)).toBe("() => 50");
        assert(
            toString(() => {
                console.log(123);
            })
        ).toBe("() => {\n            console.log(123);\n        }");
        assert(toString([1, {}, () => {}])).toBe(
            '[1,{},"[Function anonymous]"]'
        );

        const fn = () => null;
        assert(toString([1, {}, fn])).toBe('[1,{},"[Function fn]"]');
    }
}

export default new UtilSpec();
