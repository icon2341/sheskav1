import {useAuthState} from "react-firebase-hooks/auth";
import {auth} from "../../index";

export function EditItem() {
    const [user, loading, error] = useAuthState(auth);


}

export default EditItem;