import firebase from 'firebase/app'
import 'firebase/storage'

const firebaseConfig = {
  // paste configs in here
}

firebase.initializeApp(firebaseConfig)
const storage = firebase.storage()

export { storage, firebase as default }
