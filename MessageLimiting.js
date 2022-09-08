function limitMember(userId, limit) {
  const limits = JSON.parse(sp.getProperty('limits'));
  limits[userId] = limit;
}

function doLimit(userId) {
  const numSent = addOneToLimit(userId);
  const limit = getMessageLimit(userId);
  if (!limit) return;
  const name = getNameFromId(userId);
  if (numSent > limit) {
    sendMention(`Sorry ${name}, you have exceeded your message limit. You will now be removed :).`, userId, [[6, 6 + name.length]]);
    removeMember(userId);
    addMemberRemovedList(userId);
  } else if (numSent === limit) {
    sendMention(`Sorry ${name}, you have reached your message limit of ${limit}.`, userId, [[6, 6 + name.length]]);
  } else if (numSent > limit - 3) {
    sendMention(`${name}, you have sent ${numSent} of your ${limit} message limit.`, userId, [[0, name.length]]);
  }
}

function addMemberRemovedList(userId) {
  const removedMembers = JSON.parse(sp.getProperty('removedMembers'));
  removedMembers.push(userId);
  sp.setProperty(JSON.stringify(removedMembers));
}

function addOneToLimit(userId) {
  const messagesSent = JSON.parse(sp.getProperty('messagesSent'));
  let numSent = messagesSent[userId];
  messagesSent[userId] = numSent ? numSent + 1 : 1;
  sp.setProperty('messagesSent', JSON.stringify(messagesSent));
  return messagesSent[userId];
}

function getMessageLimit(userId) {
  const limits = JSON.parse(sp.getProperty('limits'));
  if (limits.hasOwnProperty(userId)) {
    return limits[userId];
  } else {
    return null;
  }
}

function getNumerSent(userId) {
  const messagesSent = JSON.parse(sp.getProperty('messagesSent'));
  if (messagesSent.hasOwnProperty(userId)) {
    return messagesSent[userId];
  } else {
    return null;
  }
}

function resetMemberLimit(userId) {
  const messagesSent = JSON.parse(sp.getProperty('messagesSent'));
  if (messagesSent.hasOwnProperty(userId)) {
    messagesSent[userId] = 0;
    sp.setProperty('messagesSent', JSON.stringify(messagesSent));
  }
}


function test2() {
  sp.setProperties({'removedMembers': JSON.stringify([]), 
                    'messagesSent': JSON.stringify({}),
                    'limits': JSON.stringify({})})
}

function limitDailyReset() {
  const removedMembers = JSON.parse(sp.getProperty('removedMembers'));
  const messagesSent = JSON.parse(sp.getProperty('messagesSent'));
  for (let member of removedMembers) {
    addMember(member)
  }
  for (let userId of Object.keys(messagesSent)) {
    messagesSent[userId] = 0;
  }
  sp.setProperty('messagesSent', JSON.stringify(messagesSent));
  sp.setProperty('removedMembers', JSON.stringify([]));
}
