# Github deployment creator

This action create a new deployment. We build this one for Jira integration.

    https://docs.github.com/fr/rest/deployments/deployments?apiVersion=2022-11-28

## Inputs

### `token`

**Required** github token that can create deployment. Test it before.

### `ref`

**Required** The ref to deploy. This can be a branch, tag, or SHA.

### `environment`

Name for the target deployment environment, which can be changed when setting a deploy status. For example, production, staging, or qa, etc...

### `auto_merge`

Attempts to automatically merge the default branch into the requested ref, if it's behind the default branch.

### `description`

Short description of the deployment.

### `production`

**Required** Specifies if the given environment is one that end-users directly interact with. Default: true when environment is production and false otherwise. Default `"false"`.

### `status`
Can be one of: error, failure, inactive, in_progress, queued, pending, success

## Outputs

### `id`

Id of deployment

## Example usage

```yaml
uses: lagrowthmachine/deployment-builder-action-public@v1.2
with:
  token: 'xxxxx'
  ref: 'master'
  auto_merge: false
  environment: 'production'
  description: 'A short description there'
```

