'use strict'
const req = require('tiny_request')
const config = require('./config')
const token = config.token
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
        if(data.response == undefined) {
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
                            if(JSON.parse(resp).response == undefined) {
                                console.log(response)
                            } else {
                                if (i == friendlist.length-1) {
                                    console.log(`Done! All off ${friendsCount} your friends were hided from your stories!`)
                                } else {
                                    console.log(`Hiding status: ${(100*i/friendlist.length).toFixed(0)}%`)
                                }
                            }
                        })
                }, 300 * i)
            }
        }
    })
