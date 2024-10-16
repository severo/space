import { asyncBufferFromUrl, parquetQuery } from 'hyparquet'
import { compressors } from 'hyparquet-compressors'
import type { ParquetReadWorkerOptions } from './types.ts'

self.onmessage = async ({ data }: { data: ParquetReadWorkerOptions}) => {
  const { metadata, asyncBuffer, rowStart, rowEnd, orderBy } = data
  const file = await asyncBufferFromUrl(asyncBuffer.url)
  try {
    const result = await parquetQuery({
      metadata, file, rowStart, rowEnd, orderBy, compressors,
    })
    self.postMessage({ result })
  } catch (error) {
    self.postMessage({ error })
  }
}