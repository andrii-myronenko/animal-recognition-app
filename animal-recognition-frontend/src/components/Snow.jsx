import React from 'react'
import './Snow.scss'

export default function Snow() {
    return (
        <>
            {(new Array(100)).fill(0).map((_, index) => <div className="snow" key={`snow ${index}`}></div>)}
        </>
    )
}
