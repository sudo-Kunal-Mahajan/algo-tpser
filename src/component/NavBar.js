import GenerateNewAddress from "./Generate_new_address"
import ImportAccount from "./Import_account"
const NavMain = ({ address, handleAddressUpdate, handleApiUpdate, currentApi }) => {

    const LogoutUser = () => {
        handleAddressUpdate(null)
    }

    return (
        <>
            <ImportAccount address={address} handleAddressUpdate={handleAddressUpdate} />
            <div id="navbar_main_section">
                <nav className="navbar navbar-expand-md bg-dark border-bottom border-bottom-dark  sticky-top p-3 " data-bs-theme="dark" role="navigation">
                    <div className="container-fluid">
                        <h5 className="text-white mt-0 mb-0">X <a className="navbar-brand text-primary" href="https://github.com/sudo-Kunal-Mahajan/algo-tpser" target="_blank" rel="noreferrer">(Github)</a></h5>
                        <button className="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span className="navbar-toggler-icon"></span>
                        </button>
                        <div className="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul className="navbar-nav  ms-auto">
                                <li className="nav-item mx-2">
                                    <select className="form-select " aria-label="select network" onChange={handleApiUpdate} value={currentApi()}>
                                        <option value="Testnet">Testnet</option>
                                        <option value="Mainnet">Mainnet</option>
                                    </select>
                                </li>
                                {
                                    address && (
                                        <li className="nav-item dropdown ">
                                            <button className="nav-link dropdown-toggle" id="navbar_profile_link"
                                                data-bs-toggle="dropdown" aria-expanded="false">
                                                <img src={process.env.PUBLIC_URL+'/profile.png'} width="20" alt="profile" />
                                            </button>
                                            <ul className="dropdown-menu dropdown-menu-end" style={{ right: 0 }} aria-labelledby="navbar_profile_link">

                                                <li>
                                                    <GenerateNewAddress address={address} handleAddressUpdate={handleAddressUpdate} />
                                                </li>
                                                <li>
                                                    <hr className="dropdown-divider" />
                                                </li>
                                                <li>
                                                    <button className="dropdown-item" onClick={LogoutUser}>Log out</button>
                                                </li>
                                            </ul>
                                        </li>
                                    )
                                }
                                {!address && (
                                    <>
                                        <li className="nav-item">
                                            <button type="button" className="nav-link" data-bs-toggle="modal" data-bs-target="#addAccountSeed">Import Account</button>
                                        </li>
                                        <li className="nav-item ">
                                            <GenerateNewAddress address={address} handleAddressUpdate={handleAddressUpdate} />
                                        </li>
                                    </>

                                )}
                            </ul>
                        </div>
                    </div>
                </nav>
            </div>
        </>

    )
}

export default NavMain;