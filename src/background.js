const brw = chrome
let darkPatterns = null
let tabId

brw.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.message == 'darkPatternsFound') {
    darkPatterns = request.darkPatterns
    console.log('background', darkPatterns)
    brw.runtime.sendMessage(
      { message: 'updateDarkPatterns', darkPatterns: darkPatterns },
      function (response) {
        console.log('Message send to popup', response)
      }
    )
    sendResponse('Success')
  } else if (request.message == 'updateBadge') {
    // console.log('badge update request received', tabId)
    brw.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      if (tabs.length > 0) {
        console.log(tabs)
        let tabId = tabs[0].id
        if (darkPatterns) {
          chrome.action.setBadgeText(
            { text: `${darkPatterns?.length}`, tabId },
            function () {
              console.log('badge updated', darkPatterns?.length)
            }
          )
        } else {
          chrome.action.setBadgeText({ text: `...`, tabId }, function () {
            console.log('badge updated ...')
          })
        }
      }
    })
    sendResponse('badge updated')
  }

  return true
})

// brw.runtime.onMessage.addListener(function (request, sender, sendResponse) {
//   console.log('background', request)
//   if (request.message == 'updateBadge') {
//     console.log('bade update request received')
//     // chrome.browserAction.setBadgeText({ text: request.text })
//     console.log('badge updated', request.text)
//     sendResponse('badge updated')
//   }

//   return true
// })
// brw.runtime.onMessage.addListener(async (request, sender, sendResponse) => {
//   if (request.message === 'tabUpdated') {
//     const receiveText = (resultArray) => {
//       sendResponse(resultArray[0])
//     }
//     // console.log(request.data)
//     brw.scripting.executeScript(
//       {
//         target: { tabId: sender.tab.id },
//         function: async (data) => {
//           // This function will be executed in the context of the page
//           const response = fetch('http://localhost:3000', {
//             method: 'POST',
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: JSON.stringify({ htmlString: data }),
//           })
//             .then((response) => response.json())
//             .then((data) => {
//               console.log('response: ', data)
//               return data
//               // sendResponse(data) // send dark pattern response.
//             })
//             .catch((error) => {
//               console.error(error)
//               return { success: 'false', message: error }
//             })

//           const responseData = await response.json()
//           console.log('response:', responseData)
//           return responseData
//           // send
//         },
//         args: [request.data], // Pass the data as an argument to the function
//       },
//       receiveText
//     )

//     // sendResponse(responseData)
//   } else if (request.message === 'consoleLog') {
//     brw.scripting.executeScript({
//       target: { tabId: sender.tab.id },
//       function: async (data) => {
//         // This function will be executed in the context of the page
//         console.log('log', data)
//       },
//       args: [request.data], // Pass the data as an argument to the function
//     })
//   } else if (request.message === 'tabUpdateResponse') {
//     // Handle the response here
//     console.log('Received tab update response:', request.data)
//   }

//   return true
// })

// // browser.tabs.onUpdated.addEventListener((tabId, tab) => {
// //   if (tab.status === 'complete') {
// //     const url = new URL(tab.url)
// //     chrome.tabs.sendMessage(tabId, {
// //       type: 'NEW',
// //       videoId: url,
// //       random: 'random',
// //     })
// //   }
// // })
