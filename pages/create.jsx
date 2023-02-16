import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';
import { Contract } from 'ethers';
import { CONTRACT_ADDRESS, abi, contractConditions } from '../constants';
import Router from 'next/router';

const Create = () => {
	const [percentageDone, setPercentageDone] = useState(0);
	const [loading, setLoading] = useState(false);

	const [name, setName] = useState('');
	const [author, setAuthor] = useState('');
	const [description, setDescription] = useState('');
	const [lanuguage, setLanguage] = useState('');
	const [price, setPrice] = useState(0);
	const [pages, setPages] = useState(0);
	const [file, setFile] = useState(null);

	const encryptionSignature = async () => {
		const provider = new ethers.providers.Web3Provider(window.ethereum);
		const signer = provider.getSigner();
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
		setPercentageDone(_percentageDone);
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
		console.log('Encrypted File hash', response.Hash);
		return response.Hash;
	};
	/* Deploy the whole data as JSON to IPFS*/
	const uploadToIpfs = async (fileCid) => {
		setLoading('uploading data to IPFS');
		const data = JSON.stringify({
			name,
			author,
			description,
			lanuguage,
			pages,
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
		}
	};

	const submitForm = async () => {
		if (
			!name ||
			!author ||
			!description ||
			!lanuguage ||
			price <= 0 ||
			pages <= 0 ||
			!file
		) {
			alert('invalid input or missing input');
			return;
		}
		//upload file
		let fileCid = await deployEncrypted(file);
		//apply access conditions
		setLoading('Interacting with smart contract...');
		const aggregator = '([1])';
		const { publicKey, signedMessage } = await encryptionSignature();
		const response = await lighthouse.accessCondition(
			publicKey,
			fileCid,
			signedMessage,
			contractConditions,
			aggregator
		);

		//upload other data to ipfs
		const ipfsLink = await uploadToIpfs(fileCid);

		//send everything to smart contract
		try {
			const signer = await encryptionSignature();
			const Contract = new Contract(CONTRACT_ADDRESS, abi, signer);
			const res = await Contract.createAsset(ipfsLink, price);
		} catch (error) {
			console.log(error);
		}

		setLoading(false);
		// Router.push('/profile');
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
							for='floating_name'
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
							for='floating_author'
							className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-purple peer-focus:dark:text-purple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
							Author(s)
						</label>
					</div>

					<div className='relative z-0 w-full mb-6 group'>
						<label
							for='description'
							className='block mb-2 text-sm font-medium text-gray-900 dark:text-gray-700'>
							Description
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
								for='floating_price'
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
								for='floating_language'
								className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-purple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
								Lanuguage
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
								for='floating_pages'
								className='peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-700 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-blue-600 peer-focus:dark:text-purple peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6'>
								Number of Pages
							</label>
						</div>
					</div>
					<div className='mb-6'>
						<label class='block mb-2 text-sm dark:text-gray-700' for='file'>
							Upload file
						</label>
						<input
							class='p-2 block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 dark:text-gray-700 focus:outline-none dark:bg-transparent dark:border-gray-600 dark:placeholder-gray-700'
							aria-describedby='file_help'
							id='file'
							type='file'
							onChange={(e) => setFile(e)}
						/>
					</div>
					<button
						type='submit'
						disabled={loading}
						className='px-3 py-2 rounded-3xl text-sm bg-purple text-yellow'>
						Submit
					</button>
					{loading && <p>{percentageDone} % complete</p>}
				</form>
			</main>
		</section>
	);
};

export default Create;
