import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import type { ToolSlug } from '@/lib/core/types'
import { TOOLS, getAllSlugs, getToolMeta } from '@/lib/tools/registry'
import StudioClient from './StudioClient'

interface Props { params: { slug: string } }

export function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = getToolMeta(params.slug as ToolSlug)
  if (!meta) return { title: 'Not Found' }
  return {
    title: `${meta.name} Generator — Free Online Tool | Studio BG`,
    description: `Free ${meta.name} background generator. ${meta.description}. Download PNG, JPEG instantly. No signup.`,
  }
}

export default function ToolPage({ params }: Props) {
  const meta = getToolMeta(params.slug as ToolSlug)
  if (!meta) notFound()
  return <StudioClient slug={params.slug as ToolSlug} />
}
