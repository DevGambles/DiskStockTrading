import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import { toast } from 'react-toastify';
// Import the FontAwesomeIcon component
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import the icons you need
import {
  faExchange
} from "@fortawesome/free-solid-svg-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import { handleError } from "@/utils";
import useFileUpload from "@/utils/useFileUpload";

const Home = () => {
  const [holdingData, setHoldingData] = useState(Array<any>);
  const fileInput = useRef<HTMLInputElement>(null);
  const [needReconsile, setNeedReconsile] = useState(false);

  const onSuccess = async (response: any) => {
    if (response.data.length > 0) {
      setHoldingData(response.data);
    }
  };

  const onError = async () => {

  };

  const {handleFileUpload, uploadStatus, uploadedFileName } = useFileUpload("/api/holding/verify", onSuccess, onError);


  // handle click upload button
  const handleClick = useCallback(() => {
    fileInput.current?.click();
  }, []);

  // reconsile holding data by symbol
  const reconsileHoldingDataBySymbol = async (holding: any) => {
    let bodyData = {
      holdings: [holding],
    };
    const res = await fetch("/api/holding/reconsile", {
      method: "POST",
      body: JSON.stringify(bodyData),
    });
    const response = await res.json();
    if (response.error) {
      handleError(response.error);
    }
    else if (response.status == "ok") {
      let data = holdingData.filter((value: any, index: any) => true);
      let index = data.indexOf(holding);
      data[index].DiskQuantity = holding.QuantityAvailable;
      setHoldingData(data);
    }
  }

  // reconsile holding data
  const reconsileHoldingData = async () => {
    let bodyData = {
      'holdings': holdingData
    };
    const res = await fetch("/api/holding/reconsile", {
      method: "POST",
      body: JSON.stringify(bodyData),
    });
    const response = await res.json();
    if (response.error) {
      handleError(response.error);
    }
    else if (response.status == "ok") {
      setHoldingData(holdingData.map((holding: any, index: any) => {
        holding.DiskQuantity = holding.QuantityAvailable;
        return holding;
      }));
    }
  }

  // handle click Reconsile Holding button
  const reconsileHolding = async () => {
    confirmAlert({
      title: "Reconsile Holding",
      message: `Are you sure to reconsile the the differences?`,
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            //reconsile the holding
            reconsileHoldingData();
          }
        },
        {
          label: 'No',
          onClick: () => {
          }
        }
      ]
    });  
  }

  useEffect(() => {
    setNeedReconsile(false);
    holdingData.forEach((holding: any, index: any) => {
      if (holding['QuantityAvailable'] != holding['DiskQuantity']) {
        setNeedReconsile(true);
      }
    })
  }, [holdingData])

  return (
    <div className="home min-h-screen text-black flex items-center flex-col">
      <section className="w-full">
        <div className="flex flex-wrap items-center bg-white py-3 px-8 shadow-sm">
          <div className="flex-1">
            <input
              type="file"
              ref={fileInput}
              hidden
              accept=".csv,.xlsx"
              onChange={handleFileUpload}
            />
            <button
              className="btn btn-primary"
              onClick={handleClick}
            >
              {uploadStatus ? "Uploading..." : "Verify Holding"}
            </button>
            <button
              hidden={!needReconsile}
              className="ml-4 btn btn-warning"
              onClick={reconsileHolding}
            >
              Reconsile Holding
            </button>
            <span className="text-md font-bold">&nbsp;{uploadedFileName}</span>
          </div>
        </div>
        <div className="w-full rounded-lg shadow-lg p-4 mb-16 overflow-x-auto">
          <table className="w-full border border-grey">
            <thead>
              <tr className="text-md tracking-wide text-left text-gray-900 bg-gray-100 border-b border-gray-600">
                <th className="px-2 py-2 text-center">Symbol</th>
                <th className="px-2 py-2 text-center">Zeroodha Quantity</th>
                <th className="px-2 py-2 text-center">Average Price</th>
                <th className="px-2 py-2 text-center">DISK quantity</th>
                <th className="px-2 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white">
              {holdingData.map((row, index) => {
                return (<tr className="text-gray-700" key={index}>
                    <td className="text-center px-4 py-3 text-ms font-bold border">
                      {row['Symbol']}
                    </td>
                    <td className="text-center px-4 py-3 text-ms font-bold border">
                      {row['QuantityAvailable']}
                    </td>
                    <td className="text-center px-4 py-3 text-ms font-bold border">
                      {row['AveragePrice']}
                    </td>
                    <td className={`text-center px-4 py-3 text-ms font-bold border ${(row['DiskQuantity'] != undefined)? (row['QuantityAvailable'] != row['DiskQuantity'] ? "bg-yellow-400" : "bg-green-400") : "bg-red-400"}`}>
                      {(row['DiskQuantity'] != undefined) ? (row['QuantityAvailable'] != row['DiskQuantity'] ? row['DiskQuantity'] : "MATCH") : "Not Found in DISK"}
                    </td>
                    <td className="text-center px-4 py-3 text-ms font-bold border">
                      {(row['QuantityAvailable'] != row['DiskQuantity']) &&
                        <button
                          className="btn btn-white border border-black"
                          onClick={reconsileHoldingDataBySymbol.bind(this, row)}>
                          <FontAwesomeIcon
                            className="edit"
                            key={row['Symbol']}
                            title="Update"
                            icon={faExchange}
                          ></FontAwesomeIcon>
                          &nbsp;Update
                        </button>
                      }
                    </td>
                  </tr>);
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default React.memo(Home)

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
}
