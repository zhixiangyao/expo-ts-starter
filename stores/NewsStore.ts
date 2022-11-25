import { createContext, useCallback, useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

import type { ResponseNewsList, GetNewsListParams } from '../apis'
import { getNewsList } from '../apis'

interface NewsContext {
  loading: boolean
  error: undefined | string
  newsList: ResponseNewsList
  handleNewsRefresh: (params: { tag?: GetNewsListParams['tag']; force: boolean }) => void
}

const NewsContext = createContext<NewsContext>({
  loading: false,
  error: undefined,
  newsList: [],
  handleNewsRefresh: () => {},
})

const useNewsStore = (): NewsContext => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>()
  const [newsList, setNewsList] = useState<ResponseNewsList>([])
  const [currentTag, setCurrentTag] = useState<GetNewsListParams['tag']>('')

  const handleNewsRefresh = useCallback(
    async (params: { tag?: GetNewsListParams['tag']; force: boolean }) => {
      if (params.tag !== undefined) {
        setCurrentTag(params.tag)
      }

      const tag = params.tag ?? currentTag
      const force = params.force

      const key = `@News:tag:${tag}`

      if (force === false) {
        const oldData = await AsyncStorage.getItem(key)

        if (oldData) {
          const data = JSON.parse(oldData).data
          const previousTime = JSON.parse(oldData).time
          const currentTime = new Date().getTime()

          if (data.length > 0 && currentTime - previousTime <= 60 * 1000 * 5) {
            setNewsList(data)
            return
          }
        }
      }

      try {
        setLoading(true)
        const e = await getNewsList({ page: 0, tag })

        setNewsList(e?.Result ?? [])

        await AsyncStorage.setItem(
          `@News:tag:${tag}`,
          JSON.stringify({
            data: e?.Result ?? [],
            time: new Date().getTime(),
          })
        )
      } catch (error: any) {
        setError(error)
      } finally {
        setLoading(false)
      }
    },
    [currentTag]
  )

  return { loading, error, newsList, handleNewsRefresh }
}

export { NewsContext, useNewsStore }
