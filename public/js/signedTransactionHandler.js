const abi = [
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "adr",
				"type": "bytes32"
			}
		],
		"name": "approveApplication",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "address",
				"name": "newOwner",
				"type": "address"
			}
		],
		"name": "transferOwner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "string",
				"name": "id",
				"type": "string"
			}
		],
		"name": "getHash",
		"outputs": [
			{
				"internalType": "bytes32",
				"name": "",
				"type": "bytes32"
			}
		],
		"payable": false,
		"stateMutability": "pure",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "getDealerInfo",
		"outputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "dealerName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "addr",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "phoneNo",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "availableServices",
						"type": "string[]"
					},
					{
						"internalType": "string[][]",
						"name": "availableSubServices",
						"type": "string[][]"
					}
				],
				"internalType": "struct DealerContract.DealerInfo",
				"name": "",
				"type": "tuple"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [],
		"name": "getAllDealerApplications",
		"outputs": [
			{
				"internalType": "bytes32[]",
				"name": "",
				"type": "bytes32[]"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "dealershipId",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "otherId",
				"type": "bytes32"
			}
		],
		"name": "transferDealershipOwner",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "dealerName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "addr",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "phoneNo",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "availableServices",
						"type": "string[]"
					},
					{
						"internalType": "string[][]",
						"name": "availableSubServices",
						"type": "string[][]"
					}
				],
				"internalType": "struct DealerContract.DealerInfo",
				"name": "info",
				"type": "tuple"
			},
			{
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "editDealerInfo",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"components": [
					{
						"internalType": "string",
						"name": "dealerName",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "addr",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "location",
						"type": "string"
					},
					{
						"internalType": "string",
						"name": "phoneNo",
						"type": "string"
					},
					{
						"internalType": "string[]",
						"name": "availableServices",
						"type": "string[]"
					},
					{
						"internalType": "string[][]",
						"name": "availableSubServices",
						"type": "string[][]"
					}
				],
				"internalType": "struct DealerContract.DealerInfo",
				"name": "info",
				"type": "tuple"
			},
			{
				"internalType": "bytes32",
				"name": "id",
				"type": "bytes32"
			}
		],
		"name": "createDealerApplication",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"constant": true,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "adr",
				"type": "bytes32"
			}
		],
		"name": "isVerified",
		"outputs": [
			{
				"internalType": "bool",
				"name": "",
				"type": "bool"
			}
		],
		"payable": false,
		"stateMutability": "view",
		"type": "function"
	},
	{
		"constant": false,
		"inputs": [
			{
				"internalType": "bytes32",
				"name": "dealerId",
				"type": "bytes32"
			},
			{
				"internalType": "bytes32",
				"name": "adr",
				"type": "bytes32"
			}
		],
		"name": "addDealerEmployee",
		"outputs": [],
		"payable": false,
		"stateMutability": "nonpayable",
		"type": "function"
	}
];

var web3 
const contractAddr = '0xb9ada20322382052C38acf3dBCd1E18e06369531';
var deployedContract;
const pk = '7380AAE53DC2A7A53E147C4DE1DAF1578A2AC85034CDF39BE69D609AAE844835';
var account;

function initWeb3(){
    if(web3 == null){
        console.log('web3 not initialised. initialising');
        web3 = new Web3(new Web3.providers.HttpProvider('https://rinkeby.infura.io/v3/137fcd99ee7c405f958afb6679d1b5a5'));
        console.log('initialising contract')
        deployedContract = new web3.eth.Contract(abi,contractAddr);
        account = web3.eth.accounts.privateKeyToAccount('0x' + pk);
        console.log(account)
    }
}

function getContract(){
    initWeb3();
    return deployedContract;
}

async function sendSigned(contractMethod){
    initWeb3();
    const encodedABI = contractMethod.encodeABI();
    const signedTX = await web3.eth.accounts.signTransaction({
      data: encodedABI,
      from: account.address,
      gas: 2000000,
      to: deployedContract.options.address,
    },'0x' + pk,false);
    console.log('signed transaction: ')
    console.log(signedTX);
    return web3.eth.sendSignedTransaction(signedTX.rawTransaction).on('receipt',console.log);
  }