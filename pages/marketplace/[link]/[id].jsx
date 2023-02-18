import React, { useEffect, useState } from 'react';
import {
	USDC_ADDRESS,
	CONTRACT_ADDRESS,
	USDC_abi,
	abi,
} from '../../../constants';
import { getProviderOrSigner } from '../../../store/util';
import { Contract } from 'ethers';
import Navbar from '../../../components/Navbar';
import useweb3store from '../../../store/web3store';
import Router from 'next/router';

const LongCard = (props) => {
	const [asset, setAsset] = useState({});
	const [loading, setLoading] = useState(false);
	const { address, web3modalRef } = useweb3store((state) => ({
		address: state.address,
		web3modalRef: state.web3Modal,
	}));

	const approveUser = async () => {
		try {
			const signer = await getProviderOrSigner(web3modalRef, true);
			const contract = new Contract(USDC_ADDRESS, USDC_abi, signer);
			const res = await contract.approve(CONTRACT_ADDRESS, asset.price - '');
			console.log('APPROVED', res);
			return res;
		} catch (error) {
			console.log(error);
			setLoading(false);
		}
	};

	const buyBook = async () => {
		setLoading(true);
		const allowed = await checkAllowance();
		if (allowed) {
			const res = await approveUser();
		}

		try {
			const signer = await getProviderOrSigner(web3modalRef, true);
			const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
			const res = await contract.buyAssetInToken(props.assetId);
			setLoading(false);
			Router.push('/profile');
		} catch (error) {
			alert('Could not buy, check console');
			console.log('Error : Could not buy your Asset', error);
			setLoading(false);
		}
	};

	const getAssetData = async () => {
		try {
			const res = await fetch(
				`https://gateway.pinata.cloud/ipfs/${props.assetLink}`
			);
			const data = await res.json();
			setAsset(data);
		} catch (error) {
			console.log(error);
		}
	};

	const checkAllowance = async () => {
		try {
			const provider = await getProviderOrSigner(web3modalRef, false);
			const contract = new Contract(USDC_ADDRESS, USDC_abi, provider);
			const res = await contract.allowance(address, CONTRACT_ADDRESS);
			if (res.toNumber() < asset.price - '') {
				return true;
			}
			return false;
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		getAssetData();
	}, []);

	return (
		<section className='bg-yellow min-h-screen px-10'>
			<Navbar />
			<main className='flex justify-evenly items-center mt-10'>
				<img
					src={`https://gateway.pinata.cloud/ipfs/${asset.img}`}
					width={300}
					height={500}
					className='rounded-sm'
					alt='Book Image'
				/>
				<div className='w-4/6 flex flex-col items-start justify-evenly p-2'>
					<h1 className='text-2xl font-semibold'>{asset.name}</h1>
					<p className='italic mb-10 '>{asset.author}</p>
					<p>
						<strong>Description : </strong> {asset.description}
					</p>
					<ul className='my-2'>
						<li>
							<strong>Language</strong> : {asset.language}
						</li>
						<li>
							<strong>Pages</strong> : {asset.pages}
						</li>
					</ul>
					<p>
						<strong>Price : {asset.price} </strong>
					</p>
					<button
						onClick={buyBook}
						className='my-4 px-3 py-2 rounded-3xl text-sm bg-purple text-yellow autofill:bg-purple'>
						Buy now!
					</button>
					{loading && (
						<div role='status'>
							<svg
								aria-hidden='true'
								className='w-8 h-8 mr-2 text-gray-200 animate-spin fill-purple'
								viewBox='0 0 100 101'
								fill='none'
								xmlns='http://www.w3.org/2000/svg'>
								<path
									d='M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z'
									fill='currentColor'
								/>
								<path
									d='M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z'
									fill='currentFill'
								/>
							</svg>
							<span className='sr-only'>Loading...</span>
						</div>
					)}
				</div>
			</main>
		</section>
	);
};

export default LongCard;

export async function getServerSideProps(context) {
	console.log(context.query);

	//you can make DB queries using the data in context.query
	return {
		props: {
			assetId: context.query.id,
			assetLink: context.query.link,
		},
	};
}
