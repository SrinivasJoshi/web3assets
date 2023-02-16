import React, { useRef, useEffect, useState } from 'react';
import Web3Modal from 'web3modal';
import useweb3store from '../store/web3store';
import { getProviderOrSigner } from '../store/util';
import Link from 'next/link';

const Navbar = () => {
	const web3ModalRef = useRef();
	const [isOpen, setIsOpen] = useState(false);
	const [walletConnected, setWalletConnected] = useState(false);
	const { address, addAddress, addweb3Modal } = useweb3store((state) => ({
		address: state.address,
		addAddress: state.addAddress,
		addweb3Modal: state.addweb3Modal,
	}));

	const connectWallet = async () => {
		try {
			const signer = await getProviderOrSigner(web3ModalRef, true);
			const _address = await signer.getAddress();
			addAddress(_address);
			setWalletConnected(true);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		if (!walletConnected) {
			addweb3Modal(web3ModalRef);
			web3ModalRef.current = new Web3Modal({
				network: 'matic',
				providerOptions: {},
				disableInjectedProvider: false,
			});
			connectWallet();
		}
	}, [walletConnected]);

	return (
		<div className='flex justify-between items-center bg-yellow h-10 pt-5'>
			<Link href={'/'}>
				<img src='/images/logo.png' alt='Logo' width={100} />
			</Link>

			{walletConnected ? (
				<div className='flex items-center justify-evenly w-96'>
					<Link href={'/marketplace'}>Discover</Link>
					<Link href={'/profile'}>Profile</Link>
					<Link href={'/create'}>Create</Link>
					<p className='border border-purple rounded-xl px-3 py-2'>
						{address.slice(0, 5) + '...' + address.slice(-4, -1)}{' '}
					</p>
				</div>
			) : (
				<button onClick={connectWallet}>Wallet</button>
			)}
		</div>
	);
};

export default Navbar;
