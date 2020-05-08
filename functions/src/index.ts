import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin'

exports.GOOGLE_APPLICATION_CREDENTIALS = '/Users/chengchinlim/BackendProjects/cloud-functions-5227-service-account-key.json'

admin.initializeApp({
  credential: admin.credential.applicationDefault(),
  databaseURL: "https://cloud-functions-5227.firebaseio.com"
});

export const helloWorld = functions.https.onRequest((request, response) => {
    response.send("Hello from Firebase!");
});

export const fireStoreUpdateTrigger = functions.firestore
    .document('fruits/{docId}').onUpdate((change, context) => {
        // cloud functions -> firestore 3x speed
        // firestore -> cloud functions 1x speed
        const timeStart = Date.now()
        admin.firestore().collection('fruits').doc(context.params.docId)
            .update({ update: true })
            .then(result => {
                console.log(`Result: ${JSON.stringify(result)}`)
                const processTime = Date.now() - timeStart
                console.log(`Processing time: ${processTime}ms`)
                console.log('Fruit docs updated')
            })
            .catch(error => console.log(error))
    })