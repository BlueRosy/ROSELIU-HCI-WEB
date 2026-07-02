export type PipelineZoneId = "signals" | "states" | "support";

export type AtlasSelection =
  | { kind: "pipeline"; id: PipelineZoneId }
  | { kind: "loop"; key: string };

export const PIPELINE_ZONES: PipelineZoneId[] = ["signals", "states", "support"];
