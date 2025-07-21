"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StepClass = void 0;
class StepClass {
    constructor(stepArgs) {
        this.name = stepArgs.name;
        this.id = stepArgs.id;
        this.if = stepArgs.if;
        this.uses = stepArgs.uses;
        this.bash = stepArgs.bash;
        this.run = stepArgs.run;
        this.with = stepArgs.with;
        this.secrets = stepArgs.secrets;
        this['i80-env-with-secrets'] = stepArgs.i80EnvWithSecrets;
        this['working-directory'] = stepArgs.workingDirectory;
        this['continue-on-error'] = stepArgs.continueOnError;
        this['timeout-minutes'] = stepArgs.timeoutMinutes;
        let decodedSecretEnv = {};
        if (stepArgs.i80EnvWithSecrets) {
            decodedSecretEnv = Object.entries(stepArgs.i80EnvWithSecrets).reduce((acc, [key, value]) => {
                return { ...acc, [key]: transformSecretEnvToRegularEnv(key, value) };
            }, {});
        }
        this.env = { ...stepArgs.env, ...decodedSecretEnv };
    }
}
exports.StepClass = StepClass;
function transformSecretEnvToRegularEnv(key, value) {
    const envValue = value.replace('/', '_').replace('-', '_').toUpperCase();
    return {
        [key]: '${{ env.' + envValue + ' }}'
    };
}
//# sourceMappingURL=step.js.map