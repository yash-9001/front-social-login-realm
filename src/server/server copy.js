/* eslint-disable no-unused-vars */
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require('cors');
const Realm = require('realm-web');
const { App, Credentials } = require("realm-web");
const { google } = require("googleapis");
const axios = require("axios");
// import nc from "next-connect";

// nc().use(cors())

const app = express();
const port = 5500;
app.use(cors());
app.use(bodyParser.json())
app.use(express.json())

mongoose.connect('mongodb+srv://realmm:realmmPassword@atlascluster.cinwufg.mongodb.net/userData'
).then(() => {
    console.log("Connected to MongoDB Atlas");
}).catch((err) => {
    console.log("Error connecting to MongoDB Atlas:", err);
})

const userSchema = new mongoose.Schema({
    taskName: String,
    taskDescription: String,
    taskStatus: String,
    userId: String
})

const userModel = mongoose.model('User', userSchema)
app.get('/usersData', async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' });
        }
        userModel.find({ userId: userId })
            .then((userData) => {
                if (!userData) {
                    return res.status(404).json({ error: 'User not found' });
                }
                res.json(userData);
            })
            .catch((error) => {
                console.log("Error in app.get:", error);
                res.status(500).json({ error: 'Error fetching user data' });
            });
    } catch (error) {
        console.log("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
app.post('/usersData', async (req, res) => {
    try{
        let user = await userModel.create(req.body);
        res.status(201).json(user);
    }catch(error){
        console.log("Error", error);
        res.status(500).send("Error in POST", error)
    }
})
app.put('/usersData', async (req, res) => {
    try {
        const { _id } = req.query;
        const { taskName, taskDescription, taskStatus } = req.body; 
        const updatedTask = await userModel.updateOne(
            { _id: _id },
            { $set:{
                taskName: taskName,
                taskDescription: taskDescription, 
                taskStatus: taskStatus
            } }
        );
        if (updatedTask) {
            res.status(200).json(updatedTask);
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.delete('/usersData', async (req, res) => {
    try {
        const { _id } = req.query;
        const deletedTask = await userModel.deleteOne({ _id: _id });
        if (deletedTask) {
            res.status(200).json({ message: 'Task deleted successfully' });
        } else {
            res.status(404).json({ error: 'Task not found' });
        }
    } catch (error) {
        console.error('Failed to delete task:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});


const BASE_URL = `http://localhost:5500`;
const GOOGLE_CLIENT_ID = '932506994363-drmn01grg6fkrsjm2d84ngoq360h8om6.apps.googleusercontent.com';
console.log(GOOGLE_CLIENT_ID);
const GOOGLE_CLIENT_SECRET = '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';
const GOOGLE_PROJECT_ID = 'project1-420703';

const oauthConfig = {
  client_id: GOOGLE_CLIENT_ID,
  project_id: GOOGLE_PROJECT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_secret: GOOGLE_CLIENT_SECRET,
  redirect_uris: `http://localhost:5500/auth/google/callback`,
  JWTsecret: "secret",
  scopes: [
    "https://www.googleapis.com/auth/userinfo.email",
    "https://www.googleapis.com/auth/userinfo.profile",
    "openid",
  ],
};
// const OAuth2 = google.auth.OAuth2;
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  oauthConfig.client_id,
  oauthConfig.client_secret,
  oauthConfig.redirect_uris
);


const realmApp = new App({
  id: 'users-ekiix',
});

app.get("/auth/google", function (req, res) {
  const loginLink = oauth2Client.generateAuthUrl({
    access_type: "offline", // Indicates that we need to be able to access data continuously without the user constantly giving us consent
    scope: oauthConfig.scopes,
  })
  console.log("baseURL: --->... ", BASE_URL);  
  res.redirect(loginLink);
});

app.get("/auth/google/callback", function (req, res, errorHandler) {
  if (req.query.error) {
    return errorHandler(req.query.error);
  } else {
    const authCodeFromQueryString = req.query.code;
    console.log("---------------->>....authCodeFromQueryString", authCodeFromQueryString);
    
    oauth2Client.getToken(authCodeFromQueryString, async function (
      error,
      token
    ) {
      if (error) return errorHandler(error);
      
        // console.log("-------------------------------------------------------->>>>.............",google.auth.getAccessToken())
        const vueAppUrl = `http://localhost:5173/home?gtoken=${token.id_token}`;
        return res.redirect(vueAppUrl, '_blank', 'width=600,height=800');

    });
  }
});



// clientID: '1148896139479819', // Replace with your Facebook App ID
// clientSecret: '53d454b82431b85d02201e70a40b9037', // Replace with your Facebook App Secret
// callbackURL: 'http://localhost:5500/auth/facebook/callback', // Callback URL



const FACEBOOK_APP_ID = '1148896139479819';
const FACEBOOK_APP_SECRET = '53d454b82431b85d02201e70a40b9037'

app.get('/auth/facebook', (req, res) => {
  const BASE_URL = `http://localhost:5500`;
  const redirect_uri = `${BASE_URL}/auth/facebook/callback`;
  const scope = 'email';
  const authUrl = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${FACEBOOK_APP_ID}&redirect_uri=${redirect_uri}&scope=${scope}`;
  res.redirect(authUrl);
});

// Facebook OAuth Callback
app.get('/auth/facebook/callback', async (req, res) => {
  const { code } = req.query;
  console.log("code", code);
  const BASE_URL = `http://localhost:5500`;
  const redirect_uri = `${BASE_URL}/auth/facebook/callback`;
  const accessTokenUrl = 'https://graph.facebook.com/v11.0/oauth/access_token';
  const accessTokenParams = {
    client_id: FACEBOOK_APP_ID,
    client_secret: FACEBOOK_APP_SECRET,
    redirect_uri,
    code,
  };
  let vueAppUrl;
  try {
    const { data } = await axios.get(accessTokenUrl, { params: accessTokenParams });
    const accessToken = data.access_token;
    const profileUrl = 'https://graph.facebook.com/me';
    const profileParams = {
      fields: 'id,name,email',
      access_token: accessToken,
    };
    const { data: profileData } = await axios.get(profileUrl, { params: profileParams });
    console.log("---------------------->.... profileData", profileData);
    const credentials = Realm.Credentials.facebook(accessToken);
    console.log("----->>>>...accesstoken", accessToken);
    const realmUserfb = await realmApp.logIn(credentials)
    .then((res) => {
      vueAppUrl = `http://localhost:5173/home?ftoken=${accessToken}`;
    })
    console.log("realmUserfb", realmUserfb);
    return res.redirect(vueAppUrl, '_blank', 'width=600,height=800');
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
});


// import OAuth from 'oauth';
// const TWITTER_CLIENT_ID = 'Z2NNQnB6UGNRMmRaelI5TE1xU1M6MTpjaQ';
// const TWITTER_CLIENT_SECRET = 'cGtl__X2R_oq65q9XCki-Nn9QCneVI9Vp3tYIgemnt1vjHXsC_';
// const TWITTER_REDIRECT_URI = 'http://localhost:5500/auth/twitter/callback';

// const oauth = new OAuth.OAuth(
//   'https://api.twitter.com/oauth/request_token',
//   'https://api.twitter.com/oauth/access_token',
//   TWITTER_CLIENT_ID,
//   TWITTER_CLIENT_SECRET,
//   '1.0A', // Use OAuth 1.0A for Twitter API
//   TWITTER_REDIRECT_URI,
//   'HMAC-SHA1'
// );

// app.get("/auth/twitter", (req, res) => {
//   oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret) => {
//     console.log("-------------->>>. oauthToken , oauthTokenSecret", oauthToken, oauthTokenSecret);
//     if (error) {
//       console.log("oauthToken, oauthTokenSecret", oauthToken, oauthTokenSecret);
//       console.error('Twitter authentication error:', error);
//       return res.status(500).send('Twitter authentication failed');
//     }
//     console.log(oauthToken);
//     console.log(oauthTokenSecret);
//     res.redirect(`https://api.twitter.com/oauth/authenticate?oauth_token=${oauthToken}`);
//   });
// });

// app.get("/auth/twitter/callback", async (req, res) => {
//   const { oauth_token, oauth_verifier } = req.query;
//   console.log(oauth_token);
//   oauth.getOAuthAccessToken(oauth_token, null, oauth_verifier, (error, accessToken, accessTokenSecret) => {
//     if (error) {
//       console.error('Error obtaining access token:', error);
//       return res.status(500).send('Error obtaining access token');
//     }
//     console.log(accessToken);
//     console.log(accessTokenSecret);
//     const headers = {
//       'Authorization': `Bearer ${accessToken}`,
//       'Content-Type': 'application/json'
//     };
//     const userUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';
//     axios.get(userUrl, { headers })
//       .then(response => {
//         const userData = response.data;
//         console.log(userData);
//         res.send(userData);
//       })
//       .catch(error => {
//         console.error('Error fetching user details:', error);
//         res.status(500).send('Error fetching user details');
//       });
//   });
// });

// app.listen(5500, () => {
//   console.log('Server is running on port 5500');
// });





































// import OAuth from 'oauth';

// const consumerKey = 'EqJlnlQkKOXG6qVA6ICVBfgWe';
// const consumerSecret = 'BpoiBHQYzAprR1fLWKm6zDpYfkB1xQMdXD4MpWpdO645UBlqfs';
// // const requestToken = '1782340072676749312-IQqir6HjFNHPTE7BDaarqzR93CF4LF';
// // const requestTokenSecret = 'fI7Qu6jmSqpuuIxAF62s2OfIX0GSBhEVbSevOcsIyTa2b';
// // const oauthVerifier = 'oauth-verifier-obtained-from-twitter';
// const callbackUrl = 'http://localhost:5500/oauth_callback'

// const oauth = new OAuth.OAuth(
//   'https://api.twitter.com/oauth/request_token',
//   'https://api.twitter.com/oauth/access_token',
//   consumerKey,
//   consumerSecret,
//   '1.0A',
//   callbackUrl,
//   'HMAC-SHA1'
// );

// // Initiate the OAuth flow by obtaining a request token
// oauth.getOAuthRequestToken(function (error, requestToken, requestTokenSecret) {
//   if (error) {
//     console.error('Error getting request token:', error);
//   } else {
//     console.log('Request token:', requestToken);
//     console.log('Request token secret:', requestTokenSecret);
//     console.log('Authorize URL:', 'https://api.twitter.com/oauth/authenticate?oauth_token=' + requestToken);
//     // Redirect the user to the authorize URL to grant access
//   }
// });




// const apiKey = 'EqJlnlQkKOXG6qVA6ICVBfgWe';
// const apiSecretKey = 'BpoiBHQYzAprR1fLWKm6zDpYfkB1xQMdXD4MpWpdO645UBlqfs';

app.get('/twitter/token', async (req, res) => {
  try {
    const apiKey = 'EqJlnlQkKOXG6qVA6ICVBfgWe';
    const apiSecretKey = 'BpoiBHQYzAprR1fLWKm6zDpYfkB1xQMdXD4MpWpdO645UBlqfs';
    const tokenUrl = 'https://api.twitter.com/oauth2/token';
    const params = new URLSearchParams();
    params.append('grant_type', 'client_credentials');

    const config = {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + btoa(apiKey + ':' + apiSecretKey)
      }
    };

    const response = await axios.post(tokenUrl, params, config);
    const accessToken = response.data.access_token;

    // Redirect the user to another endpoint with the access token
    res.redirect(`/twitter/user?token=${accessToken}`);
  } catch (error) {
    console.error('Error getting bearer token:', error.response.data);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.get('/twitter/user', async (req, res) => {
  try {
    const bearerToken = req.query.token;

    const userUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';
    const userConfig = {
      headers: {
        'Authorization': `Bearer ${bearerToken}`
      }
    };

    const userResponse = await axios.get(userUrl, userConfig);
    const userData = userResponse.data;

    res.status(200).json(userData);
  } catch (error) {
    console.error('Error getting user data:', error.response.data);
    res.status(500).json({ error: 'Internal server error' });
  }
});















app.post("/logout", (req, res) => {
  res.redirect("http://localhost:5500");
});
// app.use(function (error, res) {
//   // res.status(error.status || 500);
//   res.send({ error: error.message || 'Internal Server Error' });
// });
app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});