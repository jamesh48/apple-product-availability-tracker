import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

type AvailabilityResponse = { storeName: string; availabilityStatus: string; state: string }[][];

export const productNotificationSlice = createApi({
  reducerPath: "productNotifications",
  baseQuery: fetchBaseQuery({ baseUrl: "http://localhost:3001" }),
  endpoints: (builder) => ({
    getStudioDisplay: builder.query<AvailabilityResponse, string>({
      query: (productSku) => ({
        url: "/checkProductAvailability",
        method: "GET",
        params: { productSku },
      }),
    }),
  }),
});

export const { useGetStudioDisplayQuery } = productNotificationSlice;
