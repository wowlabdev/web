export interface ExceptionRecord {
  fingerprint: string;
  message: string;
  name: string;
  outcome: string;
  route: string;
  script: string;
  source: string;
  stack: string;
  version: string;
}

export interface TailEnvironment {
  ERRORS: AnalyticsEngineDataset;
}
