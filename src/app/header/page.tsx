"use client"
import { ConnectButton } from '@web3uikit/web3'
// most easiest way to create button
export default function Header() {
  return (
    <div > 
        {/* <h1 className=' w-screen text-center mt-5 text-3xl text-emerald-300 font-bold'>Decentralized Lottery</h1> */}
        <div className=' w-screen  flex mt-5 justify-end'>

        <ConnectButton moralisAuth={false}/>
        </div>
       
    </div>
  )
}
