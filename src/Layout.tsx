import { ReactNode, useEffect } from 'react'
import {cn } from './utils.ts'
// import {checkLogin} from './Login.tsx'

interface LayoutProps {
  children: ReactNode
  className?: string
  progress?: number
  error?: Error
  title?: string
}

/**
 * Layout for shared UI.
 * Content div style can be overridden by className prop.
 *
 * @param props
 * @param props.children - content to display inside the layout
 * @param props.className - additional class names to apply to the content container
 * @param props.progress - progress bar value
 * @param props.error - error message to display
 * @param props.title - page title
 */
export default function Layout({ children, className, progress, error, title }: LayoutProps) {
  const errorMessage = error?.toString()
  if (error) console.error(error)

  // useEffect(() => {
  //   checkLogin().catch((e: unknown) => {console.error(e)})
  // }, [])
  // // TODO(SL) use react context instead

  useEffect(() => {
    document.title = title ? `${title} - hyperparam` : 'hyperparam'
  }, [title])

  return <main className='main'>
    <Sidebar />
    <div className='content-container'>
      <div className={cn('content', className)}>
        {children}
      </div>
      <div className={cn('error-bar', error && 'show-error')}>{errorMessage}</div>
    </div>    
    {progress !== undefined && progress < 1 &&
      <div className={'progress-bar'} role='progressbar'>
        <div style={{ width: `${(100 * progress).toString()}%` }} />
      </div>
    }
  </main>
}

function Sidebar() {
  return <nav className='nav'>
    <a className="brand" href='https://hyperparam.app' target="_blank" rel="noreferrer">hyperparam</a>
  </nav>
}

export function Spinner({ className }: { className: string }) {
  return <div className={cn('spinner', className)}></div>
}
