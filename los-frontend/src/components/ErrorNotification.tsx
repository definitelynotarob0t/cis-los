import { useSelector } from 'react-redux'
import { RootState } from '../store'

const ErrorNotification = () => {

  const error = useSelector((state: RootState) => state.error)

  if (error.error === null) {
    return
  }

  return (
    <div className="notification">
       <div className="error-notification">{error.error}</div>
    </div>
  )
}

export default ErrorNotification