import React, { useState } from 'react'

export function ImageWithFallback(props: React.ImgHTMLAttributes<HTMLImageElement> & { fallbackText?: string }) {
    const [didError, setDidError] = useState(false)

    const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        setDidError(true)
        if (props.onError) {
            props.onError(e)
        }
    }

    const { src, alt, style, className, fallbackText, ...rest } = props

    return didError ? (
        <div
            className={`inline-block bg-gray-900 text-center align-middle ${className ?? ''}`}
            style={{ ...style, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}
        >
            <div className="text-[#00FF00] font-mono text-xs p-2 text-center">
                {fallbackText || alt || 'Image Error'}
            </div>
        </div>
    ) : (
        <img src={src} alt={alt} className={className} style={style} {...rest} onError={handleError} />
    )
}
