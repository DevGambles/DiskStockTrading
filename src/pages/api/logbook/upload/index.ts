import { NextApiRequest, NextApiResponse } from 'next';
import { useSession, getSession } from "next-auth/react";
import busboy, {Busboy, BusboyConfig} from 'busboy';
import ExcelJS from 'exceljs';
import LogBook from "@/models/logbookModel";
import User from "@/models/userModel";
import Holding from '@/models/holdingModel';
import InitHolding from '@/models/initHoldingModel';
import { format } from 'date-fns';
import connectDb from '@/utils/connectDb';
import { mapRowToLogbook, mapHoldingToNewHolding } from '@/utils';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parsing to handle multipart uploads
  },
};

// upload log data
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    await connectDb();
    const session = await getSession({ req });
    if(session?.user) {
      let busboyInstance: Busboy = busboy({ headers: req.headers });
    
      // Handle each part of the form data
      busboyInstance.on('field', () => {
        // Handle non-file fields if needed
      });
  
      busboyInstance.on('file', async (fieldname: any, file: any, filename: any, encoding: any, mimetype: any) => {
        const session = await getSession({ req });
        console.log("session: " + JSON.stringify(session));
  
        var curUser = await User.findOne({email : session?.user.email});
        // File has been saved, you can perform further operations on it
        // For example, use exceljs to read the file
  
        try {
          const workbook = new ExcelJS.Workbook();
          await workbook.csv.read(file);
  
          // Access the worksheet and read the data
          const worksheet = workbook.worksheets[0];
          const rows: any[] = [];
  
          let isOrderCsvFile = false;
          worksheet.eachRow(async (row, rowNumber) => {
            const rowData: any[] = [];
            row.eachCell((cell, colNumber) => {
              rowData.push(cell.value);
            });
            
            if (rowData.length > 6) {
              try {
                if (rowData[0] != "Time") {
                  const columns = {
                    Time: 0,
                    Type: 1,
                    Instrument: 2,
                    Product: 3,
                    Qty: 4,
                    AvgPrice: 5,
                    Status: 6,
                  };
                  rows.push({
                    Time: rowData[columns.Time],
                    Type: rowData[columns.Type],
                    Instrument: rowData[columns.Instrument],
                    Product: rowData[columns.Product],
                    Qty: rowData[columns.Qty],
                    AvgPrice: rowData[columns.AvgPrice],
                    Status: rowData[columns.Status],
                  });
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
  
          if (isOrderCsvFile) {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            if (rows.length > 0) {
              let start = new Date(new Date(rows[0].Time)), end = new Date(new Date(rows[0].Time));
              start.setHours(0, 0, 0, 0);
              end.setHours(23, 59, 59, 999);
              let orderToday = format(start, 'yyyy-MM-dd');
              let formattedToday = format(today, 'yyyy-MM-dd');
              if (orderToday < formattedToday) {
                // return res.status(200).json({ status: "This order file is old. Please upload today's order file." });
              }
              await Promise.all(rows.map(async (row, index) => {
                var logbookFound = await LogBook.findOne({
                  userId: curUser._id,
                  Time: { $gte: start, $lte: end },
                  Type: row.Type,
                  Instrument: row.Instrument,
                  // Product: row.Product,
                  // Qty: row.Qty,
                  // AvgPrice: row.AvgPrice,
                  // Status: row.Status,
                })
                console.log("logbookFound: ", logbookFound);
                var qty = parseInt(row.Qty);
                qty = (row.Type == "BUY" ? qty : -qty);
    
                var holdingFound = await Holding.findOne({
                  Symbol: row.Instrument,
                  userId: curUser._id
                });
                
                if (!logbookFound) {
                  let holding = null;
                  if (holdingFound) {
                    holdingFound.QuantityAvailable += qty;
                    if (isNaN(holdingFound.CurrentInvestment)) 
                      holdingFound.CurrentInvestment = 0;
                    holdingFound.CurrentInvestment += row.AvgPrice * qty;
                    holdingFound.AveragePrice = holdingFound.CurrentInvestment / holdingFound.QuantityAvailable;
                    holdingFound.updatedAt = new Date();
                    holding = await holdingFound.save();
                  } else {
                    holdingFound = await InitHolding.findOne({
                      Symbol: row.Instrument,
                      userId: curUser._id
                    });
                    if (holdingFound) {
                      holding = mapHoldingToNewHolding(holdingFound.userId, holdingFound, row.AveragePrice);
                      
                      holding.QuantityAvailable += qty;
                      if (isNaN(holding.CurrentInvestment)) 
                        holding.CurrentInvestment = 0;
                      holding.CurrentInvestment += row.AvgPrice * qty;
                      holding.AveragePrice = holding.CurrentInvestment / holding.QuantityAvailable;
                      await holding.save();
                    }
                  }
                  var logbook = await mapRowToLogbook(curUser._id, row, holding);
                }
                else {
                  let holding = null;
                  if (holdingFound) {
                    var fqty = (logbookFound.Type == "BUY" ? parseInt(logbookFound.Qty) : -parseInt(logbookFound.Qty));
                    holdingFound.QuantityAvailable -= fqty;
                    holdingFound.CurrentInvestment -= logbookFound.AvgPrice * fqty;
    
                    holdingFound.QuantityAvailable += qty;
                    if (isNaN(holdingFound.CurrentInvestment)) 
                      holdingFound.CurrentInvestment = 0;
                    holdingFound.CurrentInvestment += logbook.Amount;
                    holdingFound.AveragePrice = holdingFound.CurrentInvestment / holdingFound.QuantityAvailable;
                    holdingFound.updatedAt = new Date();
                    holding = await holdingFound.save();
                  } else {
                    holdingFound = await InitHolding.findOne({
                      Symbol: row.Instrument,
                      userId: curUser._id
                    });
                    if (holdingFound) {
                      holding = mapHoldingToNewHolding(holdingFound.userId, holdingFound, row.AveragePrice);
                      
                      var fqty = (logbookFound.Type == "BUY" ? parseInt(logbookFound.Qty) : -parseInt(logbookFound.Qty));
                      holding.QuantityAvailable -= fqty;
                      holding.CurrentInvestment -= logbookFound.AvgPrice * fqty;
                      holding.QuantityAvailable += qty;
                      if (isNaN(holding.CurrentInvestment)) 
                        holding.CurrentInvestment = 0;
                      holding.CurrentInvestment += logbook.Amount;
                      holding.AveragePrice = holding.CurrentInvestment / holding.QuantityAvailable;
                      holding.updatedAt = new Date();
                      await holding.save();
                    }
                  }
                  var logbook = await mapRowToLogbook(curUser._id, row, holding);
                  await logbookFound.remove();
                }
                await logbook.save();
              }));
            }
  
            // Send the data in the API response
            res.status(200).json({ status: "ok" });
          }
          else
            res.status(500).json({ error: 'Excel read error' });  
        } catch (error) {
          console.log(error);
          res.status(500).json({ error: 'Excel read error' });
        }
      });
  
      // Pipe the request to busboy for parsing
      req.pipe(busboyInstance);
    }else {
      res.status(403).json({ error: 'User is not logged in'});
    }
  } else {
    res.status(405).json({ error: 'Method not allowed:' + req.method });
  }
}