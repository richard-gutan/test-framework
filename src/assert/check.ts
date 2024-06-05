import { isEqual } from "./is-equal";

export class Check {
    static isTruthy(value: unknown): boolean {
        return !!value;
    }

    static is(value1: unknown, value2: unknown): boolean {
        return value1 === value2;
    }

    static isEqual(value1: unknown, value2: unknown): boolean {
        return isEqual(value1, value2);
    }

    static throws(fn: Function): { thrown: boolean; message?: string } {
        try {
            fn();
        } catch (err) {
            const message = Check.getErrorMessage(err);
            return { thrown: true, message };
        }
        return { thrown: false };
    }

    private static getErrorMessage(error: unknown): string {
        if (typeof error === "string") {
            return error;
        }
        if (error instanceof Error) {
            return error.message;
        }
        return `Unknown error object: "${error}"`;
    }
}
