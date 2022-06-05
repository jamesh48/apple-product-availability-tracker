export type StoreApiResponse = {
  storeName: string;
  state: string;
  partsAvailability: { [sku: string]: { pickupSearchQuote: string } };
};

export type ProductApiResponse = {
  status: "fulfilled" | "rejected";
  reason?: string;
  value: {
    body: {
      content: {
        pickupMessage: {
          stores: StoreApiResponse[];
        };
      };
    };
  };
};

export type ReturningData = { storeName: string; state: string; availabilityStatus: string }[];
export type TransformedResponse = [ReturningData, { [location: string]: boolean }];
