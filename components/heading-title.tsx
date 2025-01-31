import React from 'react'

interface HeadingTitleProps {
    title: string
    children?: React.ReactNode
}
const HeadingTitle = ({ title, children }: HeadingTitleProps) => {
    return (
        <div className='mt-5 justify-between items-center flex flex-row   '>
            <p className='font-bold text-4xl'>{title}</p>
            {children}
        </div>
    )
}

export default HeadingTitle