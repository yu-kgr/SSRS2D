
// APIから情報取得する関数
function getSalmonSchedule(){

    var url = "https://splamp.info/salmon/api/now";
    var urlFetchOption = {
      method : 'get',
      contentType : 'application/json'
    };

    var res = UrlFetchApp.fetch(url, urlFetchOption);
    var json = JSON.parse(res.getContentText())

    setEmbedFormat(json);
};

// 取得した内容を整形する関数
function setEmbedFormat(json) {
  for (i = 0; i < 1; i++) {
    var data = json[i];
    var endTs = data.end;
    var endDate = new Date(endTs * 1000);
    var endMonth = endDate.getMonth() + 1;
    var endDay = endDate.getDate();
    var endHour = (endDate.getHours() < 10) ? '0' + endDate.getHours() : endDate.getHours();
    var endMin = (endDate.getMinutes() < 10) ? '0' + endDate.getMinutes() : endDate.getMinutes();
    var end = endMonth + "/" + endDay + " " + endHour + ":" + endMin;
    
    var startTs = data.start;
    var startDate = new Date(startTs * 1000);
    var startMonth = startDate.getMonth() + 1;
    var startDay = startDate.getDate();
    var startHour = (startDate.getHours() < 10) ? '0' + startDate.getHours() : startDate.getHours();
    var startMin = (startDate.getMinutes() < 10) ? '0' + startDate.getMinutes() : startDate.getMinutes();
    var start = startMonth + "/" + startDay + " " + startHour + ":" + startMin;
    var embed = {};
    
    embed.title = "今日のバイトは この場所 だよ";
    embed.description = "ふむ、もうすぐ次の船が 出るようだ。\n参加したい者は :hand_splayed: をあげるんだよ…"
    embed.image = { url: data.stage_img };
    embed.color = 3329330;
    
    embed.fields = [
      {
        name: 'ステージ',
        value: data.stage_ja,
        inline: true
      },
      {
        name: '日時',
        value: start + " ~ " + end,
        inline: true
      },
      {
        name: 'ブキ1',
        value: data.w1_ja,
        inline: true
      },
      {
        name: 'ブキ2',
        value: data.w2_ja,
        inline: true
      },
      {
        name: 'ブキ3',
        value: data.w3_ja,
        inline: true
      },
      {
        name: 'ブキ4',
        value: data.w4_ja,
        inline: true
      },
    ];
    postDiscordEmbed("", embed);
  }
}

// discordに取得した内容をPostする関数
function postDiscordEmbed(msg, embed) {
  
  var prop = PropertiesService.getScriptProperties();
  var res = prop.getgetProperty("WEBHOOK");
  var url = res;
  var jsonData = {
    "content": msg,
    "embeds": [embed],
  }

  var options = {
    method: 'post',
    headers: {"Content-type": "application/json"},
    payload:JSON.stringify(jsonData),
    muteHttpExceptions:true
  };
 
  try {
    var response = UrlFetchApp.fetch(url, options);
    Logger.info(url + ":responscode>>>" + response.getResponseCode()); 
  } catch(e) {
    Logger.log("message:" + e.message + "\nfileName:" + e.fileName + "\nlineNumber:" + e.lineNumber + "\nstack:" + e.stack);
  }
}
