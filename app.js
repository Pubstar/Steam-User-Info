const express = require('express');
const app = express();
const axios = require('axios');

app.use(express.static('public'));
app.set('view engine', 'ejs');

let userData = '';
let userBanData = '';
let userFriendData = '';



app.get('/', (req, res) => {
    res.render('index');
})

app.get('/user/:id', async (req, res) => {
    resetData();
    try {
        const { id: userId } = req.params;
        console.log(userId);
        await getUserBanData(userId);
        await getUserData(userId);
        await getUserFriendData(userId); // 401 Unauthorized
        res.render('user', { userBanData, userData, userFriendData });
    } catch {
        res.render('user', { userBanData, userData, userFriendData });
    }
})

app.get('/user/', async (req, res) => {
    resetData();
    try {
        const { userId } = req.query;
        await getUserBanData(userId);
        await getUserData(userId);
        await getUserFriendData(userId);
        res.render('user', { userBanData, userData, userFriendData });
    } catch {
        res.redirect('/');
    }
})

function resetData() {
    userData = '';
    userBanData = '';
    userFriendData = '';
}

async function getUserData(userId) {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerSummaries/v2/?key=7925BFBE895D38600D8AB46DC332F22F&steamids=${userId}`)
            .then(res => {
                userData = res.data.response;
                resolve();
            })
            .catch(e => {
                console.log('**ERROR**');
                console.log(e);
                reject();
            })
    })
}

async function getUserBanData(userId) {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.steampowered.com/ISteamUser/GetPlayerBans/v1/?key=7925BFBE895D38600D8AB46DC332F22F&steamids=${userId}`)
            .then(res => {
                userBanData = res.data;
                resolve();
            })
            .catch(e => {
                console.log('**ERROR**');
                console.log(e);
                reject();
            })
    })
}

async function getUserFriendData(userId) {
    return new Promise((resolve, reject) => {
        axios.get(`https://api.steampowered.com/ISteamUser/GetFriendList/v0001/?key=7925BFBE895D38600D8AB46DC332F22F&relationship=all&steamid=${userId}`)
            .then(res => {
                userFriendData = res.data;
                resolve();
            })
            .catch(e => {
                console.log('**ERROR**');
                console.log(e);
                reject();
            })
    })
}

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Server started on port: ' + listener.address().port);
})