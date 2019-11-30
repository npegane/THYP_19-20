(function ($) {
    'use strict';
    // const fs = require('fs') 
    const regex = /\[.*\]/gm;
    var students = [];
    var liste = [];
    window.googleDocCallback = function () { return true; };
    // var fileLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRPYNknmIr5_bU7GfiJtuS_b9fGae7HZwcjAiMoAC24fLzIfxRtXQySMu3E95D3M595D3DYT7NUtvzt/pub?gid=760811187&single=true&output=csv&callback=googleDocCallback";
    var fileLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRPYNknmIr5_bU7GfiJtuS_b9fGae7HZwcjAiMoAC24fLzIfxRtXQySMu3E95D3M595D3DYT7NUtvzt/pub?gid=760811187&single=true&output=csv";
    d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vRPYNknmIr5_bU7GfiJtuS_b9fGae7HZwcjAiMoAC24fLzIfxRtXQySMu3E95D3M595D3DYT7NUtvzt/pub?gid=760811187&single=true&output=csv").then(function(data){       
        students = data;
        readFile(students);
    });

    function getUrlImg(photo) {  
        if(photo=="#" || photo==null || photo=="") return "#";
        var url = new URL(photo);
        let urlParam = new URLSearchParams(url.search);
        let id = urlParam.get('id');
        //merci à https://stackoverflow.com/questions/50664868/get-pictures-from-google-drive-folder-with-javascript-to-my-website
        return "https://drive.google.com/uc?id="+id+"&export=download"; 
    }
    //console.log(data);
    var readFile = function(data) {
        var globalSkills = [];
        var globalNeeds = []
        data.forEach((eleve, key) => {
            // console.log(i);
            // console.log("IND", eleve);
            var skillList = [];
            var needsList = [];
            for (let [key, value] of Object.entries(eleve)) {
                //console.log(key.match(regex));
                var numVal = 0;
                var skill = key.match(regex);
                // console.log(skill);
                if(skill){
                    var skillName = skill[0].slice(1, skill[0].length-1);
                    // console.log(skillName);
                    switch(value){
                        case 'je suis expert(e)':
                            numVal = 100;
                            break;
                        case 'je connais bien':
                            numVal = 75;
                            break;
                        case 'je connais un peu':
                            numVal = 50;
                            break;
                        case 'je ne connais pas du tout':
                            numVal = 25;
                            break;
                        case 'Pas besoin':
                            numVal = 0;
                            break;
                        case 'Besoin d\'approfondissement':
                            numVal = 50;
                            break;
                        case 'Besoin urgent':
                            numVal = 100;
                            break;
                    }
                    if(value.includes("besoin") || value.includes("Besoin")){
                        // console.log("BESOIN: ", skillName);
                        needsList.push({
                            "needName": skillName,
                            "value": numVal
                        })
                        var indNeed = globalNeeds.findIndex((need) => need.name === skillName);

                        if(indNeed != -1){
                            globalNeeds[indNeed].value += numVal;
                        } else {
                            globalNeeds.push({name:skillName, value : numVal});
                        }
                    } else {
                        skillList.push({
                            "skillName": skillName,
                            "value": numVal
                        });
                        var indSkill = globalSkills.findIndex((skill) => skill.name === skillName);
                        if(indSkill != -1){
                            globalSkills[indSkill].value += numVal;
                        } else {
                            globalSkills.push({name:skillName, value : numVal});
                        }
                    }                    
                }
                
            }
            

            // console.log("COMPETENCEs",eleve[108], eleve[106], eleve[108], compAndroid,compJava, compJavascript, compPHP);
            
            liste.push({
                nom: eleve['Votre nom'],
                prenom: eleve['Votre prénom'],
                mail: eleve['Votre mail'],
                numEtudiant: eleve['N° étudiant'],
                photo: eleve['Votre photo'],
                github: eleve['Votre compte GitHub']? eleve['Votre compte GitHub']:'',
                specialite: eleve['Vos spécialités']? eleve['Vos spécialités']:'',
                formation: eleve['Votre formation précédente']? eleve['Votre formation précédente']:'',
                competences: skillList,
                besoins: needsList
            })
            $('#listeEleve').append("<option value='"+ eleve['N° étudiant'] +"'>" + eleve['Votre nom']+ " " + eleve['Votre prénom'] + "</option>")
            
        });
        console.log("GLOBAL SKIIILS", globalSkills);
        console.log("GLOBAL NEEEDs", globalNeeds);
        globalNeeds.sort((a,b) => a.value - b.value );
        globalNeeds.reverse();
        globalSkills.sort((a,b) => a.value - b.value );
        globalSkills.reverse();
        console.log("GLOBAL NEEEDs SORTED", globalNeeds);
        console.log("GLOBAL SKIILS SORTED", globalSkills);
        $('#listeEleve').change();
        console.log(liste);
        
    };
    // var liste = [];

    $('#listeEleve').on('change', function(){
        // console.log("VALUE", this.selectedIndex, liste[this.selectedIndex])
        var ind = this.selectedIndex;
        $('#nom').html(liste[ind].nom);
        $('#prenom').html(liste[ind].prenom);
        $('#email').html(liste[ind].mail);
        $('#specialite').html(liste[ind].specialite);
        $('#formation').html(liste[ind].formation);
        $('#skillsList').html('')
        $('#needsList').html('')
        $("#photo").css("background-image", "url("+getUrlImg(liste[ind].photo)+")");
        var strRow = '<div class="row">'
        var strEndDiv = '</div>'
        var str="";
        var p = d3.select("#skillsList").selectAll("p")
        .data(liste[ind].competences)
        .enter()
        .append("div")
        .attr("class", "col-md-12 col-lg-12")
        .html(function(d,i){
            console.log("D3 I", i, d);
            // i % 2 == 0 ? str = strRow : str = "";
            str = "";
            console.log(str);
            var processedSkillName = d.skillName.length > 45? d.skillName.slice(0,44)+'...': d.skillName;
            str +=  '<div class="progress-container progress-primary"><span class="progress-badge" title="' + d.skillName + '">' + processedSkillName + '</span>'
            str +=      '<div class="progress">'
            str +=          '<div id="bar' + i + '" class="progress-bar progress-bar-primary" data-aos="progress-full" data-aos-offset="10" data-aos-duration="2000" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="">'
            str +=          '</div><span class="progress-value" id="comp' + i + '">%</span>'
            str +=      '</div>'
            str +=  '</div>'    
            return str;
        });

        var p = d3.select("#needsList").selectAll("p")
        .data(liste[ind].besoins)
        .enter()
        .append("div")
        .attr("class", "col-md-12 col-lg-12")
        .html(function(d,i){
            console.log("D3 I", i, d);
            // i % 2 == 0 ? str = strRow : str = "";
            str = "";
            console.log(str);
            var processedNeedName = d.needName.length > 45? d.needName.slice(0,44)+'...': d.needName;
            str +=  '<div class="progress-container progress-primary"><span class="progress-badge" title="' + d.needName + '">' + processedNeedName + '</span>'
            str +=      '<div class="progress">'
            str +=          '<div id="barNeed' + i + '" class="progress-bar progress-bar-primary" data-aos="progress-full" data-aos-offset="10" data-aos-duration="2000" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="">'
            str +=          '</div><span class="progress-value" id="need' + i + '">%</span>'
            str +=      '</div>'
            str +=  '</div>'    
            return str;
        });
        
        for(var i = 0; i< liste[ind].competences.length; i++){
            $('#bar' + i).css('width', liste[ind].competences[i].value + '%');
            $('#comp' + i).html(liste[ind].competences[i].value + '%');
            $('#barNeed' + i).css('width', liste[ind].competences[i].value + '%');
            $('#need' + i).html(liste[ind].competences[i].value + '%');
        }

    });

    
})(jQuery);