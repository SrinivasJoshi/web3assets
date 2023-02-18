import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';
import { Contract } from 'ethers';
import { CONTRACT_ADDRESS, abi, contractConditions } from '../constants';
import Router from 'next/router';
import useweb3store from '../store/web3store';
import { getProviderOrSigner } from '../store/util';

const Create = () => {
	const { userAddress, web3modalRef } = useweb3store((state) => ({
		address: state.address,
		web3modalRef: state.web3Modal,
	}));

	const [loading, setLoading] = useState('');
	const [name, setName] = useState('');
	const [author, setAuthor] = useState('');
	const [description, setDescription] = useState('');
	const [language, setLanguage] = useState('');
	const [price, setPrice] = useState(0);
	const [pages, setPages] = useState(0);
	const [file, setFile] = useState(null);
	const [image, setImage] = useState(null);

	const encryptionSignature = async () => {
		const signer = await getProviderOrSigner(web3modalRef, true);
		const address = await signer.getAddress();
		const messageRequested = (await lighthouse.getAuthMessage(address)).data
			.message;
		const signedMessage = await signer.signMessage(messageRequested);
		return {
			signedMessage: signedMessage,
			publicKey: address,
		};
	};

	const progressCallback = (progressData) => {
		let _percentageDone =
			100 - (progressData?.total / progressData?.uploaded)?.toFixed(2);
		setLoading(_percentageDone);
	};

	/* Deploy file along with encryption */
	const deployEncrypted = async (e) => {
		setLoading('Uploading file ...');
		const sig = await encryptionSignature();
		const response = await lighthouse.uploadEncrypted(
			e,
			sig.publicKey,
			process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
			sig.signedMessage,
			progressCallback
		);
		console.log('Encrypted File hash', response.data.Hash);
		return response.data.Hash;
	};

	// Deploy book image to IPFS
	const uploadImageToIpfs = async () => {
		const file = image.files[0];
		try {
			const formData = new FormData();
			formData.append('file', file);
			const resFile = await axios({
				method: 'post',
				url: 'https://api.pinata.cloud/pinning/pinFileToIPFS',
				data: formData,
				headers: {
					pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
					pinata_secret_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_SECRET}`,
					'Content-Type': 'multipart/form-data',
				},
			});

			const Hash = resFile.data.IpfsHash;
			console.log(Hash);
			return Hash;
		} catch (error) {
			console.log('Error uploading image file to IPFS : ', error?.data.message);
			setLoading('');
		}
	};

	/* Deploy the whole data as JSON to IPFS*/
	const uploadToIpfs = async (fileCid, imgCid) => {
		setLoading('uploading data to IPFS');
		const data = JSON.stringify({
			name,
			author,
			description,
			language,
			pages,
			img,
			fileCid,
		});
		try {
			const resFile = await axios({
				method: 'post',
				url: 'https://api.pinata.cloud/pinning/pinJSONToIPFS',
				data,
				headers: {
					pinata_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_KEY}`,
					pinata_secret_api_key: `${process.env.NEXT_PUBLIC_PINATA_API_SECRET}`,
					'Content-Type': 'application/json',
				},
			});

			const Hash = `https://gateway.pinata.cloud/ipfs/${resFile.data.IpfsHash}`;
			console.log('IPFS hash : ', Hash);
			return Hash;
		} catch (error) {
			console.log('Error uploading file to IPFS : ', error?.data.message);
			setLoading('');
		}
	};

	const submitForm = async (e) => {
		e.preventDefault();
		if (
			!name ||
			!author ||
			!description ||
			!language ||
			price <= 0 ||
			pages <= 0 ||
			!file
		) {
			alert('invalid input or missing input');
			return;
		}
		//upload file
		// let fileCid = await deployEncrypted(file);
		let fileCid = 'QmeszNqzhScx7kaLMYG6ELdE6pTSwdgGbtyssYkex5bmWZ';
		if (!fileCid) {
			return;
		}
		//apply access conditions
		setLoading('Interacting with smart contract...');
		const { publicKey, signedMessage } = await encryptionSignature();
		const response1 = await lighthouse.accessCondition(
			publicKey,
			fileCid,
			signedMessage,
			contractConditions
		);
		console.log(response1);
		//upload other data to ipfs
		const imgCid = await uploadImageToIpfs();
		const ipfsLink = await uploadToIpfs(fileCid, imgCid);

		//send everything to smart contract
		try {
			const signer = await encryptionSignature();
			const contract = new Contract(CONTRACT_ADDRESS, abi, signer);
			const res = await contract.createAsset(ipfsLink, price);
		} catch (error) {
			console.log(error);
			setLoading('');
		}

		setLoading(false);
		Router.push('/profile');
	};

	return (
		<section className='bg-yellow min-h-screen px-10'>
			<Navbar />
			<main className='flex flex-col justify-evenly items-center'>
				<h1 className='text-2xl font-serif text-purple font-bold mb-10'>
					Create your eBook
				</h1>

				<form className='w-2/4' onSubmit={submitForm}>
					<div className='relative z-0 w-full mb-6 group'>
						<input
							type='text'
							name='floating_name'
							id='floating_name'
							className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-purple focus:outline-none focus:ring-0 focus:border-purple peer'
							placeholder=' '
							required
							onChange={(e) => setName(e.target.value)}
						/>
						<label
							htmlFor='floating_name'
							className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple peer-focus:dark:text-purple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
							Book Name
						</label>
					</div>
					<div className='relative z-0 w-full mb-6 group'>
						<input
							type='text'
							name='floating_author'
							id='floating_author'
							className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-purple focus:outline-none focus:ring-0 focus:border-purple peer'
							placeholder=' '
							required
							onChange={(e) => setAuthor(e.target.value)}
						/>
						<label
							htmlFor='floating_author'
							className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple peer-focus:dark:text-purple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
							Author(s)
						</label>
					</div>

					<div className='relative z-0 w-full mb-6 group'>
						<label
							htmlFor='description'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700'>
							Description(max : 150 words)
						</label>
						<textarea
							id='description'
							rows='10'
							className='block p-2.5 w-full text-sm text-gray-900 bg-transparent rounded-lg border-2 dark:bg-transparent dark:border-gray-700 dark:text-black outline-none'
							placeholder=''
							onChange={(e) => setDescription(e.target.value)}></textarea>
					</div>
					<div className='grid md:grid-cols-3 md:gap-6'>
						<div className='relative z-0 w-full mb-6 group'>
							<input
								type='number'
								min={0}
								name='floating_price'
								id='floating_price'
								className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-purple focus:outline-none focus:ring-0 focus:border-purple peer'
								placeholder=' '
								required
								onChange={(e) => setPrice(e.target.value)}
							/>
							<label
								htmlFor='floating_price'
								className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple peer-focus:dark:text-purple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
								Price in $
							</label>
						</div>
						<div className='relative z-0 w-full mb-6 group'>
							<input
								type='text'
								name='floating_language'
								id='floating_language'
								className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-purple focus:outline-none focus:ring-0 focus:border-blue-600 peer'
								placeholder=' '
								required
								onChange={(e) => setLanguage(e.target.value)}
							/>
							<label
								htmlFor='floating_language'
								className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-purple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 autofill:bg-transparent'>
								Language
							</label>
						</div>
						<div className='relative z-0 w-full mb-6 group'>
							<input
								type='number'
								min={0}
								name='floating_pages'
								id='floating_pages'
								className='block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none dark:text-black dark:border-gray-600 dark:focus:border-purple focus:outline-none focus:ring-0 focus:border-purple peer'
								placeholder=' '
								required
								onChange={(e) => setPages(e.target.value)}
							/>
							<label
								htmlFor='floating_pages'
								className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-purple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
								Number of Pages
							</label>
						</div>
					</div>
					<div className='mb-6'>
						<label
							className='block mb-2 text-sm dark:text-gray-700'
							htmlFor='img'>
							Upload image of book(portrait)
						</label>
						<input
							className='p-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-700 focus:outline-none dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-700'
							aria-describedby='img_help'
							id='img'
							type='file'
							onChange={(e) => setImage(e)}
							disabled={loading.length > 0}
						/>
					</div>
					<div className='mb-6'>
						<label
							className='block mb-2 text-sm dark:text-gray-700'
							htmlFor='file'>
							Upload file
						</label>
						<input
							className='p-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-700 focus:outline-none dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-700'
							aria-describedby='file_help'
							id='file'
							type='file'
							onChange={(e) => setFile(e)}
							disabled={loading.length > 0}
						/>
					</div>
					<button
						type='submit'
						disabled={loading.length > 0}
						className='mb-5 px-3 py-2 rounded-3xl text-sm bg-purple text-yellow disabled:bg-slate-800 autofill:bg-purple'>
						Submit
					</button>
					{loading ? loading : ''}
				</form>
			</main>
		</section>
	);
};

export default Create;
