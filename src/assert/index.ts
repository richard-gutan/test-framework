import { Check } from "./check";
import { toString } from "../util";

interface Assertions {
    toBeTruthy(): void;
    toBeFalsy(): void;
    toBe(value: unknown): void;
    toThrow(message?: string): void;
    toEqual(value: unknown): void;
}

class AssertNot implements Assertions {
    constructor(private value: unknown) {}

    toBeTruthy() {
        if (Check.isTruthy(this.value)) {
            throw new Error(`Value "${toString(this.value)}" is truthy.`);
        }
    }

    toBeFalsy() {
        if (!Check.isTruthy(this.value)) {
            throw new Error(`Value "${toString(this.value)}" is falsy.`);
        }
    }

    toThrow(message?: string) {
        if (typeof this.value === "function") {
            const { thrown, message: errMessage } = Check.throws(this.value);
            if (message && message === errMessage) {
                throw new Error(
                    `Expected error message "${message}" is equal to received message "${errMessage}".`
                );
            }
            if (thrown) {
                throw new Error(
                    `Function "${toString(this.value)}" did throw.`
                );
            }
        } else {
            throw new Error(
                `Value "${toString(this.value)}" is not a function.`
            );
        }
    }

    toBe(value: unknown) {
        if (Check.is(this.value, value)) {
            throw new Error(
                `Value "${toString(this.value)}" is "${toString(value)}".`
            );
        }
    }

    toEqual(value: unknown) {
        if (Check.isEqual(this.value, value)) {
            throw new Error(
                `Value "${toString(this.value)}" is equal to "${toString(
                    value
                )}".`
            );
        }
    }
}

class Assert implements Assertions {
    public readonly not = new AssertNot(this.value);

    constructor(private value: unknown) {}

    toBeTruthy() {
        if (!Check.isTruthy(this.value)) {
            throw new Error(`Value "${toString(this.value)}" is not truthy.`);
        }
    }

    toBeFalsy() {
        if (Check.isTruthy(this.value)) {
            throw new Error(`Value "${toString(this.value)}" is not falsy.`);
        }
    }

    toThrow(message?: string) {
        if (typeof this.value === "function") {
            const { thrown, message: errMessage } = Check.throws(this.value);
            if (!thrown) {
                throw new Error(
                    `Function "${toString(this.value)}" didn't throw.`
                );
            }

            if (message && message !== errMessage) {
                throw new Error(
                    `Expected error message "${message}" is not equal to received message "${errMessage}".`
                );
            }
        } else {
            throw new Error(
                `Value "${toString(this.value)}" is not a function.`
            );
        }
    }

    toBe(value: unknown) {
        if (!Check.is(this.value, value)) {
            throw new Error(
                `Value "${toString(this.value)}" is not "${toString(value)}".`
            );
        }
    }

    toEqual(value: unknown) {
        if (!Check.isEqual(this.value, value)) {
            throw new Error(
                `Value "${toString(this.value)}" is not equal to "${toString(
                    value
                )}".`
            );
        }
    }
}

export const assert = (value: unknown): Assert => {
    return new Assert(value);
};
