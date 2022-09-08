const sp = PropertiesService.getScriptProperties();
const urlBase = 'https://api.groupme.com/v3';
// Docs: https://github.com/groupme-js/GroupMeCommunityDocs

const accessToken = sp.getProperty('accessToken');
const groupId = '25707511';

const sampleInput = {
  "attachments": [],
  "avatar_url": "https://i.groupme.com/600x338.gif.ccb8915ab37a491c82d67a087e0554d6",
  "created_at": 1633933844,
  "group_id": "69502188",
  "id": "163919762566657547",
  "name": "Michael",
  "sender_id": "38301276",
  "sender_type": "user",
  "source_guid": "6179b4e0b47af8120eb3a416b275f16c",
  "system": false,
  "text": `!calebquote 152`,
  "user_id": "60035430"
}

function doPost(e) {
  const input = e ? JSON.parse(e.postData.getDataAsString()) : sampleInput;

  const commands = {
    '!limit': {
      censorable: false, isAdminCommand: true, function: limitMember, params: [input['user_id'], input['text'].replace(new RegExp('[^0-9]', 'g'), '')]
    },
    '!breadfact': { censorable: false, isAdminCommand: false, function: sendMessage, params: [getBreadFact()] },
    '!cringe': { censorable: true, isAdminCommand: true, function: sendMessage, params: [cringeString()] },
    '!help': { censorable: false, isAdminCommand: false, function: sendMessage, params: ['Find a list of commands at https://bit.ly/Patrick-Commands'] },
    '!commands': { censorable: false, isAdminCommand: false, function: sendMessage, params: ['Find a list of commands at https://bit.ly/Patrick-Commands'] },
    'jah': { censorable: true, isAdminCommand: false, function: sendMessage, params: ['R.I.P.', 'test'] },
    'armadillo': { censorable: true, isAdminCommand: false, function: sendMessage, params: ['https://youtu.be/HvKsb_f361o'] },
    'of course': { censorable: true, isAdminCommand: false, function: sendMessage, params: [ofCourseString()] },
    'hungry': { censorable: true, isAdminCommand: false, function: sendMessage, params: [fruitCraverString(), fruitCraverVideo()] },
    'fruit': { censorable: true, isAdminCommand: true, function: sendMessage, params: [fruitCraverString, fruitCraverVideo()] },
    'hello there': { censorable: true, isAdminCommand: false, function: sendMessage, params: ['General Kenobi'] },
    'do not': { censorable: true, isAdminCommand: false, function: sendMessage, params: ['do not'] },
    'i lost the game': { censorable: true, isAdminCommand: false, function: sendMessage, params: ['I just lost the game'] },
    'i just lost the game': { censorable: true, isAdminCommand: false, function: sendMessage, params: ['I just lost the game'] },
    'crap': { censorable: true, isAdminCommand: false, function: sendMessage, params: [`Hey ${input.name}, keep it civil!! No more naughty words!! 😤`] },
    'hell ': { censorable: true, isAdminCommand: false, function: sendMessage, params: [`Hey ${input['name']}, keep it civil!! No more naughty words!! 😤`] },
    'shit': { censorable: true, isAdminCommand: false, function: sendMessage, params: [`Hey ${input['name']}, keep it civil!! No more naughty words!! 😤`] },
    'god': { censorable: true, isAdminCommand: false, function: sendMessage, params: [`Hey ${input['name']}, don't use the lord's name in vain!!!`] },
    'jesus': { censorable: true, isAdminCommand: false, function: sendMessage, params: [`Hey ${input['name']}, don't use the lord's name in vain!!!`] },
    ' christ': { censorable: true, isAdminCommand: false, function: sendMessage, params: [`Hey ${input['name']}, don't use the lord's name in vain!!!`] },
    '!image': { censorable: false, isAdminCommand: false, function: imageCommand, params: [] },
    '!censoring': { censorable: false, isAdminCommand: true, function: censoringCommand, params: [] },
    '!remove': { censorable: false, isAdminCommand: true, function: removeCommand, params: [input] },
    '@all': { censorable: false, isAdminCommand: true, function: atAllCommand, params: [input['text']] },
    '@everyone': { censorable: false, isAdminCommand: true, function: atAllCommand, params: [input['text']] },
    '!stopats': { censorable: false, isAdminCommand: true, function: stopAtsCommand, params: [input['name'], input['user_id']] },
    '!lockdown': { censorable: false, isAdminCommand: true, function: lockdownCommand, params: [] },
    '!translate': { censorable: false, isAdminCommand: false, function: translateCommand, params: [input['text']] },
    '!totalcount': { censorable: false, isAdminCommand: false, function: sendMessage, params: [`${parseInt(sp.getProperty('toadyMessageCount')) + 1} messages have been sent today!`] },
    '!calebquote': { censorable: false, isAdminCommand: false, function: calebQuoteCommand, params: [input['text'].replace(new RegExp('[^0-9]', 'g'), '')] },
    '!code': { censorable: false, isAdminCommand: false, function: sendMessage, params: [`This code is hosted as a Google App Script as I am too lazy to set up a Google App engine or AWS EC2/Lambda function. The code can be found at the following link. Let me know if you find a bug!`, `https://script.google.com/d/1sxxUCKoWT0O6FOqnzT-vTioyBQIKBw3gUmimuV_VO-w4XDLetk1rWSqE/edit?usp=sharing`] },
    '!github': { censorable: false, isAdminCommand: false, function: sendMessage, params: [`This code is hosted as a Google App Script as I am too lazy to set up a Google App engine or AWS EC2/Lambda function. The code can be found at the following link. Let me know if you find a bug!`, `https://script.google.com/d/1sxxUCKoWT0O6FOqnzT-vTioyBQIKBw3gUmimuV_VO-w4XDLetk1rWSqE/edit?usp=sharing`] },
    '!stats': { censorable: false, isAdminCommand: false, function: statsCommand, params: [] },
    '!update': { censorable: false, isAdminCommand: false, function: updateCommand, params: [] },
    '!showvideos': { censorable: false, isAdminCommand: false, function: showVideosCommand, params: [] },
    '!xqc': { censorable: false, isAdminCommand: false, function: sendImage, params: ['https://cdn.discordapp.com/attachments/695113708288081953/973498615861501982/Screen_Shot_2022-05-10_at_6.15.32_PM.png', 'xqcL'] },
  };

  const currentlyCensoring = JSON.parse(sp.getProperty('currentlyCensoring'));
  const inLockdown = JSON.parse(sp.getProperty('inLockdown'));

  if (inLockdown && !isAdmin(input['user_id'])) {
    lockdownRemove(input['user_id'], input['name']);
    return;
  }

  if (input['system']) return;
  sp.setProperty('toadyMessageCount', parseInt(sp.getProperty('toadyMessageCount')) + 1)

  if (input['sender_type'] === 'bot' || input['user_id'] === '97994109') return;
  doLimit(input['user_id']);

  for (let command of Object.keys(commands)) {
    if (input['text'].toLowerCase().includes(command)) {
      if (!commands[command]['censorable'] || currentlyCensoring) {
        if (!commands[command]['isAdminCommand'] || isAdmin(input['user_id'])) {
          try {
            commands[command]['function'](...commands[command]['params']);
            likeMessage(input['id']);
          } catch (e) {
            sendMessage("Sorry but Michael is an idiot and this is the easiest way to fix patrick", e.toString())
          }
        }
      }
    }
  }
}

function nightlyReset() {
  const todaysCount = parseInt(sp.getProperty('toadyMessageCount'));
  const highestCount = JSON.parse(sp.getProperty('mostMessagesRecord'))['count'];
  if (todaysCount >= highestCount) {
    const date = new Date;
    date.setDate(date.getDate() - 1);
    sp.setProperty('mostMessagesRecord', JSON.stringify({ count: todaysCount, date: date.toLocaleDateString('en-US', { timeZone: 'America/Chicago' }) }));
    sendMessage(`Yesterday (${date.toLocaleDateString('en-US', { timeZone: 'America/Chicago' })}) was the most texts ever sent in this gt with ${todaysCount} messages sent!`);
  }
  sp.setProperty('toadyMessageCount', 0);
  updateStats();
  limitDailyReset();
}

function test() {
  const sheet = SpreadsheetApp.openByUrl('https://docs.google.com/spreadsheets/d/1s2AUiHQuBE1UR-sSi_lOlTrwEp76VcXEnQxLYHbJLJc/edit').getSheets()[0];
  const column = sheet.getRange('A:A');
  const values = column.getValues(); // get all data in one call
  let ct = 0;
  while ( values[ct] && values[ct][0] != "" ) {
    ct++;
  }
  const max = ct+1;
  console.log(max);
  let num = (parseInt(Math.floor(Math.random() * (max - 2) + 2)));
  console.log(num)

}