import algosdk from "algosdk";
import { algodClient } from "../utils/AlgorandUtils";
import { useEffect, useRef, useState } from "react";

const SendAlgo = ({ pub_key, HandleTrxSign, maxAllowedSend }) => {
    const [formData, setFormData] = useState({ "recPub": "", "message": "", "amount": "", "maxBatch": 10 })
    const [stopTrx, setStopTrx] = useState(false);
    const [counter,setCounter] = useState(0);
    const [submitting, setSubmitting] = useState(false);
    const breakLoop =useRef(false);
    const handleFormData = (event) => {
        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        })
        )
    };
    useEffect(() => {
        if (stopTrx) {
            setSubmitting(false);
            breakLoop.current = true;
        }
    }, [stopTrx])

    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitting(true);
        trxHandler();
    }

    const trxHandler = async () => {
        const amount_main = (Math.round(parseFloat(formData.amount)) + 1000)
        
        while (maxAllowedSend>amount_main && !breakLoop.current) {
            const batchSize =  parseInt(formData.maxBatch)
                console.log(stopTrx)
                const transactions = Array.from({ length: batchSize }, () => HandleTransaction());
                await Promise.all(transactions).then(() => {
                    setCounter(counter => counter+batchSize)
                })
                console.log(transactions)
                maxAllowedSend = maxAllowedSend - amount_main * batchSize           
        }
        setSubmitting(false);
    }
    const HandleTransaction = async () => {
        try {
           
                const params = await algodClient.getTransactionParams().do();
                const txn = {
                    from: pub_key,
                    to: formData.recPub,
                    fee: params.fee,
                    amount: Math.round(parseFloat(formData.amount)),
                    firstRound: params.firstRound,
                    lastRound: params.lastRound,
                    genesisID: params.genesisID,
                    genesisHash: params.genesisHash,
                    note: algosdk.encodeObj(formData.message + Math.round((Math.random()*10000)).toString()),
                };
                const signedTxn = HandleTrxSign(txn);
                algodClient.sendRawTransaction(signedTxn.blob).do();
                return true

           
        } catch (err) {
            return false

        }

    }

    return (
        <>
            {
                pub_key && (
                    <>
                        {submitting && (
                            <div className="alert alert-success text-center" role="alert">
                                {counter} transactions sent successfully
                            </div>
                        )}
                        <form onSubmit={handleSubmit} className="form p-3">
                            <div className="mb-3">
                                <label htmlFor="recPub" className="form-label">Receiver Address</label>
                                <input type="text" name="recPub" className="form-control" id="recPub" value={formData.recPub} onChange={handleFormData} required />
                            </div>
                            <div className="mb-3 ">
                                <label htmlFor="amount" className="form-label">Amount (in micro algo)</label>
                                <input type="number" className="form-control" name="amount" id="amount" min={2} value={formData.amount} onChange={handleFormData} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="messageInput" className="form-label">Optional Note</label>
                                <textarea className="form-control" name="message" id="messageInput" rows="3" value={formData.message} onChange={handleFormData}></textarea>
                            </div>
                            <div className="mb-3">
                                <label htmlFor="maxAllowedSend" className="form-label">Max Batch</label>
                                <input type="number" className="form-control" name="maxAllowedSend" min={1} id="maxAllowedSend" onChange={handleFormData} value={formData.maxBatch}  />
                            </div>
                            <div className="mb-3 row justify-content-center">
                                <button type="submit" className={`btn ${submitting ? 'btn-secondary' : 'btn-primary'} col-4 mx-2`} disabled={submitting}>{submitting ? "Please Wait..." : "Submit"}</button>
                                <button type="button" onClick={() => {setStopTrx(true)}} className="btn btn-warning col-4 mx-2" disabled={!submitting}>Stop</button>
                            </div>
                        </form>
                    </>
                )
            }
        </>
    )
}

export default SendAlgo;