'use client'

import { useEffect, useRef } from 'react'

interface BlockcertsVerifierProps {
  src?: string
  allowDownload?: boolean
  allowSocialShare?: boolean
  disableAutoVerify?: boolean
  disableVerify?: boolean
  displayMode?: 'card' | 'fullscreen'
  locale?: string
  theme?: 'bright' | 'dark'
  clickableUrls?: boolean
}

const BlockcertsVerifier: React.FC<BlockcertsVerifierProps> = ({
  src,
  allowDownload = false,
  allowSocialShare = false,
  disableAutoVerify = false,
  disableVerify = false,
  displayMode = 'card',
  locale = 'auto',
  theme = 'bright',
  clickableUrls = false,
}) => {
  const verifierRef = useRef<HTMLElement>(null)

  useEffect(() => {
    // Dynamically import Web Components library
    const loadBlockcerts = async () => {
      if (typeof window !== 'undefined') {
        try {
          await import('@blockcerts/blockcerts-verifier')
        } catch (error) {
          console.error('Failed to load blockcerts-verifier:', error)
        }
      }
    }

    loadBlockcerts()
  }, [])

  return (
    <blockcerts-verifier
      ref={verifierRef}
      src={src}
      allow-download={allowDownload.toString()}
      allow-social-share={allowSocialShare.toString()}
      disable-auto-verify={disableAutoVerify.toString()}
      disable-verify={disableVerify.toString()}
      display-mode={displayMode}
      locale={locale}
      theme={theme}
      clickable-urls={clickableUrls.toString()}
    />
  )
}

export default BlockcertsVerifier