'use client'

export default function SkipToContent() {
  const handleSkip = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    const main = document.querySelector('main')
    if (main) {
      main.setAttribute('tabindex', '-1')
      main.focus()
      // Remove tabindex after focus to restore natural tab order
      setTimeout(() => main.removeAttribute('tabindex'), 100)
    }
  }

  return (
    <a
      href="#main-content"
      onClick={handleSkip}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-sendmarc-blue-500 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-sendmarc-blue-600"
    >
      Skip to main content
    </a>
  )
}
