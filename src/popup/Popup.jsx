import { useState, useEffect, useMemo } from 'react'

import './Popup.css'

export const Popup = () => {
  const [count, setCount] = useState(0)
  const link = 'https://github.com/guocaoyi/create-chrome-ext'

  const minus = () => {
    if (count > 0) setCount(count - 1)
  }

  const add = () => setCount(count + 1)

  useEffect(() => {
    chrome.storage.sync.get(['count'], (result) => {
      setCount(result.count || 0)
    })
  }, [])

  // useEffect(() => {
  //   chrome.storage.sync.set({ count })
  //   chrome.runtime.sendMessage({ type: 'COUNT', count })
  // }, [count])
  const [currentUrl, setCurrentUrl] = useState('')
  const lexiangUrls = useMemo(() => {
    if (currentUrl) {
      const url = new URLSearchParams(currentUrl)
      console.log(url);
      const pathname = `${url.pathname}${url.search}`

      return [
        { name: 'local', url: `http://lx.net${pathname}` },
        { name: 'net', url: `https://lexiangla.net${pathname}` },
        { name: 'com', url: `https://lexiangla.com${pathname}` },
      ]
    }

    return []
  }, [currentUrl])

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log(tabs);
      setCurrentUrl(tabs[0].url)
    })
  }, [])

  return (
    <main>
      {lexiangUrls.map(({ name, url }) => {
        return (
          <div>
            <a href={url}>跳转到：{name}</a>
          </div>
        )
      })}
    </main>
  )
}

export default Popup
