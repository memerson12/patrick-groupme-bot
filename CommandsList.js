const commands = {
    '!breadfact': { censorable: false, isAdminCommand: false, description: 'Sends a bread fact what else would it do.' },
    '!help, !commands': { censorable: false, isAdminCommand: false, description: 'Links to this page.'},
    '!image': { censorable: false, isAdminCommand: false, description: 'Sends a random image from the brass smugmug folder (if this stopped working the password probably changed).'},
    '!censoring': { censorable: false, isAdminCommand: true, description: 'Toggles censoring on/off'},
    '!remove @[person]': { censorable: false, isAdminCommand: true, description: 'Removes people from the group text. Usage: "!remove @[person]" you may @ as many people you would like to remove.'},
    '@all, @everyone': { censorable: false, isAdminCommand: true, description: 'Mentions everyone in the chat who has not opted out using the !stopats command.'},
    '!stopats': { censorable: false, isAdminCommand: true, description: 'Toggles on/off you being mentioned by @all messages'},
    '!lockdown': { censorable: false, isAdminCommand: true, description: 'Turns on/off a lockdown where only admins may speak.'},
    '!translate [letter language code]': { censorable: false, isAdminCommand: false, description: `Translates into most languages ex !translate es Hello -> Hola, a list of language codes can be found at https://cloud.google.com/translate/docs/languages.`},
    '!totalcount': { censorable: false, isAdminCommand: false, description: 'Returns number of messages sent by everyone in the chat for the day.'},
    '!calebquote': { censorable: false, isAdminCommand: false, description: 'Sends a random quote from Caleb from the following spreadsheet. https://docs.google.com/spreadsheets/d/1s2AUiHQuBE1UR-sSi_lOlTrwEp76VcXEnQxLYHbJLJc/edit?usp=sharing.'},
    '!code, !github': { censorable: false, isAdminCommand: false, description: `Sends the link to view the Patrick's code.`},
    '!stats': { censorable: false, isAdminCommand: false, description: 'Displays chat stats.'},
    '!update': { censorable: false, isAdminCommand: false, description: 'Updates chat stats.'},
    '!showvideos': { censorable: false, isAdminCommand: false, description: 'Displays a list of videos from previous seasons.'},
  };

function doGet(e) {
  const html = HtmlService.createHtmlOutput()
  html.setTitle('Patrick Commands')
  html.setFaviconUrl('https://i.imgur.com/yLlS9Ql.png');
  html.append(`
  <style>
    h1 {text-align:center; }
    p {text-align:center;}
    table.center {
    margin-left:auto; 
    margin-right:auto;
    }
  </style>

  <table style="border-collapse:collapse;border-color:#ccc;border-spacing:0" class="center">
    <tr>
      <th style="background-color:#f0f0f0;border-color:#ccc;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">Command</th>
      <th style="background-color:#f0f0f0;border-color:#ccc;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">Description</th>
      <th style="background-color:#f0f0f0;border-color:#ccc;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;font-weight:normal;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">Permissions</th>
    </tr>
  `)
  for(let command of Object.keys(commands)) {
    html.append(`
    <tr>
      <td style="background-color:#fff;border-color:#ccc;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">${command}</td>
      <td style="background-color:#fff;border-color:#ccc;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">${commands[command]['description']}</td>
      <td style="background-color:#fff;border-color:#ccc;border-style:solid;border-width:1px;color:#333;font-family:Arial, sans-serif;font-size:14px;overflow:hidden;padding:10px 5px;text-align:left;vertical-align:top;word-break:normal">${commands[command]['isAdminCommand'] ? 'Admin' : 'Member'}</td>
    `)
  }
  html.append(`</table>`);
  return html;
}
