export class TavusHttpError extends Error {
  readonly status: number
  readonly details?: string

  constructor(message: string, status: number, details?: string) {
    super(message)
    this.name = 'TavusHttpError'
    this.status = status
    this.details = details
  }
}

export function statusForTavusError(error: unknown): number {
  if (error instanceof TavusHttpError) {
    return error.status
  }

  if (error instanceof Error) {
    if (error.message.includes('not configured') || error.message.includes('not set')) {
      return 500
    }
    if (error.message.includes('pal_id') || error.message.includes('face_id')) {
      return 400
    }
  }

  return 502
}
