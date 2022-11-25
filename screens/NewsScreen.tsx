import { StyleSheet, ActivityIndicator, ScrollView, Image, Pressable } from 'react-native'
import { useContext, useEffect, useState } from 'react'

import { Text, View } from '../components/Themed'
import { type RootTabScreenProps } from '../types'
import { formatTime } from '../tools'
import { NewsContext } from '../stores/NewsStore'
import type { GetNewsListParams } from '../apis'

interface Tab {
  key: string
  title: string
  value: GetNewsListParams['tag']
}

const tabs: Tab[] = [
  {
    key: '__0',
    title: '全部',
    value: '',
  },
  {
    key: '__1',
    title: '苹果',
    value: 'iosm',
  },
  {
    key: '__2',
    title: '精读',
    value: 'jingdum',
  },
  {
    key: '__3',
    title: '原创',
    value: 'originalm',
  },
  {
    key: '__4',
    title: '评测',
    value: 'labsm',
  },
]

export default function News({ navigation }: RootTabScreenProps<'News'>) {
  const { loading, newsList, handleNewsRefresh } = useContext(NewsContext)
  const [activeData, setActiveData] = useState<{ key: string; value: GetNewsListParams['tag'] }>({
    key: '__0',
    value: '',
  })

  useEffect(() => {
    handleNewsRefresh({
      tag: activeData.value,
      force: false,
    })
  }, [handleNewsRefresh, activeData])

  return (
    <View style={styles.container}>
      <View style={styles.newsHeaderTabs}>
        {tabs.map(tab => (
          <Pressable
            key={tab.key}
            onPress={() => {
              if (loading) return
              if (tab.key === activeData.key) return

              setActiveData({
                key: tab.key,
                value: tab.value,
              })
            }}
          >
            <View style={styles.newsHeaderTab}>
              <Text style={styles.newsHeaderTabText}>{tab.title}</Text>

              {tab.key === activeData.key && <View style={styles.newsHeaderTabActive} />}
            </View>
          </Pressable>
        ))}
      </View>

      <ScrollView style={styles.newsContainer}>
        {loading ? (
          <ActivityIndicator />
        ) : (
          newsList?.map(item => (
            <Pressable
              key={item.newsid}
              onPress={() => {
                navigation.navigate('NewsContentModal', { title: item.title, uri: item.WapNewsUrl })
              }}
            >
              <View style={styles.newsItem}>
                <View style={styles.newsItemLeft}>
                  <Text style={styles.newsItemLeftTitle} numberOfLines={2}>
                    {item.title}
                  </Text>
                  <View style={styles.newsItemLeftBottom}>
                    <Text style={styles.newsItemLeftTime}>{formatTime(item.orderdate)}</Text>
                    <Text style={styles.newsItemLeftBottom}>{item.commentcount}评</Text>
                  </View>
                </View>
                <View style={styles.newsItemRight}>
                  <Image
                    style={styles.newsItemRightImage}
                    source={{
                      uri: item.image,
                    }}
                  />
                </View>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  newsHeaderTabs: {
    flexDirection: 'row',
    height: 45,
  },
  newsHeaderTab: {
    position: 'relative',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 10,
    paddingRight: 10,
    paddingBottom: 5,
    paddingLeft: 10,
    flex: 1,
  },
  newsHeaderTabText: {
    fontSize: 19,
  },
  newsHeaderTabActive: {
    width: 20,
    height: 3,
    backgroundColor: 'red',
  },
  newsContainer: {
    flex: 1,
  },
  newsItem: {
    flex: 1,
    flexDirection: 'row',
    height: 120,
    padding: 10,
  },
  newsItemLeft: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between',
    marginRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
  },
  newsItemLeftTitle: {
    fontSize: 18,
  },
  newsItemLeftTime: {
    fontSize: 14,
    color: 'gray',
  },
  newsItemLeftBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    color: 'gray',
  },
  newsItemRight: {
    height: 100,
    width: 150,
  },
  newsItemRightImage: {
    height: 100,
    width: 150,
    borderRadius: 5,
  },
})
