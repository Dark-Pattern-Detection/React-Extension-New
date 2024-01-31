import React from 'react'
import './TempComponent.css'

const TempComponent = (props) => {
  const { darkPatterns } = props
  // return darkPatterns ? (
    return(<div className='temp'>
      {/* <h2>{darkPatterns.length}</h2> */}
      <h2>2</h2>
      <h3>Patterns found</h3>
    </div>)
  // ) : (
  //   <div className='temp'>
  //     <h2>Loading...</h2>
  //   </div>
  // )
}

export default TempComponent
