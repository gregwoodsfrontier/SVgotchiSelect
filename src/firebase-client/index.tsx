import React, { createContext, useContext, useEffect, useState } from "react";
import { SubmitScoreReq, HighScore } from "types";
import fb from 'firebase';

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTHDOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASEURL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECTID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGEBUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGINGSENDERID,
  appId: process.env.REACT_APP_FIREBASE_APPID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENTID
}

interface FirebaseContext {
  highscores?: Array<HighScore>,
  handleSubmitScore?: (score: number, gotchiData: SubmitScoreReq) => Promise<Array<HighScore>>
}

export const FirebaseContext = createContext<FirebaseContext>({});

export const FirebaseProvider = ({ children }: { children: React.ReactNode }) => {
  // Stored on init
  const [firebase, setFirebase] = useState<fb.app.App>();
  const [highscores, setHighscores] = useState<Array<HighScore>>();

  const sortByScore = (a: HighScore, b: HighScore) => {
    return b.score - a.score;
  }

  const handleSubmitScore = async (score: number, gotchiData: SubmitScoreReq) => {
    const { name, tokenId } = gotchiData;
    const submitScore = firebase?.functions().httpsCallable('submitScore');

    if (submitScore) {
      const res = await submitScore({tokenId, score, name});
  
      if (res.data.status === 200) {
        const highscoresCopy = highscores === undefined ? [] : [...highscores];
    
        const indexOfScore = highscoresCopy.findIndex(score => score.tokenId === tokenId);
        if (indexOfScore >= 0) {
          highscoresCopy[indexOfScore].score = score
        } else {
          highscoresCopy.push({
            tokenId: tokenId,
            score: score,
            name: name,
          })
        }
  
        highscoresCopy.sort(sortByScore);
        setHighscores(highscoresCopy);
      }
      return res.data;
    }

  }
  
  const handleGetHighscores = async () => {
    const getHighscores = firebase?.functions().httpsCallable('getHighscores');
    if (getHighscores) {
      const res = await getHighscores();
      return res.data;
    }
  }

  useEffect(() => {
    if (!firebase) {
      const firebaseInit = fb.initializeApp(firebaseConfig);
      setFirebase(firebaseInit)
    }
  }, [])

  useEffect(() => {
    if (firebase === undefined) return;
    const getHighscores = async () => {
      const res = await handleGetHighscores();
      setHighscores(res);
    }

    getHighscores();
  }, [firebase])

  return (
    <FirebaseContext.Provider value={{
      highscores,
      handleSubmitScore
    }}>
      {children}
    </FirebaseContext.Provider>
  )
}

export const useFirebase = () => useContext(FirebaseContext);


