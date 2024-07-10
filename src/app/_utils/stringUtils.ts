/**
 * Truncates a file name with extension to a specified length. The file extension is preserved. If the file name is already shorter than the specified length, it is returned as is. The file name is truncated in the middle and an ellipsis is inserted in between file name parts (without extension).
 * @param fileName Full file name with extension
 * @param maxLength Maximum length of the truncated file name
 * @returns Truncated file name with extension
 */
export const truncateFileName = (fileName: string, maxLength: number) => {
  if (fileName.length <= maxLength) {
    return fileName
  }

  const extensionIndex = fileName.lastIndexOf('.')
  const extension = fileName.slice(extensionIndex)
  const extensionLength = extension.length
  const fileNameLength = maxLength - extensionLength - 4
  const fragmentLength = Math.floor(fileNameLength / 2)

  return `${fileName.slice(0, fragmentLength)}...${fileName.slice(extensionIndex - fragmentLength, extensionIndex)}${extension}`
}

/**
 * Pluralizes a noun based on the count. The noun is suffixed with an 's' by default. If the count is 1, the noun is not pluralized.
 * @param count Count of the noun
 * @param noun Noun to pluralize
 * @param suffix Optional suffix to append to the noun
 * @returns Pluralized noun with count
 * @example
 * pluralize(0, 'file') // '0 files'
 * pluralize(1, 'file') // '1 file'
 * pluralize(2, 'file') // '2 files'
 */
export const pluralize = (count: number, noun: string, suffix = 's') =>
  `${count} ${noun}${count !== 1 ? suffix : ''}`

/**
 * Format bytes as human-readable text.
 * @param bytes Number of bytes.
 * @param si True to use metric (SI) units, aka powers of 1000. False to use
 *           binary (IEC), aka powers of 1024.
 * @param dp Number of decimal places to display.
 * @return Formatted string.
 */
export const humanFileSize = (bytes: number, si = true, dp = 1) => {
  const thresh = si ? 1000 : 1024

  if (Math.abs(bytes) < thresh) {
    return bytes + ' B'
  }

  const units = si
    ? ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB']
  let u = -1
  const r = 10 ** dp

  do {
    bytes /= thresh
    ++u
  } while (Math.round(Math.abs(bytes) * r) / r >= thresh && u < units.length - 1)

  return bytes.toFixed(dp) + units[u]
}

/**
 * Extracts the host name from a URL.
 * @param url URL to extract the host name from
 * @returns Host name
 */
export const hostName = (url: string) => {
  const u = new URL(url)
  return u.hostname
}
