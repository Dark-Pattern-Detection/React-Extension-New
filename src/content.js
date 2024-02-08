const brw = chrome

let activateObserver = false
let darkPatterns = []
let tabUrl = null

initPatternHighlighter()
async function initPatternHighlighter() {
  // adding synthetic ids to all div tags

  brw.runtime.sendMessage({ message: 'updateBadge' }, () => {
    console.log('tab activated')
  })

  let idCounter = 1
  document.querySelectorAll('div').forEach((divElm) => {
    const currentClass = divElm.getAttribute('class')

    const newClass = currentClass
      ? `${currentClass.replace(
          /dark_pattern_id_\d+/g,
          ''
        )} dark_pattern_id_${idCounter}`
      : `dark_pattern_id_${idCounter}`

    divElm.setAttribute('class', newClass)
    idCounter++
  })

  // brw.runtime.onMessage.addListener((request, sender, sendResponse) => {
  //   if ((request.message = 'getDarkPatterns')) {
  //     console.log('sending dark patterns')
  //     sendResponse({ darkPatterns })
  //   }
  //   return true
  // })

  const activatePicker = () => {
    const disableClicks = () => {
      document
        .querySelectorAll('a, button, input, select, textarea')
        .forEach((element) => {
          element.style.pointerEvents = 'none'
        })
      // document.body.style.pointerEvents = 'none'
    }

    document.body.style.cursor = 'crosshair'
    const enableClicks = () => {
      document
        .querySelectorAll('a, button, input, select, textarea')
        .forEach((element) => {
          element.style.pointerEvents = 'auto'
        })
      document.body.style.pointerEvents = 'auto'
    }

    let currentCursor = null

    let timeout
    const mouseMoveListener = (event) => {
      event.stopPropagation()
      const target = event.target
      if (currentCursor && currentCursor == target) {
        console.log('return')
        return
      }
      clearTimeout(timeout)
      timeout = setTimeout(() => {
        if (target) {
          currentCursor = target
          // const parentDiv = target?.closest('div')
          target.style.pointerEvents = 'none'
          // disableClicks()

          target.style.outline = '1px solid red'
          // target.style.boxShadow = '0 0 1000px 1000px rgba(128, 128, 128, 0.5)'
          // target.style.boxShadow = '1000px 1000px 1000px 1000px #7e7e7eff'

          // target.style.zIndex = 10000
          // target.style.backgroundColor = '#ff74748f'
        }
      }, 50)
    }

    const mouseOutListener = (event) => {
      const target = event.target
      clearTimeout(timeout)
      if (target) {
        // const parentDiv = target?.closest('div')
        // console.log('parent', parentDiv?.getAttribute('class'))
        // enableClicks()
        target.style.pointerEvents = 'auto'
        target.style.outline = 'none'
        target.style.boxShadow = 'none'

        // target.style.backgroundColor = ''
      }
    }

    document.addEventListener('mousemove', mouseMoveListener)
    document.addEventListener('mouseout', mouseOutListener)

    document.addEventListener('click', (event) => {
      event.preventDefault()
      clearTimeout(timeout)
      const target = event.target
      if (target) {
        target.style.pointerEvents = 'auto'
        target.style.outline = 'none'
        target.style.boxShadow = 'none'

        // const randomNumber = Math.floor(Math.random() * 1000000) + 1
        // target.classList.add(`dark-select-${randomNumber}`)

        const parentDiv = target?.closest('div')
        const parentClass = parentDiv?.getAttribute('class')

        console.log(target.innerText)
        console.log('parent', parentClass)
        //TODO: send this to the node server
        console.log(target.outerHTML)
        const data = {
          targetElm: target.outerHTML,
          text: target.innerText,
          parentDivClass: parentDiv?.getAttribute('class'),
          tabUrl: window.location.href,
        }

        fetch('http://localhost:5000/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log('Response from server:', data)
          })
          .catch((error) => {
            console.error('Error:', error)
          })

        // const elementClass = target.getAttribute('class')

        // console.log(elementClass)
      }
      // enableClicks()
      document.body.style.cursor = 'auto'
      document.removeEventListener('mousemove', mouseMoveListener)
      document.removeEventListener('mouseout', mouseOutListener)
    })

    // disableClicks()
  }

  const newActivatePicker = () => {
    console.log('new picker')

    const onCursorPositionChange = (e) => {
      console.log('cursor position change')
      const boundingBox = e.target.getBoundingClientRect()
      const topLeft = {
        x: boundingBox.left,
        y: boundingBox.top,
      }
      const existingBox = document.getElementById('activation-box')
      existingBox?.remove()
      const box = document.createElement('div')
      box.id = 'activation-box'
      box.style.top = topLeft.y + 'px'
      box.style.left = topLeft.x + 'px'
      box.style.width = boundingBox.width + 'px'
      box.style.height = boundingBox.height + 'px'
      document.body.appendChild(box)
    }

    document.addEventListener('mousemove', onCursorPositionChange)
    document.addEventListener('click', () => {
      const box = document.getElementById('activation-box')
      box.remove()
      document.removeEventListener('mousemove', onCursorPositionChange)
    })
  }

  brw.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message == 'activatePicker') {
      console.log('activating picker')
      activatePicker() //
      sendResponse('activating picker')
    }

    return true
  })

  const response = await fetch('http://localhost:3000', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ htmlString: document.documentElement.outerHTML }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log('response: ', data)
      return data
    })
    .catch((error) => {
      console.error(error)
      return { success: 'false', message: error }
    })

  if (response?.success == true) {
    // console.log('success')
    darkPatterns = response.data

    // Store darkPatterns in local storage

    darkPatterns.map(async (data) => {
      const { class: className, darkPatterns } = data
      const regex = /dark_pattern_id_\d+/g
      const matches = className.match(regex)

      const divElm = document.querySelector(`.${matches[0]}`)
      // console.log(divElm, className)

      //TODO: change the style to highlight the dark patterns

      divElm.style.backgroundColor = 'red'
      divElm.style.color = 'white'
      divElm.style.fontWeight = 'bold'
      divElm.style.padding = '10px'
      divElm.style.borderRadius = '5px'
      divElm.style.position = 'relative'
      divElm.style.zIndex = '9999'
    })
    brw.runtime.sendMessage(
      {
        message: 'darkPatternsFound',
        darkPatterns: darkPatterns,
      },
      function () {
        console.log('message send to background script')
      }
    )

    brw.storage.local.set(
      { [window.location.href]: darkPatterns },
      function () {
        console.log(
          'darkPatterns stored in local storage',
          window.location.href
        )
      }
    )

    brw.runtime.sendMessage(
      {
        message: 'updateBadge',
        text: `${darkPatterns.length}`,
      },
      function () {
        console.log('update badge messaged sent')
      }
    )

    if (!activateObserver) {
      activateObserver = true
      const observer = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
          if (mutation.type === 'childList' || mutation.type === 'subtree') {
            // Call your highlighting function whenever there is a change in the DOM
            const addedDivs = Array.from(mutation.addedNodes).filter(
              (node) => node.tagName && node.tagName.toLowerCase() === 'div'
            )
            const removedDivs = Array.from(mutation.removedNodes).filter(
              (node) => node.tagName && node.tagName.toLowerCase() === 'div'
            )

            console.log(mutation.addedNodes)
            if (addedDivs.length > 0 || removedDivs.length > 0) {
              // initPatternHighlighter()
              break
            }

            //  console.log('added', mutation.addedNodes)
          }
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })
    }
  }
}
