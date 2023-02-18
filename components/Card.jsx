import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const Card = ({ item }) => {
	const router = useRouter();
	const [fileCid, setFileCid] = useState('');
	const [image, setImage] = useState('');
	const [isProfile, setIsProfile] = useState(false);

	const getInfo = async () => {
		try {
			const res = await fetch(`https://gateway.pinata.cloud/ipfs/${item.link}`);
			const data = await res.json();
			setFileCid(data.fileCid);
			setImage(data.img);
		} catch (error) {
			console.log(error);
		}
	};

	useEffect(() => {
		setIsProfile(router.pathname == '/profile');
		getInfo();
	}, []);

	return (
		<div className='border border-purple rounded-lg p-2 flex flex-col items-center'>
			<h1 className='text-xl font-semibold mb-3'>{item.assetName}</h1>
			<img
				src={`https://gateway.pinata.cloud/ipfs/${image}`}
				width={200}
				height={300}
				className='rounded-sm mb-5'
				alt='Book Image'
			/>
			{!isProfile && <p>Price : {item.price.toNumber()}$ </p>}
			{!isProfile ? (
				<Link href={`/marketplace/${item.link}/${item.assetId.toNumber()}`}>
					<button className='mt-5 px-3 py-2 rounded-3xl text-sm bg-purple text-yellow autofill:bg-purple'>
						Learn more
					</button>
				</Link>
			) : (
				<a
					target='_blank'
					href={`https://files.lighthouse.storage/viewFile/${fileCid}`}>
					<button className='px-3 py-2 rounded-3xl text-sm bg-purple text-yellow autofill:bg-purple'>
						View File
					</button>
				</a>
			)}
		</div>
	);
};

export default Card;
