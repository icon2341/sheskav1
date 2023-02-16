import React, {useRef, useState} from "react";
import  {useCallback} from 'react'
import {useDropzone} from 'react-dropzone'
import any = jasmine.any;

function MyDropzone() {
    const onDrop = useCallback((acceptedFiles: any) => {
        // Do something with the files
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            {
                isDragActive ?
                    <p>Drop the files here ...</p> :
                    <p>Drag 'n' drop some files here, or click to select files</p>
            }
        </div>
    )
}

export default MyDropzone