import React from 'react';
import {LoadingIndicator} from "./LoadingIndicator";
export function LoadingScreen() {
    const style = {
        fontFamily: 'Roboto, sans-serif',
        fontWeight: '300'
    }
    return (
        <div className='d-flex flex-md-column justify-content-center align-items-center' style={{ height: '100vh', width: '100vw' }}>
            <LoadingIndicator/>
            <h4 className={`text-muted`} style={style}>Just setting up some things.</h4>
        </div>
    );

}


export default LoadingScreen;