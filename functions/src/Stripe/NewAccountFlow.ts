// import {logger} from "firebase-functions";

import {onRequest} from "firebase-functions/v2/https";

exports.createConnectedAccount = onRequest({secrets: ["STRIPE_SECRET"]}, async (req: any, res : any) => {
// Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    // const writeResult = await getFirestore()
    //     .collection("messages")
    //     .add({original: original});
    // Send back a message that we've successfully written the message
    res.json({result: `Message with ID: ${original} added.`});
    //process.env.SECRET_NAME
});