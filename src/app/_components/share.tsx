import { useState } from 'react'
import { File } from '@/app/_types/file'
import { useQuery } from '@tanstack/react-query'

interface ShareProps {
  shareId: string
  edit?: boolean
}

const useShare = (shareId: string) => {
  return useQuery({
    queryKey: ['share', { shareId }],
    queryFn: async () => {
      const response = await fetch(`/api/share/${shareId}`, {
        method: 'GET',
      })
      return response.json()
    },
  })
}

export const Share = ({ shareId, edit = false }: ShareProps) => {
  const [files, setFiles] = useState<File[]>([])

  return (
    <div className="container relative">
      <div className="fixed left-0 right-0 top-0">Contacts</div>
      <div>
        <div>
          {/* <img src="..." /> */}
          <strong>Andrew Alfred</strong>
        </div>
        <div>
          {/* <img src="..." /> */}
          <strong>Debra Houston</strong>
        </div>
      </div>
    </div>
  )
}
