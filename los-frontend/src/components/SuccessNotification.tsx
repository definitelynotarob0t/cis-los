import { useSelector } from 'react-redux'
import { RootState } from '../store'

const SuccessNotification = () => {

  const notification = useSelector((state: RootState) => state.notification)

  if (notification.notification === null) {
    return
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    backgroundColor: 'green'
  }
  return (
    <div style={style}>
      {notification.notification}
    </div>
  )
}

export default SuccessNotification