import { StatusBar } from 'expo-status-bar'
import { SafeAreaProvider } from 'react-native-safe-area-context'

import useCachedResources from './hooks/useCachedResources'
import useColorScheme from './hooks/useColorScheme'
import Navigation from './navigation'
import { NewsContext, useNewsStore } from './stores/NewsStore'

export default function App() {
  console.info('App update!')

  const isLoadingComplete = useCachedResources()
  const colorScheme = useColorScheme()
  const store = useNewsStore()

  if (!isLoadingComplete) {
    return null
  } else {
    return (
      <SafeAreaProvider>
        <NewsContext.Provider value={store}>
          <Navigation colorScheme={colorScheme} />
        </NewsContext.Provider>
        <StatusBar />
      </SafeAreaProvider>
    )
  }
}
