"use client";
import { useWeb3Contract } from "react-moralis";
import { abi, contractAddresses } from "../../../constants"; // we have index.js which basically means whole folder
import { useMoralis } from "react-moralis";
import { useEffect, useState } from "react";
import { BigNumber, ethers, ContractTransaction } from "ethers";
import { useNotification } from "@web3uikit/core";
import Image from "next/image"
import { ConnectButton } from "@web3uikit/web3";
import eth from "../../../public/eth.svg";


//[key: string]: This part says that the object has keys, and each key is a string.
//The key here is like a placeholder for the actual keys that will be used.
interface contractAddressInterface {
  [key: string]: string[]; // [key:string] means key is string type.
}

export default function LotteryEntrance() {
  const addresses: contractAddressInterface = contractAddresses;
  // pull out the chainId object and rename it with chainIdHex.
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis(); // getting chainId from useMoralis hook, useMoralis know about the chain id because back in header component passes all the information of metamask to the moralis provider and then moralis provider passes it down to the other componencts onside the moralis provider tag.
  // console.log(chainId) // hex version of our chainID, but we need actual number.
  const chainId: string = parseInt(chainIdHex!).toString(); //The ! symbol after it is used to tell TypeScript that you are sure this variable won't be null or undefined.
  console.log(chainId);
  const raffleAddress = chainId in addresses ? addresses[chainId][0] : null;
  const [entFee, setentFee] = useState("0");
  const [totalplayers, settotalplayers] = useState("0");
  const [winner, setwinner] = useState("0");
  const [raffleBal, setraffleBal] = useState("0");
  const dispatch = useNotification();

  // runContractFunction can both send transaction and read state
  const {
    runContractFunction: enterRaffle,
    isLoading,
    isFetching,
  } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "enterRaffle",
    params: {},
    msgValue: entFee,
  });

  const { runContractFunction: getEnteranceFee } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getEnteranceFee",
    params: {},
  });

  const { runContractFunction: getNumOfPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getNumOfPlayers",
    params: {},
  });

  const { runContractFunction: getRecentWinner } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getRecentWinner",
    params: {},
  });

  const { runContractFunction: getLotteryBalance } = useWeb3Contract({
    abi: abi,
    contractAddress: raffleAddress!,
    functionName: "getLotteryBalance",
    params: {},
  });

  async function updateUI() {
    const entFeeFromCall = ((await getEnteranceFee()) as BigNumber).toString();
    const playersFromCall = ((await getNumOfPlayers()) as BigNumber).toString();
    const WinnerFromCall = (await getRecentWinner()) as string;
    const raffleBalFromCall = (
      (await getLotteryBalance()) as BigNumber
    ).toString();
    setentFee(entFeeFromCall);
    settotalplayers(playersFromCall);
    setwinner(WinnerFromCall);
    setraffleBal(raffleBalFromCall);
    // console.log(entFeeFromCall)
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      updateUI();
    }
  }, [isWeb3Enabled]);


  useEffect(() => {
    console.log(entFee, totalplayers, winner, raffleBal);
  }, [entFee, totalplayers, winner, raffleBal]);

  const handleSuccess = async (tx: ContractTransaction) => {
    //take tx as parameter
    await tx.wait(1); // wait to finish tx
    handleNewNotification();
    updateUI();
  };

  const handleNewNotification = () => {
    dispatch({
      type: "info",
      message: "Transaction Complete!",
      title: "Transaction Notification",
      position: "topR",
      // icon: "bell",
    });
  };

  return (
    <>
      <div className="h-screen w-screen flex justify-center text-xl items-center ">
        <div className=" w-8/12 xl:w-3/12 md:2/12 bg-emerald-950 rounded-md h-3/4">
        <h1 className=' w-full text-center mt-6 text-3xl text-emerald-300 font-bold'>Decentralized Lottery</h1>
        <div className=" w-full mt-2 mb-1 flex justify-center">

        <Image src={eth}  width={165} height={64}  alt="Picture of the logo." />
        </div>
          {raffleAddress ? (
            <div className=" flex-col w-full justify-center text-center ">
              <h1 className=" mt-1">
                Enterance Fee: {ethers.utils.formatUnits(entFee, "ether")} ETH
              </h1>
              <h1 className=" mt-1">Number of players: {totalplayers}</h1>
              <h1 className=" mt-1">
                Recent Winner: {winner.slice(0, 6)}...
                {winner.slice(winner.length - 4)}
              </h1>
              <h1 className=" mt-1">
                Lottery Prize: {ethers.utils.formatUnits(raffleBal, "ether")}{" "}
                ETH
              </h1>
                  {/* {/* <div className=" w-full flex justify-center mt-2">
                  <ConnectButton moralisAuth={false}/>
                  </div> */}
              <button 
                className=" max-w-full rounded-sm text-black bg-emerald-500 hover:text-white mt-7 pl-2 pr-2"
                onClick={async () => {
                  await enterRaffle({
                    onSuccess: (tx) => handleSuccess(tx as ContractTransaction), // onsucces is not checking that transaction has block confirmation but
                    // actually it is just tx is succesdully sent to metamsask and that why we tx as param and wait to confirm the transaction.
                    onError: (error) => console.log(error),
                  });
                }}
                // disabled={isLoading || isFetching}
              >
                {isLoading || isFetching ? (
                  <div className=" text-center animate-spin spinner-border h-8 w-8 border-b-2 rounded-full"></div>
                ) : (
                  <div>Enter Raffle</div>
                )}
              </button>
            </div>
          ) : (
            <div className=" text-center">
              <h1>No Raffle Address Deteched</h1>
            </div>
          )}
                  <div className=" w-full flex justify-center mt-7">
                
                  <ConnectButton/>
                  </div>
        </div>
      </div>
    </>
  );
}
