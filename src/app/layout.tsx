"use client";
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import {MoralisProvider} from "react-moralis";
import { NotificationProvider } from '@web3uikit/core';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Lottery - Dapp',
  description: 'Decentralized lottery dapp.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    //initializeOnMount is here is the optionality to hook in a server to add some more to our website. but we do not need it present
    <MoralisProvider initializeOnMount={false}> 
    <html lang="en">
      <body className={inter.className}>
    <NotificationProvider>
        {children}
      </NotificationProvider> 
        </body>
    </html>

    </MoralisProvider>
  )
}
