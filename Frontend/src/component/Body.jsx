import React from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

const Body = () => {
  return (<>
   <div className="bg-red-300 h-full left-0.5">
     <Navbar />
    {/* <div>Body</div> */}
    <Outlet/>
    </div>
    </>
  )
}

export default Body