export const PIPELINE_NODES = [
  "SPECIFY",
  "PLAN",
  "TASKS",
  "IMPLEMENT",
  "PR",
  "CI",
  "PREVIEW",
  "DEPLOY",
] as const;

export type PipelineNodeLabel = (typeof PIPELINE_NODES)[number];
