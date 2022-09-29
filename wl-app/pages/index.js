import Head from "next/head";
import styles from "../styles/Home.module.css";
import Web3Modal from "web3modal";
import { providers, Contract, ethers } from "ethers";
import { useEffect, useRef, useState } from "react";
import {
  WHITELIST_CONTRACT_ADDRESS,
  abi,
  ALCHEMY_API_KEY_URL,
} from "../constants";

export default function Home() {
  const [walletConnected, setWalletConnected] = useState(false);
  const [wlAmount, setWlAmount] = useState(0);
  const [joinedWl, setJoinedWl] = useState(false);
  const [loading, setLoading] = useState(false);
  const web3ModalRef = useRef();

  const getProviderOrSigner = async (needSigner = false) => {
    try {
      const provider = await web3ModalRef.current.connect();
      const web3Provider = new providers.Web3Provider(provider);

      const { chainId } = await web3Provider.getNetwork();
      if (chainId !== 5) {
        window.alert("Change network to Goerli");
        throw new Error("Change network to Goerli");
      }
      if (needSigner) {
        const signer = web3Provider.getSigner();
        return signer;
      }
      return web3Provider;
    } catch (err) {
      console.error(err);
    }
  };

  const isAddressWled = async () => {
    try {
      const signer = await getProviderOrSigner(true);
      const wlContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);
      const address = await signer.getAddress();
      const _joinedWl = await wlContract.wlAddresses(address);
      setJoinedWl(_joinedWl);
    } catch (err) {}
  };

  const getAmountOfWl = async () => {
    if (walletConnected) {
      try {
        const provider = await getProviderOrSigner();
        const wlContract = new Contract(
          WHITELIST_CONTRACT_ADDRESS,
          abi,
          provider
        );
        const _wlAmount = await wlContract.numAddressesWhitelisted();
        setWlAmount(_wlAmount);
      } catch (err) {
        console.error(err);
      }
    } else {
      try {
        const provider1 = new ethers.providers.JsonRpcProvider(
          ALCHEMY_API_KEY_URL
        );
        const contract = new ethers.Contract(
          WHITELIST_CONTRACT_ADDRESS,
          abi,
          provider1
        );

        const _wlAmount = await contract.numAddressesWhitelisted();
        setWlAmount(_wlAmount);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const addToWl = async () => {
    try {
      setLoading(true);
      const signer = await getProviderOrSigner(true);
      const wlContract = new Contract(WHITELIST_CONTRACT_ADDRESS, abi, signer);

      const tx = await wlContract.addAddressToWl();

      await tx.wait();
      await getAmountOfWl();

      setLoading(false);
      setJoinedWl(true);
    } catch (err) {
      console.error(err);
    }
  };

  const renderButton = () => {
    if (walletConnected) {
      if (joinedWl) {
        return (
          <p className={styles.description}>You are whitelisted already</p>
        );
      } else if (loading) {
        return <button className={styles.button}>Loading...</button>;
      } else {
        return (
          <button className={styles.button} onClick={addToWl}>
            Join Whitelist
          </button>
        );
      }
    } else {
      return (
        <button className={styles.button} onClick={connectWallet}>
          Connect Wallet
        </button>
      );
    }
  };

  const connectWallet = async () => {
    try {
      await getProviderOrSigner();
      setWalletConnected(true);
      isAddressWled();
      getAmountOfWl();
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getAmountOfWl();
    if (!walletConnected) {
      web3ModalRef.current = new Web3Modal({
        network: "goerli",
        providerOptions: {},
        disableInjectedProvider: false,
      });
      // connectWallet();
    }
  }, [walletConnected]);

  return (
    <div>
      <Head>
        <title>WanShiTong NFT - Whitelist</title>
        <meta name="description" content="Whitelist-Dapp" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.main}>
        <div>
          <h1 className={styles.title}>Welcome to WanShiTong NFT!</h1>
          <div className={styles.description}>
            A collection for frens of "He who knows 10,000 things"
          </div>
          <div className={styles.description}>
            {wlAmount} have already joined the Whitelist
          </div>
          {renderButton()}
        </div>
        <div>
          <img className={styles.image} src="/owl.jpg" />
        </div>
      </div>

      <footer className={styles.footer}>
        Made with &#10084; by Script
      </footer>
    </div>
  );
}
