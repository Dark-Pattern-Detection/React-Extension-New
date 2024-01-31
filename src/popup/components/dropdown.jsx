// AccordionComponent.js
import React, { useEffect, useState } from 'react'
import './dropdown.css'

const AccordionComponent = (props) => {
  const [currIndex, setCurrIndex] = useState(0)
  const { darkPatterns } = props
  useEffect(() => {
    // JavaScript for accordion functionality
    const accordionTitles = document.querySelectorAll('.accordion-title')

    accordionTitles.forEach((title) => {
      title.addEventListener('click', function () {
        const content = this.nextElementSibling

        // Toggle active class on click
        this.parentNode.classList.toggle('active')

        // Toggle content visibility
        if (content.style.display === 'block') {
          content.style.display = 'none'
        } else {
          content.style.display = 'block'
        }
      })
    })
  }, [])

  return (
    <div className='accordion'>
      <div className='accordion-section'>
        <div className='accordion-title'>Highlight Patterns</div>
        <div className='accordion-content'>
          
          <footer>
            {/* {currIndex === 0 ? null : ( */}
              <button type="button"
                class="button"
                id='prev'
                // onClick={() =>
                //   setCurrIndex(currIndex === 0 ? currIndex : currIndex - 1)
                // }
              >
                <i id='lefticon' class="fa fa-angle-left" ></i>
              </button>
              <p>scarcity deception</p>
            {/* <p>{darkPatterns[currIndex].label}</p> */}
            {/* <p>{darkPatterns[currIndex].text}</p> */}
            {/* )} */}
            {/* {currIndex === darkPatterns.length - 1 ? null : ( */}
              <button type="button"
                class="button"
                id='next'
                // onClick={() =>
                //   setCurrIndex(
                //     currIndex === darkPatterns.length - 1
                //       ? currIndex
                //       : currIndex + 1
                //   )
                // }
              >
                <i id='righticon' class="fa fa-angle-right" ></i>

              </button>
            {/* )} */}
          </footer>
        </div>
      </div>
    </div>
  )
}

export default AccordionComponent
