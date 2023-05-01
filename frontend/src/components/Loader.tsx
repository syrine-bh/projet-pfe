import React from 'react'

import '../stylesheets/loading-spinner.css'
function Loader() {
    return (
        <div className='loading_container'>
            <div className='lds-ellipsis'>
                <div></div>
                <div></div>
                <div></div>
                <div></div>
            </div>
        </div >
    )
}

export default Loader