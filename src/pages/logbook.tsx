import * as R from "ramda";
import { NextPageContext } from "next";
import { getSession } from "next-auth/react";
import { useEffect, useRef, useState, useMemo } from "react";
import { toast } from 'react-toastify';
import DataTable from "react-data-table-component";
import Select from "react-select";
import { DateRangePicker } from 'rsuite';
import subDays from 'date-fns/subDays';
import startOfWeek from 'date-fns/startOfWeek';
import endOfWeek from 'date-fns/endOfWeek';
import addDays from 'date-fns/addDays';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import addMonths from 'date-fns/addMonths';
import moment from 'moment';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css
import 'rsuite/dist/rsuite.min.css';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ExcelJS from 'exceljs';
import { handleError, handleInfo, arrangeStocks, getCurrentDateStr } from "@/utils";
import Export from "@/components/forms/Export";

// date picker custom rages
const predefinedRanges: any = [
  {
    label: 'Today',
    value: [new Date(), new Date()],
    placement: 'left'
  },
  {
    label: 'Yesterday',
    value: [addDays(new Date(), -1), addDays(new Date(), -1)],
    placement: 'left'
  },
  {
    label: 'This week',
    value: [startOfWeek(new Date()), endOfWeek(new Date())],
    placement: 'left'
  },
  {
    label: 'Last 7 days',
    value: [subDays(new Date(), 6), new Date()],
    placement: 'left'
  },
  {
    label: 'Last 30 days',
    value: [subDays(new Date(), 29), new Date()],
    placement: 'left'
  },
  {
    label: 'This month',
    value: [startOfMonth(new Date()), new Date()],
    placement: 'left'
  },
  {
    label: 'Last month',
    value: [startOfMonth(addMonths(new Date(), -1)), endOfMonth(addMonths(new Date(), -1))],
    placement: 'left'
  },
  {
    label: 'This year',
    value: [new Date(new Date().getFullYear(), 0, 1), new Date()],
    placement: 'left'
  },
  {
    label: 'Last year',
    value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date(new Date().getFullYear(), 0, 0)],
    placement: 'left'
  },
  {
    label: 'All time',
    value: [new Date(new Date().getFullYear() - 1, 0, 1), new Date()],
    placement: 'left'
  },
  {
    label: 'Last week',
    closeOverlay: false,
    value: (value: any) => {
      const [start = new Date()] = value || [];
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), -7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), -7)
      ];
    },
    appearance: 'default'
  },
  {
    label: 'Next week',
    closeOverlay: false,
    value: (value: any) => {
      const [start = new Date()] = value || [];
      return [
        addDays(startOfWeek(start, { weekStartsOn: 0 }), 7),
        addDays(endOfWeek(start, { weekStartsOn: 0 }), 7)
      ];
    },
    appearance: 'default'
  }
];

export default function LogBook() {

  const [orderData, setOrderData] = useState([]);
  const [uploadStatus, setUploadStatus] = useState(0);
  const [uploadedFileName, setUploadedFileName] = useState("");
  const [orderDates, setOrderDates] = useState(Array<string>());
  const dateStr = useMemo(getCurrentDateStr, []);
  const [lastUpdate, setLastUpdate] = useState("");
  const [totalBought, setTotalBought] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [totalProfit, setTotalProfit] = useState(0);
  const [showCalendar, setShowCalendar] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

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
      field: "Time",
      selector: (d: any) => d.Time,
      sortable: true
    },
    {
      name: "Stock",
      field: "Instrument",
      selector: (d: any) => d.Instrument,
      sortable: true
    },
    {
      name: "Price",
      field: "AvgPrice",
      selector: (d: any) => d.AvgPrice,
      sortable: true
    },
    {
      name: "Quantity Bought",
      field: "BoughtQuantity",
      selector: (d: any) => d.BoughtQuantity,
      // sortable: true,
      cell: (row:any) => <div className="data-text-center">{row.BoughtQuantity}</div>
    },
    {
      name: "Buy Amount",
      field: "BuyAmount",
      selector: (d: any) => d.BuyAmount,
      // sortable: true,
      cell: (row:any) => <div className="data-text-center">{row.BuyAmount}</div>
    },
    {
      name: "Quantity Sold",
      field: "SoldQuantity",
      selector: (d: any) => d.SoldQuantity,
      sortable: true,
      cell: (row:any) => <div className="data-text-center">{row.SoldQuantity}</div>
    },
    {
      name: "Sell Amount",
      field: "SellAmount",
      selector: (d: any) => d.SellAmount,
      // sortable: true,
      cell: (row:any) => <div className="data-text-center">{row.SellAmount}</div>
    },
    {
      name: "Profit on sale",
      field: "Profit",
      selector: (d: any) => d.Profit,
      sortable: true,
      cell: (row:any) => <div className="data-text-center">{row.Profit.toFixed(2)}</div>
    },
  ];

  // handle click upload button
  const handleClick = async () => {
    if (uploadStatus > 0)
      return;
    let result = await getOrderStatus();
    if (result) { //the order data for current data was uploaded already.
     
    }
    fileInput.current?.click();
  };

  // upload excel file
  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    if (uploadStatus > 0)
      return;
    setUploadedFileName("");
    // Read the uploaded file
    const file = event.target.files![0];
    if (!file) {
      setUploadStatus(0);
      console.log("No file selected");
      return;
    }

    // handle click upload button
    const uploadFile = async () => {
      setUploadStatus(1);

      const formData = new FormData();
      formData.append("order", file);

      const res = await fetch("/api/logbook/upload", {
        method: "POST",
        body: formData,
      });

      setUploadStatus(0);
      const response = await res.json();
      if (response.error) {
        handleInfo("Please input the correct Order excel file!");
        setUploadedFileName("Upload Failed.");
      }
      else if (response.status == "ok") {
        fetchOrderData(true);
        setUploadedFileName(file.name);
      }
    }

    const reader = new FileReader();
    reader.onload = async (event: any) => {
      // Access the worksheet and read the data
      const data = event.target.result;
      const buffer: any = Buffer.from(data).toString();
      let rows = buffer.split("\n");
      let isOrderCsvFile = false;
      let time: string = '';
      rows.map((row: any, rowNumber: any) => {
        const rowData: any[] = [];
        row.split(",").map((cell: any, colNumber: any) => {
          rowData.push(cell);
        });

        const maxRowCount = 6;
        if (rowData.length > maxRowCount) {
          try {
            if (rowData[0] != "Time") {
              time = rowData[0];
            }
            else {
              isOrderCsvFile = true;
            }
          }
          catch (e) {
            console.log(e);
          }
        }
      });
      if (!isOrderCsvFile) {
        handleInfo("Please input the correct Order excel file!");
        return;
      }
      time = moment(time).format('yyyy-MM-DD');
      if (orderDates.indexOf(time) != -1) {
        confirmAlert({
          title: "Overwrite",
          message: `Are you sure to overwrite today's order file?\nOrder:${time}\nToday:${dateStr}\nLast Update:${lastUpdate}`,
          buttons: [
            {
              label: 'Yes',
              onClick: () => {
                uploadFile();
              }
            },
            {
              label: 'No',
              onClick: () => {
                setUploadStatus(0);
                setUploadedFileName("");
              }
            }
          ]
        });  
      }
      else
        uploadFile();
    }
    reader.readAsArrayBuffer(file);
  };

  // get order status
  const getOrderStatus = async () => {
    // Read the uploaded file
    const res = await fetch("/api/logbook/check", {
      method: "GET",
    });

    const response = await res.json();
    if (response.error) {
      handleError("Error occured while get the status of logbook.");
      return false;
    }
    else {
      setLastUpdate(new Date(response.lastUpdate).toLocaleString('en-US'));
      if (!response.status) {
        handleInfo("Hi, Please upload today's order file.", {delay: 1000, autoClose: 10000});
      }
      let dates = response.dates.map((date: any, index: any) => {
        return moment(date).format('yyyy-MM-DD');
      })
      setOrderDates(dates);
      return response.status;
    }
  };

  // fetch order data
  const fetchOrderData = async (force=false) => {
    if (orderData?.length == 0 || force) {
      console.log("GetOrder");
      const res = await fetch("/api/logbook", {
        method: "GET",
      });

      const response = await res.json();
      if (response.data.length > 0) {
        setOrderData(response.data);
        setFilterStock(new Set([]));
        setFilterText("");
        setLastUpdate(new Date(response.lastUpdate).toLocaleString('en-US'));
      }
    }
  };

  // initialize
  useEffect(() => {
    fetchOrderData();
  }, [])

  const [filterText, setFilterText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [filterStock, setFilterStock] = useState<Set<string>>(
    new Set([])
  );
  const [resetPaginationToggle, setResetPaginationToggle] = useState(
    false
  );
  const [dateState, setDateState] = useState(new Date())
  const changeDate = (e: any) => {
    setDateState(e)
  }

  const stocks: any[] = useMemo(() => {
    return arrangeStocks(orderData);
  }, [orderData]);

  // filter available order data
  const filteredItems = orderData.filter(
    (item: any) => {
      if (filterStock.size && !filterStock.has(item.Instrument)) {
        return false;
      }

      if (startDate && endDate) {
        if (item.Time < startDate) return false;
        if (item.Time > endDate) return false;
      }
      return true;
    }
  );

  // filter form component
  const subHeaderComponentMemo = useMemo(() => {
    const handleClear = () => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText("");
      }
    };

    const handleSelectChange = (values: any) => {
      setFilterStock(new Set(values.map((e: any) => e.value)));
    }

    const handleRangeChange = (dates:any) => {
      setStartDate(moment(dates[0]).format('yyyy-MM-DD') + ' 00:00:00');
      setEndDate(moment(dates[1]).format('yyyy-MM-DD') + ' 23:59:59');
    }

    return (
      <div className="col-md-12 flex" style={{
          rowGap: 10,
          columnGap: 10,
          padding: '16px 0px',
        }}>
        <div className="col-md-6 flex flex-col gap-2">
          <div className="text-md font-bold">STOCK</div>
          <Select
            id="stock"
            placeholder="Filter by Stock"
            options={stocks}
            isMulti
            onChange={handleSelectChange}
          ></Select>
        </div>
        <div className="col-md-6 flex flex-col gap-2">
          <div className="text-md font-bold">DATE RANGE</div>
          <DateRangePicker
            ranges={predefinedRanges}
            placeholder="Select Date Range"
            showOneCalendar
            format='yyyy-MM-dd'
            onChange={handleRangeChange}
          />
        </div>
      </div>
    );
  }, [
    filterText,
    resetPaginationToggle,
    setFilterStock,
    stocks
  ]);

  // covert table data to csv
  function convertArrayOfObjectsToCSV(array: any) {
    let result: any;
    
    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    console.log(filteredItems[0]);
    const keys = columns.map((value: any, index: any) => value.field);
    result = '';  
    result += columns.map((value: any, index: any) => value.name).join(columnDelimiter);
    result += lineDelimiter;
    
    array.forEach((item: any) => {
    	let ctr = 0;
    	keys.forEach((key: any) => {
      if (ctr > 0) result += columnDelimiter;
  
        result += item[key]??"";
        
        ctr++;
      });
      result += lineDelimiter;
	  });
  
  	return result;
  }

  // download as csv file
  const downloadCSV = (array: any) => {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;
    const filename = 'export.csv';
    if (!csv.match(/^data:text\/csv/i)) {
    	csv = `data:text/csv;charset=utf-8,${csv}`;
    }
    
    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
    link.remove();
  }

  // download button
  const actionsMemo = useMemo(() => <Export totalBought={totalBought} totalSold={totalSold} totalProfit={totalProfit} onExport={() => downloadCSV(filteredItems)} />, [orderData]);

  useEffect(() => {
    getOrderStatus();
  }, [])

  useEffect(() => {
    let totalBoughtQuantity: any = 0, totalSoldQuantity: any = 0, totalProfitQuantity: any = 0;
    filteredItems.forEach((value: any, index: any) => {
      totalBoughtQuantity += value.BoughtQuantity??0;
      totalSoldQuantity += value.SoldQuantity??0;
      totalProfitQuantity += value.Profit??0;
    })
    setTotalBought(totalBoughtQuantity.toFixed(2));
    setTotalSold(totalSoldQuantity.toFixed(2));
    setTotalProfit(totalProfitQuantity.toFixed(2));
  }, [filteredItems]);

  return (
    <div className="home min-h-screen text-black flex items-center flex-col">
      <section className="w-full">
        <div className="flex flex-col bg-white py-3 px-8 shadow-sm">
          <div className="flex flex-wrap items-center relative gap-2">
            <div className="flex-1">
              <input
                type="file"
                ref={fileInput}
                hidden
                accept=".csv,.xlsx"
                onChange={handleFileUpload}
              />
              <button
                className="btn btn-primary text-nowrap"
                onClick={handleClick}
              >
                {uploadStatus ? "Uploading..." : "Upload Order"}
              </button>
              <span className="text-md font-bold">&nbsp;{uploadedFileName}</span>
            </div>
            <div className="flex items-center relative">
              <button
                className="btn btn-white border border-black mr-8 text-nowrap"
                onClick={()=>{setShowCalendar(!showCalendar)}}
              >
              {/* {`${showCalendar ? "Hide" : "Show"} Calendar`} */}
              {"Calendar"}
              </button>
              <div hidden={!showCalendar} style={{zIndex: '10', position: 'absolute', top:'48px', left:'0px'}}>
                <Calendar 
                onChange={changeDate} 
                value={dateState}
                tileClassName={({ date, view }) => {
                  if(orderDates.find(x => x===moment(date).format("YYYY-MM-DD"))){
                  return  'highlight'
                  }
                }}
                // tileDisabled={({ date }) => date.getDay() === 0}
                />
              </div>
              <span><b>Today:</b> {dateStr}</span>&nbsp;&nbsp;
              <span><b>Last Update:</b> {lastUpdate}</span>
            </div>
          </div>
          {subHeaderComponentMemo}
        </div>
        <div className="w-full mb-8 rounded-lg shadow-lg p-4">
          <div className="bg-white">
            {/* <CSVLink
              filename={"TableContent.csv"}
              data={filteredItems}
              className="btn btn-primary"
            >
              Download csv
            </CSVLink> */}
            <DataTable
              key="logbook"
              columns={columns}
              data={filteredItems}
              expandableRows={false}
              pagination
              // subHeader
              // subHeaderComponent={subHeaderComponentMemo}
              customStyles={customStyles}
              actions={actionsMemo}
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export async function getServerSideProps(ctx: NextPageContext) {
  const session = await getSession(ctx);
  return {
    props: {
      session,
    },
  };
}
