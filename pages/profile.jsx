import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { ethers } from 'ethers';
import lighthouse from '@lighthouse-web3/sdk';

const Profile = () => {
	const [tab, setTab] = useState(true);

	//FUNC : getMyCreatedAssets
	//FUNC : getBoughtAssets
	//do not decrypt - just forward the user to view the file
	return (
		<section className='bg-yellow min-h-screen px-10'>
			<Navbar />
			<main className='flex flex-col justify-evenly items-center'>
				<h1 className='text-2xl font-serif text-purple font-bold mb-10'>
					Profile
				</h1>
				{tab ? <div></div> : <div></div>}
			</main>
		</section>
	);
};

export default Profile;
