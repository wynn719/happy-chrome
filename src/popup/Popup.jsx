import { useState, useEffect, useMemo } from 'react'
import { Box, Stack, Button } from '@chakra-ui/react'

function getSubdomainPrefix(url) {
  const regex = /^(?:https?:\/\/)?([a-z0-9-]+)\.[a-z0-9-]+\.[a-z]{2,}$/i
  const match = url.match(regex)
  let subdomainPrefix = ''

  if (match && match[1]) {
    subdomainPrefix = match[1]
  }

  return subdomainPrefix + '.'
}

function openNewTab(url) {
  chrome.tabs.create({ url })
}

function useCurrentUrl() {
  const [currentUrl, setCurrentUrl] = useState('')
  const currentOrigin = useMemo(() => {
    if (currentUrl) {
      const url = new URL(currentUrl)
      return `${url.protocol}//${url.hostname}`
    }

    return ''
  }, [currentUrl])
  const isLexiang = useMemo(() => {
    if (currentUrl) {
      const url = new URL(currentUrl);
      const lexiang = ['lx.net', 'lexiangla.net', 'lexiangla.com'];
      if (lexiang.some((domain) => url.hostname.includes(domain))) {
        return true;
      }

      return false;
    }
  }, [currentUrl]);

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      setCurrentUrl(tabs[0].url)
    })
  }, [])

  return {
    currentUrl,
    currentOrigin,
    isLexiang,
  }
}

function ShortCuts() {
  const { currentOrigin } = useCurrentUrl()
  const shortCuts = useMemo(() => [
    {
      name: 'settings',
      url: `${currentOrigin}/settings`,
    },
    {
      name: 'admin-version-function',
      url: `${currentOrigin}/admin/dev/version-function`,
    },
  ])

  return (
    <Box margin={3}>
      <Stack spacing={4} direction={'row'} align={'center'}>
        {shortCuts.map(({ name, url }) => {
          return (
            <Button key={name} colorScheme={'teal'} size={'xs'} onClick={() => openNewTab(url)}>
              {name}
            </Button>
          )
        })}
      </Stack>
    </Box>
  )
}

export const Popup = () => {
  const { currentUrl, isLexiang } = useCurrentUrl();
  const lexiangUrls = useMemo(() => {
    if (currentUrl) {
      const url = new URL(currentUrl)
      const subdomainPrefix = getSubdomainPrefix(url.hostname)
      const path = `${url.pathname}${url.search}`

      return [
        { name: 'local', url: `http://${subdomainPrefix}lx.net${path}` },
        { name: 'net', url: `https://${subdomainPrefix}lexiangla.net${path}` },
        { name: 'com', url: `https://${subdomainPrefix}lexiangla.com${path}` },
      ]
    }

    return []
  }, [currentUrl])

  if (!isLexiang) {
    return (
      <main>
        <Box padding={3} alignItems={'center'} justifyContent={'center'} justifyItems={'center'}>
          Hava a nice day!
        </Box>
      </main>
    )
  }

  return (
    <main>
      <Box margin={3}>
        <Stack spacing={4} direction={'row'} align={'center'}>
          {lexiangUrls.map(({ name, url }) => {
            return (
              <Button key={name} colorScheme={'teal'} size={'xs'} onClick={() => openNewTab(url)}>
                {name}
              </Button>
            )
          })}
        </Stack>
      </Box>
      <ShortCuts></ShortCuts>
    </main>
  )
}

export default Popup
