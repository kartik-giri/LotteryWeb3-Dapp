// import works with our front end
// require does not
// node != ecmascript / javascript
// backend js is little diff from front jss

// import ManualHeader from "./manualheader/page";
import LotteryEntrance from "./lotteryentrace/page";
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lottery - Dapp',
  description: 'Decentralized lottery dapp.',
}


export default function Home() {
  return (
    <main className=" w-screen h-screen bg-emerald-200">
      {/* <ManualHeader/> */}

      

      <LotteryEntrance />

    </main>
  );
}
