import React from 'react'

import '../../stylesheets/comment-loader.css'
import { getRandomInt } from '../../config'

function CommentLoader() {



    const fullNameWidth = getRandomInt(30,50)
    const commentWidth = getRandomInt(70,100)
    const dateWidth = getRandomInt(25,40) 

    return (
        // <div>
        //     <div className="box shine"></div>

        //     <div className='lines-container'>
        //         <div className="lines shine"></div>
        //         <div className="lines shine"></div>
        //         <div className="lines shine"></div>
        //     </div>
        // </div>
        <div className="media mb-4 d-flex align-items-start">
            <div className="avatar avatar-sm flex-shrink-0">
                <div className="box shine"></div>
            </div>

            <div className='lines-container'>
                <div style={{ marginTop: 0, width: `${fullNameWidth}%` }} className="lines shine"></div>
                <div style={{ width: `${commentWidth}%` }} className="lines shine"></div>
                <div style={{ width: `${dateWidth}%` }} className="lines shine"></div>
            </div>

        </div>
    )
}

export default CommentLoader