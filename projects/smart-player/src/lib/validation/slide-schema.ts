import { z } from 'zod';

export const SlideNodeBaseSchema = z.object({
  id: z.string({ required_error: '"id" est requis' }).min(1, '"id" ne peut pas être vide'),
  type: z.string({ required_error: '"type" est requis' }).min(1, '"type" ne peut pas être vide'),
  content: z.unknown(),
  language: z.string().optional(),
  label: z.string().optional(),
  meta: z.record(z.unknown()).optional(),
}).passthrough();

export const SlideBaseSchema = z.object({
  id: z.string({ required_error: '"id" est requis' }).min(1, '"id" ne peut pas être vide'),
  title: z.string({ required_error: '"title" est requis' }).min(1, '"title" ne peut pas être vide'),
  description: z.string().optional(),
  tags: z.array(z.string({ message: 'Chaque tag doit être une chaîne' })).optional(),
  nodes: z.array(SlideNodeBaseSchema, { message: '"nodes" doit être un tableau de nœuds' }),
}).passthrough();

export type SlideNodeBase = z.infer<typeof SlideNodeBaseSchema>;
export type SlideBase = z.infer<typeof SlideBaseSchema>;
