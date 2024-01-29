import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './popup.css'
import TempComponent from './components/TempComponent'
import Dropdown from './components/dropdown'

const Test = () => {
  const [darkPatterns, setDarkPatterns] = useState(null)

  useEffect(() => {
    chrome.storage.local.get('darkPatterns', (data) => {
      console.log('darkPatterns', data)
      setDarkPatterns(data.darkPatterns)
    })
    chrome.runtime.onMessage.addListener(function (
      request,
      sender,
      sendResponse
    ) {
      if ((request.message = 'updateDarkPatterns')) {
        setDarkPatterns(request.darkPatterns)
        console.log('Dark patterns received in popup:', request.darkPatterns)
        sendResponse('popup received the data')
      }

      return true
    })
  }, [])
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
