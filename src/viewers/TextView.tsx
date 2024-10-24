import { useContext, useEffect, useRef, useState } from 'react'
import { Spinner } from '../Layout.tsx'
import ContentHeader from './ContentHeader.tsx'
import { AuthContext } from '../contexts/AuthContext.tsx'

enum LoadingState {
  NotLoaded,
  Loading,
  Loaded
}

interface ViewerProps {
  url: string
  setError: (error: Error | undefined) => void
  setProgress: (progress: number | undefined) => void
}

/**
 * Text viewer component.
 */
export default function TextView({ url, setError }: ViewerProps) {
  const [loading, setLoading] = useState(LoadingState.NotLoaded)
  const [text, setText] = useState<string>()
  const textRef = useRef<HTMLPreElement>(null)
  const auth = useContext(AuthContext)

  // Load plain text content
  useEffect(() => {
    if (!auth) {
      // Auth not loaded yet
      return
    }
    const { fetch } = auth
    async function loadContent() {
      try {
        const res = await fetch(url)
        const text = await res.text()
        if (res.status == 401) {
          setError(new Error(text))
          setText(undefined)
          return
        }
        setError(undefined)
        setText(text)        
      } catch (error) {
        setError(error as Error)
        setText(undefined)
      } finally {
        setLoading(LoadingState.Loaded)
      }
    }

    setLoading((loading)=> {
      // use loading state to ensure we only load content once
      if (loading !== LoadingState.NotLoaded) return loading
      loadContent().catch(() => undefined)
      return LoadingState.Loading
    })
  }, [url, setError, auth])

  const headers = <>
    <span>{text ? newlines(text) : 0} lines</span>
  </>

  // Simple text viewer
  return <ContentHeader content={{ fileSize: text?.length }} headers={headers}>
    <code className='text' ref={textRef}>
      {text}
    </code>

    {loading && <Spinner className='center' />}
  </ContentHeader>
}

function newlines(str: string): string {
  let count = 0
  for (const c of str) {
    if (c === '\n') count++
  }
  return count.toLocaleString('en-US')
}
