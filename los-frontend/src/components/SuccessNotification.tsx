import { useSelector } from "react-redux";
import { RootState } from "../store";

const SuccessNotification = () => {

	const notification = useSelector((state: RootState) => state.notification);

	if (notification.notification === null) {
		return;
	}

	return (
		<div className="notification">
			<div className="success-notification"><strong>{notification.notification}</strong></div>   
		</div>
	);
};

export default SuccessNotification;