import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { AiFillCaretRight } from "react-icons/ai";

import nft from "../abi/abi.json";
import ERC20 from "../abi/ERC20.json";
import fromExponential from "from-exponential";

function Main({ acc, web3main, prov }) {
  const location = useLocation();
  const { id } = useParams();
  const [next, setnext] = useState(0);
  const [done, setdone] = useState(false);
  const [csvFile, setCsvFile] = useState();
  const [tokval, settokval] = useState();
  const [tokname, settokname] = useState();
  const [chainid, setchainid] = useState();
  const [show, setShow] = useState(false);
  const [fdata, setfdata] = useState();
  const handleClose = () => setShow(false);
  const [text, settext] = useState();
  const [all, setall] = useState();
  const [adlist, setadlist] = useState([]);
  const [vallist, setvallist] = useState();
  const [tok, settok] = useState();
  const [total, settotal] = useState();
  const [balance, setbalance] = useState();
  const [mirror, setmirror] = useState();
  const [err, seterr] = useState([]);
  const [errlist, seterrlist] = useState([]);
  const [lineerr, setlineerr] = useState([]);
  const [est, setest] = useState();
  const [maintoken, setmaintoken] = useState();
  const [add, setadd] = useState();
  const [tname, settname] = useState("");
  const [link, setlink] = useState("");

  const breakd = (e) => {
    setfdata(e);
    seterrlist([""]);
    const sptdata = e?.split("\n");
    const ma = sptdata?.map((v) => {
      return v?.split(",");
    });
    const filma = ma?.filter(function (el) {
      return el?.length === 2;
    });
    settext(filma);
    const addlist = ma?.map((v) => {
      return v[0] === "" || v[0] === undefined || v[0] === "\r" || v[0] === "\t"
        ? null
        : v[0];
    });
    const filadd = addlist?.filter(function (el) {
      return el != null;
    });
    const vallist = ma?.map((v) => {
      return v[1] === "" || v[1] === undefined || v[0] === "\r" || v[0] === "\t"
        ? null
        : v[1];
    });
    const filval = vallist?.filter(function (el) {
      return el != null;
    });
    if (web3main && acc) {
      const errlistv = filma?.map((v, i) => {
        if (v[0] === "" || v[0] === undefined || v[0] === "\r" ? null : v[0]) {
          return [web3main.utils.isAddress(v[0]), i + 1];
        }
      });
      const errlistM = errlistv?.filter(function (el) {
        return el ? el[0] : null != null;
      });
      seterrlist(errlistv);
    }

    setadlist(filadd);
    setvallist(filval);
  };

  useEffect(async () => {
    if (web3main && acc && prov) {
      const chainId = await prov.request({ method: "eth_chainId" });

      setchainid(chainId);

      if (chainId == 0x38) {
        setadd("0xDb103fd28Ca4B18115F5Ce908baaeed7E0f1f101");
        settname("BNB");
        setlink("https://bscscan.com/tx/");
      } else if (chainId == 0x61) {
        setadd("0x2095D88e6E3aac59afd8aC33e919E0D47E7158D6");
        settname("BNB");
        setlink("https://testnet.bscscan.com/search?f=0&q=");
      } else if (chainId == 0x89) {
        setadd("0xE77DCC952bF415057FB3Dca18c75Fe1F5cbF96Cc");
        settname("MATIC");
        setlink("https://polygonscan.com/tx/");
      } else if (chainId == 0x13881) {
        setadd("0x3666759E577b3C05A4DeEB2dF62879c36567Ee01");
        settname("MATIC");
        setlink("https://mumbai.polygonscan.com/tx/");
      } else if (chainId == 0xa86a) {
        setadd("0x0327b2E62eD0a117f99D32b57ba69E8dd7dD6072");
        settname("AVAX");
        setlink("https://snowtrace.io/tx/");
      } else if (chainId == 0xa869) {
        setadd("0x3666759E577b3C05A4DeEB2dF62879c36567Ee01");
        settname("AVAX");
        setlink("https://testnet.snowtrace.io/tx/");
      } else {
        return false;
      }
    }
  }, [web3main, acc, prov]);

  const breakdnew = async (e) => {
    seterr([""]);
    if (tok === "BNB" || tok === "MATIC" || tok === "FTM" || tok?.length > 20) {
      if (adlist?.length === vallist?.length) {
        const fildata = errlist?.filter((p) => p[0] === false);
        if (fildata?.length === 0) {
          setnext(next + 1);
          if (tok === "BNB" || tok === "MATIC" || tok === "FTM") {
            balancebnb();
            setnext(next + 1);
          } else {
            balancetok();
            balancebnb();
            setnext(next + 1);
          }
        } else {
          setlineerr(fildata);
        }
      } else {
        seterr([...err, "Please select right the format "]);
      }
    } else {
      seterr([...err, "Please select a token address or select BNB"]);
    }
  };

  const totalamt = vallist?.reduce(
    (curr, prev) => Number(curr) + Number(prev),
    0
  );

  const approve = async () => {
    try {
      if (add) {
        if (web3main && acc) {
          const accounts = await web3main.eth.getAccounts();
          let userwalletaddresss = accounts[0];

          const ercContract = await new web3main.eth.Contract(ERC20, tok);

          const tokenDecimal = await ercContract.methods.decimals().call();

          let amountADesired = web3main.utils.toBN(
            fromExponential(
              parseInt(parseFloat(totalamt) * Math.pow(10, tokenDecimal))
            )
          );

          const allowanceAmnt = await ercContract.methods
            .allowance(userwalletaddresss, add)
            .call();

          const gasPrice = await web3main.eth.getGasPrice();
          const EIP1559_OPTIONS =
            tname === "MATIC"
              ? {
                  gasLimit: web3main.utils.toHex(500000),
                  gasPrice: gasPrice,
                }
              : {};

          if (
            allowanceAmnt >=
            parseInt(parseFloat(totalamt) * Math.pow(10, tokenDecimal))
          ) {
            // no need to approve again...
          } else {
            await ercContract.methods.approve(add, amountADesired).send({
              from: userwalletaddresss,
              EIP1559_OPTIONS,
            });
          }

          const list = vallist?.map((v) =>
            web3main.utils.toBN(
              fromExponential(Number(v) * Math.pow(10, tokenDecimal))
            )
          );

          let token = new web3main.eth.Contract(nft, add);
          let platformFee = await token.methods.getTotalFees().call();
          let amountIn = web3main.utils.toBN(fromExponential(platformFee));
          let amounttot = web3main.utils.toBN(
            fromExponential(totalamt * Math.pow(10, tokenDecimal))
          );
          token.methods
            .batchTokenTransfer(
              userwalletaddresss,
              adlist,
              list,
              tok,
              amounttot,
              true
            )
            .estimateGas({ from: userwalletaddresss, value: amountIn })
            .then((fees) => {
              setest(fees);
            })
            .catch();
          token.methods
            .batchTokenTransfer(
              userwalletaddresss,
              adlist,
              list,
              tok,
              amounttot,
              true
            )
            .send({
              from: userwalletaddresss,
              value: amountIn,
              EIP1559_OPTIONS,
            })
            .then((fees) => {
              setnext(next + 1);
              settotal(fees?.transactionHash);
            })
            .catch();
        }
      } else {
        console.log("chain not supported!!");
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const balancebnb = async () => {
    if (web3main && acc) {
      const accounts = await web3main.eth.getAccounts();
      let userwalletaddresss = accounts[0];
      const accountbal = await web3main.eth.getBalance(userwalletaddresss);
      setbalance(accountbal / 1000000000000000000);
    }
  };

  const balancetok = async () => {
    if (web3main && acc) {
      const accounts = await web3main.eth.getAccounts();
      let userwalletaddresss = accounts[0];
      let token = new web3main.eth.Contract(ERC20, tok);
      const tokenDecimal = await token.methods.decimals().call();

      token.methods
        .balanceOf(userwalletaddresss)
        .call({ from: userwalletaddresss })
        .then((result) => {
          settokval(parseInt(Number(result) / Math.pow(10, tokenDecimal)));
          token.methods
            .symbol()
            .call({ from: userwalletaddresss })
            .then((result) => {
              settokname(result);
            })
            .catch();
        })
        .catch();
    }
  };

  const buybnb = async () => {
    try {
      if (web3main && acc) {
        const accounts = await web3main.eth.getAccounts();
        let userwalletaddresss = accounts[0];

        const list = vallist?.map((v) =>
          web3main.utils.toBN(
            fromExponential(parseInt(Number(v) * Math.pow(10, 18)))
          )
        );
        if (chainid == 0x61) {
          setmaintoken("0xb2c3C9523E9b8FC44F677e47Aa034fC66974DA1E");
          let token = new web3main.eth.Contract(
            nft,
            "0xb2c3C9523E9b8FC44F677e47Aa034fC66974DA1E"
          );
          let amountIn = web3main.utils.toBN(
            fromExponential(parseInt((totalamt + 0.00001) * Math.pow(10, 18)))
          );
          token.methods
            .batchTokenTransfer(
              userwalletaddresss,
              adlist,
              list,
              "0x0000000000000000000000000000000000000000",
              amountIn,
              false
            )
            .send({ from: userwalletaddresss, value: amountIn })
            .then((fees) => {
              setnext(next + 1);
              settotal(fees?.transactionHash);
            })
            .catch();
        }
        if (chainid == 0x13881) {
          setmaintoken("0x5a2bcecA1B040dad76Bc107EE627b7187bbAe91C");
          let token = new web3main.eth.Contract(
            nft,
            "0x8fb1036C3Ba7CD7861FAc2f68d77a5836cE5191F"
          );
          let amountIn = web3main.utils.toBN(
            fromExponential(parseInt((totalamt + 0.00001) * Math.pow(10, 18)))
          );
          token.methods
            .batchTokenTransfer(
              userwalletaddresss,
              adlist,
              list,
              "0x0000000000000000000000000000000000000000",
              amountIn,
              false
            )
            .send({ from: userwalletaddresss, value: amountIn })
            .then((fees) => {
              setnext(next + 1);
              settotal(fees?.transactionHash);
            })
            .catch();
        }
        if (chainid == 0xfa2) {
          setmaintoken("0x15C0311cD2e0e89c390B43B4e280B8f853C69bD4");
          let token = new web3main.eth.Contract(
            nft,
            "0xb5f05Cc05E3069ff4b092AF7F904FD624Ef8f561"
          );
          let amountIn = web3main.utils.toBN(
            fromExponential(parseInt((totalamt + 0.00001) * Math.pow(10, 18)))
          );
          token.methods
            .batchTokenTransfer(
              userwalletaddresss,
              adlist,
              list,
              "0x0000000000000000000000000000000000000000",
              amountIn,
              false
            )
            .send({ from: userwalletaddresss, value: amountIn })
            .then((fees) => {
              setnext(next + 1);
              settotal(fees?.transactionHash);
            })
            .catch();
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const buybnbest = async () => {
    try {
      if (web3main && acc) {
        const accounts = await web3main.eth.getAccounts();
        let userwalletaddresss = accounts[0];
        if (tok === "BNB") {
          const list = vallist?.map((v) =>
            web3main.utils.toBN(
              fromExponential(parseInt(Number(v) * Math.pow(10, 18)))
            )
          );
          let token = new web3main.eth.Contract(
            nft,
            "0xb2c3C9523E9b8FC44F677e47Aa034fC66974DA1E"
          );
          let amountIn = web3main.utils.toBN(
            fromExponential(parseInt((totalamt + 0.00001) * Math.pow(10, 18)))
          );
          token.methods
            .batchTokenTransfer(
              userwalletaddresss,
              adlist,
              list,
              "0x0000000000000000000000000000000000000000",
              amountIn,
              false
            )
            .estimateGas({ from: userwalletaddresss, value: amountIn })
            .then((fees) => {
              setest(fees);
            })
            .catch();
        }
        if (tok === "MATIC") {
          const list = vallist?.map((v) =>
            web3main.utils.toBN(
              fromExponential(parseInt(Number(v) * Math.pow(10, 18)))
            )
          );
          let token = new web3main.eth.Contract(
            nft,
            "0x8fb1036C3Ba7CD7861FAc2f68d77a5836cE5191F"
          );
          let amountIn = web3main.utils.toBN(
            fromExponential(parseInt((totalamt + 0.00001) * Math.pow(10, 18)))
          );
          token.methods
            .batchTokenTransfer(
              userwalletaddresss,
              adlist,
              list,
              "0x0000000000000000000000000000000000000000",
              amountIn,
              false
            )
            .estimateGas({ from: userwalletaddresss, value: amountIn })
            .then((fees) => {
              setest(fees);
            })
            .catch();
        }
        if (tok === "FTM") {
          const list = vallist?.map((v) =>
            web3main.utils.toBN(
              fromExponential(parseInt(Number(v) * Math.pow(10, 18)))
            )
          );
          let token = new web3main.eth.Contract(
            nft,
            "0xb5f05Cc05E3069ff4b092AF7F904FD624Ef8f561"
          );
          let amountIn = web3main.utils.toBN(
            fromExponential(parseInt((totalamt + 0.00001) * Math.pow(10, 18)))
          );
          token.methods
            .batchTokenTransfer(
              userwalletaddresss,
              adlist,
              list,
              "0x0000000000000000000000000000000000000000",
              amountIn,
              false
            )
            .estimateGas({ from: userwalletaddresss, value: amountIn })
            .then((fees) => {
              setest(fees);
            })
            .catch();
        } else {
          const ercContract = await new web3main.eth.Contract(ERC20, tok);

          const tokenDecimal = await ercContract.methods.decimals().call();

          let amountADesired = web3main.utils.toBN(
            fromExponential(
              parseInt(
                parseInt(parseFloat(totalamt) * Math.pow(10, tokenDecimal))
              )
            )
          );
          ercContract.methods
            .approve(add, amountADesired)
            .estimateGas({ from: userwalletaddresss })
            .then((result) => {
              setest(result);
            })
            .catch();
        }
      }
    } catch (err) {
      console.log(err.message);
    }
  };

  const finalbuy = () => {
    if (tok === "BNB" || tok === "MATIC" || tok === "FTM") {
      buybnb();
    } else {
      approve();
    }
  };

  const submit = (data) => {
    const file = data;
    const reader = new FileReader();

    reader.onload = function (e) {
      const text = e.target.result;
      breakd(text);
    };

    reader.readAsText(file);
  };

  return (
    <div className="main">
      <div className="main-content">
        {/* Logo and Headline */}
        <div className="app-header">
          <img src={process.env.PUBLIC_URL + '/logo.png'} alt="Mentonex" className="app-logo" />
          <h1 className="app-headline">Mentonex Multisender</h1>
          <p className="app-subtitle">Send tokens to multiple recipients in one transaction</p>
        </div>

        <div className="b-steps">
          <div className="steps">
            <ul className="step-items" data-progress={next}>
              <li className={next >= 1 ? "step-item is-previous" : next === 0 ? "step-item is-active" : "step-item"}>
                <div className="step-marker">1</div>
                <div className="step-title">Prepare</div>
              </li>
              <li className={next >= 2 ? "step-item is-previous" : next === 1 ? "step-item is-active" : "step-item"}>
                <div className="step-marker">2</div>
                <div className="step-title">Approve</div>
              </li>
              <li className={next === 2 ? "step-item is-active" : next >= 3 ? "step-item is-previous" : "step-item"}>
                <div className="step-marker">3</div>
                <div className="step-title">Multisend</div>
              </li>
            </ul>
          </div>
        </div>

        {!done && next === 0 && (
          <div className="form-section">
            <label className="form-label">Token</label>
            <input
              type="text"
              placeholder="Token Address or select native currency"
              className="inp"
              value={tok}
              list="tok"
              onChange={(e) => settok(e.target.value)}
            />
            <datalist id="tok">
              {chainid == 0x61 && <option value="BNB">BNB Smart Chain Native Currency</option>}
              {chainid == 0x13881 && <option value="MATIC">POLYGON</option>}
              {chainid == 0xfa2 && <option value="FTM">FANTOM</option>}
            </datalist>

            <label className="form-label" style={{marginTop: '24px'}}>Recipients & Amounts</label>
            <div style={{position: 'relative', display: 'flex'}}>
              <div className="line-numbers">
                {(fdata || '').split('\n').map((_, i) => (
                  <div key={i} className="line-number">{i + 1}</div>
                ))}
              </div>
              <textarea
                value={fdata || ''}
                placeholder="Enter addresses and amounts (format: address,amount)&#10;Example:&#10;0x1234567890123456789012345678901234567890,100&#10;0x0987654321098765432109876543210987654321,50"
                className="inp textarea-with-lines"
                onChange={(e) => breakd(e.target.value)}
              />
            </div>
            
            <div className="file-upload-area">
              <input
                type="file"
                accept=".csv"
                onChange={(e) => submit(e.target.files[0])}
                id="inputGroupFile01"
                style={{display: 'none'}}
              />
              <label className="custom-file-label" htmlFor="inputGroupFile01">
                📁 Choose CSV File
              </label>
              <p style={{margin: '8px 0 0 0', fontSize: '14px', color: '#6b7280'}}>
                Or upload a CSV file with addresses and amounts
              </p>
            </div>

            <div style={{marginTop: '32px', textAlign: 'center'}}>
              <button onClick={() => breakdnew()}>
                Next Step →
              </button>
            </div>

            <div style={{marginTop: '24px'}}>
              <div className="instruction">
                <p><strong>Instructions:</strong></p>
                <p>1. Token address should be 0x...</p>
                <p>2. Upload CSV file or enter addresses manually in format: address,amount</p>
                <p>3. Click Next to continue</p>
              </div>
            </div>

            {err?.map((v, i) => (
              <div key={i} className="errs">{v}</div>
            ))}
            {lineerr?.map((v, i) => (
              <div key={i} className="errs">Line {v[1]}: Not a valid address</div>
            ))}
          </div>
        )}

        {!done && next === 1 && (
          <div className="form-section">
            <h3 style={{marginBottom: '24px', color: '#374151'}}>Review Transaction</h3>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '32px'}}>
              <div className="dtel">
                <h3>{totalamt?.toFixed(6)} {tok === "BNB" || tok === "MATIC" || tok === "FTM" ? tok : tokname}</h3>
                <p>Total tokens to send</p>
              </div>
              <div className="dtel">
                <h3>{tok === "BNB" || tok === "MATIC" || tok === "FTM" ? balance : tokval} {tok === "BNB" || tok === "MATIC" || tok === "FTM" ? tok : tokname}</h3>
                <p>Your token balance</p>
              </div>
              <div className="dtel">
                <h3>{Number(balance)?.toFixed(6)} {tname}</h3>
                <p>Your {tname} balance</p>
              </div>
            </div>

            <h4 style={{marginBottom: '16px', color: '#374151'}}>Recipients</h4>
            <div style={{maxHeight: '300px', overflowY: 'auto'}}>
              <table>
                <thead>
                  <tr>
                    <th>Address</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {text?.map((v, i) => (
                    <tr key={i}>
                      <td>{v[0]}</td>
                      <td>{v[1]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div style={{marginTop: '32px', textAlign: 'center'}}>
              <button onClick={() => { buybnbest(); setnext(next + 1); }}>
                Next Step →
              </button>
            </div>
          </div>
        )}

        {!done && next === 2 && (
          <div className="form-section">
            <h3 style={{marginBottom: '24px', color: '#374151'}}>Confirm Transaction</h3>
            
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '32px'}}>
              <div className="dtel">
                <h3>{vallist?.length}</h3>
                <p>Total addresses</p>
              </div>
              <div className="dtel">
                <h3>{totalamt} {tok === "BNB" || tok === "MATIC" || tok === "FTM" ? tok : tokname}</h3>
                <p>Total tokens</p>
              </div>
              <div className="dtel">
                <h3>{tokval ? tokval : balance} {tok === "BNB" || tok === "MATIC" || tok === "FTM" ? tok : tokname}</h3>
                <p>Your balance</p>
              </div>
              <div className="dtel">
                <h3>1</h3>
                <p>Transactions needed</p>
              </div>
              <div className="dtel">
                <h3>{balance} {tname}</h3>
                <p>Your {tname} balance</p>
              </div>
              <div className="dtel">
                <h3>{est / 100000000} {tname}</h3>
                <p>Transaction fees</p>
              </div>
            </div>

            <div style={{marginTop: '32px', textAlign: 'center'}}>
              <button onClick={finalbuy}>
                Send Tokens →
              </button>
            </div>
          </div>
        )}

        {!done && next === 3 && (
          <div className="suctran">
            <h4>🎉 Transaction Successful!</h4>
            <p style={{marginBottom: '24px', color: '#6b7280'}}>Your bulk transfer has been completed successfully.</p>
            <a href={`${link}${total}`} target="_blank" rel="noopener noreferrer">
              View Transaction Details
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;