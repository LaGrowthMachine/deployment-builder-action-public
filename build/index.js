"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createDeployment = void 0;
const core = __importStar(require("@actions/core"));
const github_1 = __importDefault(require("@actions/github"));
const axios_1 = __importStar(require("axios"));
function setStatus(deploymentId, status, deps) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield axios_1.default.post(`https://api.github.com/repos/${deps.repo}/deployments/${deploymentId}/statuses`, {
            state: status,
        }, {
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${deps.token}`,
                'X-GitHub-Api-Version': '2022-11-28',
                'User-Agent': '@lagrowthmachine-script',
            },
        });
    });
}
function createDeployment(params) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield axios_1.default.post(`https://api.github.com/repos/${params.repo}/deployments`, {
                ref: params.ref,
                auto_merge: params.auto_merge,
                environment: params.environment,
                production_environment: params.production_environment,
                required_contexts: params.required_contexts || [],
            }, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${params.token}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                    'User-Agent': '@lagrowthmachine-script',
                },
            });
            return res.data;
        }
        catch (e) {
            core.info(JSON.stringify(e instanceof axios_1.AxiosError ? (_a = e.response) === null || _a === void 0 ? void 0 : _a.data : (e instanceof Error ? e.message : e), null, 2));
            console.log('error', JSON.stringify(e instanceof axios_1.AxiosError ? (_b = e.response) === null || _b === void 0 ? void 0 : _b.data : (e instanceof Error ? e.message : e), null, 2));
            throw e;
        }
    });
}
exports.createDeployment = createDeployment;
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = github_1.default.context;
            const token = core.getInput("token", { required: true, trimWhitespace: true });
            const ref = core.getInput("ref", { required: false, trimWhitespace: true }) || context.ref;
            const environment = core.getInput("environment", { required: true, trimWhitespace: true });
            const auto_merge = (core.getInput("auto_merge", { required: false, trimWhitespace: true }) === 'true' ? true : false) || false;
            const status = core.getInput("status", { required: false, trimWhitespace: true });
            const productionEnabled = core.getInput("production", { required: false, trimWhitespace: true }) === "true" ? true : false;
            const requiredContexts = core.getInput("required_contexts", { required: false, trimWhitespace: true }).split(",");
            const repo = `${context.repo.owner}/${context.repo.repo}`;
            core.info('Deployment creation will start');
            const deployment = yield createDeployment({
                repo,
                ref,
                auto_merge: auto_merge,
                environment,
                production_environment: productionEnabled,
                token,
                required_contexts: requiredContexts,
            });
            const deploymentId = deployment.id;
            core.setOutput("deployment_id", deploymentId);
            if (status) {
                yield setStatus(deploymentId, status, { repo, token });
            }
        }
        catch (error) {
            if (error instanceof Error) {
                core.error(error);
                core.setFailed(error.message);
            }
            else {
                core.error(`Unknown error`);
                core.setFailed(`Unknown error`);
            }
        }
    });
}
run();
