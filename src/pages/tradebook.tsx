import * as R from "ramda";
import { NextPageContext } from "next";
import { useSession, getSession } from "next-auth/react";
import { ToastContainer, toast } from 'react-toastify';
import React, { useCallback, useEffect, useRef, useState, useMemo } from "react";
import Select from "react-select";
import DataTable from "react-data-table-component";
import { arrangeStocks } from "@/utils";

const TradeBook = () => {

  const [initHoldingData, setInitHoldingData] = useState([]);
  const [orderData, setOrderData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [filterStock, setFilterStock] = useState({
    label: '',
    value: ''
  });
  
  const [currentHoling, setCurrentHolding] = useState({
    CurrentInvestment: 0,
    AveragePrice: 0,
    QuantityAvailable: 0
  }); 

  const conditionalRowStyles = [
    // {
    //   when: (row: any) => row.calories < 300,
    //   style: {
    //     backgroundColor: 'green',
    //     color: 'white',
    //     '&:hover': {
    //       cursor: 'pointer',
    //     },
    //   },
    // },
    // You can also pass a callback to style for additional customization
    {
      when: (row: any) => row.Status == "COMPLETE",
      style: (row: any) => ({ 
        backgroundColor: row.Type == "BUY" ? 'darkgreen' : 'darkred',
        color: 'white',
      }),
    },
  ];

  const customStyles = {
    rows: {
      style: {
      },
    },
    headCells: {
      style: {
        fontWeight: 'bold',
        fontSize: 'medium',
        background: 'rgb(243 244 246 / var(--tw-bg-opacity))'
      },
    },
    cells: {
      style: {
        fontSize: 'medium'
      },
    },
  };

  // datatable columns
  const columns: any = [
    {
      name: "Date",
      selector: (d: any) => d.Time,
      sortable: true
    },
    {
      name: "Stock",
      selector: (d: any) => d.Instrument,
      sortable: true
    },
    {
      name: "Price",
      selector: (d: any) => d.AvgPrice,
      sortable: true
    },
    {
      name: "Type",
      selector: (d: any) => d.Type,
      sortable: true
    },
    {
      name: "Quantity Bought",
      selector: (d: any) => d.BoughtQuantity,
      sortable: true,
      cell: (row:any) => <div className="data-text-center">{row.BoughtQuantity}</div>
    },
    {
      name: "Quantity Sold",
      selector: (d: any) => d.SoldQuantity,
      sortable: true,
      cell: (row:any) => <div className="data-text-center">{row.SoldQuantity}</div>
    },
    {
      name: "Amount",
      selector: (d: any) => d.Amount,
      sortable: true,
      cell: (row:any) => <div className="data-text-center">{row.Amount.toFixed(2)}</div>
    },
    {
      name: "Cumulative Qty",
      selector: (d: any) => d.CumulativeQty,
      sortable: true,
      cell: (row:any) => <div className="data-text-center">{row.CumulativeQty}</div>
    },
    {
      name: "Cumulative Investment",
      selector: (d: any) => d.CumulativeInvestment,
      sortable: true,
      cell: (row:any) => <div className="data-text-center">{row.CumulativeInvestment.toFixed(2)}</div>
    },
    // {
    //   name: "Investment",
    //   selector: (d: any) => d.Investment,
    //   sortable: true,
    //   cell: (row:any) => <div className="data-text-center">{row.Investment}</div>
    // },
    {
      name: "Average Cost",
      selector: (d: any) => d.AvgCost,
      sortable: true,
      cell: (row:any) => <div className="data-text-center">{row.AvgCost.toFixed(2)}</div>
    },
    {
      name: "Profit on Sale",
      selector: (d: any) => d.Profit,
      sortable: true,
      cell: (row:any) => <div className="data-text-center">{row.Profit.toFixed(2)}</div>
    },
  ];

  // get stocks data from orderData using unique into object of label and value
  const stocks: any[] = useMemo(() => {
    return arrangeStocks(orderData);
  }, [orderData]);

  // get holding data
  const getInitHoldingData = async () => {
    if (initHoldingData?.length == 0) {
      console.log("GetHolding" + initHoldingData.length);
      const res = await fetch("/api/holding/init", {
        method: "GET",
      });

      const response = await res.json();
      if (response.data.length> 0)
        setInitHoldingData(response.data);
      getOrderData(response.data);
    }
  };

  // get order data
  const getOrderData = async (holdings: any) => {
    if (orderData?.length == 0) {
      console.log("GetOrder");
      const res = await fetch("/api/logbook/getLogBook", {
        method: "GET",
      });

      const response = await res.json();
      if (response.data.length > 0) {
        setOrderData(response.data);
        setFilterStock({
          label: response.data[0].Instrument,
          value: response.data[0].Instrument
        });
        if (holdings.length) {
          const holding = holdings.find((item: any) => item.Symbol === response.data[0].Instrument);
          if (holding) {
            setCurrentHolding(holding);
          }
        }
      }
    }
  };

  // filter available rows
  const resetTableData = () => {
    const filteredItems = orderData.filter(
      (item: any) => {
        if (filterStock.value && filterStock.value != item.Instrument) {
          return false;
        }
        return true;
      }
    );

    setTableData([]);

    const holding: any = initHoldingData.find((item: any) => item.Symbol === filterStock.value);
    if (holding) {
      setCurrentHolding(holding);
      if (filteredItems.length) {
        const data:any = filteredItems.map((item: any, index: any) => {
          return {
            ...item,
          }
        })
        setTableData(data);
      }
    }
  }

  // initialize
  useEffect(() => {
    getInitHoldingData();
  }, []);

  useEffect(() => {
    if (initHoldingData.length && orderData.length && filterStock.value) {
      resetTableData()
    }
  }, [initHoldingData, orderData, filterStock])

  return (
    <div className="home min-h-screen text-black flex items-center flex-col">
      <section className="w-full">
        <div className="w-full">
          <table className="table">
            <thead className="trade-opening">
              <tr>
                <th rowSpan={2} className="text-center">
                  Stock
                </th>
                <th colSpan={3} className="text-center">Opening Balance</th>
              </tr>
              <tr>
                <th className="text-center">Cumulative Qty</th>
                <th className="text-center">Cumulative Investment</th>
                <th className="text-center">Average Cost</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="text-center">
                  <Select
                    id="stock"
                    placeholder="Filter by Stock"
                    options={stocks}
                    value={filterStock}
                    onChange={(value: any) => {
                      setFilterStock(value);
                    }}
                  ></Select>
                </td>
                <td className="text-center pt-3">{currentHoling.QuantityAvailable}</td>
                <td className="text-center pt-3">{(currentHoling.CurrentInvestment * 100000).toFixed(2)}</td>
                <td className="text-center pt-3">{currentHoling.AveragePrice}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="w-full mb-8 rounded-lg shadow-lg p-4">
          <DataTable
            key="logbook"
            columns={columns}
            data={tableData}
            expandableRows={false}
            pagination
            customStyles={customStyles} 
            conditionalRowStyles={conditionalRowStyles}
          />
        </div>
      </section>
    </div>
  );
}

export default React.memo(TradeBook)

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
}
