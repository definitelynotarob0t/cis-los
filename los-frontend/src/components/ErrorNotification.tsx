import { useSelector } from "react-redux";
import { RootState } from "../store";

const ErrorNotification = () => {

	const error = useSelector((state: RootState) => state.error);

	if (error.error === null) {
		return;
	}

	return (
		<div>
			<div className="error-notification"><strong>{error.error}</strong></div>
		</div>
	);
};

export default ErrorNotification;