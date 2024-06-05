import { isObject } from "../util";

export const isEqual = (value1: unknown, value2: unknown): boolean => {
    if (typeof value1 !== typeof value2) {
        return false;
    }

    if (isObject(value1) && isObject(value2)) {
        return isObjectEqual(value1, value2);
    }
    return value1 === value2;
};

const isObjectEqual = (
    value1: Record<string, unknown>,
    value2: Record<string, unknown>
): boolean => {
    const keys1 = Object.keys(value1);
    const keys2 = Object.keys(value2);

    if (keys1.length !== keys2.length) {
        return false;
    }

    for (const key of keys1) {
        const prop1 = value1[key];
        const prop2 = value2[key];

        if (prop1 !== prop2) {
            if (isObject(prop1) && isObject(prop2)) {
                const isEqual = isObjectEqual(prop1, prop2);
                if (!isEqual) {
                    return false;
                }
            } else {
                return false;
            }
        }
    }
    return true;
};
