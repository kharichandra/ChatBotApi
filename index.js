const express = require('express')
const dialogflow = require('@google-cloud/dialogflow');
require('dotenv').config();
const app = express()
const port = 3000

app.use(express.json())
app.use(express.urlencoded({extended:false}))

// Your credentials
const CREDENTIALS = JSON.parse(process.env.CREDENTIALS);
// Your google dialogflow project-id
const PROJECID = CREDENTIALS.project_id;

// Configuration for the client
const CONFIGURATION = {
    credentials: {
        private_key: CREDENTIALS['private_key'],
        client_email: CREDENTIALS['client_email']
    }
}

// Create a new session
const sessionClient = new dialogflow.SessionsClient(CONFIGURATION);

// Detect intent method
const detectIntent = async (languageCode, queryText, sessionId) => {

    let sessionPath = sessionClient.projectAgentSessionPath(PROJECID, sessionId);

    // The text query request.
    let request = {
        session: sessionPath,
        queryInput: {
            text: {
                // The query to send to the dialogflow agent
                text: queryText,
                // The language used by the client (en-US)
                languageCode: languageCode,
            },
        },
    };

    // Send request and log result
    const responses = await sessionClient.detectIntent(request);
    console.log(responses);
    const result = responses[0].queryResult;
    console.log(result);

    return {
        response: result.fulfillmentText
    };
}

// detectIntent('en','hi','abc123');

let movies = [{
    id: '1',
    title:'inception',
    release_date:'2010-07-16'

},{
    id: '2',
    title:'The Wall',
    release_date:'2011-08-19'

}]

app.get('/movie',(req,res) =>{
    res.json(movies)
})

app.post('/movie',(req,res) =>{
    const movie = req.body
    console.log(movie)
    movies.push(movie)
    res.send("Movie added in the list");
})

// Dialogflow route
app.post('/dialogflow', async (req, res) => {

    let languageCode = req.body.languageCode;
    let queryText = req.body.queryText;
    let sessionId = req.body.sessionId;

    let responseData = await detectIntent(languageCode, queryText, sessionId);

    res.send(responseData.response);
});

app.listen(process.env.PORT || port,()=> console.log(`Server listening on port ${port}`));