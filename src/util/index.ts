export const isObject = (
    val: unknown
): val is Record<string | number | symbol, "unknown"> =>
    !!val && typeof val === "object";

export const isClass = (val: unknown): boolean => {
    return typeof val === "function" && /^class/.test(val.toString());
};

export const toString = (value: unknown) => {
    switch (typeof value) {
        case "object":
            return JSON.stringify(value, (key, val) => {
                if (typeof val === "function") {
                    return `[Function ${
                        (val as Function).name || "anonymous"
                    }]`;
                }
                return val;
            });
        default:
            return String(value);
    }
};
