import {IDefaultKeyPair} from './common';

export interface IStep {
  name: string,
  id?: string,
  if?: string,
  uses?: string,
  run?: string,
  workingDirectory?: string,
  bash?: string,
  with?: IDefaultKeyPair, 
  env?: IDefaultKeyPair,
  secrets?: IDefaultKeyPair,
  continueOnError?: boolean,
  timeoutMinutes?: boolean,
  i80EnvWithSecrets?: { [key: string]: string },
}

export class StepClass implements IStep {
  public name: string;
  public id?: string;
  public if?: string;
  public uses?: string;
  public run?: string;
  public bash?: string;
  public with?: IDefaultKeyPair;
  public env?: IDefaultKeyPair;
  public secrets?: IDefaultKeyPair;
  public 'working-directory'?: string;
  public 'continue-on-error'?: boolean;
  public 'timeout-minutes'?: boolean;
  public 'i80-env-with-secrets'?: { [key: string]: string };

  constructor(stepArgs: IStep) {
    this.name = stepArgs.name;
    this.id = stepArgs.id
    this.if = stepArgs.if
    this.uses = stepArgs.uses
    this.bash = stepArgs.bash
    this.run = stepArgs.run
    this.with = stepArgs.with
    this.env = stepArgs.env
    this.secrets = stepArgs.secrets
    this['i80-env-with-secrets'] = stepArgs.i80EnvWithSecrets
    this['working-directory'] = stepArgs.workingDirectory
    this['continue-on-error'] = stepArgs.continueOnError
    this['timeout-minutes'] = stepArgs.timeoutMinutes
  }
}
