import styles from './SettingsNavButton.module.scss';
export function SettingsNavButton(props: {title: string, icon: any, active: boolean}) {
    const color = props.active ? 'white' : 'black';
    const size = 28;

    return (
        <div className={`${styles.buttonContainer} ${props.active ? styles.buttonContainerActive : ''}`}>
            <props.icon color={color} className={styles.navIcon} size={size}/>
            <h3 className={styles.navText}>{props.title}</h3>
        </div>
    )
}

export default SettingsNavButton;