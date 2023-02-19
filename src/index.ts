const core = require('@actions/core');
const github = require('@actions/github');
import axios from 'axios';

async function setStatus(deploymentId: string, status: string, deps: {
    repo: string;
    token: string;
}) {
    const res = await axios.post(`https://api.github.com/repos/${deps.repo}/deployments/${deploymentId}/statuses`, 
        {
            state: status,
        },
        { 
            headers: {
                Accept: 'application/vnd.github+json',
                Authorization: `Bearer ${deps.token}`,
                'X-GitHub-Api-Version': '2022-11-28',
                'User-Agent': '@lagrowthmachine-script',
            },
        }
    );
}

async function run() {
    try {
        const context = github.context;
        const token = core.getInput("token", { required: true, trimWhitespace: true });
        const ref = core.getInput("ref", { required: false, trimWhitespace: true }) || context.ref;
        const environment = core.getInput("environment", { required: true, trimWhitespace: true });
        const auto_merge = core.getInput("auto_merge", { required: false, trimWhitespace: true }) || false;
        const status = core.getInput("status", { required: false, trimWhitespace: true });
        const productionEnabled = core.getInput("production", { required: false, trimWhitespace: true }) === "true" ? true : false;
        const repo = `${context.repo.owner}/${context.repo.repo}`;
        const res = await axios.post(`https://api.github.com/repos/${repo}/deployments`, 
            {
                ref,
                auto_merge,
                environment,
                production_environment: productionEnabled,
            },
            {
                headers: {
                    Accept: 'application/vnd.github+json',
                    Authorization: `Bearer ${token}`,
                    'X-GitHub-Api-Version': '2022-11-28',
                    'User-Agent': '@lagrowthmachine-script',
                },
            }
        );
        const deploymentId = res.data.id;
        core.setOutput("deployment_id", deploymentId);
        if (status) {
            await setStatus(deploymentId, status, { repo, token })
        }
    } catch (error) {
        if (error instanceof Error) {
            core.error(error);
            core.setFailed(error.message);
        } else {
            core.error(`Unknown error`);
            core.setFailed(`Unknown error`);
        }
    }
}

run();