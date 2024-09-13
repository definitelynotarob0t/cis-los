import { useSelector } from 'react-redux'
import { RootState } from '../store'

const ErrorNotification = () => {

  const error = useSelector((state: RootState) => state.error)

  if (error.error === null) {
    return
  }

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    backgroundColor: 'red'
  }
  return (
    <div style={style}>
      {error.error}
    </div>
  )
}

export default ErrorNotification