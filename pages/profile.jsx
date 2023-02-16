import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { Contract } from 'ethers';
import lighthouse from '@lighthouse-web3/sdk';
import useweb3store from '../store/web3store';
import { abi, CONTRACT_ADDRESS } from '../constants';
import { getProviderOrSigner } from '../store/util';

const Profile = () => {
	const [isSection1, setIsSection1] = useState(true);
	const [createdAssets, setCreatedAssets] = useState([]);
	const [boughtAssets, setBoughtAssets] = useState([]);
	const { web3modalRef } = useweb3store((state) => ({
		web3modalRef: state.web3Modal,
	}));

	const changeSection = () => {
		if (isSection1) {
			setIsSection1(false);
		} else {
			setIsSection1(true);
		}
	};

	//FUNC : getMyCreatedAssets
	const getMyCreatedAssets = async () => {
		try {
			const signer = await getProviderOrSigner(web3modalRef, true);
			const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
			const _createdAssets = await contract.getCreatedAssets();
			setCreatedAssets(_createdAssets);
			console.log(_createdAssets);
		} catch (error) {
			console.log('Error fetching your created Assets : ', error);
		}
	};

	//FUNC : getBoughtAssets
	const getBoughtAssets = async () => {
		try {
			const signer = await getProviderOrSigner(web3modalRef, true);
			const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
			const _boughtAssets = await contract.getCreatedAssets();
			setBoughtAssets(_boughtAssets);
			console.log(_boughtAssets);
		} catch (error) {
			console.log('Error fetching your bought assets ', error);
		}
	};
	useEffect(() => {
		getBoughtAssets();
		getMyCreatedAssets();
	}, []);

	//do not decrypt - just forward the user to view the file : https://files.lighthouse.storage/${CID}
	return (
		<section className='bg-yellow min-h-screen px-10'>
			<Navbar />
			<main className='flex flex-col justify-evenly items-center'>
				<h1 className='text-2xl font-serif text-purple font-bold mb-10'>
					Profile
				</h1>
				<div className='flex justify-center text-purple w-4/5 mb-10'>
					<button
						className={`w-1/2 pb-2 ${
							isSection1 ? 'border-b-2 border-purple' : ''
						}`}
						onClick={changeSection}>
						Created Assets
					</button>
					<button
						className={`w-1/2 pb-2 ${
							!isSection1 ? 'border-b-2 border-purple' : ''
						}`}
						onClick={changeSection}>
						Owned Assets
					</button>
				</div>

				{isSection1 ? (
					<div className=''>
						{createdAssets.length === 0 ? (
							'No assets created by you yet!'
						) : (
							<div>{createdAssets.map()}</div>
						)}
					</div>
				) : (
					<div>
						{boughtAssets.length === 0 ? (
							'No assets purchased by you yet!'
						) : (
							<div>{boughtAssets.map()}</div>
						)}
					</div>
				)}
			</main>
		</section>
	);
};

export default Profile;
