import './App.css';
import NavMain from './component/NavBar';
import { useState, useEffect } from 'react';
import algosdk from 'algosdk';
import SendAlgo from './component/sendAlgo';
import { algodClient } from './utils/AlgorandUtils';
function App() {
	const [accountInfo, setAccountInfo] = useState(null);
	const [address, setAddress] = useState(null);


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
	}, [address]);
	return (
		<>
			<NavMain address={address} handleAddressUpdate={handleAddressUpdate} />
			<div className="App flex-grow-1">
				<div className="container-fluid mt-3">
					{address && (
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
											<SendAlgo pub_key={address.addr} HandleTrxSign={HandleTrxSign} maxAllowedSend={accountInfo && (accountInfo["amount"] - accountInfo["min-balance"])} />
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
						</>
					)}
				</div>
			</div>
		</>

	);
}

export default App;
