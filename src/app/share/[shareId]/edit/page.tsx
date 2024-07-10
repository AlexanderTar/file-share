/* eslint-disable @next/next/no-img-element */
'use client'

import { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { hostName, pluralize, truncateFileName } from '@/app/_utils/stringUtils'
import Controls from '@/app/_components/controls'
import { upload } from '@vercel/blob/client'
import moment from 'moment'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Share, ShareRequest } from '@/app/_types/share'
import { useShowError } from '@/app/_hooks/useShowError'
import { toast } from 'sonner'
import { PulseLoader } from 'react-spinners'

const useUpdateShare = (
  shareId: string,
  options?: {
    onError?: (error: unknown) => void
    onSuccess?: (data: Share) => void
  },
) => {
  return useMutation({
    ...options,
    mutationKey: ['updateShare'],
    mutationFn: async (data: ShareRequest) => {
      const response = await fetch(`/api/share/${shareId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      const resp = await response.json()
      return resp
    },
  })
}

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

  const [name, setName] = useState<string>()
  const [newFiles, setNewFiles] = useState<
    (File & { preview: string; url: string; downloadUrl: string; contentType?: string })[]
  >([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([])

  const showError = useShowError()

  useEffect(() => {
    if (!share) return
    setName(share.name)
  }, [share])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setIsUploading(true)
      setUploadingFiles(acceptedFiles)
      const newFiles = (
        await Promise.all(
          acceptedFiles.map(async (file) => {
            try {
              const blob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/file',
              })

              return Object.assign(file, {
                url: blob.url,
                downloadUrl: blob.downloadUrl,
                contentType: blob.contentType,
                preview: URL.createObjectURL(file),
              })
            } catch (error) {
              showError(error)
              return null
            }
          }),
        )
      ).filter((file) => file !== null)
      setNewFiles((prevFiles) => [...prevFiles, ...newFiles])
      setIsUploading(false)
      setUploadingFiles([])
    },
    [showError],
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    noClick: true,
    noKeyboard: true,
  })

  const { mutate: updateShare, isPending } = useUpdateShare(shareId, {
    onError: showError,
    onSuccess: (data) => {
      const host = hostName(window.location.href)
      navigator.clipboard.writeText(`${host}/share/${data.id}/view`)
      toast.success('Successfully copied the link to clipboard!')
    },
  })

  const onSubmit = (formData: FormData) => {
    const expires = formData.get('expires') as string
    const password = formData.get('password') as string | null
    var expiresAt = new Date()
    switch (expires) {
      case 'hour':
        expiresAt = moment(expiresAt).add(1, 'hour').toDate()
        break
      case 'day':
        expiresAt = moment(expiresAt).add(1, 'day').toDate()
        break
      case 'week':
        expiresAt = moment(expiresAt).add(7, 'day').toDate()
        break
      case 'never':
        expiresAt = new Date(9999, 11, 31, 23, 59, 59, 999)
        break
    }
    updateShare({
      name: name!!,
      expiresAt: expiresAt.getTime(),
      password: password || undefined,
      files: [
        ...share!!.files,
        ...newFiles.map((file) => ({
          name: file.name,
          url: file.url,
          downloadUrl: file.downloadUrl,
          contentType: file.contentType,
        })),
      ],
    })
  }

  return (
    <div className="relative">
      <div className="absolute -z-50 h-screen w-screen" {...getRootProps()}>
        <input className="h-screen w-screen" {...getInputProps()} />
      </div>
      <div className="flex w-screen flex-col gap-4 px-10 py-10 md:flex-row">
        <div className="flex grow flex-col gap-4">
          <input
            type="text"
            placeholder="New file share"
            className="border-transparent bg-transparent text-3xl outline-none placeholder:text-gray-200 focus:border-transparent focus:ring-0 xl:col-span-4"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
          />
          <div className="grid h-max w-max grow grid-cols-2 gap-6 sm:grid-cols-4 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
            {share?.files.map((file) => (
              <a key={file.name} href={file.url} target="_blank">
                <div className="cursor-pointer">
                  <img className="h-32 w-32 rounded-lg" src={file.url} alt="" />
                  <p className="text-xs">{truncateFileName(file.name, 20)}</p>
                </div>
              </a>
            ))}
            {newFiles.map((file) => (
              <a key={file.name} href={file.preview} target="_blank">
                <div className="cursor-pointer">
                  <img className="h-32 w-32 rounded-lg" src={file.preview} alt="" />
                  <p className="text-xs">{truncateFileName(file.name, 20)}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Controls
            files={[...(share?.files || []), ...(newFiles || [])]}
            onDropTriggered={open}
            onSubmitted={onSubmit}
            disabled={!name || !share?.files.length || isPending}
          />
          {isUploading && (
            <div className="-mx-5 flex w-full flex-row items-center justify-center gap-2">
              <PulseLoader color="#fff" loading={true} size={10} />
              <p className="text-lg">{`Uploading ${pluralize(uploadingFiles.length, 'file')}`}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
