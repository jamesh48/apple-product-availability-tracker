import axios from "axios";
import { ProductApiResponse, ReturningData, StoreApiResponse, TransformedResponse } from "./types";
require("dotenv").config({ path: "./server/.env" });

const hotList = ["CO", "TX", "UT"];
const targetItemSku = "MK0U3LL/A";

(() => {
  setInterval(async () => {
    await checkProductAvailability(targetItemSku);
  }, 90000);
})();

export const sendNotification = async (byState: ReturningData[], stateToTest: string) => {
  const stateTest = byState.findIndex((stateArr) => stateArr[0].state === stateToTest);
  if (stateTest !== -1) {
    const productTest = byState[stateTest].filter(
      (store) => store.availabilityStatus !== "Currently unavailable",
    );
    if (productTest.length) {
      try {
        await axios({
          method: "POST",
          url: "https://api.pushover.net/1/messages.json",
          headers: { "Content-Type": "application/json" },
          data: {
            token: process.env.APP_TOKEN,
            user: process.env.USER_TOKEN,
            message: `Apple Studio Display ${productTest[0].availabilityStatus.toLowerCase()} in ${
              productTest[0].state
            }, ${productTest[0].storeName}!`,
            url: process.env.URL,
          },
        });
        return;
      } catch (err) {
        console.log(err.message);
      }
    }
    return;
  }
  return;
};

export const checkProductAvailability = async (productSku: string) => {
  const responses = (await Promise.allSettled(
    [
      "Broomfield,%20CO",
      "Albuquerque,%20NM",
      "Murray,%20UT",
      "Oklahoma%20City,%20OK",
      "Leawood,%20KS",
      "Dallas,%20TX",
      "Cleveland,%20OH",
      "New%20York,%20NY",
    ].map((location) => {
      return new Promise(async (resolve, reject) => {
        await new Promise((resolve) => {
          setTimeout(() => {
            resolve("ok");
          }, 500);
        });
        try {
          const { data } = await axios(
            `https://www.apple.com/shop/fulfillment-messages?pl=true&mt=compact&parts.0=${productSku}&searchNearby=true&location=${location}`,
          );

          resolve(data);
        } catch (err) {
          // try again

          setTimeout(async () => {
            try {
              const { data } = await axios(
                `https://www.apple.com/shop/fulfillment-messages?pl=true&mt=compact&parts.0=${productSku}&searchNearby=true&location=${location}`,
              );
              resolve(data);
            } catch (err) {
              reject("Error");
            }
          }, 250);
        }
      });
    }),
  )) as ProductApiResponse[];

  const [results] = responses.reduce<TransformedResponse>(
    (total, item) => {
      if (item.status === "fulfilled") {
        const filtered = item.value.body.content.pickupMessage.stores.filter(
          (store) => !total[1][store.storeName],
        );

        const availability = filtered.map((store: StoreApiResponse) => {
          total[1][store.storeName] = true;
          return {
            storeName: store.storeName,
            state: store.state,
            availabilityStatus: store.partsAvailability[productSku as string].pickupSearchQuote,
          };
        });

        return [total[0].concat(availability), total[1]];
      }
      return total;
    },
    [[], {}],
  );

  const [byState] = results.reduce<[ReturningData[], { [state: string]: number }]>(
    (total, storeEntry) => {
      if (typeof total[1][storeEntry.state] === "number") {
        total[0][total[1][storeEntry.state]].push(storeEntry);
      } else {
        total[1][storeEntry.state] = total[0].length;
        total[0].push([storeEntry]);
      }
      return total;
    },
    [[], {}],
  );

  try {
    await Promise.all(
      hotList.map((state) => {
        return sendNotification(byState, state);
      }),
    );
    return byState;
  } catch (err) {
    console.log("send notification error");
    throw new Error("send notification error");
  }
};
