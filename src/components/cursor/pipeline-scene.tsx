"use client";

import { PIPELINE_NODES } from "@/lib/constants/pipeline-nodes";
import { PipelineNode } from "./pipeline-node";

const NODE_SPACING = 4;

export function PipelineScene({ litIndex = -1 }: { litIndex?: number }) {
  return (
    <group>
      {PIPELINE_NODES.map((label, i) => (
        <PipelineNode
          key={label}
          label={label}
          position={[0, -i * NODE_SPACING, 0]}
          isVercel={i === PIPELINE_NODES.length - 1}
          isLit={i <= litIndex}
        />
      ))}
    </group>
  );
}
