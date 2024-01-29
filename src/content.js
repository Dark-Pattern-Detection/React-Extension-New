const brw = chrome

let activateObserver = false
let darkPatterns = []
let tabUrl = null

initPatternHighlighter()
async function initPatternHighlighter() {
  // adding synthetic ids to all div tags

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

  brw.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if ((request.message = 'getDarkPatterns')) {
      console.log('sending dark patterns')
      sendResponse({ darkPatterns })
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

  if (response?.success === 'true') {
    darkPatterns = response.data

    // Store darkPatterns in local storage
    chrome.storage.local.set(
      { [window.location.href]: darkPatterns },
      function () {
        console.log(
          'darkPatterns stored in local storage',
          window.location.href
        )
      }
    )

    darkPatterns.map(async (data) => {
      const { class: className, darkPatterns } = data
      const regex = /dark_pattern_id_\d+/g
      const matches = className.match(regex)

      const divElm = document.querySelector(`.${matches[0]}`)

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
  }
  // console.log(activateObserver)
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

          // console.log(addedDivs, removedDivs)
          if (addedDivs.length > 0 || removedDivs.length > 0) {
            initPatternHighlighter()
            break
          }

          //  console.log('added', mutation.addedNodes)
        }
      }
    })

    // observer.observe(document.body, {
    //   childList: true,
    //   subtree: true,
    // })
  }
}
