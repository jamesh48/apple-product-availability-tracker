import express from "express";
import axios from "axios";
import cors from "cors";
import { ProductApiResponse, ReturningData, StoreApiResponse, TransformedResponse } from "./types";
import { sendNotification } from "./utils";
require("dotenv").config({ path: "./.env" });
const app = express();

const hotList = ["CO", "UT", "NM"];
app.use(cors());

app.get("/checkProductAvailability", async ({ query: { productSku } }, res) => {
  try {
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
    } catch (err) {
      console.log("send notification error");
    }

    res.json(byState);
  } catch (err) {
    console.log(err.message);
    res.sendStatus(500);
  }
});

app.listen(3001, () => {
  console.log("Apple product checker listening on 3001");
});
