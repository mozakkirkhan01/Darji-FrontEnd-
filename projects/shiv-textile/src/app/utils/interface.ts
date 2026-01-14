export class PurchaseProductModel {
    PurchaseProductId: number;
    PurchaseId: number;
    ProductId: number;
    SearchProduct: string;
    MRP: number;
    SellingPrice: number;
    CostPrice: number;
    DiscountPercentage: number;
    DiscountAmount: number;
    NetPrice: number;
    Quantity: number;
    TaxableAmount: number;
    GSTPercentage: number;
    CGSTAmount: number;
    SGSTAmount: number;
    IGSTAmount: number;
    GrossAmount: number;
}

export class ProductStockResponse {
    Data: {
        ProductStockId: number;
        StockCode: string;
        ProductId: number;
        ProductName: string;
    }[];
    TotalRecords: number;
}




