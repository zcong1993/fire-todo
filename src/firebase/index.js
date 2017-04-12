import { firebaseDb } from './firebase'

export function push(data) {
  firebaseDb.ref('/zcong')
    .push(data)
    .then(r => console.log(r))
    .catch(e => console.log(e))
}

export function set(data) {
  firebaseDb.ref('/zcong/set')
    .set(data)
    .then(r => console.log(r))
    .catch(e => console.log(e))
}

export function getSet() {
  return firebaseDb.ref('/zcong/set')
    .once('value')
    // .then(d => console.log(d.val()))
    .catch(e => console.log(e))
}

export function getAll(ref = '/zcong') {
  return firebaseDb.ref(ref)
    .once('value')
    .then(d => d.val())
    .catch(e => console.log(e))
}

export function onAdded(arr) {
  return firebaseDb.ref('/zcong')
    .on('child_added', data => {
      console.log('added')
      arr.push(data.val())
    })
}
