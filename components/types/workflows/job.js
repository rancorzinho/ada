"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobClass = void 0;
const step_1 = require("../../workflows/step");
function composeAWSSteps(environment, awsEnvConfig) {
    const steps = [
        {
            name: 'Add profile credentials to ~/.aws/credentials',
            run: `
export OIDC=$(curl -sLS "\${ACTIONS_ID_TOKEN_REQUEST_URL}&audience=180seg" \\
-H "User-Agent: actions/oidc-client" \\
-H "X-Correlation-Id: \${{ github.repository }}-\${{ github.ref }}" \\
-H "Authorization: Bearer $ACTIONS_ID_TOKEN_REQUEST_TOKEN" \\
| jq -r '.value')


curl \${{ vars.CERBERUS_URL }} -H "Authorization: $OIDC" \\
-H "Content-Type: application/json" \\
-d '{"account": "${environment}"}' \\
-o cerberus_output.json

if jq -e '.error == true' cerberus_output.json >/dev/null; then
  cat cerberus_output.json
fi

aws configure set aws_access_key_id $(jq -r '.Credentials | .AccessKeyId' cerberus_output.json) --profile ${awsEnvConfig.profile}
aws configure set aws_secret_access_key $(jq -r '.Credentials | .SecretAccessKey' cerberus_output.json) --profile ${awsEnvConfig.profile}
aws configure set aws_session_token $(jq -r '.Credentials | .SessionToken' cerberus_output.json) --profile ${awsEnvConfig.profile}
aws configure set region ${awsEnvConfig.region} --profile ${awsEnvConfig.profile}`,
        },
        {
            name: 'Show AWS role to be used',
            run: `
aws sts get-caller-identity --profile ${awsEnvConfig.profile} --region ${awsEnvConfig.region}`,
        }
    ];
    return steps.map(step => new step_1.Step(step));
}
class JobClass {
    constructor(name, jobArgs) {
        this.name = name;
        this['runs-on'] = jobArgs.runsOn;
        this['continue-on-error'] = jobArgs.continueOnError;
        this['timeout-minutes'] = jobArgs.timeoutMinutes || 20;
        this.permissions = jobArgs.permissions;
        this.needs = jobArgs.needs;
        this.if = jobArgs.if;
        this.uses = jobArgs.uses;
        this.environment = jobArgs.environment;
        this.concurrency = jobArgs.concurrency;
        this.outputs = jobArgs.outputs;
        this.env = jobArgs.env;
        this.with = jobArgs.with;
        this.secrets = jobArgs.secrets;
        this.defaults = jobArgs.defaults;
        this.strategy = jobArgs.strategy;
        this.container = jobArgs.container;
        this.services = jobArgs.services;
        const envWithSecrets = jobArgs.steps.flatMap(step => Object.values(step['i80-env-with-secrets'] || {}));
        const awsSecretStepDefinition = [
            ...composeAWSSteps('staging', { accountId: '914001248160', region: 'us-east-2', profile: 'default', organizationId: 'o-qd9wutgz18' }),
            new step_1.Step({
                name: 'Fetch declared secrets',
                uses: 'aws-actions/aws-secretsmanager-get-secrets@v2',
                with: {
                    'secret-ids': [...new Set(envWithSecrets.map(secretNameWithVault => secretNameWithVault.split('/')[0]))].join('\n'),
                    'parse-json-secrets': 'true',
                }
            }),
        ];
        const secretStep = envWithSecrets.length > 0 ? awsSecretStepDefinition : [];
        this.steps = [...secretStep, ...jobArgs.steps];
    }
}
exports.JobClass = JobClass;
//# sourceMappingURL=job.js.map