import create from 'zustand';
import { Contract, providers, utils } from 'ethers';
import { abi, NFT_CONTRACT_ADDRESS } from '../constants';

const web3store = (set) => ({
	address: '',
	web3Modal: {},
	addAddress: (_address) => {
		set((state) => ({
			address: _address,
		}));
	},
	addweb3Modal: (_modal) => {
		set((state) => ({
			web3Modal: _modal,
		}));
	},
});
const useweb3store = create(web3store);

export default useweb3store;
