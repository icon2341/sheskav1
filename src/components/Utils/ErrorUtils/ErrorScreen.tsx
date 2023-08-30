import React from "react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "src/components/ui/alert-dialog"
import {useNavigate} from "react-router-dom";

//TOOD make this a generic error screen that can be used anywhere, pass two functions as props to handle the buttons and show the buttons conditionally if functions are passed
export function ErrorScreen(props: {errorMessage: string}) {
    const navigate = useNavigate();

    return (
        <div>
            <AlertDialog defaultOpen={true}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>There was an issue completing this request!</AlertDialogTitle>
                        <AlertDialogDescription>
                            {props.errorMessage}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => {navigate('/')}}>Go Home</AlertDialogCancel>
                        <AlertDialogAction onClick={() => {navigate('/resetpassword')}}>Go Back to Reset Password</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    )
}