/*jslint browser: true*/
/*global $, jQuery, alert, console*/
$(function () {
    "use strict";
    
    var now = new Date(),
        month = now.getMonth() + 1,
        today = now.getFullYear() + "" + month + "" + now.getDate(),
        j = 0,
        eColors = [],
        uColors = [],
        sColors = [],
        title = [],
        url = [],
        items = [],
        users = [],
        edits = [],
        score = [];
    
    $("table").stupidtable();
    
    $('#date-select').datepicker({ dateFormat: "yymmdd" });
    $('#date-select').datepicker("setDate", today);

    $('#go').click(function () {
//        $('#result').html('');
        
        var date = $('#date-select').val(),
            jsonAddress = 'http://weekly.hatnote.com/data/en/' + date + '/weeklypedia_en_' + date + '.json';
        
        $.getJSON(jsonAddress, function (data) {
            var i = 0,
                k = 0;
            for (i = 0; i < data.mainspace.length; i++) {
                title.push(data.mainspace[i].title_s);
                url.push("https://en.wikipedia.org/wiki/" + data.mainspace[i].title);
                edits.push(data.mainspace[i].edits);
                users.push(data.mainspace[i].users);
                score.push(Math.round((users[i] / edits[i]) * 1000) / 10);
                items.push("<tr id='entry" + i + "'><td class='rank'>" + (i + 1) + "</td><td><a href='" + url[i] + "'>" + title[i] + "</a></td><td class='edits'><span>" + edits[i] + " edits</span></td><td class='users'><span>" + users[i] + " users</td><td class='score'><span>" + score[i] + "</td></tr>");
            }
            
            $("#result").append("<thead><tr><th>#</th><th data-sort='string' class= 'aheader'>Article</th><th data-sort='int' class= 'eheader'>Edits</th><th data-sort='int' class= 'uheader'>Users</th><th data-sort='float' class= 'sheader'>Score</th></tr></thead>");
            $('<tbody/>', {
                "class": "result-list",
                html: items.join("")
            }).appendTo("#result");
            
            var maxEdits = Math.max.apply(Math, edits),
                maxUsers = Math.max.apply(Math, users),
                maxScore = Math.max.apply(Math, score);
            
            for (k = 0; k < title.length; k++) {
                eColors.push("RGBA(214, 67, 48, " + edits[k] / maxEdits + ")");
                uColors.push("RGBA(186, 94, 232, " + users[k] / maxUsers + ")");
                sColors.push("RGBA(94, 232, 35, " + (score[k] / maxScore) + ")");
                $(".edits").slice(k, k + 1).css({"background": eColors[k] });
                $(".users").slice(k, k + 1).css({"background": uColors[k] });
                $(".score").slice(k, k + 1).css({"background": sColors[k] });
            }
        });
    });
    
    $("table").click(function () {
        for (j = 0; j < title.length; j++) {
            $(".rank").slice(j, j + 1).html("<p>" + (j + 1) + "</p>");
        }
    });
});