import React, { useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import './popup.css'
import TempComponent from './components/TempComponent'
import Dropdown from './components/dropdown'

const Test = () => {
  const [darkPatterns, setDarkPatterns] = useState(null)

  useEffect(() => {
    console.log('useeffect hello')
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
        <h1>PATTERN ALERT</h1>
      </header>

      <TempComponent darkPatterns={darkPatterns} />
      {/* {darkPatterns && darkPatterns.length > 0 ? ( */}
        <Dropdown darkPatterns={darkPatterns} />
      {/* ) : null} */}
      {/* <button class='button' id='start'>
        START
      </button> */}
      <footer>
        <button class='button' id='report'>
        <i class="fa fa-flag"></i> Report
        </button>
        <button class='button' id='more' type='submit' >
        <i class="fa fa-bars"></i>  More
        </button>
      </footer>
    </div>
  )
}

const container = document.createElement('div')

document.body.appendChild(container)
const root = createRoot(container)
root.render(<Test />)
