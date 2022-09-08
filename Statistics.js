function updateStats() {
  const [memberMessages, memberLikes, names] = [{}, {}, {}];
  let [lastMessageId, repeatMessageId] = [0, -1];
  let messages;
  while (lastMessageId !== repeatMessageId) {
    // console.log(`${urlBase}/groups/${groupId}/messages?token=${accessToken}&limit=100&before_id=${lastMessageId ? lastMessageId : ''}`);
    try {
      messages = JSON.parse(UrlFetchApp.fetch(`${urlBase}/groups/${groupId}/messages?token=${accessToken}&limit=100&before_id=${lastMessageId ? lastMessageId : ''}`))['response']['messages'];
    } catch {
      break;
    }
    repeatMessageId = lastMessageId;
    for (let message of messages) {
      lastMessageId = message['id'];

      if (!names.hasOwnProperty(message['sender_id'])) {
        names[message['sender_id']] = message['name'];
      }

      if (memberMessages.hasOwnProperty(message['sender_id'])) {
        memberMessages[message['sender_id']]++;
      } else {
        memberMessages[message['sender_id']] = 1;
      }

      if (message['favorited_by'].length) {
        if (memberLikes.hasOwnProperty(message['sender_id'])) {
          memberLikes[message['sender_id']] += message['favorited_by'].length;
        } else {
          memberLikes[message['sender_id']] = message['favorited_by'].length;
        }
      }
    }
  }
  // console.log(repeatMessageId);
  const date = new Date();
  sp.setProperties({
    'memberMessagesCount': JSON.stringify(sortByCount(memberMessages, names)),
    'memberLikesCount': JSON.stringify(sortByCount(memberLikes, names)),
    'statsUpdateTime': JSON.stringify(date.toLocaleString('en-US', { timeZone: 'America/Chicago' }))
  })
}

function sortByCount(memberMessages, names) {
  // sort by count in descending order
  const finalMessagesArray = Object.keys(memberMessages).map(function (key) {
    return {
      name: names ? names[key] : key,
      total: memberMessages[key]
    };
  });

  finalMessagesArray.sort(function (a, b) {
    return b.total - a.total;
  });
  return finalMessagesArray;
}
