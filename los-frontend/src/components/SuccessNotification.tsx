import { useSelector } from 'react-redux'
import { RootState } from '../store'

const SuccessNotification = () => {

  const notification = useSelector((state: RootState) => state.notification)

  if (notification.notification === null) {
    return
  }

  return (
    <div className="success-notification">
      {notification.notification}
    </div>
  )
}

export default SuccessNotification