define(["com/init","com/util"],function(init,util) {
  var avalonObj = {};
  var dynamicObj = {};
  require(["domReady!", "mmState"], function () {

    var main = avalon.define({
      $id:"main",
      id:"home",
      tips:""
    });

    //首页
    avalon.state("home", {
      controller: "main",
      url: "/",
      views: {
        "": {templateUrl: "app/home/home.html"}
      },
      onChange: function () {
        main.id = "home";
        main.tips = "这里可以找到我们";
        if(!avalonObj.home){
          avalonObj.home = avalon.define({
            $id:"home"
          });
        }
      },
      onAfterLoad:function(){
        $.AMUI.map.init();
        $('.am-slider').flexslider({itemWidth: 380, slideshow: false});
      }
    });

    //　团队
    avalon.state("team", {
      controller: "main",
      url: "/team",
      views: {
        "": {templateUrl: "app/team/team.html"}
      },
      onChange: function () {
        main.id = "team";
        main.tips = "团队介绍";
        if(!avalonObj.team){
          avalonObj.team = avalon.define({
            $id:"team",
            teamLst:[
              {id:"1",icon:"static/images/temp/t-icon1.png",name:"熊泽1",birthday:"2015年2月5日",position:"苹果公司前任CEO，好牛逼啊好牛逼",skill:"IOS开发，C语言"},
              {id:"2",icon:"static/images/temp/t-icon1.png",name:"熊泽2",birthday:"2015年2月5日",position:"苹果公司前任CEO，好牛逼啊好牛逼",skill:"IOS开发，C语言"},
              {id:"3",icon:"static/images/temp/t-icon1.png",name:"熊泽3",birthday:"2015年2月5日",position:"苹果公司前任CEO，好牛逼啊好牛逼",skill:"IOS开发，C语言"},
              {id:"4",icon:"static/images/temp/t-icon1.png",name:"熊泽4",birthday:"2015年2月5日",position:"苹果公司前任CEO，好牛逼啊好牛逼",skill:"IOS开发，C语言"},
              {id:"5",icon:"static/images/temp/t-icon1.png",name:"熊泽5",birthday:"2015年2月5日",position:"苹果公司前任CEO，好牛逼啊好牛逼",skill:"IOS开发，C语言"}
            ],
            see:function(obj){
              dynamicObj.teamitem = obj.$model;
              avalon.router.go("teamsee");
            }
          });
        }
      }
    });
    avalon.state("teamsee", {
      controller: "main",
      url: "/team/see",
      views: {
        "": {templateUrl: "app/team/team.see.html"}
      },
      onBeforeChange:function(){
        if(!dynamicObj.teamitem){
          alert("非法访问！");
          avalon.router.go("team");
          return false;
        }
      },
      onChange: function () {
        main.id = "team";
        main.tips = "团队介绍";
        if(!avalonObj.teamsee){
          avalonObj.teamsee = avalon.define({
            $id:"teamsee",
            teamitem:{}
          });
        }
        avalonObj.teamsee.teamitem = dynamicObj.teamitem;
      },
      onAfterLoad:function(){
        dynamicObj.teamitem = undefined;
      },
      see:function(obj){

      }
    });

    //　成功案例
    avalon.state("case", {
      controller: "main",
      url: "/case",
      views: {
        "": {templateUrl: "app/case/case.html"}
      },
      onChange: function () {
        main.id = "case";
        main.tips = "看看我们能做什么，看看我们做了些什么。。。。。。";
        if(!avalonObj.case){
          avalonObj.case = avalon.define({
            $id:"case",
            caseLst:[
              {icon:"static/images/temp/picture.png",title:"案例：科技中心"},
              {icon:"static/images/temp/picture1.png",title:"案例：科技中心"},
              {icon:"static/images/temp/picture2.png",title:"案例：科技中心"},
              {icon:"static/images/temp/picture3.png",title:"案例：科技中心"},
              {icon:"static/images/temp/picture4.png",title:"案例：科技中心"}
            ]
          });
        }
      }
    });


    //　通知公告
    avalon.state("notice", {
      controller: "main",
      url: "/notice",
      views: {
        "": {templateUrl: "app/notice/notice.html"}
      },
      onChange: function () {
        main.id = "notice";
        main.tips = "公告：看我们能做什么，看看我们做了些什么。。。。。。";
        if(!avalonObj.notice){
          avalonObj.notice = avalon.define({
            $id:"notice",
            noticeLst:[
              {icon:"static/images/temp/picture3.png",title:"DiamondKarry-砖石站",content:"阿萨洛克圣诞节阿拉斯柯达拉斯柯达拉克丝加达拉斯的拉克丝觉得拉克丝大家拉克丝大家拉克丝觉得拉克丝觉得"},
              {icon:"static/images/temp/picture4.png",title:"DiamondKarry-砖石站",content:"阿萨洛克圣诞节阿拉斯柯达拉斯柯达拉克丝加达拉斯的拉克丝觉得拉克丝大家拉克丝大家拉克丝觉得拉克丝觉得"},
              {icon:"static/images/temp/picture6.png",title:"DiamondKarry-砖石站",content:"阿萨洛克圣诞节阿拉斯柯达拉斯柯达拉克丝加达拉斯的拉克丝觉得拉克丝大家拉克丝大家拉克丝觉得拉克丝觉得"},
              {icon:"static/images/temp/picture3.png",title:"DiamondKarry-砖石站",content:"阿萨洛克圣诞节阿拉斯柯达拉斯柯达拉克丝加达拉斯的拉克丝觉得拉克丝大家拉克丝大家拉克丝觉得拉克丝觉得"},
              {icon:"static/images/temp/picture6.png",title:"DiamondKarry-砖石站",content:"阿萨洛克圣诞节阿拉斯柯达拉斯柯达拉克丝加达拉斯的拉克丝觉得拉克丝大家拉克丝大家拉克丝觉得拉克丝觉得"}
            ]
          });
        }
      }
    });

    //启动路由
    avalon.history.start({
      basepath: "/mmRouter"
    })
  });

  //util.getAjaxData("pub/sportctg", "query", {},function(data){
  //  sport.ctg = data.rs.data;
  //  util.getAjaxData("web/center", "query", {data:{ctgId:sport.ctg[0].id}},function(data){
  //    online.venue = data.rs.data;
  //  });
  //});


  return avalon;
});
