function updateSmugmugCookies() {
  let x = (UrlFetchApp.fetch("https://highlanderbandphotos.smugmug.com/"));
  let token = (x.getContentText().substring(x.getContentText().indexOf('"csrfToken":"')).substring(13, 45));
  let cookies = x.getAllHeaders()['Set-Cookie'];
  for (let i = 0; i < cookies.length; i++) {
    cookies[i] = cookies[i].split(';')[0];
  }
  console.log(cookies)
  let smsess = (cookies[1].substring(7));
  let spc = cookies[0].substring(3);
  UrlFetchApp.fetch("https://highlanderbandphotos.smugmug.com/services/api/json/1.4.0/?", {
    "headers": {
      "accept": "application/json",
      "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
      "cookie": "SMSESS=" + smsess + "; sp=" + spc
    },
    "payload": "NodeID=r5KBt&Password=[password]&Remember=0&method=rpc.node.auth&_token=" + token,
    "method": "POST",
  });
  // sp.setProperty('smugmugCookies', JSON.stringify([smsess, spc]));
  return {smsess: smsess, spc: spc}
}

function GetRandomBrassImage() {
  let cookies = updateSmugmugCookies();
  console.log(cookies)
  const response = JSON.parse(UrlFetchApp.fetch("https://highlanderbandphotos.smugmug.com/services/api/json/1.4.0/?galleryType=album&albumId=254338499&albumKey=SC2V5X&nodeId=pc3RMN&PageNumber=0&imageId=0&imageKey=&returnModelList=true&PageSize=2000&imageSizes=X2%2CX3&method=rpc.gallery.getalbum", {
    "headers": {
      "accept": "application/json",
      "cookie": `sp=${cookies['spc']};  SMSESS=${cookies['smsess']}`
    }
  }));
  console.log(response)
  let randPhotoIdx = Math.floor(Math.random() * response['Images'].length+1);
  if(randPhotoIdx === response['Images'].length) return {url: 'https://i.groupme.com/768x1024.jpeg.bf11270bf3f042bb93e59a74fcb5f7ee.large', description: 'f o o t'}
  let imageKey = response['Images'][randPhotoIdx].ImageKey;
  let imageUrl = `https://photos.smugmug.com/photos/i-${imageKey}/20/X5/i-${imageKey}-X5.jpg`;

  let imageDescription = response['Images'][randPhotoIdx]['PhotoBy']['album']['name'];
  imageDescription = imageDescription ? imageDescription : '';
  console.log({url: imageUrl, description: imageDescription});
  return ({url: imageUrl, description: imageDescription});
}
