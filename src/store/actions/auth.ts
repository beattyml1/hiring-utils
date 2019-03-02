import firebase from 'firebase';
import {mutations} from "@/store";


export function login(context) {
    const provider = new firebase.auth.GithubAuthProvider();

    firebase.auth().signInWithPopup(provider).then((result) => {
        context.commit(mutations.setUser, result.user);
    }).catch((e) => {
        alert(e.message);
    });
}

export function logout(context) {
    firebase.auth().signOut().then((result) => {
        context.commit(mutations.setUser, false);
    }).catch((e) => {
        alert(e.message);
    });
}
