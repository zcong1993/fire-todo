import firebase from 'firebase'
import { firebaseConfig, baseRef as br } from './config'

export const firebaseApp = firebase.initializeApp(firebaseConfig)
export const firebaseAuth = firebaseApp.auth()
export const firebaseDb = firebaseApp.database()
export const baseRef = br
export default firebase
