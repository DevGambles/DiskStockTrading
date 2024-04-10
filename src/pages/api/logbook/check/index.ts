import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "next-auth/react";
import LogBook from "@/models/logbookModel";
import User from "@/models/userModel";
import connectDb from '@/utils/connectDb'
import { buffer } from 'stream/consumers';
import { format } from 'date-fns';

export const config = {
  api: {
    bodyParser: false, // Disable the default body parsing to handle multipart uploads
  },
};

// check order status
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const session = await getSession({req});
    if(session?.user) {
      await connectDb();
      let today: any = new Date();
      let buf: any = await buffer(req);
      buf = buf.toString('utf8');
      if (buf) {
        const rawBody = JSON.parse(buf.toString('utf8'));
        today = new Date(rawBody.date);
      }
      today.setHours(0, 0, 0, 0);
      var curUser = await User.findOne({email : session?.user.email});
      var data = await LogBook.find({userId: curUser._id, $expr: {
        $gte: [ { $toDate: '$Time' }, today]
      }});
      let lastUppdate = await LogBook.find({}).sort({"Time": -1}).limit(1);
      if (lastUppdate.length > 0)
        lastUppdate = lastUppdate[0].Time;
  
      var dates = await LogBook.distinct('Time', {userId: curUser._id});
      res.status(200).json({ status: data.length, lastUpdate: lastUppdate, dates: dates });
    }else {
      res.status(403).json({ error: 'User is not logged in'});      
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}