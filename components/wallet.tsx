'use client';

const Wallet = () => {

    const connectWallet = async () => {
        // @ts-ignore
       const api = await window.cardano?.lace.enable();
       console.log(api);
    }

    return (
    <div>
        <h1>Wallet Component</h1>
        <button onClick={connectWallet}>Connect Wallet</button>
    </div>
    );
}

export default Wallet;