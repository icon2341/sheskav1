import {InfinitySpin, LineWave} from 'react-loader-spinner';

export const LoadingIndicator = () => {
    const style = {
        marginTop: '-15px',
        marginRight: '-10px',
    }

    return (
        <div style={style}>
            <LineWave
                width='200'
                color="#24475B"
            />
        </div>
    )
}