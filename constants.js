export const CONTRACT_ADDRESS = '0xB577699C1113bE7Ec92CcaB6973aBe18C970E2c2';
export const contractConditions = [
	{
		id: 1,
		chain: 'Polygon Mumbai',
		method: 'doesUserOwnAsset',
		standardContractType: '',
		returnValueTest: {
			// comparator: '>=',
			value: true,
		},
	},
];

export const abi = [
	{
		inputs: [
			{ internalType: 'address', name: '_USDCtokenAddr', type: 'address' },
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
					{ internalType: 'string', name: 'name', type: 'string' },
					{ internalType: 'uint256', name: 'price', type: 'uint256' },
					{ internalType: 'string', name: 'link', type: 'string' },
					{ internalType: 'address payable', name: 'creator', type: 'address' },
				],
				indexed: false,
				internalType: 'struct AssetShare.Asset',
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
					{ internalType: 'string', name: 'name', type: 'string' },
					{ internalType: 'uint256', name: 'price', type: 'uint256' },
					{ internalType: 'string', name: 'link', type: 'string' },
					{ internalType: 'address payable', name: 'creator', type: 'address' },
				],
				indexed: false,
				internalType: 'struct AssetShare.Asset',
				name: 'asset',
				type: 'tuple',
			},
		],
		name: 'AssetSold',
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
		inputs: [],
		name: 'I_Owner',
		outputs: [{ internalType: 'address', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: '_USDCtoken',
		outputs: [{ internalType: 'contract IERC20', name: '', type: 'address' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: '_tokenID', type: 'uint256' }],
		name: 'buyAssetInToken',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'string', name: '_assetName', type: 'string' },
			{ internalType: 'string', name: '_link', type: 'string' },
			{ internalType: 'uint256', name: '_price', type: 'uint256' },
		],
		name: 'createAsset',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
	{
		inputs: [{ internalType: 'uint256', name: 'tokenID', type: 'uint256' }],
		name: 'doesUserOwnAsset',
		outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getBoughtAssets',
		outputs: [
			{
				components: [
					{ internalType: 'string', name: 'name', type: 'string' },
					{ internalType: 'uint256', name: 'price', type: 'uint256' },
					{ internalType: 'string', name: 'link', type: 'string' },
					{ internalType: 'address payable', name: 'creator', type: 'address' },
				],
				internalType: 'struct AssetShare.Asset[]',
				name: '',
				type: 'tuple[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'getCreatedAssets',
		outputs: [
			{
				components: [
					{ internalType: 'string', name: 'name', type: 'string' },
					{ internalType: 'uint256', name: 'price', type: 'uint256' },
					{ internalType: 'string', name: 'link', type: 'string' },
					{ internalType: 'address payable', name: 'creator', type: 'address' },
				],
				internalType: 'struct AssetShare.Asset[]',
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
					{ internalType: 'string', name: 'name', type: 'string' },
					{ internalType: 'uint256', name: 'price', type: 'uint256' },
					{ internalType: 'string', name: 'link', type: 'string' },
					{ internalType: 'address payable', name: 'creator', type: 'address' },
				],
				internalType: 'struct AssetShare.Asset[]',
				name: '',
				type: 'tuple[]',
			},
		],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'platformfeeBasisPoint',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [],
		name: 'totalAssets',
		outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
		stateMutability: 'view',
		type: 'function',
	},
	{
		inputs: [
			{ internalType: 'uint256', name: 'tokenId', type: 'uint256' },
			{ internalType: 'uint256', name: '_price', type: 'uint256' },
		],
		name: 'updatePrice',
		outputs: [],
		stateMutability: 'nonpayable',
		type: 'function',
	},
];
