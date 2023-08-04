import algosdk from "algosdk";
const showConfirmation = () => {
    const result = window.confirm('Do you want to proceed?');
    return result;
};
const GenerateNewAddress = ({ address, handleAddressUpdate }) => {
    const generateAddress = () => {
        const account = algosdk.generateAccount();
        handleAddressUpdate({ addr: account.addr, mnemonic: algosdk.secretKeyToMnemonic(account.sk) });
    };
    const handleconfirmation = () => {
        const result = showConfirmation();
        return result ? generateAddress() : null
    }
    return (
            <>
            {
                !address && (
                    <button onClick={generateAddress} className="nav-link">Generate Address</button>
                )
            }

            {address && (                
                   
                <button onClick={handleconfirmation} className="dropdown-item">Generate New</button>
                              
            )}
        </>
    );
};

export default GenerateNewAddress;