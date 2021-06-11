import * as functions from "firebase-functions";
import * as admin from "firebase-admin";

admin.initializeApp();

interface SubmitScoreReq {
  tokenId: string,
  score: number,
  name: string,
}

export const submitScore = functions.https.onCall(
    async (data: SubmitScoreReq, context) => {
      // context.app will be undefined if the request doesn't include a valid
      // App Check token.
      if (context.app == undefined) {
        console.log("Request made with invalid token");
        return {
          status: 403,
          error: new functions.https.HttpsError(
              "failed-precondition",
              "The function must be called from an App Check verified app."
          ),
        };
      }

      console.log("Data recieved: ", data);
      const {tokenId, score, name} = data;

      const ref = admin.database().ref("/test/" + tokenId);
      const currentSnapshot = await ref.once("value");
      const value = currentSnapshot.val();
      console.log("Current value: ", value);

      if (value === null || value.score < score) {
        await ref.set({
          score: score,
          name: name,
        });

        return {status: 200};
      } else {
        return {
          status: 400,
          error: "Score isnt greater than previous highscore",
        };
      }
    });

export const getHighscoreForTokenId = functions.https.onCall(async (data) => {
  const {tokenId} = data;
  console.log("Retrieving data for: ", tokenId);

  const ref = admin.database().ref("/test/" + tokenId);
  const currentSnapshot = await ref.once("value");
  const value = currentSnapshot.val();
  console.log("Current value: ", value);

  return value?.score;
});

export const getHighscores = functions.https.onCall(async () => {
  const orderByScore = (a: {score: number}, b: {score: number}) => {
    return b.score - a.score;
  };
  console.log("Retrieving highscores");

  const ref = admin.database().ref("/test").orderByChild("score");
  const currentSnapshot = await ref.once("value");
  const value = currentSnapshot.val();

  const results = Object.keys(value).map((key) => {
    return {
      tokenId: key,
      score: value[key].score,
      name: value[key].name,
    };
  });

  const sorted = results.sort(orderByScore);

  return sorted;
});
