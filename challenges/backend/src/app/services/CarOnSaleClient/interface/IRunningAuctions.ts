export interface IRunningAuctions {
    items: IRunningAuction[];
    total: number;
}

export interface IRunningAuction {
    id: number;
    numBids: number;
    minimumRequiredAsk: number;
    currentHighestBidValue: number;
}