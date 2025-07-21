import { IDefaultKeyPair } from './common';
export interface IStep {
    name: string;
    id?: string;
    if?: string;
    uses?: string;
    run?: string;
    workingDirectory?: string;
    bash?: string;
    with?: IDefaultKeyPair;
    env?: IDefaultKeyPair;
    secrets?: IDefaultKeyPair;
    continueOnError?: boolean;
    timeoutMinutes?: boolean;
    i80EnvWithSecrets?: {
        [key: string]: string;
    };
}
export declare class StepClass implements IStep {
    name: string;
    id?: string;
    if?: string;
    uses?: string;
    run?: string;
    bash?: string;
    with?: IDefaultKeyPair;
    env?: IDefaultKeyPair;
    secrets?: IDefaultKeyPair;
    'working-directory'?: string;
    'continue-on-error'?: boolean;
    'timeout-minutes'?: boolean;
    'i80-env-with-secrets'?: {
        [key: string]: string;
    };
    constructor(stepArgs: IStep);
}
