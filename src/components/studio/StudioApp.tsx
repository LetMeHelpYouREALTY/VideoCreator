'use client'

import { CVIProvider } from '@/components/cvi/components/cvi-provider'
import { StudioClient } from '@/components/studio/StudioClient'

export function StudioApp() {
  return (
    <CVIProvider>
      <StudioClient />
    </CVIProvider>
  )
}
