import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import lighthouse from '@lighthouse-web3/sdk';
import { ethers } from 'ethers';

const Create = () => {
	const [percentageDone, setPercentageDone] = useState(0);
	const [name, setName] = useState('');
	const [author, setAuthor] = useState('');
	const [description, setDescription] = useState('');
	const [lanuguage, setLanguage] = useState('');
	const [price, setPrice] = useState(0);
	const [pages, setPages] = useState(0);
	const [file, setFile] = useState(null);
	const [loading, setLoading] = useState(false);
	const [fileUploaded, setFileUploaded] = useState(false);

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
		/*
		   uploadEncrypted(e, publicKey, accessToken, uploadProgressCallback)
		   - e: js event
		   - publicKey: wallets public key
		   - accessToken: your api key
		   - signedMessage: message signed by the owner of publicKey
		   - uploadProgressCallback: function to get progress (optional)
		*/
		const sig = await encryptionSignature();
		const response = await lighthouse.uploadEncrypted(
			e,
			sig.publicKey,
			process.env.NEXT_PUBLIC_LIGHTHOUSE_API_KEY,
			sig.signedMessage,
			progressCallback
		);
		console.log(response);
		setFileUploaded(true);
		/*
		  output:
			{
			  Name: "c04b017b6b9d1c189e15e6559aeb3ca8.png",
			  Size: "318557",
			  Hash: "QmcuuAtmYqbPYmPx3vhJvPDi61zMxYvJbfENMjBQjq7aM3"
			}
		  Note: Hash in response is CID.
		*/
	};

	const submitForm = () => {
		//validate data
		//set loading state - true
		//send transaction to smart contract
		//apply access controls
		//set loading state - false
		//clear state variables
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
							placeholder=''></textarea>
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
							disabled={fileUploaded}
							onChange={(e) => deployEncrypted(e)}
						/>
					</div>
					<button
						type='submit'
						className='px-3 py-2 rounded-3xl text-sm bg-purple text-yellow'>
						Submit
					</button>
				</form>
			</main>
		</section>
	);
};

export default Create;
