export const fn1 = () => 33;

export const fn2 = () => 22;

export const value1 = 1;

export const bucket = {
    fn1: () => 11,
    innerBucket: {
        fn2: () => 22,
    },
};

export function oldStyleFn() {
    return 999;
}

export class TestClass {
    value = 1;
}

const fn3 = () => 55;
export default fn3;
