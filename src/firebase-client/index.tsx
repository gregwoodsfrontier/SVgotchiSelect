import React, { createContext, useContext, useEffect, useState } from "react";
import { SubmitScoreReq, HighScore } from "types";
import fb from 'firebase';
import 'firebase/app-check';

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

interface IFirebaseContext {
  highscores?: Array<HighScore>,
  handleSubmitScore?: (score: number, gotchiData: SubmitScoreReq) => Promise<Array<HighScore>>
}

export const FirebaseContext = createContext<IFirebaseContext>({});

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
    // Dont connect to firebase in dev mode
    if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') return;

    if (!firebase) {
      const firebaseInit = fb.initializeApp(firebaseConfig);
      const appCheck = firebaseInit.appCheck();
      appCheck.activate(process.env.REACT_APP_FIREBASE_CAPTCHA);
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


