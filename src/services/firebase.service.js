"use strict";

const { getMessaging } = require("firebase-admin/messaging");
const codeNotification = require("../constants");
const NotificationService = require("./notification.service");
const { findTokenDeviceByUserId } = require("../models/repo/token.repo");

class FirebaseService {
  static notification = async (msg = {}) => {
    try {
      const {
        sender,
        senderName,
        receiver,
        target,
        action,
        metadata = {},
      } = msg;
      const tokens = await findTokenDeviceByUserId(receiver);
      let receiveTokens = tokens.reduce((acc, current) => {
        if (current.deviceToken.trim() !== "") {
          acc.push(current.deviceToken);
        }
        return acc;
      }, []);
      const payload = "Thông báo mới!";
      let type = codeNotification[target][action];
      let title = "";
      if (type === "NI01")
        title = `${senderName} đã comment vào một idea của bạn `;
      if (type === "NI02") title = `${senderName} đã vote cho idea của bạn`;
      if (type === "NC01")
        title = `${senderName} đã react cho một comment của bạn`;
      if (type === "NI03") title = `Bài viết của bạn đã được duyệt`;
      const message = {
        notification: {
          title: title,
          body: payload,
        },
        tokens: receiveTokens,
      };
      await NotificationService.createNotification({
        type,
        from: sender,
        to: receiver,
        target: metadata?.targetId,
      });

      await getMessaging().sendEachForMulticast(message);
    } catch (err) {
      console.log("Error:", err);
    }
  };

  static notificationToGroup = async (msg = {}) => {
    try {
      const {
        sender,
        senderName,
        receivers,
        target,
        action,
        metadata = {},
      } = msg;

      // Kiểm tra nếu không có receivers
      if (!Array.isArray(receivers) || receivers.length === 0) {
        console.log("No receivers provided.");
        return;
      }

      // Lấy tất cả token của từng user
      const allTokens = await Promise.all(
        receivers.map(async (receiverId) => {
          const tokens = await findTokenDeviceByUserId(receiverId);
          return tokens.reduce((acc, current) => {
            if (current.deviceToken.trim() !== "") {
              acc.push({
                receiverId,
                token: current.deviceToken,
              });
            }
            return acc;
          }, []);
        })
      );

      // Gom tất cả token lại thành một mảng
      const flattenedTokens = allTokens.flat();
      console.log("Flattened Tokens:", flattenedTokens);

      // Nhóm token theo user để gửi thông báo
      const groupedTokens = {};
      flattenedTokens.forEach(({ receiverId, token }) => {
        if (!groupedTokens[receiverId]) {
          groupedTokens[receiverId] = [];
        }
        groupedTokens[receiverId].push(token);
      });

      // Xử lý từng user và gửi thông báo
      await Promise.all(
        receivers.map(async (receiverId) => {
          const tokens = groupedTokens[receiverId] || [];

          // Dữ liệu thông báo
          const payload = "Thông báo mới!";
          if (type === "PE01")
            title = `Thăm dò ý kiến của ${senderName} sắp hết hạn`;
          const type = codeNotification[target][action];
          const message = {
            notification: {
              title: title,
              body: payload,
            },
            tokens,
          };

          // Lưu thông báo vào database
          await NotificationService.createNotification({
            type,
            from: sender,
            to: receiverId,
            target: metadata?.targetId,
          });

          // Nếu có token, gửi thông báo qua Firebase
          if (tokens.length > 0) {
            await getMessaging().sendEachForMulticast(message);
            console.log(`Notification sent to user ${receiverId}`);
          } else {
            console.log(
              `No tokens for user ${receiverId}, notification saved to database only.`
            );
          }
        })
      );

      console.log("All notifications processed successfully.");
    } catch (err) {
      console.error("Error sending group notifications:", err);
    }
  };
}

module.exports = FirebaseService;
