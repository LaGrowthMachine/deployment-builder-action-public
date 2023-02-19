"use strict";
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
const core = require('@actions/core');
const github = require('@actions/github');
const axios_1 = __importDefault(require("axios"));
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
function run() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const context = github.context;
            const token = core.getInput("token", { required: true, trimWhitespace: true });
            const ref = core.getInput("ref", { required: false, trimWhitespace: true }) || context.ref;
            const environment = core.getInput("environment", { required: true, trimWhitespace: true });
            const auto_merge = core.getInput("auto_merge", { required: false, trimWhitespace: true }) || false;
            const status = core.getInput("status", { required: false, trimWhitespace: true });
            const productionEnabled = core.getInput("production", { required: false, trimWhitespace: true }) === "true" ? true : false;
            const repo = `${context.repo.owner}/${context.repo.repo}`;
            console.log(JSON.stringify({
                url: `https://api.github.com/repos/${repo}/deployments`,
                repo,
                ref,
                auto_merge,
                environment,
                production_environment: productionEnabled,
            }, null, 4));
            const res = yield axios_1.default.post(`https://api.github.com/repos/${repo}/deployments`, {
                ref,
                auto_merge,
                environment,
                production_environment: productionEnabled,
            }, {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${token}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                    'User-Agent': '@lagrowthmachine-script',
                },
            });
            const deploymentId = res.data.json.id;
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
