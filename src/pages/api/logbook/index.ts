import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "next-auth/react";
import LogBook from "@/models/logbookModel";
import User from "@/models/userModel";
import connectDb from '@/utils/connectDb'
import { format } from 'date-fns';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parsing to handle multipart uploads
  },
};

// get logbooks info
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await getSession({ req });
    if(session?.user) {
      await connectDb();
      var curUser = await User.findOne({email : session?.user.email});
      var data = await LogBook.find({userId: curUser._id}).sort({Time: -1});
      const rows: any[] = [];
      data.map((row, index) => {
        const rowData = Object.assign({}, row._doc);
  
        const date = new Date(rowData.Time);
        const options : any = { year: 'numeric', month: 'short', day: 'numeric' };
        const formattedDate = date.toLocaleDateString('en-GB', options);
        rowData.Time = formattedDate;
        if (rowData.Status == "COMPLETE") {
          rowData.AvgPrice = Math.fround(rowData.AvgPrice).toFixed(2);
          if (rowData.Type == "BUY") {
            rowData.BoughtQuantity = parseInt(rowData.Qty);
            rowData.BuyAmount = Math.round(rowData.AvgPrice * rowData.BoughtQuantity);
            // rowData.Remain = rowData.BoughtQuantity;
            // rowData.Sold = 0;
          }
          else {
            rowData.SoldQuantity = parseInt(rowData.Qty);
            rowData.SellAmount = Math.round(rowData.AvgPrice * rowData.SoldQuantity);
            // rowData.Sold = rowData.SoldQuantity;
            // rowData.Remain = 0;
          }
          rows.push(rowData);
        }
      })
      let lastUppdate = await LogBook.find({}).sort({"Time": -1}).limit(1);
      if (lastUppdate.length > 0)
        lastUppdate = lastUppdate[0].Time;
      res.status(200).json({ data: rows, lastUpdate: lastUppdate });
    }else {
      res.status(403).json({ error: 'User is not logged in'});
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}