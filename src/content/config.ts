import { defineCollection, z } from 'astro:content';

const pages = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    hero_main: z.object({
      badge: z.string(),
      headline: z.string(),
      subheadline: z.string(),
      primary_cta_label: z.string(),
      primary_cta_target: z.string(),
    }),
    hero_status_quo: z.object({
      badge: z.string(),
      headline: z.string(),
      subheadline: z.string(),
    }),
    hero_purpose: z.object({
      badge: z.string(),
      headline: z.string(),
      subheadline: z.string(),
      primary_cta_label: z.string(),
      primary_cta_target: z.string(),
    }),
    hero_day_one: z.object({
      badge: z.string(),
      headline: z.string(),
      subheadline: z.string(),
      primary_cta_label: z.string(),
      primary_cta_target: z.string(),
    }),
    hero_call_to_action: z.object({
      badge: z.string(),
      headline: z.string(),
      subheadline: z.string(),
      primary_cta_label: z.string(),
      primary_cta_target: z.string(),
    }),
    why_section: z.object({
      title: z.string(),
      description: z.string(),
    }),
    accordion_items: z.array(z.object({
      title: z.string(),
      content: z.string(),
      defaultOpen: z.boolean().optional(),
    })),
    intake_anchor: z.object({
      title: z.string(),
      description: z.string(),
      cta_label: z.string(),
      cta_target: z.string(),
    }),
  }),
});

export const collections = { pages };