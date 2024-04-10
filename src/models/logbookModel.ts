import mongoose, { Schema } from 'mongoose'

// //Interface
export interface ILogBook extends Document{
    userId: string,
    Time: Date,
    Type: string,
    Instrument: string,
    Product: string,
    Qty: string,
    AvgPrice: string,
    Status: string,
    Amount: number,
    CumulativeQty: number,
    CumulativeInvestment: number,
    AvgCost: number,
    Profit: number,
}

export type LogBookType = ILogBook & Document;

//Scheme
export const LogBookSchema = new Schema<ILogBook>(
    {
        userId: {
            type: String,
            required: true,
        },
        Time:{
            type: Date,
            required: true,
            default: null
        },
        Type:{
            type: String,
            required: true,
        },
        Instrument:{
            type: String,
            required: true,
        },
        Product:{
            type: String,
            required: true,
        },
        Qty:{
            type: String,
            required: true,
        },
        AvgPrice:{
            type: String,
            required: true,
        },
        Status:{
            type: String,
            required: true,
        },
        Amount:{
            type: Number,
            required: true,
            default: 0,
        },
        CumulativeQty:{
            type: Number,
            required: true,
            default: 0,
        },
        CumulativeInvestment:{
            type: Number,
            required: true,
            default: 0,
        },
        AvgCost:{
            type: Number,
            required: true,
            default: 0,
        },
        Profit:{
            type: Number,
            required: true,
            default: 0,
        },
    },
    { timestamps: true }
)

//Model
const LogBookModel = mongoose?.models?.logbook || mongoose.model("logbook", LogBookSchema)

export default LogBookModel