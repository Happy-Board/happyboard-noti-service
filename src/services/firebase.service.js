'use strict'

const { getMessaging } = require('firebase-admin/messaging')
const codeNotification = require('../constants')
const NotificationService = require('./notification.service')
const { findTokenDeviceByUserId } = require('../models/repo/token.repo')

class FirebaseService {
    static notification = async (msg = {}) => {
        try {
            const { sender, receiver, target, action, metadata = {} } = msg
            const tokens = await findTokenDeviceByUserId(receiver)
            if(!tokens.length) throw new Error('No token found')
            let receiveTokens = tokens.reduce((acc, current) => {
                if (current.deviceToken.trim() !== '') {
                    acc.push(current.deviceToken);
                }
                return acc;
            }, []);
            console.log(receiveTokens);
            if(receiveTokens.length === 0) throw new Error('No token found')
            const payload = {
                msg: "New Notification"
            }
            let type = codeNotification[target][action]
            const message = {
                notification: {
                    title: type,
                    body: JSON.stringify(payload)
                },
                tokens: receiveTokens,
    
            }
            await NotificationService.createNotification({
                type,
                from: sender,
                to: receiver,
                target: metadata?.targetId
            })
            await getMessaging().sendEachForMulticast(message)
        } catch (err) {
            console.log('Error:', err.message)
        }
    }    
}

module.exports = FirebaseService