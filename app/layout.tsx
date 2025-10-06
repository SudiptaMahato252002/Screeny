import { Metadata } from "next"
import "./globals.css"
import {Karla} from "next/font/google"
import { satoshi } from "@/fonts/font"


const getisKarla=Karla({
  variable:"--font-geist-karla",
  subsets:["latin"]
})


const metadata:Metadata={
  title:"SnapCast",
  description:"A Screen Sharing App",
  icons:{
    icon:"asset/icons/logo.svg"
  }
}

export default function Layout({children}:Readonly<{children:React.ReactNode}>)
{

  return(
    <html lang="en">
      <body className={`${getisKarla.variable} ${satoshi.variable} font-karla antialiased`}>
        {children}
      </body>
    </html>

  )

}