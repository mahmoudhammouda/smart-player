import { z } from "zod";

export const nodeTypeSchema = z.enum([
  "text",
  "math",
  "code",
  "diagram",
  "interactive-sandbox",
]);

export type NodeType = z.infer<typeof nodeTypeSchema>;

export const slideNodeSchema = z.object({
  id: z.string(),
  type: nodeTypeSchema,
  content: z.string(),
  language: z.string().optional(),
  label: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
});

export type SlideNode = z.infer<typeof slideNodeSchema>;

export const slideSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  tags: z.array(z.string()).optional(),
  nodes: z.array(slideNodeSchema),
});

export type Slide = z.infer<typeof slideSchema>;

export const scenarioSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  description: z.string(),
  slide: slideSchema,
});

export type Scenario = z.infer<typeof scenarioSchema>;
