import { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from "next-auth/react";
import Holding from "@/models/holdingModel";
import User, { UserType } from "@/models/userModel";
import connectDb from '@/utils/connectDb'

export const config = {
  api: {
    bodyParser: false, // Disable the default body parsing to handle multipart uploads
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  
  if (req.method === 'GET') {
    await connectDb();
    const session = await getSession({ req });
    var curUser = await User.findOne({email : session?.user.email});
    const rows: Array<UserType> = [];
    if (curUser.role == "admin") {
      var data = await User.find({});
      
      data.map((row, index) => {
        rows.push(row);
      })
      res.status(200).json({ data: rows });
    }else {
      res.status(403).json({ error: 'Permission denied' });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}