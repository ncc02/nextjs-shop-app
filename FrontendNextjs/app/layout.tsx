import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import ToasterContext from './context/ToasterContext'
import QueryContext from './context/QueryContext'
import Loading from './(site)/components/Loading'
import AuthContext from './context/AuthContext'
import ImageModal from './(site)/components/ImageModal'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Shop App',
  description: 'View you like products',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthContext>
          <Loading />
          <ImageModal />
          <ToasterContext />
          <QueryContext>{children}</QueryContext>
        </AuthContext>
      </body>
    </html>
  )
}
