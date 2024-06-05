import { isClass, isObject } from "../util";

export interface MockCall {
    args: unknown[];
}

export interface MockFunction<A extends any[] = any, R = any> extends Function {
    (...args: A): R | undefined;
    readonly calls: MockCall[];
    mockImplementation(fn: (...args: A) => R): void;
    mockReset(): void;
    originalImplementation?: (...args: A) => R;
}

class Mock {
    fn<A extends any[] = any, R = any>(
        originalImplementation?: (...args: A) => R
    ): MockFunction<A, R> {
        let implementation: Function | null = null;
        const calls: MockCall[] = [];

        const mockFn = function (...args: A): R | undefined {
            calls.push({ args });
            if (implementation) {
                return implementation(...args);
            }
        };

        const mockImplementation = (fn: (...args: A) => R) => {
            implementation = fn;
        };

        const mockReset = () => {
            calls.length = 0;
            implementation = originalImplementation ?? null;
        };

        return Object.assign(mockFn, {
            mockImplementation,
            originalImplementation,
            mockReset,
            calls,
        });
    }

    module(path: string) {
        const module: Record<string, unknown> = require(path);

        this.replaceFunctionsWithMocks(module);

        return module;
    }

    private replaceFunctionsWithMocks(obj: Record<string, unknown>) {
        for (const key in obj) {
            const entry = obj[key];

            if (typeof entry === "function" && !isClass(entry)) {
                obj[key] = this.fn(obj[key] as (...args: any) => any);
            } else if (isObject(entry)) {
                this.replaceFunctionsWithMocks(entry);
            }
        }
    }
}

export const mock = new Mock();
