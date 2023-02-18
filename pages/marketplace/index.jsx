import React, { useState, useEffect } from 'react';
import { Contract } from 'ethers';
import { abi, CONTRACT_ADDRESS } from '../../constants';
import { getProviderOrSigner } from '../../store/util';
import useweb3store from '../../store/web3store';
import Navbar from '../../components/Navbar';
import Card from '../../components/Card';

const Marketplace = () => {
	const [marketItems, setMarketItems] = useState([]);
	const { web3modalRef } = useweb3store((state) => ({
		web3modalRef: state.web3Modal,
	}));

	const getMarketItems = async () => {
		try {
			const provider = await getProviderOrSigner(web3modalRef, false);
			const contract = new Contract(CONTRACT_ADDRESS, abi, provider);
			const _marketItems = await contract.getMarketItems();
			setMarketItems(_marketItems);
		} catch (error) {
			console.log('Error fetching market items : ', error);
		}
	};

	useEffect(() => {
		getMarketItems();
	}, []);

	return (
		<section className='bg-yellow min-h-screen px-10'>
			<Navbar />
			<main className='flex flex-col justify-evenly items-center'>
				<h1 className='text-2xl font-serif text-purple font-bold mb-10'>
					Marketplace
				</h1>
				<div className='grid gap-8 pb-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-4'>
					{marketItems.map((item, i) => {
						return <Card item={item} key={i} />;
					})}
				</div>
				{marketItems.length === 0 && <p>No market items found</p>}
			</main>
		</section>
	);
};

export default Marketplace;
