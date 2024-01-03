"use client";
import { ethers } from "ethers";
import { useMoralis } from "react-moralis";
import { useEffect } from "react";

export default function ManualHeader() {
  //  const connect = async () => {
  //   if (typeof window !== 'undefined' && typeof (window as any).ethereum !== "undefined") {
  //     await (window as any).ethereum.request({ method: "eth_requestAccounts" });
  //   }
  //  }

  // here we are getting the enableWeb3 function from useMoralis hook it is
  // eqivalient to await ethereum.request({ method: "eth_requestAccounts" })
  // isWeb3Enabled which is varibale of hook which keeps track of whether we are connected or not.
  // account keeps track are we connected to account or not. it is having account. and because its is hook it rre-render when ever it is changed.
  // isWeb3EnableLoading just see that our metamask is popped up.
  const { enableWeb3, account, isWeb3Enabled, Moralis, deactivateWeb3, isWeb3EnableLoading, chainId } = useMoralis(); // with only this hook we have connected to metamask
  console.log(account);
  
  // why its load twice, because it automatically run on load
  // then, it will run checking the value
  // no dependency array: run anytime something re-renders
  // careful with this!! Because then we get circular render
  // blank dependency array, run once on load
  useEffect(() => {
    console.log(isWeb3Enabled);
    if (isWeb3Enabled) return; // check if we are connected to metamsk.
    if(typeof window !== "undefined"){ // if not
      if(window.localStorage.getItem("connected")){
        enableWeb3();
      }
    }
  }, [isWeb3Enabled, enableWeb3]);

  useEffect(()=>{
    Moralis.onAccountChanged((account)=>{
      console.log(`Account changed to ${account}`)
      if(account == null){
        window.localStorage.removeItem("connected")
        deactivateWeb3();
        console.log("Null account find")
      }
    })
  },[account, Moralis, deactivateWeb3])
  console.log(`this chain id ${chainId}`)

  return (
    // It is showing the connect button every time we refresh the app. because our website does not know we hit enableWeb3 already.
    // to fix this we use useffect see above
    <>
      {account ? (
        <div>
          Connected to: {account.slice(0, 6)}...
          {account.slice(account.length - 4)}
        </div>
      ) : (
        <button
          onClick={async () => {
            await enableWeb3();
            if(typeof window !== "undefined"){
              window.localStorage.setItem("connected", "injected"); // in web3uikit selecting the wallet is similar to it setitem 
            }
          }}
          className=" w-20 rounded-sm text-black bg-green-600 hover:text-white "
          disabled={isWeb3EnableLoading}
        >
          Connect
        </button>
      )}
      
    </>
  );
}
