
import React from 'react'
import {Outlet} from 'react-router-dom'
import Header from '../components/Header'
import Footer from '../components/Footer'


export default function MainLayout() {
  return (
   <>
   <Header/>
   <div className="outlet-background">
        <Outlet />
    </div>
   <Footer/>
   </>
  )
}
