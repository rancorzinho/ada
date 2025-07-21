"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JobClass = void 0;
const step_1 = require("../../workflows/step");
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
        const declaredSecrets = jobArgs.steps.flatMap(step => step['i80-declared-secrets'] || []);
        const awsSecretStepDefinition = {
            name: 'Fetch declared secrets',
            uses: 'aws-actions/aws-secretsmanager-get-secrets@v2',
            with: {
                'secret-ids': declaredSecrets.join('\n'),
                'parse-json-secrets': 'true',
            }
        };
        jobArgs.steps.map(step => delete step['i80-declared-secrets']);
        const secretStep = declaredSecrets.length > 0 ? [new step_1.Step(awsSecretStepDefinition)] : [];
        this.steps = [...secretStep, ...jobArgs.steps];
    }
}
exports.JobClass = JobClass;
//# sourceMappingURL=job.js.map