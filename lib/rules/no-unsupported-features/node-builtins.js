/**
 * @author Toru Nagashima
 * See LICENSE file in root directory for full license.
 */
"use strict"

const { READ } = require("@eslint-community/eslint-utils")
const {
    checkUnsupportedBuiltins,
    messages,
} = require("../../util/check-unsupported-builtins")
const enumeratePropertyNames = require("../../util/enumerate-property-names")
const getConfiguredNodeVersion = require("../../util/get-configured-node-version")
const extendTrackMapWithNodePrefix = require("../../util/extend-trackmap-with-node-prefix")

const trackMap = {
    globals: {
        queueMicrotask: {
            [READ]: { supported: ["12.0.0"], experimental: "11.0.0" },
        },
        require: {
            resolve: {
                paths: { [READ]: { supported: ["8.9.0"] } },
            },
        },
    },
    modules: {
        assert: {
            strict: {
                [READ]: { supported: ["9.9.0", "8.13.0"] },
                doesNotReject: { [READ]: { supported: ["10.0.0"] } },
                rejects: { [READ]: { supported: ["10.0.0"] } },
            },
            deepStrictEqual: { [READ]: { supported: ["4.0.0"] } },
            doesNotReject: { [READ]: { supported: ["10.0.0"] } },
            notDeepStrictEqual: { [READ]: { supported: ["4.0.0"] } },
            rejects: { [READ]: { supported: ["10.0.0"] } },
            CallTracker: {
                [READ]: { supported: null, experimental: "14.2.0" },
            },
        },
        async_hooks: {
            [READ]: { supported: ["8.0.0"] },
            createHook: { [READ]: { supported: ["8.1.0"] } },
            AsyncLocalStorage: {
                [READ]: { supported: ["13.10.0", "12.17.0"] },
            },
        },
        buffer: {
            Buffer: {
                alloc: { [READ]: { supported: ["4.5.0"] } },
                allocUnsafe: { [READ]: { supported: ["4.5.0"] } },
                allocUnsafeSlow: { [READ]: { supported: ["4.5.0"] } },
                from: { [READ]: { supported: ["4.5.0"] } },
            },
            kMaxLength: { [READ]: { supported: ["3.0.0"] } },
            transcode: { [READ]: { supported: ["7.1.0"] } },
            constants: { [READ]: { supported: ["8.2.0"] } },
            Blob: { [READ]: { supported: null, experimental: "15.7.0" } },
        },
        child_process: {
            ChildProcess: { [READ]: { supported: ["2.2.0"] } },
        },
        console: {
            clear: { [READ]: { supported: ["8.3.0", "6.13.0"] } },
            count: { [READ]: { supported: ["8.3.0", "6.13.0"] } },
            countReset: {
                [READ]: { supported: ["8.3.0", "6.13.0"] },
            },
            debug: { [READ]: { supported: ["8.0.0"] } },
            dirxml: { [READ]: { supported: ["8.0.0"] } },
            group: { [READ]: { supported: ["8.5.0"] } },
            groupCollapsed: { [READ]: { supported: ["8.5.0"] } },
            groupEnd: { [READ]: { supported: ["8.5.0"] } },
            table: { [READ]: { supported: ["10.0.0"] } },
            markTimeline: { [READ]: { supported: ["8.0.0"] } },
            profile: { [READ]: { supported: ["8.0.0"] } },
            profileEnd: { [READ]: { supported: ["8.0.0"] } },
            timeLog: { [READ]: { supported: ["10.7.0"] } },
            timeStamp: { [READ]: { supported: ["8.0.0"] } },
            timeline: { [READ]: { supported: ["8.0.0"] } },
            timelineEnd: { [READ]: { supported: ["8.0.0"] } },
        },
        crypto: {
            Certificate: {
                exportChallenge: { [READ]: { supported: ["9.0.0"] } },
                exportPublicKey: { [READ]: { supported: ["9.0.0"] } },
                verifySpkac: { [READ]: { supported: ["9.0.0"] } },
            },
            ECDH: { [READ]: { supported: ["8.8.0", "6.13.0"] } },
            KeyObject: { [READ]: { supported: ["11.6.0"] } },
            createPrivateKey: { [READ]: { supported: ["11.6.0"] } },
            createPublicKey: { [READ]: { supported: ["11.6.0"] } },
            createSecretKey: { [READ]: { supported: ["11.6.0"] } },
            constants: { [READ]: { supported: ["6.3.0"] } },
            fips: { [READ]: { supported: ["6.0.0"] } },
            generateKeyPair: { [READ]: { supported: ["10.12.0"] } },
            generateKeyPairSync: { [READ]: { supported: ["10.12.0"] } },
            getCurves: { [READ]: { supported: ["2.3.0"] } },
            getFips: { [READ]: { supported: ["10.0.0"] } },
            privateEncrypt: { [READ]: { supported: ["1.1.0"] } },
            publicDecrypt: { [READ]: { supported: ["1.1.0"] } },
            randomFillSync: {
                [READ]: { supported: ["7.10.0", "6.13.0"] },
            },
            randomFill: {
                [READ]: { supported: ["7.10.0", "6.13.0"] },
            },
            scrypt: { [READ]: { supported: ["10.5.0"] } },
            scryptSync: { [READ]: { supported: ["10.5.0"] } },
            setFips: { [READ]: { supported: ["10.0.0"] } },
            sign: { [READ]: { supported: ["12.0.0"] } },
            timingSafeEqual: { [READ]: { supported: ["6.6.0"] } },
            verify: { [READ]: { supported: ["12.0.0"] } },
        },
        dns: {
            Resolver: { [READ]: { supported: ["8.3.0"] } },
            resolvePtr: { [READ]: { supported: ["6.0.0"] } },
            promises: {
                [READ]: {
                    supported: ["11.14.0", "10.17.0"],
                    experimental: "10.6.0",
                },
            },
        },
        events: {
            EventEmitter: {
                once: {
                    [READ]: { supported: ["11.13.0", "10.16.0"] },
                },
            },
            once: { [READ]: { supported: ["11.13.0", "10.16.0"] } },
        },
        fs: {
            Dirent: { [READ]: { supported: ["10.10.0"] } },
            copyFile: { [READ]: { supported: ["8.5.0"] } },
            copyFileSync: { [READ]: { supported: ["8.5.0"] } },
            mkdtemp: { [READ]: { supported: ["5.10.0"] } },
            mkdtempSync: { [READ]: { supported: ["5.10.0"] } },
            realpath: {
                native: { [READ]: { supported: ["9.2.0"] } },
            },
            realpathSync: {
                native: { [READ]: { supported: ["9.2.0"] } },
            },
            promises: {
                [READ]: {
                    supported: ["11.14.0", "10.17.0"],
                    experimental: "10.1.0",
                },
            },
            writev: { [READ]: { supported: ["12.9.0"] } },
            writevSync: { [READ]: { supported: ["12.9.0"] } },
            readv: {
                [READ]: { supported: ["13.13.0", "12.17.0"] },
            },
            readvSync: {
                [READ]: { supported: ["13.13.0", "12.17.0"] },
            },
            lutimes: {
                [READ]: { supported: ["14.5.0", "12.19.0"] },
            },
            lutimesSync: {
                [READ]: { supported: ["14.5.0", "12.19.0"] },
            },
            opendir: {
                [READ]: { supported: ["12.12.0"] },
            },
            opendirSync: {
                [READ]: { supported: ["12.12.0"] },
            },
            rm: {
                [READ]: { supported: ["14.14.0"] },
            },
            rmSync: {
                [READ]: { supported: ["14.14.0"] },
            },
            read: {
                [READ]: { supported: ["13.11.0", "12.17.0"] },
            },
            readSync: {
                [READ]: { supported: ["13.11.0", "12.17.0"] },
            },
            Dir: {
                [READ]: { supported: ["12.12.0"] },
            },
            StatWatcher: {
                [READ]: { supported: ["14.3.0", "12.20.0"] },
            },
        },
        "fs/promises": {
            [READ]: {
                supported: ["14.0.0"],
            },
        },
        http2: {
            [READ]: {
                supported: ["10.10.0", "8.13.0"],
                experimental: "8.4.0",
            },
        },
        inspector: {
            [READ]: { supported: null, experimental: "8.0.0" },
        },
        module: {
            Module: {
                builtinModules: {
                    [READ]: {
                        supported: ["9.3.0", "6.13.0", "8.10.0"],
                    },
                },
                createRequireFromPath: { [READ]: { supported: ["10.12.0"] } },
                createRequire: { [READ]: { supported: ["12.2.0"] } },
                syncBuiltinESMExports: { [READ]: { supported: ["12.12.0"] } },
            },
            builtinModules: {
                [READ]: {
                    supported: ["9.3.0", "6.13.0", "8.10.0"],
                },
            },
            createRequireFromPath: { [READ]: { supported: ["10.12.0"] } },
            createRequire: { [READ]: { supported: ["12.2.0"] } },
            syncBuiltinESMExports: { [READ]: { supported: ["12.12.0"] } },
        },
        os: {
            constants: {
                [READ]: { supported: ["6.3.0"] },
                priority: { [READ]: { supported: ["10.10.0"] } },
            },
            getPriority: { [READ]: { supported: ["10.10.0"] } },
            homedir: { [READ]: { supported: ["2.3.0"] } },
            setPriority: { [READ]: { supported: ["10.10.0"] } },
            userInfo: { [READ]: { supported: ["6.0.0"] } },
        },
        path: {
            toNamespacedPath: { [READ]: { supported: ["9.0.0"] } },
        },
        perf_hooks: {
            [READ]: { supported: ["8.5.0"] },
            monitorEventLoopDelay: { [READ]: { supported: ["11.10.0"] } },
        },
        process: {
            allowedNodeEnvironmentFlags: { [READ]: { supported: ["10.10.0"] } },
            argv0: { [READ]: { supported: ["6.4.0"] } },
            channel: { [READ]: { supported: ["7.1.0"] } },
            cpuUsage: { [READ]: { supported: ["6.1.0"] } },
            emitWarning: { [READ]: { supported: ["6.0.0"] } },
            getegid: { [READ]: { supported: ["2.0.0"] } },
            geteuid: { [READ]: { supported: ["2.0.0"] } },
            hasUncaughtExceptionCaptureCallback: {
                [READ]: { supported: ["9.3.0"] },
            },
            hrtime: {
                bigint: { [READ]: { supported: ["10.7.0"] } },
            },
            ppid: {
                [READ]: {
                    supported: ["9.2.0", "6.13.0", "8.10.0"],
                },
            },
            release: { [READ]: { supported: ["3.0.0"] } },
            report: {
                [READ]: { supported: ["14.0.0"], experimental: "11.8.0" },
            },
            resourceUsage: { [READ]: { supported: ["12.6.0"] } },
            setegid: { [READ]: { supported: ["2.0.0"] } },
            seteuid: { [READ]: { supported: ["2.0.0"] } },
            setUncaughtExceptionCaptureCallback: {
                [READ]: { supported: ["9.3.0"] },
            },
            stdout: {
                getColorDepth: { [READ]: { supported: ["9.9.0"] } },
                hasColor: { [READ]: { supported: ["11.13.0"] } },
            },
            stderr: {
                getColorDepth: { [READ]: { supported: ["9.9.0"] } },
                hasColor: { [READ]: { supported: ["11.13.0"] } },
            },
        },
        stream: {
            Readable: {
                from: {
                    [READ]: { supported: ["12.3.0", "10.17.0"] },
                },
            },
            finished: { [READ]: { supported: ["10.0.0"] } },
            pipeline: { [READ]: { supported: ["10.0.0"] } },
        },
        trace_events: {
            [READ]: { supported: ["10.0.0"] },
        },
        url: {
            URL: { [READ]: { supported: ["7.0.0", "6.13.0"] } },
            URLSearchParams: {
                [READ]: { supported: ["7.5.0", "6.13.0"] },
            },
            domainToASCII: { [READ]: { supported: ["7.4.0"] } },
            domainToUnicode: { [READ]: { supported: ["7.4.0"] } },
        },
        util: {
            callbackify: { [READ]: { supported: ["8.2.0"] } },
            formatWithOptions: { [READ]: { supported: ["10.0.0"] } },
            getSystemErrorName: {
                [READ]: { supported: ["9.7.0", "8.12.0"] },
            },
            inspect: {
                custom: { [READ]: { supported: ["6.6.0"] } },
                defaultOptions: { [READ]: { supported: ["6.4.0"] } },
                replDefaults: { [READ]: { supported: ["11.12.0"] } },
            },
            isDeepStrictEqual: { [READ]: { supported: ["9.0.0"] } },
            promisify: { [READ]: { supported: ["8.0.0"] } },
            TextDecoder: {
                [READ]: { supported: ["8.9.0"], experimental: "8.3.0" },
            },
            TextEncoder: {
                [READ]: { supported: ["8.9.0"], experimental: "8.3.0" },
            },
            types: {
                [READ]: { supported: ["10.0.0"] },
                isBoxedPrimitive: { [READ]: { supported: ["10.11.0"] } },
            },
        },
        v8: {
            [READ]: { supported: ["1.0.0"] },
            DefaultDeserializer: { [READ]: { supported: ["8.0.0"] } },
            DefaultSerializer: { [READ]: { supported: ["8.0.0"] } },
            Deserializer: { [READ]: { supported: ["8.0.0"] } },
            Serializer: { [READ]: { supported: ["8.0.0"] } },
            cachedDataVersionTag: { [READ]: { supported: ["8.0.0"] } },
            deserialize: { [READ]: { supported: ["8.0.0"] } },
            getHeapCodeStatistics: { [READ]: { supported: ["12.8.0"] } },
            getHeapSnapshot: { [READ]: { supported: ["11.13.0"] } },
            getHeapSpaceStatistics: { [READ]: { supported: ["6.0.0"] } },
            serialize: { [READ]: { supported: ["8.0.0"] } },
            writeHeapSnapshot: { [READ]: { supported: ["11.13.0"] } },
        },
        vm: {
            Module: { [READ]: { supported: ["9.6.0"] } },
            compileFunction: { [READ]: { supported: ["10.10.0"] } },
        },
        worker_threads: {
            [READ]: { supported: ["12.11.0"], experimental: "10.5.0" },
        },
    },
}
Object.assign(trackMap.globals, {
    Buffer: trackMap.modules.buffer.Buffer,
    TextDecoder: {
        ...trackMap.modules.util.TextDecoder,
        [READ]: { supported: ["11.0.0"] },
    },
    TextEncoder: {
        ...trackMap.modules.util.TextEncoder,
        [READ]: { supported: ["11.0.0"] },
    },
    URL: {
        ...trackMap.modules.url.URL,
        [READ]: { supported: ["10.0.0"] },
    },
    URLSearchParams: {
        ...trackMap.modules.url.URLSearchParams,
        [READ]: { supported: ["10.0.0"] },
    },
    console: trackMap.modules.console,
    process: trackMap.modules.process,
})

trackMap.modules = extendTrackMapWithNodePrefix(trackMap.modules)

module.exports = {
    meta: {
        docs: {
            description:
                "disallow unsupported Node.js built-in APIs on the specified version",
            recommended: true,
            url: "https://github.com/eslint-community/eslint-plugin-n/blob/HEAD/docs/rules/no-unsupported-features/node-builtins.md",
        },
        type: "problem",
        fixable: null,
        schema: [
            {
                type: "object",
                properties: {
                    version: getConfiguredNodeVersion.schema,
                    ignores: {
                        type: "array",
                        items: {
                            enum: Array.from(
                                new Set([
                                    ...enumeratePropertyNames(trackMap.globals),
                                    ...enumeratePropertyNames(trackMap.modules),
                                ])
                            ),
                        },
                        uniqueItems: true,
                    },
                },
                additionalProperties: false,
            },
        ],
        messages,
    },
    create(context) {
        return {
            "Program:exit"() {
                checkUnsupportedBuiltins(context, trackMap)
            },
        }
    },
}
