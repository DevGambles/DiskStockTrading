import mongoose, { Schema } from 'mongoose'

// //Interface
export interface InitHolding extends Document{
    userId: string,
    Symbol: string,
    ISIN: string,
    Sector: string,
    QuantityAvailable: number,
    QuantityDiscrepant: number,
    QuantityLongTerm: number,
    QuantityPledgedMargin: number,
    QuantityPledgedLoan: number,
    AveragePrice: number,
    PreviousClosingPrice: number,
    UnrealizedPL: number,
    UnrealizedPLPct: number,
    CurrentInvestment: number,
}

export type InitHoldingType = InitHolding & Document;

//Scheme
export const InitHoldingSchema = new Schema<InitHolding>(
    {
        userId: {
            type: String,
            required: true,
        },
        Symbol:{
            type: String,
            required: true,
        },
        ISIN:{
            type: String,
            required: false,
            default: "",
        },
        Sector:{
            type: String,
            required: true,
        },
        QuantityAvailable:{
            type: Number,
            required: true,
        },
        QuantityDiscrepant:{
            type: Number,
            required: true,
        },
        QuantityLongTerm:{
            type: Number,
            required: true,
        },
        QuantityPledgedMargin:{
            type: Number,
            required: true,
        },
        QuantityPledgedLoan:{
            type: Number,
            required: true,
        },
        AveragePrice:{
            type: Number,
            required: true,
        },
        PreviousClosingPrice:{
            type: Number,
            required: true,
        },
        UnrealizedPL:{
            type: Number,
            required: true,
        },
        UnrealizedPLPct:{
            type: Number,
            required: true,
        },
        CurrentInvestment:{
            type: Number,
            required: true,
            default: 0
        },
    },
    { timestamps: true }
)

//Model
const InitHoldingModel = mongoose?.models?.InitHolding || mongoose.model("InitHolding", InitHoldingSchema)

export default InitHoldingModel