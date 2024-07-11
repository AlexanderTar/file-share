'use client'

import { humanFileSize, pluralize } from '@/app/_utils/stringUtils'
import { UploadIcon } from '../_icons/upload'

interface ControlsProps {
  files: { size: number }[]
  disabled: boolean
  onDropTriggered: () => void
  onSubmitted: (formData: FormData) => void
}

export default function Controls({
  files,
  disabled = true,
  onDropTriggered,
  onSubmitted,
}: ControlsProps) {
  return (
    <div className="flex h-fit min-w-80 flex-col gap-4 rounded-lg border border-gray-300 p-3">
      {files.length === 0 ? (
        <div
          className="flex cursor-pointer flex-row items-center justify-center gap-2"
          onClick={onDropTriggered}
        >
          <UploadIcon className="h-6 w-6 fill-white" />
          <div className="flex flex-col items-start justify-center">
            <p className="text-lg font-bold">Upload files</p>
            <p className="text-lg text-gray-200">or drag & drop files anywhere</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-start justify-center">
          <div className="flex flex-row items-start justify-center gap-3">
            <p className="text-lg font-bold">{pluralize(files.length, 'file')}</p>
            <p className="text-lg text-gray-300">
              {humanFileSize(files.reduce((size, file) => size + file.size, 0))}
            </p>
          </div>
          <p className="cursor-pointer text-lg text-gray-200" onClick={onDropTriggered}>
            Add more
          </p>
        </div>
      )}
      <form action={onSubmitted} className="flex flex-col items-start justify-center gap-2">
        <label htmlFor="expires" className="text-sm font-extrabold">
          Link expires
        </label>
        <select
          id="expires"
          name="expires"
          defaultValue="never"
          className="text-md border-transparent bg-transparent outline-none placeholder:text-gray-200 focus:border-transparent focus:ring-0"
        >
          <option value="hour">1 hour</option>
          <option value="day">1 day</option>
          <option value="week">1 week</option>
          <option value="never">Never</option>
        </select>
        <label htmlFor="password" className="text-sm font-extrabold">
          Password
        </label>
        <input
          type="password"
          name="password"
          className="text-md border-transparent bg-transparent outline-none placeholder:text-gray-200 focus:border-transparent focus:ring-0"
          placeholder="Password (optional)"
        />
        <button
          type="submit"
          disabled={disabled}
          className="text-primary-foreground hover:scale-1025 h-10 w-full rounded-lg bg-indigo-700 px-4 py-2 font-bold shadow-lg transition duration-300 ease-in-out active:scale-95 active:after:scale-[1.0] disabled:pointer-events-none disabled:opacity-50"
        >
          Share
        </button>
      </form>
    </div>
  )
}
