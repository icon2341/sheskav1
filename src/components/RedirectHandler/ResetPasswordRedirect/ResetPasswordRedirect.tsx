import React, {useEffect, useState} from "react";
import {useSearchParams} from "react-router-dom";
import LoadingScreen from "src/components/Utils/LoadingUtils/LoadingScreen";
import {validateToken} from "src/api/Utils/Authentication/TokenSystem";
import {trackPromise, usePromiseTracker} from "react-promise-tracker";
import {ErrorScreen} from "src/components/Utils/ErrorUtils/ErrorScreen";
import ResetPasswordForm from "src/components/Authentication/components/ResetPasswordForm/ResetPasswordForm";

const area = 'ResetPasswordRedirect'
export function ResetPasswordRedirect() {
    let [searchParams] = useSearchParams();
    const [stateError, setStateError] = useState("")
    // const [token, setToken] = useState<string | null>(null)
    const token = searchParams.get('token')
    const { promiseInProgress } = usePromiseTracker({area, delay: 0});


    useEffect(() => {
        if(token === null) {
            console.log('NO TOKEN')
            setStateError('No token provided, please check your email for a password reset link or request one from the login page.')
        }else {
            console.log('ATTEMPTING TO VALIDATE TOKEN: ', token)
            trackPromise(validateToken(token).then((response : any) => {
                if(response.result) {
                    if(response.result.uid) {
                        // token has been validated, so we can now send a password with a new token and the server will be able to change the password
                        console.log('TOKEN VALIDATED, ALLOW USER TO SUBMIT PASSWORD')
                    }
                }
            }).catch((error) => {
                console.log('ERROR MESSAGE: ', error)
                setStateError(error)
            }))
        }
    }, [])

    if(promiseInProgress) {
        return <LoadingScreen/>
    } else if (stateError) {
        return <ErrorScreen errorMessage={stateError}/>
    } else if (token) {
        return <div className={"flex justify-center items-center h-screen"}>
            <ResetPasswordForm token={token}/>
        </div>
    } else return <LoadingScreen/>
}
export default ResetPasswordRedirect;