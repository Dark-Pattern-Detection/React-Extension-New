import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './popup.css'
import TempComponent from './components/TempComponent'
import Dropdown from './components/dropdown'

const Test = () => {
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
  }, [url])
  console.log('popup')
  return (
    <div style={{ width: '300px', borderRadius: '20px' }}>
      <header id='heading'>
        <h1>Pattern Alert</h1>
      </header>

      <TempComponent darkPatterns={darkPatterns} />
      {darkPatterns && darkPatterns.length > 0 ? (
        <Dropdown darkPatterns={darkPatterns} />
      ) : null}
      {/* <button class='button' id='start'>
        START
      </button> */}
      <footer>
        <button class='button' id='report'>
          Report
        </button>
        <button class='button' id='more'>
          More
        </button>
      </footer>
    </div>
  )
}

const container = document.createElement('div')

document.body.appendChild(container)
const root = createRoot(container)
root.render(<Test />)
