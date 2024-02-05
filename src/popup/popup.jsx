import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './popup.css'
import TempComponent from './components/TempComponent'
import Dropdown from './components/dropdown'

const Test = () => {
  const brw = chrome
  // const getCookieValue = (name) => {
  //   const cookies = document.cookie.split(';')

  //   for (let i = 0; i < cookies.length; i++) {
  //     const cookie = cookies[i].trim()
  //     if (cookie.startsWith(name + '=')) {
  //       return cookie.substring(name.length + 1)
  //     }
  //   }
  //   return null
  // }

  const [darkPatterns, setDarkPatterns] = useState(null)
  const [url, setUrl] = useState(null)

  useEffect(() => {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      setUrl(tabs[0].url)
    })
  }, [chrome])

  useEffect(() => {
    console.log(window.location.href, url)
    if (url) {
      chrome.storage.local.get([url], (data) => {
        console.log('darkPatterns', data[url])
        setDarkPatterns(data[url])
      })
    }
  }, [url])

  // useEffect(() => {
  //   if (darkPatterns) {
  //     chrome.action.setBadgeText(
  //       { text: `${darkPatterns?.length}` },
  //       function () {
  //         console.log('badge updated', darkPatterns?.length)
  //       }
  //     )
  //   }
  // }, [darkPatterns])

  useEffect(() => {
    brw.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        console.log(tabs)
        let tabId = tabs[0].id
        if (darkPatterns) {
          console.log('updating badge')
          chrome.action.setBadgeText(
            { text: `${darkPatterns?.length}`, tabId },
            function () {
              console.log('badge updated', darkPatterns?.length)
            }
          )
        } else {
          chrome.action.setBadgeText({ text: `...`, tabId }, function () {
            console.log('badge updated', darkPatterns?.length)
          })
        }
      }
    })
  }, [darkPatterns])

  useEffect(() => {
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if ((request.message = 'updateDarkPatterns')) {
        setDarkPatterns(request.darkPatterns)
        setUrl(request.url)
        console.log('Dark patterns received in popup:', request.darkPatterns)
        sendResponse('popup received the data')
      }

      return true
    })
  }, [])

  return (
    <div style={{ width: '300px', borderRadius: '20px' }}>
      <header id='heading'>
        <h1>PATTERN ALERT</h1>
      </header>
      <TempComponent darkPatterns={darkPatterns} />
      {darkPatterns && darkPatterns.length > 0 ? (
        <Dropdown darkPatterns={darkPatterns} />
      ) : null}
      {/* <button className='button' id='start'>
        START
      </button> */}
      <footer>
        <button class='button' id='report'>
          <i class='fa fa-flag'></i> Report
        </button>
        <button class='button' id='more' type='submit'>
          <i class='fa fa-bars'></i> More
        </button>
      </footer>
    </div>
  )
}

const container = document.createElement('div')

document.body.appendChild(container)
const root = createRoot(container)
root.render(<Test />)
