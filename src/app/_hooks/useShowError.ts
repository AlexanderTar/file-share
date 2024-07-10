import { useCallback } from 'react'
import { toast } from 'sonner'

export const useShowError = () => {
  return useCallback((error: unknown, id?: string) => {
    if (
      typeof error === 'object' &&
      error !== null &&
      'message' in error &&
      typeof error.message === 'string'
    ) {
      toast.error(error.message, { id })
    } else if (typeof error === 'string') {
      toast.error(error, { id })
    } else {
      toast.error('Unexpected error', { id })
    }
  }, [])
}
