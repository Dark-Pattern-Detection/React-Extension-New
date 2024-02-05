import React from 'react'
import './TempComponent.css'

const TempComponent = (props) => {
  const { darkPatterns } = props

  // For developemnt
  // return(<div className='temp'>
  //     <h2>2</h2>
  //     <h3>Patterns found</h3>
  //   </div>)

  // For Production
  return (
    <div className='temp'>
      {darkPatterns ? (
        <>
          <h2>{darkPatterns.length}</h2> <h3>Patterns Found</h3>
        </>
      ) : (
        <h2>Loading...</h2>
      )}
    </div>
  )
}

export default TempComponent
