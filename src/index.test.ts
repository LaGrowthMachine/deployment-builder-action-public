import dotenv from 'dotenv';
dotenv.config();
import { createDeployment } from ".";

test('Should create deployment', async () => {
    const deployment = await createDeployment({
        repo: process.env.GITHUB_TEST_REPO!,
        ref: process.env.GITHUB_TEST_REF!,
        auto_merge: true,
        environment: process.env.GITHUB_TEST_ENVIRONMENT!,
        production_environment: process.env.GITHUB_TEST_PRODUCTION_PRODUCTION === 'true',
        token: process.env.GITHUB_TEST_SECOND_TOKEN!,
    });
    expect(deployment).toBeDefined();
    expect(deployment.id).toBeDefined();
})