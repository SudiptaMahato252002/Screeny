'use client'

import React, { useEffect, useState } from 'react'
import Image from 'next/image'

interface CopyLinkButtonProps {
  videoId: string
}

const CopyLinkButton = ({ videoId }: CopyLinkButtonProps) => {
  const [copied, setCopied] = useState<boolean>(false)

  useEffect(() => {
    const changeChecked = setTimeout(() => {
      if (copied) setCopied(false)
    }, 2000)

    return () => clearTimeout(changeChecked)
  }, [copied])

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/video/${videoId}`)
    setCopied(true)
  }

  return (
    <button onClick={handleCopyLink}>
      <Image
        src={copied ? '/assets/images/checked.png' : '/assets/icons/link.svg'}
        alt='copy-link'
        height={24}
        width={24}
      />
    </button>
  )
}

export default CopyLinkButton