const Export = ({ totalBought, totalSold, totalProfit, onExport }: any) => {
    return (
      <div className="flex flex-wrap items-center">
        <span className="text-base"><b>Totals: </b>{totalBought}&nbsp;<i>(Bought)</i>&nbsp;{totalSold}&nbsp;<i>(Sold)</i>&nbsp;{totalProfit}&nbsp;<i>(Profit)</i></span>&nbsp;&nbsp;
        <button className="btn btn-primary" onClick={(e: any) => onExport(e.target.value)}>Export</button>
      </div>
    )
};

export default Export;