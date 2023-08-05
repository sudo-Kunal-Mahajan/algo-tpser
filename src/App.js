import './App.css';
import NavMain from './component/NavBar';
import { useState, useEffect } from 'react';
import algosdk from 'algosdk';
import SendAlgo from './component/sendAlgo';
import { algodMainClient, algodTestClient } from './utils/AlgorandUtils';
import FooterMain from './Footer';
function App() {
	const [accountInfo, setAccountInfo] = useState(null);
	const [address, setAddress] = useState(null);
	const [algodClient, setAlgodClient] = useState(algodTestClient);
	const handleAddressUpdate = (address) => {
		localStorage.removeItem("address")
		localStorage.setItem("address", JSON.stringify(address))
		setAddress(localStorage.getItem("address") ? JSON.parse(localStorage.getItem("address")) : null)
	}


	const HandleTrxSign = (builtTxn) => {
		const { sk } = algosdk.mnemonicToSecretKey(address.mnemonic);
		return algosdk.signTransaction(builtTxn, sk);
	}
	useEffect(() => {
		setAddress(localStorage.getItem("address") ? JSON.parse(localStorage.getItem("address")) : null)
	}, [])

	const currentApi = () => {
		if (algodClient === algodTestClient) {
			return "Testnet"
		} else {
			return "Mainnet"
		}
	}

	const handleApiUpdate = (api) => {
		if (api.target.value === "Testnet") {
			setAlgodClient(algodTestClient)
		} else {
			setAlgodClient(algodMainClient)
		}
	}

	useEffect(() => {
		if (address != null) {
			const fetchAssets = async () => {
				try {
					const accountInfo = await algodClient.accountInformation(address.addr).do();
					setAccountInfo(accountInfo)
					console.log(accountInfo)

				} catch (error) {
					console.error('Error fetching assets:', error);
					setAccountInfo(null)
				} 
			}
			fetchAssets();
		}
	}, [address,algodClient]);

	return (
		<>
			<NavMain address={address} handleAddressUpdate={handleAddressUpdate} currentApi={currentApi} handleApiUpdate={handleApiUpdate} />
			<div className="App flex-grow-1">
				<div className="container-fluid mt-3">
					{address ? (
						<>
							<div className="row">
								<div className="col-12 text-center">
									Your public address: {address.addr}
								</div>
							</div>
							<div className="row mt-3">
								<div className="col-xs-12 col-md-6">
									<div className='card'>
										<div className="card-header">
											<h5 className="card-title">Send Algos</h5>
										</div>
										<div className='card-body'>
											<SendAlgo pub_key={address.addr} HandleTrxSign={HandleTrxSign} algodClient={algodClient} maxAllowedSend={accountInfo && (accountInfo["amount"] - accountInfo["min-balance"])} />
										</div>
									</div>
								</div>
								<div className="col-xs-12 col-md-6">
									<div className='card'>
										<div className="card-header">
											<h5 className="card-title">Send ASAs</h5>
										</div>
										<div className='card-body'>
										</div>
									</div>
								</div>
							</div>
				
							<div className='row mt-3'>
								<div className="col-12 card card-body">
									<ul>
										<li>
										You can dust to my account @NA4VOZFZFSGZM6AQMMUMEIDSPQXN4GLEDE7OD4SFVNHV7APXIIWNL62AT4 ;-&#41;
										</li>
										<li>
											The code has no fail-safe other than the stop button. So, if you are sending a lot of transactions, make sure you have enough balance to cover the fee of all the transactions. 
										</li>
										<li>
											Currently deployed using the AlgoNode Free API which restricts the max transaction per second. To get most out of the app, you can pair up the code with your own node ( utils\AlgorandUtils.js ).
										</li>
									</ul>
									
								</div>
							</div>
						</>
					) : (<>
						<div className="card card-body mt-3">
						<strong className='text-danger text-center'>Your mnemonic never leaves the browser but it is also not securely stored. So, consider using dummy accounts.<br/> Generate a wallet and feed it with the amount you want to spend. </strong>

							<ul className='mt-3'>
								<li>
								 Import your mnemonic or Generate a new address from the provided buttons in navbar.
								</li>
								<li>
								You can switch the network too from the NavBar itself.
								</li>
								<li>
									If you are using TestNet, you can get Test Algo using the dispenser from this link: <a href="https://bank.t	estnet.algorand.network/" target="_blank" rel="noreferrer">https://bank.testnet.algorand.network/</a>
								</li>
							</ul>
						</div>
						
						
						</>		
					)}

				</div>
			</div>
			<FooterMain which_api={"AlgoNode (" + currentApi() +")"} />
		</>

	);
}

export default App;
