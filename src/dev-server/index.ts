import { spawn } from "node:child_process";

const compileProcess = spawn("npx", ["tsc", "--watch", "--pretty"], {
    shell: true,
});

compileProcess.stdout.on("data", (data: Buffer) => {
    process.stdout.write(data);

    const output = data.toString();
    if (output.includes("Found 0 errors")) {
        runTests();
    }
});

compileProcess.stderr.on("data", (data: Buffer) => {
    process.stderr.write(data);
});

const runTests = () => {
    const testProcess = spawn("node", ["out/main.spec.js"], {
        shell: true,
    });

    testProcess.stdout.on("data", (data: Buffer) => {
        process.stdout.write(data);
    });

    testProcess.stderr.on("data", (data: Buffer) => {
        process.stderr.write(data);
    });
};
