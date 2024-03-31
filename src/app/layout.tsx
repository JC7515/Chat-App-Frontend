import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast';
import { Providers } from '@/redux/provider';
import { useDispatch } from 'react-redux';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Authentication App',
  description: 'Created by JC Dev',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
            {children}
            <Toaster position='top-right' toastOptions={{ duration: 3000, }} />
        </Providers>
      </body>
    </html>
  )
}
