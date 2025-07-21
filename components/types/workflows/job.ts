import {IDefaultKeyPair, IWorkflowDefaults, IConcurrency} from './common';
import { Step } from '../../workflows/step';
import {IPermission} from './permission';

interface IMatrix {
  [key: string]: any,
}

interface IStrategy {
  matrix?: IMatrix,
  'fail-fast'?: boolean,
  'max-parallel'?: number
  include?: IEnv[]
  exclude?: IEnv[]
}

interface ICredentials {
  username: string
  password: string
}

interface IEnv {
  [key: string]: any
}

interface IContainer {
  image: string,
  credentials?: ICredentials,
  env?: IEnv
  ports?: number[],
  volumes?: string[]
  options?: string
}

interface IService {
  image: string
  ports?: string[]
  credentials?: ICredentials
  env?: IEnv
  volumes?: string[]
  options?: string
}

export interface IJob {
  runsOn: "ubuntu-latest"| "windows-latest"| "macos-latest" | string
  timeoutMinutes?: Number
  steps: Step[]
  permissions?: IPermission
  needs?: string[]
  if?: string
  uses?: string
  environment?: string | {name: string, url: string}
  concurrency?: IConcurrency | string
  outputs?: IDefaultKeyPair
  env?: IDefaultKeyPair
  with?: IDefaultKeyPair
  secrets?: IDefaultKeyPair | 'inherit'
  defaults?: IWorkflowDefaults
  strategy?: IStrategy
  continueOnError?: boolean
  container?: IContainer | string
  services?: IService
}

export class JobClass {
  public name: string
  public 'runs-on': 'ubuntu-latest'| 'windows-latest' | 'macos-latest' | string
  public 'timeout-minutes'?: Number
  public permissions?: IPermission
  public needs?: string[]
  public if?: string
  public uses?: string
  public environment?: string | {name: string, url: string}
  public concurrency?: IConcurrency | string
  public outputs?: IDefaultKeyPair
  public env?: IDefaultKeyPair
  public with?: IDefaultKeyPair
  public secrets?: IDefaultKeyPair | 'inherit'
  public defaults?: IWorkflowDefaults
  public strategy?: IStrategy
  public 'continue-on-error'?: boolean
  public container?: IContainer | string
  public services?: IService
  public steps: Step[]

  constructor(name: string, jobArgs: IJob) {
    this.name = name 
    this['runs-on'] = jobArgs.runsOn 
    this['continue-on-error'] = jobArgs.continueOnError
    this['timeout-minutes'] = jobArgs.timeoutMinutes || 20
    this.permissions = jobArgs.permissions
    this.needs = jobArgs.needs
    this.if = jobArgs.if
    this.uses = jobArgs.uses
    this.environment = jobArgs.environment
    this.concurrency = jobArgs.concurrency
    this.outputs = jobArgs.outputs
    this.env = jobArgs.env
    this.with = jobArgs.with
    this.secrets = jobArgs.secrets
    this.defaults = jobArgs.defaults
    this.strategy = jobArgs.strategy
    this.container = jobArgs.container
    this.services = jobArgs.services

    const declaredSecrets = jobArgs.steps.flatMap(step => step['i80-declared-secrets'] || []);
    const awsSecretStepDefinition = { 
      name: 'Fetch declared secrets', 
      uses: 'aws-actions/aws-secretsmanager-get-secrets@v2',
      with: {
        'secret-ids': declaredSecrets.join('\n'),
        'parse-json-secrets': 'true',
      }
    }
    jobArgs.steps.map(step => delete step['i80-declared-secrets']);

    const secretStep = declaredSecrets.length > 0 ? [ new Step(awsSecretStepDefinition)] : [];
    this.steps = [...secretStep, ...jobArgs.steps];
  }
}
