import algosdk from "algosdk";
import { useEffect, useRef, useState } from "react";

const SendAlgo = ({ pub_key, HandleTrxSign, maxAllowedSend, algodClient }) => {
    const [formData, setFormData] = useState({ "recPub": "", "message": "", "amount": "0", "maxBatch": "10", "maxTrxn": "0" })
    const [counter, setCounter] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    const currTrxnNum = useRef(0);
    const breakLoop = useRef(false);
    const maxAllowedSendRef = useRef(maxAllowedSend);

    const handleFormData = (event) => {
        const { name, value } = event.target
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: value
        })
        )
    };

    useEffect(() => {
        maxAllowedSendRef.current = maxAllowedSend;
    }, [maxAllowedSend])




    const handleSubmit = (event) => {
        event.preventDefault();
        setSubmitting(true);
        setCounter(0);
        currTrxnNum.current = 0;
        breakLoop.current = false;

        if (!algosdk.isValidAddress(formData.recPub)) {
            alert("Invalid Receiver Address")
        }

        formData.maxBatch = parseInt(formData.maxBatch)
        formData.maxTrxn = parseInt(formData.maxTrxn)
        formData.amount = parseInt(formData.amount)

        if (formData.maxTrxn !== 0 && (formData.maxTrxn <= formData.maxBatch)) {
            formData.maxBatch = formData.maxTrxn
            alert("Only " + formData.maxBatch + " transactions will be sent")
            setSubmitting(false);

        } else if (maxAllowedSendRef.current < formData.amount + 1000) {
            alert("There isn't enough balance to send the transactions.")
            setSubmitting(false);
        } else {
            trxBatchHandler().then(() => {
                setSubmitting(false);
            })
        }


    }

    const trxBatchHandler = async () => {

        const amount_main = formData.amount + 1000
        const batchSize = formData.maxBatch

        while (maxAllowedSendRef.current > amount_main && !breakLoop.current && (formData.maxTrxn === 0 || ((currTrxnNum.current + batchSize) <= formData.maxTrxn))) {
            const params = await algodClient.getTransactionParams().do();
            const transactions = Array.from({ length: batchSize }, () => trxHandler(params));
            await Promise.all(transactions).then(() => {
                currTrxnNum.current = currTrxnNum.current + batchSize
                setCounter(currTrxnNum.current)
            })
            console.log(transactions)
            maxAllowedSendRef.current = maxAllowedSendRef.current - amount_main * batchSize
        }
    }
    const trxHandler = async (params) => {
        try {
            const txn = {
                from: pub_key,
                to: formData.recPub,
                fee: params.fee,
                amount: formData.amount,
                firstRound: params.firstRound,
                lastRound: params.lastRound,
                genesisID: params.genesisID,
                genesisHash: params.genesisHash,
                note: algosdk.encodeObj(formData.message + " Rand Num for Entropy: " + Math.round((Math.random() * 1000000 * (currTrxnNum.current + 3.142857))).toString()),
            };
            const signedTxn = HandleTrxSign(txn);
            algodClient.sendRawTransaction(signedTxn.blob).do();
            
        } catch (err) {
            console.log(err);
        }

    }

    return (
        <>
            {
                pub_key && (
                    <>
                        {counter ? (
                            <div className="alert alert-success text-center" role="alert">
                                {counter} transactions sent successfully!!!
                            </div>
                        ) : ("")}
                        <form onSubmit={handleSubmit} className="form p-3">
                            <div className="mb-3">
                                <label htmlFor="recPub" className="form-label">Receiver Address</label>
                                <input type="text" name="recPub" className="form-control" id="recPub" value={formData.recPub} onChange={handleFormData} required />
                            </div>
                            <div className="mb-3 ">
                                <label htmlFor="amount" className="form-label">Amount (in micro algo)</label>
                                <input type="number" className="form-control" name="amount" id="amount" min={0} value={formData.amount} onChange={handleFormData} />
                            </div>

                            <div className="mb-3">
                                <label htmlFor="maxBatch" className="form-label">Max Batch</label>
                                <input type="number" className="form-control" name="maxBatch" min={1} id="maxBatch" onChange={handleFormData} value={formData.maxBatch} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="maxTrxn" className="form-label">Max Transactions <small>(0 means till the balance is Rip-ed)</small></label>
                                <input type="number" className="form-control" name="maxTrxn" min={0} id="maxTrxn" onChange={handleFormData} value={formData.maxTrxn} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="messageInput" className="form-label">Optional Note</label>
                                <textarea className="form-control" name="message" id="messageInput" rows="3" value={formData.message} onChange={handleFormData}></textarea>
                            </div>
                            <div className="mb-3 row justify-content-center">
                                <button type="submit" className={`btn ${submitting ? 'btn-secondary' : 'btn-primary'} col-4 mx-2`} disabled={submitting}>{submitting ? "Please Wait..." : "Attack"}</button>
                                <button type="button" onClick={() => { breakLoop.current = true; }} className={`btn ${submitting ? 'btn-danger' : 'btn-secondary'} col-4 mx-2`} disabled={!submitting}>Stop</button>
                            </div>
                        </form>
                    </>
                )
            }
        </>
    )
}

export default SendAlgo;