function imageCommand() {
  const image = GetRandomBrassImage();
  sendImage(image['url'], image['description']);
}

function censoringCommand() {
  let currentlyCensoring = !JSON.parse(sp.getProperty('currentlyCensoring'));
  sp.setProperty('currentlyCensoring', currentlyCensoring);
  sendMessage(`Message censroing is now ${currentlyCensoring ? 'on' : 'off'}`)
}

function removeCommand(input) {
  const attatchments = input['attachments'];
  if (!attatchments) {
    sendMessage('Incorrect Usage. Please @ all the people you would like to remove. Ex: "!remove @Devin Monk" you may @ as many people you would like to remove.');
  } else {
    for (let attatchment of attatchments) {
      if (attatchment['type'] === 'mentions') {
        for (let userId of attatchment['user_ids']) {
          removeMember(userId);
        }
      }
    }
  }
}

function atAllCommand(message) {
  const optOutList = JSON.parse(sp.getProperty('atAllOptOut'));
  const allMembers = getGroupInfo()['members'];
  const toMention = [];
  const locations = [];
  const messageLength = message.length;
  for (let member of allMembers) {
    if (!optOutList.includes(member['user_id'])) {
      toMention.push(member['user_id']);
      locations.push([0, messageLength])
    }
  }
  sendMention(message, toMention, locations);
}

function stopAtsCommand(name, userId) {
  let optOutList = JSON.parse(sp.getProperty('atAllOptOut'));
  if (optOutList.includes(userId)) {
    optOutList = optOutList.filter((id) => id !== userId);
    sp.setProperty('atAllOptOut', JSON.stringify(optOutList));
    sendMention(`@${name} you will now me @ed by @all messages`, [userId], [[0, name.length + 1]]);
  } else {
    optOutList.push(userId);
    sp.setProperty('atAllOptOut', JSON.stringify(optOutList));
    sendMention(`@${name} you will no longer be @ed by @all messages`, [userId], [[0, name.length + 1]]);
  }
}

function lockdownCommand() {
  const inLockdown = JSON.parse(sp.getProperty('inLockdown'));
  sp.setProperty('inLockdown', !inLockdown);
  if (inLockdown) {
    const lockdownRemoveList = JSON.parse(sp.getProperty('lockdownRemoveList'));
    for (let member of lockdownRemoveList) {
      addMember(member['userId'], member['name']);
    }
    sp.setProperty('lockdownRemoveList', JSON.stringify([]));
    atAllCommand('The lockdown had ended');
  } else {
    atAllCommand('------------------------------------\n\n\t\t\tWARNING\n\n This group is now in lockdown if any non-admin attempts to speak they will be kicked with no warning.\n\n------------------------------------');
  }
}

function translateCommand(message) {
  const splitMessage = message.split(' ');
  const translated = LanguageApp.translate(splitMessage.slice(2).join(' '), '', splitMessage[1]);
  sendMessage(translated);
}

function calebQuoteCommand(quoteNumberString) {
  const quoteNumber = parseInt(quoteNumberString);
  const sheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1s2AUiHQuBE1UR-sSi_lOlTrwEp76VcXEnQxLYHbJLJc/edit').getSheets()[0];
  const column = sheet.getRange('A:A');
  const values = column.getValues(); // get all data in one call
  let ct = 0;
  while ( values[ct] && values[ct][0] != "" ) {
    ct++;
  }
  const max = ct;
  let num;
  if(quoteNumber && quoteNumber <= max) {
    num = quoteNumber;
  } else {
    num = (parseInt(Math.floor(Math.random() * (max - 2) + 2)));
  }
  if (sheet.getRange("B" + num).getValue() != "")
    sendImage(sheet.getRange("B" + num).getValue(), `Quote number ${num}:\n\n${sheet.getRange("A" + num).getValue()}\n\n-Caleb`);
  else
    sendMessage(`Quote number ${num}:\n\n${sheet.getRange("A" + num).getValue()}\n\n-Caleb`);
}

function statsCommand() {
  let statsMessage = ''
  const groupInfo = getGroupInfo();
  let { mostMessagesRecord, memberMessagesCount, memberLikesCount, statsUpdateTime } = sp.getProperties();
  mostMessagesRecord = JSON.parse(mostMessagesRecord);
  memberMessagesCount = JSON.parse(memberMessagesCount);
  memberLikesCount = JSON.parse(memberLikesCount);

  statsMessage += `The most texts in this group text since 10/18/2021 is ${mostMessagesRecord['count']} messages on ${mostMessagesRecord['date']}\n\nTotal messages: ${groupInfo['messages']['count']}`;
  // sendMessage(statsMessage);
  statsMessage += '\n\n------------------------------------\n\nMost Messages:\n';
  let messageBoardCount = 0
  for (let memberMessageCount of memberMessagesCount) {
    if (messageBoardCount >= 5) break;
    if (memberMessageCount['name'] === 'GroupMe' || memberMessageCount['name'] === 'GroupMe Calendar') continue;
    statsMessage += `\n${messageBoardCount + 1}. ${memberMessageCount['name']} with ${memberMessageCount['total']} messages`;
    messageBoardCount++;
  }
  statsMessage += '\n\n------------------------------------\n\nMost Likes:\n';
  let likesBoardCount = 0
  for (let memberLikeCount of memberLikesCount) {
    if (likesBoardCount >= 5) break;
    statsMessage += `\n${likesBoardCount + 1}. ${memberLikeCount['name']} with ${memberLikeCount['total']} likes`;
    likesBoardCount++;
  }
  statsMessage += '\n\n------------------------------------\n\nMost Average Likes per Message:\n\n';
  statsMessage += likesToMessageStat();

  statsMessage += `\n\nStats last updated ${JSON.parse(statsUpdateTime)}, do !update to update stats.`
  sendMessage(statsMessage);
}

function updateCommand() {
  const groupInfo = getGroupInfo();
  sendMessage(`Parsing ${groupInfo['messages']['count']} messages...`);
  updateStats();
  sendMessage(`Stats Updated!`);
}

function showVideosCommand() {
  let shows = '';
  shows += '2021-2022 | Sugar Rush | State Finals: https://youtu.be/ThYcP6nM-2c\n';
  shows += '2021-2022 | Sugar Rush | McKinney Marching Invitational: https://youtu.be/FZAngHo51SY\n\n';
  shows += '2019-2020 | Play | State Prelims: https://youtu.be/qnMee8IOjoc\n';
  shows += '2019-2020 | Play | State Finals: https://youtu.be/24Rxmn7IEY8\n\n';
  shows += '2018-2019 | Seaductress | Duncanville Marching Invitational Prelims: https://youtu.be/9qwkPNJyhdo\n\n';
  shows += '2017-2018 | I do | State Finals w/ Interview: https://youtu.be/nEmy3M5RwZ8\n\n';
  shows += '2016-2017 | Day Dreams of Winter | UIL: https://youtu.be/N75lG_rV0sw\n';
  shows += '2016-2017 | Day Dreams of Winter | US Bands Finals: https://youtu.be/_3AFzHeKJ5g\n\n';
  shows += '2015-2016 | Spellbound | Midlothian Invitational: https://youtu.be/dFSX_VQoK4E\n\n';
  shows += '2014-2015 | Stained Glass | UIL Area: https://youtu.be/171_HkYwubk';
  sendMessage(shows);
}
