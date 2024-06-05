import { assert } from "../assert";
import { TestSuite } from "../test-suite";
import { type MockFunction, mock } from "../mock";
import { type ChildProcess, spawn } from "node:child_process";

mock.module("node:child_process");

(spawn as MockFunction).mockImplementation(() => ({
    stdout: { on: mock.fn() },
    stderr: { on: mock.fn() },
}));

class DevServer {
    private compileProcess: ChildProcess | null = null;

    getCompileProcess() {
        return this.compileProcess;
    }

    compile(): void {
        this.compileProcess = spawn("npx", ["tsc", "--watch", "--pretty"], {
            shell: true,
        });

        this.compileProcess.stdout?.on("data", DevServer.stdoutOnDataHandler);
        this.compileProcess.stderr?.on("data", DevServer.stderrOnDataHandler);
    }

    static stdoutOnDataHandler() {}

    static stderrOnDataHandler() {}
}

class DevServerSpec extends TestSuite {
    devServer: DevServer | null = null;

    setup(): void {
        this.devServer = new DevServer();
    }

    testCompile() {
        this.devServer?.compile();
        const compileProcess = this.devServer?.getCompileProcess();
        assert(compileProcess?.stdout).toBeTruthy();
        assert(compileProcess?.stderr).toBeTruthy();

        const spawnCalls = (spawn as MockFunction).calls;
        assert(spawnCalls.length).toBe(1);
        assert(spawnCalls[0].args).toEqual([
            "npx",
            ["tsc", "--watch", "--pretty"],
            {
                shell: true,
            },
        ]);

        const stdoutOnListener = compileProcess?.stdout?.on;
        const stdoutOnCalls = stdoutOnListener
            ? (stdoutOnListener as MockFunction).calls
            : [];
        assert(stdoutOnCalls.length).toBe(1);
        assert(stdoutOnCalls[0].args).toEqual([
            "data",
            DevServer.stdoutOnDataHandler,
        ]);

        const stderrOnListener = compileProcess?.stderr?.on;
        const stderrOnCalls = stderrOnListener
            ? (stderrOnListener as MockFunction).calls
            : [];
        assert(stderrOnCalls.length).toBe(1);
        assert(stderrOnCalls[0].args).toEqual([
            "data",
            DevServer.stderrOnDataHandler,
        ]);
    }

    testStderrOnDataHandler() {}

    testStdoutOnDataHandler() {}
}

export default new DevServerSpec();
