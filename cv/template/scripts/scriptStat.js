(function ($) {
    'use strict';
    // const fs = require('fs') 
    const regex = /\[.*\]/gm;
    var students = [];
    var liste = [];
    var globalSkills = [];
    var globalNeeds = [];
    window.googleDocCallback = function () { return true; };
    // var fileLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRPYNknmIr5_bU7GfiJtuS_b9fGae7HZwcjAiMoAC24fLzIfxRtXQySMu3E95D3M595D3DYT7NUtvzt/pub?gid=760811187&single=true&output=csv&callback=googleDocCallback";
    var fileLink = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRPYNknmIr5_bU7GfiJtuS_b9fGae7HZwcjAiMoAC24fLzIfxRtXQySMu3E95D3M595D3DYT7NUtvzt/pub?gid=760811187&single=true&output=csv";
    d3.csv("https://docs.google.com/spreadsheets/d/e/2PACX-1vRPYNknmIr5_bU7GfiJtuS_b9fGae7HZwcjAiMoAC24fLzIfxRtXQySMu3E95D3M595D3DYT7NUtvzt/pub?gid=760811187&single=true&output=csv").then(function(data){       
        students = data;
        readFile(students);
    });
    //console.log(data);
    var readFile = function(data) {
        
        data.forEach((eleve, key) => {
            var skillList = [];
            var needsList = [];
            for (let [key, value] of Object.entries(eleve)) {
                var numVal = 0;
                var skill = key.match(regex);
                if(skill){
                    var skillName = skill[0].slice(1, skill[0].length-1);
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
                        needsList.push({
                            "needName": skillName,
                            "value": numVal
                        })
                        var indNeed = globalNeeds.findIndex((need) => need.name === skillName);
                        if(indNeed != -1){
                            globalNeeds[indNeed].value += numVal;
                            switch(numVal){
                                case 100:
                                    // globalNeeds[indSkill].urgent = []
                                    globalNeeds[indNeed].urgent.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                    break;
                                case 75:
                                    // globalNeeds[indSkill].strong = []
                                    globalNeeds[indNeed].strong.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                    break;
                                case 50:
                                    // globalNeeds[indSkill].little = []
                                    globalNeeds[indNeed].little.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                    break;
                                case 25:
                                    // globalNeeds[indSkill].noNeed = []
                                    globalNeeds[indNeed].noNeed.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                    break;
                            }
                        } else {
                            globalNeeds.push({name:skillName, value : numVal, urgent:[], strong: [], little: [], noNeed: []});
                            switch(numVal){
                                case 100:
                                    globalNeeds[globalNeeds.length - 1].urgent.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                    break;
                                case 75:
                                    globalNeeds[globalNeeds.length - 1].strong.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                    break;
                                case 50:
                                    globalNeeds[globalNeeds.length - 1].little.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                    break;
                                case 25:
                                    globalNeeds[globalNeeds.length - 1].noNeed.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                    break;
                            }                            
                        }
                        $('#listeNeed').append("<option value='"+ skillName +"'>" + skillName + "</option>");  
                    } else {
                        skillList.push({
                            "skillName": skillName,
                            "value": numVal
                        });
                        var indSkill = globalSkills.findIndex((skill) => skill.name === skillName);
                        if(indSkill != -1){
                            globalSkills[indSkill].value += numVal;

                            switch(numVal){
                                case 100:
                                        globalSkills[indSkill].expert.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                        break;
                                case 75:
                                        globalSkills[indSkill].good.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                        break;
                                case 50:
                                        globalSkills[indSkill].notion.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                        break;
                                case 25:
                                        globalSkills[indSkill].noSkill.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                        break;
                                        
                            }
                        } else {
                            globalSkills.push({name:skillName, value : numVal, expert: [], good: [], notion: [], noSkill:[]});
                            switch(numVal){
                                case 100:
                                        globalSkills[globalSkills.length-1].expert.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                        break;
                                case 75:
                                        globalSkills[globalSkills.length-1].good.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                        break;
                                case 50:
                                        globalSkills[globalSkills.length-1].notion.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                        break;
                                case 25:
                                        globalSkills[globalSkills.length-1].noSkill.push(eleve['Votre nom'] + " " + eleve['Votre prénom']);
                                        break;
                            }
                            $('#listeComp').append("<option value='"+ skillName +"'>" + skillName + "</option>")
                            
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
                github: eleve['Votre compte GitHub']? eleve['Votre compte GitHub']:'',
                specialite: eleve['Vos spécialités']? eleve['Vos spécialités']:'',
                formation: eleve['Votre formation précédente']? eleve['Votre formation précédente']:'',
                competences: skillList,
                besoins: needsList
            })
            // $('#listeEleve').append("<option value='"+ eleve['N° étudiant'] +"'>" + eleve['Votre nom']+ " " + eleve['Votre prénom'] + "</option>")
            
        });
        console.log("GLOBAL SKIIILS", globalSkills);
        console.log("GLOBAL NEEEDs", globalNeeds);
        // globalNeeds.sort((a,b) => a.value - b.value );
        // globalNeeds.reverse();
        // globalSkills.sort((a,b) => a.value - b.value );
        // globalSkills.reverse();
        console.log("GLOBAL NEEEDs SORTED", globalNeeds);
        console.log("GLOBAL SKIILS SORTED", globalSkills);
        $('#listeComp').change();
        console.log(liste);
        
    };

    $('#listeComp').on('change', function(){
        $("#expertList").html("");
        $("#knowersList").html("");
        $("#notionsList").html("");
        $("#beginnersList").html("");
        console.log("VALUE", this.selectedIndex, globalSkills[this.selectedIndex]);
        var skill = globalSkills[this.selectedIndex];
        skill.expert.forEach(element => {
            $("#expertsList").append("<button type='button' class='btn btn-primary'>" + element + "</button>")
        });
        skill.good.forEach(element => {
            $("#knowersList").append("<button type='button' class='btn btn-success'>" + element + "</button>")
        })

        skill.notion.forEach(element => {
            $("#notionsList").append("<button type='button' class='btn btn-info'>" + element + "</button>")
        })

        skill.noSkill.forEach(element => {
            $("#beginnersList").append("<button type='button' class='btn btn-warning'>" + element + "</button>")
        })

    });

    $('#listeNeed').on('change', function(){
        $("#urgentList").html("");
        $("#strongList").html("");
        $("#littleList").html("");
        $("#noList").html("");
        console.log("VALUE", this.selectedIndex, globalNeeds[this.selectedIndex]);
        var need = globalNeeds[this.selectedIndex];
        need.urgent.forEach(element => {
            $("#urgentList").append("<button type='button' class='btn btn-primary'>" + element + "</button>")
        });
        need.strong.forEach(element => {
            $("#strongList").append("<button type='button' class='btn btn-success'>" + element + "</button>")
        })

        need.little.forEach(element => {
            $("#littleList").append("<button type='button' class='btn btn-info'>" + element + "</button>")
        })

        need.noNeed.forEach(element => {
            $("#noList").append("<button type='button' class='btn btn-warning'>" + element + "</button>")
        })

    });
    // var liste = [];

    // $('#listeEleve').on('change', function(){
    //     // console.log("VALUE", this.selectedIndex, liste[this.selectedIndex])
    //     var ind = this.selectedIndex;
    //     $('#nom').html(liste[ind].nom);
    //     $('#prenom').html(liste[ind].prenom);
    //     $('#email').html(liste[ind].mail);
    //     $('#specialite').html(liste[ind].specialite);
    //     $('#formation').html(liste[ind].formation);
    //     $('#skillsList').html('')


    //     // $('#needsList').html('')
    //     // var strRow = '<div class="row">'
    //     // var strEndDiv = '</div>'
    //     // var str="";
    //     // var p = d3.select("#skillsList").selectAll("p")
    //     // .data(liste[ind].competences)
    //     // .enter()
    //     // .append("div")
    //     // .attr("class", "col-md-12 col-lg-12")
    //     // .html(function(d,i){
    //     //     console.log("D3 I", i, d);
    //     //     // i % 2 == 0 ? str = strRow : str = "";
    //     //     str = "";
    //     //     console.log(str);
    //     //     var processedSkillName = d.skillName.length > 45? d.skillName.slice(0,44)+'...': d.skillName;
    //     //     str +=  '<div class="progress-container progress-primary"><span class="progress-badge" title="' + d.skillName + '">' + processedSkillName + '</span>'
    //     //     str +=      '<div class="progress">'
    //     //     str +=          '<div id="bar' + i + '" class="progress-bar progress-bar-primary" data-aos="progress-full" data-aos-offset="10" data-aos-duration="2000" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="">'
    //     //     str +=          '</div><span class="progress-value" id="comp' + i + '">%</span>'
    //     //     str +=      '</div>'
    //     //     str +=  '</div>'
    //     //     return str;
    //     // });

    //     // var p = d3.select("#needsList").selectAll("p")
    //     // .data(liste[ind].besoins)
    //     // .enter()
    //     // .append("div")
    //     // .attr("class", "col-md-12 col-lg-12")
    //     // .html(function(d,i){
    //     //     console.log("D3 I", i, d);
    //     //     // i % 2 == 0 ? str = strRow : str = "";
    //     //     str = "";
    //     //     console.log(str);
    //     //     var processedNeedName = d.needName.length > 45? d.needName.slice(0,44)+'...': d.needName;
    //     //     str +=  '<div class="progress-container progress-primary"><span class="progress-badge" title="' + d.needName + '">' + processedNeedName + '</span>'
    //     //     str +=      '<div class="progress">'
    //     //     str +=          '<div id="barNeed' + i + '" class="progress-bar progress-bar-primary" data-aos="progress-full" data-aos-offset="10" data-aos-duration="2000" role="progressbar" aria-valuenow="60" aria-valuemin="0" aria-valuemax="100" style="">'
    //     //     str +=          '</div><span class="progress-value" id="need' + i + '">%</span>'
    //     //     str +=      '</div>'
    //     //     str +=  '</div>'    
    //     //     return str;
    //     // });
        
    //     // for(var i = 0; i< liste[ind].competences.length; i++){
    //     //     $('#bar' + i).css('width', liste[ind].competences[i].value + '%');
    //     //     $('#comp' + i).html(liste[ind].competences[i].value + '%');
    //     //     $('#barNeed' + i).css('width', liste[ind].competences[i].value + '%');
    //     //     $('#need' + i).html(liste[ind].competences[i].value + '%');
    //     //}

    // });

    
})(jQuery);