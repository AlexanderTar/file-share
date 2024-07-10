/* eslint-disable @next/next/no-img-element */
'use client'

import { useQuery } from '@tanstack/react-query'
import { Share } from '@/app/_types/share'
import { truncateFileName } from '@/app/_utils/stringUtils'
import { useEffect } from 'react'
import { notFound } from 'next/navigation'

const useShare = (shareId: string) => {
  return useQuery({
    queryKey: ['share', { shareId }],
    queryFn: async () => {
      const response = await fetch(`/api/share/${shareId}`, {
        method: 'GET',
      })
      return (await response.json()) as Share
    },
  })
}

interface ShareProps {
  shareId: string
}

export default function Page({ params }: { params: ShareProps }) {
  const { shareId } = params
  const { data: share } = useShare(shareId)

  useEffect(() => {
    if (!share) return
    const now = new Date()
    const expiresAt = new Date(share.expiresAt)
    if (expiresAt < now) {
      notFound()
    }
  }, [share])

  return (
    <div className="flex w-screen flex-col gap-4 px-10 py-10 md:flex-row">
      <div className="flex grow flex-col gap-4">
        <p className="border-transparent bg-transparent text-3xl outline-none placeholder:text-gray-200 focus:border-transparent focus:ring-0 xl:col-span-4">
          {share?.name}
        </p>
        <div className="grid h-max w-max grow grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {share?.files.map((file) => (
            <a key={file.name} href={file.url} target="_blank">
              <div className="cursor-pointer">
                <img className="h-32 w-32 rounded-lg" src={file.url} alt="" />
                <p className="text-xs">{truncateFileName(file.name, 20)}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
