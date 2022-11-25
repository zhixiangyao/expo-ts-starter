const formatTime = (date: string) => {
  const month = new Date(date).getMonth() + 1
  const day = new Date(date).getDate()
  const hour = new Date(date).getHours()
  const minute = new Date(date).getMinutes()

  const today = new Date().getDate()

  switch (today - day) {
    case 0:
      return `${hour}点${minute}分`

    case 1:
      return `昨天`

    case 2:
      return `前天`

    default:
      return `${month}月${day}日`
  }
}

export { formatTime }
