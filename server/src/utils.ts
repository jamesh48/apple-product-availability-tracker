import axios from "axios";
import { ReturningData } from "./types";

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
