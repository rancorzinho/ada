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
        const secrets = jobArgs.steps.flatMap(step => step['with-secrets'] || []);
        const secretStep = secrets.length > 0 ? [new step_1.Step({ name: 'set-secrets', run: `echo "Setting secrets: ${secrets.join(', ')}"` })] : [];
        this.steps = [...secretStep, ...jobArgs.steps];
    }
}
exports.JobClass = JobClass;
//# sourceMappingURL=job.js.map