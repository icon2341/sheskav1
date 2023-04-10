import ProfilePane from "./Panes/ProfilePane/ProfilePane";
import switcherStyles from './SettingsPaneSwithcer.module.scss';
import {PANE_SUBTITLES} from "./PANE_SUBTITLES";

export function SettingsPaneSwticher(props: {activePage: string}) {
    const activePage = () => {
        switch (props.activePage) {
            case 'My Profile':

                return <ProfilePane />;
            // case 'Billing':
            //     return <BillingPane />;
            // case 'Notifications':
            //     return <NotificationsPane />;
            // case 'Security':
            //     return <SecurityPane />;
        }

    };



    return (
        <div>
            <h2 className={switcherStyles.paneTitle}>{props.activePage}</h2>
            <h3 className={`${switcherStyles.paneSubtitle} text-muted`}>
                {PANE_SUBTITLES[props.activePage]}
            </h3>
            {activePage()}
        </div>
    )
}

export default SettingsPaneSwticher;