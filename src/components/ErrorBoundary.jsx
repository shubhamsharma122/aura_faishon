import React from 'react'
import { FaRedoAlt, FaHome } from 'react-icons/fa'
import { Link } from 'react-router-dom'

/**
 * ErrorBoundary — catches uncaught render/lifecycle errors anywhere below it
 * and shows a calm fallback instead of a blank white screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null }
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    console.error('[AuraFashion ErrorBoundary]', error, info?.componentStack)
  }

  reset = () => this.setState({ error: null })

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center">
        <p className="eyebrow">Unexpected error</p>
        <h1 className="mt-4 max-w-xl font-display text-3xl uppercase leading-[1.05] tracking-[.01em]">
          We hit a boundary on this play.
        </h1>
        <p className="mt-4 max-w-md text-sm leading-relaxed text-muted">
          Something went wrong while rendering this page. Your bag is saved — reload to get back into the game.
        </p>
        {this.state.error?.message && (
          <code className="mt-5 max-w-md truncate border border-ink/15 bg-mist px-3 py-2 text-[11px] text-muted">
            {this.state.error.message}
          </code>
        )}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={this.reset} className="btn-primary">
            <FaRedoAlt size={10} /> Try again
          </button>
          <Link to="/" onClick={this.reset} className="btn-outline">
            <FaHome size={10} /> Back to home
          </Link>
        </div>
      </div>
    )
  }
}
