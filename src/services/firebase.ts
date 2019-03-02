import * as firebase from 'firebase'
import {store} from "@/store";
var config = {
    apiKey: "AIzaSyDyBLXr99kj_KMzM-K3E1QmlYevZMhQxuU",
    authDomain: "salary-calc-505fe.firebaseapp.com",
    databaseURL: "https://salary-calc-505fe.firebaseio.com",
    projectId: "salary-calc-505fe",
    storageBucket: "salary-calc-505fe.appspot.com",
    messagingSenderId: "784361612034"
};
firebase.initializeApp(config);

// save a reference to the firestore database
// to access it in the future
export const db = firebase.firestore();
export const userData = () => db.doc(`/users/${store.state.user && store.state.user.uid}`)