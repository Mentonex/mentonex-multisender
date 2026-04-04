import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";
import Header from "./components/Header";
import Main from "./components/Main";

function App() {
  const [chainid, setchainid] = useState();
  const [acc, setacc] = useState(false);
  const [web3main, setweb3main] = useState();
  const [prov, setprov] = useState();
  const change = (v) => {
    setacc(v);
  };
  const provider1 = (v) => {
    setprov(v);
  };
  const web3m = (v) => {
    setweb3main(v);
  };
  // const onc = () => {
  //   settheme(!theme)
  // }
  // console.log('fffff', theme)

  // const history = useHistory()
  // useEffect(() => {
  //   const interval = setInterval(async () => {
  //     if (acc) {
  //       const accounts1 = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //       setaccountid(accounts1[0])
  //     }
  //     // console.log(accounts1)
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);
  // useEffect(async () => {
  //   if (acc) {

  //     const accounts1 = await window.ethereum.request({ method: 'eth_requestAccounts' });
  //     setaccountid1(accounts1[0])

  //   }

  // }, [acc]);
  useEffect(() => {
    const handleChainChange = async () => {
      if (acc && prov) {
        const chainId = await prov.request({ method: "eth_chainId" });
        setchainid(chainId);

        await prov.on("chainChanged", (chainId) => {
          window.location.reload();
        });
      }
    };
    handleChainChange();
  }, [acc, prov]);

  return (
    <div className="App" style={{
      backgroundImage: `url(${process.env.PUBLIC_URL + '/background.png'})`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundRepeat: 'no-repeat',
      backgroundAttachment: 'fixed'
    }}>
      <div className="right-panel">
        <Switch>
          <Route exact path="/">
            <Header change={change} web3m={web3m} provider1={provider1} />
            <Main acc={acc} web3main={web3main} prov={prov} />
          </Route>
        </Switch>
      </div>
    </div>
  );
}

export default App;
