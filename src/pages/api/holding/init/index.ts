import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "next-auth/react";
import InitHolding from "@/models/initHoldingModel";
import User from "@/models/userModel";
import connectDb from '@/utils/connectDb'
import { buffer } from 'stream/consumers';

export const config = {
  api: {
    bodyParser: false
  },
};

// get init holding data
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    await connectDb();
    const session = await getSession({req});
    if(session?.user) {
      const email = req.query.email ? req.query.email : session?.user.email;
      var curUser = await User.findOne({email : email});
      var data = await InitHolding.find({userId: curUser._id});
      const rows: any[] = [];
      data.map((row, index) => {
        const rowData: any = Object.assign({}, row._doc);
        rowData.CurrentInvestment = Math.fround(rowData.CurrentInvestment / 100000).toFixed(2);
        rowData.AveragePrice = Math.fround(rowData.AveragePrice).toFixed(2);
        rowData.UnrealizedPL = Math.fround(rowData.UnrealizedPL).toFixed(2);
        rowData.UnrealizedPLPct = Math.fround(rowData.UnrealizedPLPct).toFixed(2);
        rows.push(rowData);
      })
      let lastUppdate = await InitHolding.find({}).sort({"updatedAt": -1}).limit(1);
      if (lastUppdate.length > 0)
        lastUppdate = lastUppdate[0].updatedAt;
      res.status(200).json({ data: rows, lastUpdate: lastUppdate });
    } else {
      res.status(403).json({ error: 'User is not logged in'});
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}