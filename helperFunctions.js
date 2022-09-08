function getGroupInfo() {
  const response = UrlFetchApp.fetch(`${urlBase}/groups/${groupId}?token=${accessToken}`);
   console.log(`${urlBase}/groups/${groupId}?token=${accessToken}`)
  return JSON.parse(response)['response']
}

function isAdmin(userId) {
  const membersJson = getGroupInfo();;
  for (let member of Object.values(membersJson['members'])) {
    if (member.user_id === userId) {
      return member.roles.includes("admin");
    }
  }
  return false;
}

function likeMessage(messageId) {
  const url = `${urlBase}/messages/${groupId}/${messageId}/like?token=${accessToken}`;
  UrlFetchApp.fetch(url, {method: 'POST'});
}

function sendMessage(...messages) {
  for (let message of messages) {
    let newText = message;
    if (message.length >= 1000) {
      newText = message.substring(0, 999);
      let newLineIndex = newText.lastIndexOf('\n');
      let spaceIndex = newText.lastIndexOf(' ');
      if (newLineIndex > -1) {
        newText = newText.substring(0, newLineIndex);
        sendMessage(newText, message.substring(newLineIndex));
      } else if (spaceIndex > -1) {
        newText = newText.substring(0, spaceIndex);
        sendMessage(newText, message.substring(spaceIndex));
      } else {
        sendMessage(message.substring(0, 999), message.substring(999));
      }
    } else {

      const body = JSON.stringify(
        {
          message: {
            source_guid: Utilities.getUuid(),
            text: newText
          }
        });
      const headers = { 'Content-Type': "application/json" }
      UrlFetchApp.fetch(`${urlBase}/groups/${groupId}/messages?token=${accessToken}`, { headers: headers, method: 'post', payload: body })
    }
  }
}

function sendImage(imageUrl, text) {
  const picture = UrlFetchApp.fetch(imageUrl);
  const groupmeImage = UrlFetchApp.fetch('https://image.groupme.com/pictures', {
    headers: { 'X-Access-Token': accessToken },
    contentType: 'image/jpeg',
    contentLength: picture.getHeaders()['Content-Length'],
    payload: picture.getContent(),
    method: 'post'
  });
  const newUrl = JSON.parse(groupmeImage)['payload']['picture_url']
  const body = JSON.stringify(
    {
      message: {
        source_guid: Utilities.getUuid(),
        text: text,
        attachments: [{ type: 'image', 'url': newUrl }]
      }
    });
  const headers = { 'Content-Type': "application/json" }
  UrlFetchApp.fetch(`${urlBase}/groups/${groupId}/messages?token=${accessToken}`, { headers: headers, method: 'post', payload: body })
}

function sendMention(message, userIds, locations) {
  const body = JSON.stringify(
    {
      message: {
        source_guid: Utilities.getUuid(),
        text: message,
        attachments: [{ type: 'mentions', 'user_ids': userIds, 'loci': locations }]
      }
    });
  const headers = { 'Content-Type': "application/json" }
  UrlFetchApp.fetch(`${urlBase}/groups/${groupId}/messages?token=${accessToken}`, { headers: headers, method: 'post', payload: body })
}

function addMember(userId, name) {
  const headers = { 'Content-Type': "application/json" }
  let body = JSON.stringify({ members: [{ nickname: name, user_id: userId }] });
  UrlFetchApp.fetch(`${urlBase}/groups/${groupId}/members/add?token=${accessToken}`, { headers: headers, method: 'post', payload: body });
}

function removeMember(userId) {
  const membersJson = getGroupInfo();
  let memId = '';
  for (let member of Object.values(membersJson['members'])) {
    if (member.user_id === userId) {
      memId = member['id'];
    }
  }
  UrlFetchApp.fetch(`${urlBase}/groups/${groupId}/members/${memId}/remove?token=${accessToken}`, { method: 'post' });
}

function lockdownRemove(userId, name) {
  const lockdownRemoveList = JSON.parse(sp.getProperty('lockdownRemoveList'));
  lockdownRemoveList.push({ userId: userId, name: name })
  removeMember(userId);
  sp.setProperty('lockdownRemoveList', JSON.stringify(lockdownRemoveList));
}

function likesToMessageStat() {
  let likes = JSON.parse(sp.getProperty('memberLikesCount'))
  let messagesArray = JSON.parse(sp.getProperty('memberMessagesCount'))
  let likeToMessage = {}
  let messagesDict = {}
  for (let i = 0; i < messagesArray.length; i++)
    messagesDict[messagesArray[i]['name']] = messagesArray[i]['total']
  for (let i = 0; i < likes.length; i++) {
    likeToMessage[likes[i]['name']] = parseInt(likes[i]['total']) / parseInt(messagesDict[likes[i]['name']])
  }
  let LTMSorted = sortByCount(likeToMessage);
  let msg = '';
  for (var i = 0; i < 7; i++) {
    msg += ([i + 1] + ". " + LTMSorted[i]['name'] + " with " + Math.round((LTMSorted[i]['total']) * 10) / 10 + " likes/messages\n")
  }
  return msg;
}
