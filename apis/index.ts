const baseUrlApi = 'https://m.ithome.com/api'

interface ResponseNewsResult {
  newsid: number
  title: string
  v?: string
  orderdate: string
  postdate: string
  description: string
  image: string
  slink: any
  hitcount: number
  commentcount: number
  hidecount: boolean
  subtitle: any
  cid: number
  url: string
  live: number
  lapinid: any
  forbidcomment: boolean
  imagelist?: string[]
  c: any
  client: any
  isad: boolean
  sid: number
  PostDateStr: string
  HitCountStr: any
  WapNewsUrl: string
  NewsTips: { TipClass: string; TipName: string }[]
  IsChineseMainland: boolean
}

export interface ResponseNews {
  Success: number
  Result: ResponseNewsResult[]
}

export type ResponseNewsList = ResponseNews['Result']

export interface GetNewsListParams {
  page: number
  tag: '' | 'iosm' | 'jingdum' | 'originalm' | 'labsm'
  // 全部 苹果 精读 原创 评测
}

const getNewsList = async (params: GetNewsListParams = { page: 0, tag: '' }) => {
  const _params = Object.entries({
    Tag: params.tag,
    ot: new Date().getTime(),
    page: params.page,
    hitCountAuthority: false,
  })
    .map(arr => `${arr[0]}=${arr[1]}`)
    .join('&')

  try {
    const response = await fetch(baseUrlApi + '/news/newslistpageget?' + _params, {
      headers: {
        accept: 'application/json, text/javascript, */*; q=0.01',
        'x-requested-with': 'XMLHttpRequest',
      },
      method: 'GET',
      mode: 'cors',
    })
    const json = <ResponseNews>await response.json()
    return json
  } catch (error) {
    console.error(`${new Date()}: ${error}`)
  }
}

export { getNewsList }
