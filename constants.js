export const CONTRACT_ADDRESS = '0xf2C3666C08201fC837603abeAd35DfF2c28c3Aa4';
export const USDC_ADDRESS = '0xC33343596c8b86BF46B7C05F583833079f9115ee';
export const contractConditions = [
	{
		id: 1,
		chain: 'Mumbai',
		method: 'checkAssetOwnedByUser',
		standardContractType: 'Custom',
		contractAddress: '0xf2C3666C08201fC837603abeAd35DfF2c28c3Aa4',
		returnValueTest: {
			comparator: '==',
			value: '1',
		},
		parameters: [':tokenID'],
		inputArrayType: ['uint256'],
		outputType: 'uint8',
	},
];

export const USDC_abi = [
	{ inputs: [], stateMutability: 'nonpayable', type: 'constructor' },
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'owner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'spender',
				type: 'address',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Approval',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: true,
				internalType: 'address',
				name: 'previousOwner',
				type: 'address',
			},
			{
				indexed: true,
				internalType: 'address',
				name: 'newOwner',
				type: 'address',
			},
		],
		name: 'OwnershipTransferred',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{ indexed: true, internalType: 'address', name: 'from', type: 'address' },
			{ indexed: true, internalType: 'address', name: 'to', type: 'address' },
			{
				indexed: false,
				internalType: 'uint256',
				name: 'value',
				type: 'uint256',
			},
		],
		name: 'Transfer',
		type: 'event',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'owner', type: 'address' },
			{ internalType: 'address', name: 'spender', type: 'address' },
		],
		name: 'allowance',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'approve',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'account', type: 'address' }],
		name: 'balanceOf',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'decimals',
		outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'subtractedValue', type: 'uint256' },
		],
		name: 'decreaseAllowance',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'spender', type: 'address' },
			{ internalType: 'uint256', name: 'addedValue', type: 'uint256' },
		],
		name: 'increaseAllowance',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: 'amount', type: 'uint256' }],
		name: 'mint',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'name',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'owner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'renounceOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: 'symbol',
		outputs: [{ internalType: 'string', name: '', type: 'string' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalSupply',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'transfer',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'address', name: 'from', type: 'address' },
			{ internalType: 'address', name: 'to', type: 'address' },
			{ internalType: 'uint256', name: 'amount', type: 'uint256' },
		],
		name: 'transferFrom',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'address', name: 'newOwner', type: 'address' }],
		name: 'transferOwnership',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
];

export const abi = [
	{
		inputs: [
			{
				internalType: 'address',
				name: '_USDCtokenAddr',
				type: 'address',
			},
			{
				internalType: 'uint256',
				name: '_platformfeeBasisPoint',
				type: 'uint256',
			},
		],
		stateMutability: 'nonpayable',
		type: 'constructor',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'assetID',
				type: 'uint256',
			},
			{
				components: [
					{
						internalType: 'uint256',
						name: 'assetId',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'assetName',
						type: 'string',
					},
					{
						internalType: 'uint256',
						name: 'price',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'link',
						type: 'string',
					},
					{
						internalType: 'address payable',
						name: 'creator',
						type: 'address',
					},
				],
				indexed: false,
				internalType: 'struct web3Assets.Asset',
				name: 'asset',
				type: 'tuple',
			},
		],
		name: 'AssetCreated',
		type: 'event',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'assetID',
				type: 'uint256',
			},
			{
				components: [
					{
						internalType: 'uint256',
						name: 'assetId',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'assetName',
						type: 'string',
					},
					{
						internalType: 'uint256',
						name: 'price',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'link',
						type: 'string',
					},
					{
						internalType: 'address payable',
						name: 'creator',
						type: 'address',
					},
				],
				indexed: false,
				internalType: 'struct web3Assets.Asset',
				name: 'asset',
				type: 'tuple',
			},
		],
		name: 'AssetSold',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_assetID',
				type: 'uint256',
			},
		],
		name: 'buyAssetInToken',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'string',
				name: '_link',
				type: 'string',
			},
			{
				internalType: 'uint256',
				name: '_price',
				type: 'uint256',
			},
			{
				internalType: 'string',
				name: '_name',
				type: 'string',
			},
		],
		name: 'createAsset',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		anonymous: false,
		inputs: [
			{
				indexed: false,
				internalType: 'uint256',
				name: 'assetID',
				type: 'uint256',
			},
			{
				indexed: false,
				internalType: 'uint256',
				name: 'Price',
				type: 'uint256',
			},
		],
		name: 'PriceUpdated',
		type: 'event',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: 'tokenId',
				type: 'uint256',
			},
			{
				internalType: 'uint256',
				name: '_price',
				type: 'uint256',
			},
		],
		name: 'updatePrice',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: '_tokenAddr',
				type: 'address',
			},
		],
		name: 'updateTokenAddr',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [],
		name: '_USDCtoken',
		outputs: [
			{
				internalType: 'contract IERC20',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_tokenID',
				type: 'uint256',
			},
		],
		name: 'checkAssetOwnedByUser',
		outputs: [
			{
				internalType: 'uint8',
				name: '',
				type: 'uint8',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'uint256',
				name: '_tokenID',
				type: 'uint256',
			},
			{
				internalType: 'address',
				name: '_userAddr',
				type: 'address',
			},
		],
		name: 'doesUserOwnAsset',
		outputs: [
			{
				internalType: 'bool',
				name: '',
				type: 'bool',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'user',
				type: 'address',
			},
		],
		name: 'getBoughtAssets',
		outputs: [
			{
				components: [
					{
						internalType: 'uint256',
						name: 'assetId',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'assetName',
						type: 'string',
					},
					{
						internalType: 'uint256',
						name: 'price',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'link',
						type: 'string',
					},
					{
						internalType: 'address payable',
						name: 'creator',
						type: 'address',
					},
				],
				internalType: 'struct web3Assets.Asset[]',
				name: '',
				type: 'tuple[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{
				internalType: 'address',
				name: 'user',
				type: 'address',
			},
		],
		name: 'getCreatedAssets',
		outputs: [
			{
				components: [
					{
						internalType: 'uint256',
						name: 'assetId',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'assetName',
						type: 'string',
					},
					{
						internalType: 'uint256',
						name: 'price',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'link',
						type: 'string',
					},
					{
						internalType: 'address payable',
						name: 'creator',
						type: 'address',
					},
				],
				internalType: 'struct web3Assets.Asset[]',
				name: '',
				type: 'tuple[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getMarketItems',
		outputs: [
			{
				components: [
					{
						internalType: 'uint256',
						name: 'assetId',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'assetName',
						type: 'string',
					},
					{
						internalType: 'uint256',
						name: 'price',
						type: 'uint256',
					},
					{
						internalType: 'string',
						name: 'link',
						type: 'string',
					},
					{
						internalType: 'address payable',
						name: 'creator',
						type: 'address',
					},
				],
				internalType: 'struct web3Assets.Asset[]',
				name: '',
				type: 'tuple[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'I_Owner',
		outputs: [
			{
				internalType: 'address payable',
				name: '',
				type: 'address',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'platformfeeBasisPoint',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalAssets',
		outputs: [
			{
				internalType: 'uint256',
				name: '',
				type: 'uint256',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
];
