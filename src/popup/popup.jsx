import React from 'react'
import { createRoot } from 'react-dom/client'
import './popup.css'
import TempComponent from './components/TempComponent';
import Dropdown from './components/dropdown';

const Test = () => {
  return (
    <div style={{ width: '300px', borderRadius: '20px' }}>
      <header  id="heading"><h1>PATTERN ALERT</h1></header>
      
      <TempComponent />
      <Dropdown />
      <button class="button" id="start">START</button>
      <footer>
        <button class="button" id="report">Report</button>
        <button class="button" id="more">More</button>
      </footer>
    </div>
  )
}

const container = document.createElement('div')

document.body.appendChild(container)
const root = createRoot(container)
root.render(<Test />)
