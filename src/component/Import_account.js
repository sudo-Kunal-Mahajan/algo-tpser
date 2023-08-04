import algosdk from "algosdk";
import { useState } from "react";


const ImportAccount = ({ address, handleAddressUpdate }) => {
    const [inputMnemonic, setinputMnemonic] = useState("")

    const handleMnemonicProvided = (event) => {
        if(event.target.value===""){
            return
        } else {
            setinputMnemonic(event.target.value);
        }        
    };

    const handleSubmittedMnemonic = () => {
        if(inputMnemonic.split(" ").length!==25){
            alert("Invalid Mnemonic");
            return
        }
        const keypair = algosdk.mnemonicToSecretKey(inputMnemonic);
        handleAddressUpdate({ addr: keypair.addr, mnemonic: inputMnemonic });
        setinputMnemonic("");
    };
    return (
        <div>
            {
                !address && (
                    <>
                        <div className="modal fade" id="addAccountSeed" data-backdrop="false"  tabIndex="-1" aria-labelledby="addAccountSeedLabel" aria-hidden="true">
                            <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
                                <div className="modal-content">
                                    <div className="modal-header">
                                        <h5 className="modal-title" id="addAccountSeedLabel">Import Account</h5>
                                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className='container-fluid'>
                                           
                                            <div className='row'>
                                                <div className='col-12'>
                                                    <textarea type="text" className="form-control" placeholder="Enter Mnemonic Here" value={inputMnemonic} onChange={handleMnemonicProvided} />
                                                </div>
                                            </div>
                                            <div className="row">
                                                <div className="col-12">
                                                    <span className="text-danger">App doesn't encrypt the seed before storing in cache. Please use test account</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="modal-footer">
                                        <button onClick={handleSubmittedMnemonic} data-bs-dismiss="modal" className="btn btn-primary">Add Address</button>
                                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                                    </div>
                                </div>
                            </div>
                        </div>               
                    </>
                )
            }

        </div>
    );
};

export default ImportAccount;