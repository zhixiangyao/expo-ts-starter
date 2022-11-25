import { StatusBar } from 'expo-status-bar'
import { Platform, StyleSheet } from 'react-native'
import { WebView } from 'react-native-webview'

import { type RootStackScreenProps } from '../types'

const runFirst = `
;(() => {
  const htmlElement = document.querySelector('html')
  htmlElement && (htmlElement.style.display = 'none')
  window.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('body .page-box > *:not(.con-box)').forEach(e => (e.style.display = 'none'));
    document.querySelectorAll('body .con-box > *:not(.news)').forEach(e => (e.style.display = 'none'));
    document.querySelectorAll('body .news > *:not(main)').forEach(e => (e.style.display = 'none'));
    document.querySelectorAll('body main > *:not(.news-content)').forEach(e => (e.style.display = 'none'));
    htmlElement && (htmlElement.style.display = '')
  })
})();
true; // note: this is required, or you'll sometimes get silent failures
`

export default function NewsContentModalScreen({ route }: RootStackScreenProps<'NewsContentModal'>) {
  const { uri } = route.params

  return (
    <WebView
      style={styles.container}
      source={{ uri }}
      injectedJavaScriptBeforeContentLoaded={runFirst}
      onMessage={event => {
        alert(event.nativeEvent.data)
      }}
    >
      <StatusBar style={Platform.OS === 'ios' ? 'light' : 'auto'} />
    </WebView>
  )
}

const styles = StyleSheet.create({
  container: {},
})
