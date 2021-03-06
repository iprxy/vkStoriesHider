'use strict'
const req = require('tiny_request')
const token = require('./config').token
const url = 'https://api.vk.com/method/'

function newReq(type,url,method,query) {
    return new Promise((resolve, reject) => {
        if(type === 'get') {
            req.get({
                url: url+method,
                query: query
            }, (body, response, err) => {
                if (!err && response.statusCode == 200) {
                    resolve(body)
                } else {
                    reject(err)
                }
            })
        } else if(type === 'post') {
            req.post({
                url: url+method,
                query: query
            }, (body, response, err) => {
                if (!err && response.statusCode == 200) {
                    resolve(body)
                } else {
                    reject(err)
                }
            })
        }
    })
}
let query = {
    access_token: token
}
newReq('get', url, 'friends.get', query)
    .then(response => {
        let data = JSON.parse(response)
        if(!data.response) {
            console.log(response)
        } else {
            let friendsCount = data.response.length
            let friendlist = []
            while (data.response.length > 0) {
                friendlist.push(data.response.splice(0,200))
            }
            for(let i=0; i < friendlist.length; i++) {
                hide(i)
            }
            function hide(i) {
                setTimeout(() => {
                    let query = {
                        'v':'5.63',
                        'lang':'ru',
                        'https':1,
                        'owners_ids':friendlist[i].toString(),
                        'access_token': token
                    }
                    newReq('post', url, 'execute.storiesAddBan', query)
                        .then(resp => {
                            if(!JSON.parse(resp).response) {
                                console.log(response)
                            } else {
                                if (i == friendlist.length-1) {
                                    console.log(`Done! All off ${friendsCount} your friends were hidden from your stories!`)
                                } else {
                                    console.log(`Hiding status: ${(100*i/friendlist.length).toFixed(0)}%`)
                                }
                            }
                        })
                }, 300 * i)
            }
        }
    })
newReq('get', url, 'users.getSubscriptions', query)
    .then(response => {
        let data = JSON.parse(response)
        if(!data.response.users.items) {
            console.log(response)
        } else {
            let subscrCount = data.response.users.items.length
            let subscrList = []
            while (data.response.users.items.length > 0) {
                subscrList.push(data.response.users.items.splice(0,200))
            }
            for(let i=0; i < subscrList.length; i++) {
                hide(i)
            }
            function hide(i) {
                setTimeout(() => {
                    let query = {
                        'v':'5.63',
                        'lang':'ru',
                        'https':1,
                        'owners_ids':subscrList[i].toString(),
                        'access_token': token
                    }
                    newReq('post', url, 'execute.storiesAddBan', query)
                        .then(resp => {
                            if(!JSON.parse(resp).response) {
                                console.log(response)
                            } else {
                                if (i == subscrList.length-1) {
                                    console.log(`Done! All off ${subscrCount} your subscriptions were hidden from your stories!`)
                                } else {
                                    console.log(`Hiding status: ${(100*i/subscrList.length).toFixed(0)}%`)
                                }
                            }
                        })
                }, 300 * i)
            }
        }
    })
