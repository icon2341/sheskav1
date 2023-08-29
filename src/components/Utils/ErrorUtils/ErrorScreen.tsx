

export function ErrorScreen(props: {errorMessage: string}) {
    return (
        <div>
            <h1>There was an issue completing this request!</h1>
            <p>{props.errorMessage}</p>
        </div>
    )
}