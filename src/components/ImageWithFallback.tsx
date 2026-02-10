import React, { useState } from 'react'

const ERROR_IMG_SRC =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODgiIGhlaWdodD0iODgiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgc3Ryb2tlPSIjMDAwIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBvcGFjaXR5PSIuMyIgZmlsbD0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIzLjciPjxyZWN0IHg9IjE2IiB5PSIxNiIgd2lkdGg9IjU2IiByeD0iNiIvPjxwYXRoIGQ9Im0xNiA1OCAxNi0xOCAzMiAzMiIvPjxjaXJjbGUgY3g9IjUzIiBjeT0iMzUiIHI9IjciLz48L3N2Zz4KCg=='

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
