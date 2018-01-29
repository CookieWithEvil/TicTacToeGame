var game = {
   turn1: true,
   user1Sign: "", user2Sign: "",
   user1Wins: 0, user2Wins: 0,
   playWithComputer: true,
   arr : [["","",""],["","",""],["","",""]],
   freeCells: 9, centerCorners: 5,
   //METHODS
   placeMark: function(target){
      var i, j;//indexes of row & cell
      var sign = (this.turn1) ? this.user1Sign : this.user2Sign;
      $(target).html("<h1 class='mark'>"+sign+"</h1>");      
      if(typeof target == "object"){
         i = target.parentNode.id.slice(-1); j = target.className.slice(-1);
      }else if(typeof target == "string"){
         i = target[3]; j = target[8];
      }
      if(((+i) !== 1 && (+j) !== 1)||((+i) === 1 && (+j) === 1)) this.centerCorners--;
      this.arr[+i][+j] = sign; 
      this.freeCells--;
   },
   getStripes: function(str){
      var harr = [];
      switch(str){
         case "horizontal":{
            harr = this.arr;
         }break;
         case "diagonal":{
            harr = [[this.arr[0][0],this.arr[1][1],this.arr[2][2]],
                   [this.arr[0][2],this.arr[1][1],this.arr[2][0]]];
         }break;
         case "vertical":{
            for(var i=0; i<this.arr.length; i++){
               harr.push([]);
               for(var j=0; j<this.arr.length;j++){
                  harr[i][j] = this.arr[j][i];    
               }
            }
         }
      }      
      return harr;
   },
   checkWinner: function(sign, str){      
      var harr = this.getStripes(str);
      for(var i=0,j=0;i<harr.length;i++){
         if(harr[i][0] === sign &&
            harr[i][1] ===sign && harr[i][2] === sign){
            if(this.user1Sign === sign){               
               this.user1Wins++;
               $("#wins-num-1").html(this.user1Wins); 
            }else{               
               this.user2Wins++;
               $("#wins-num-2").html(this.user2Wins);           
            }
            this.winMessage(sign);
            return true;   
         }
      }
      if(str === "vertical" && this.freeCells === 0){         
         this.winMessage();
         return true;
      }else{
         switch(str){
            case "horizontal":{
               return this.checkWinner(sign, "diagonal");
            }break;
            case "diagonal":{
               return this.checkWinner(sign, "vertical");
            }break;
         }
      }
      return false;
   },
   winMessage: function(sign){
      $("#turns").css("visibility", "hidden");
      $("#win-message").css("display", "block");
      if(sign === undefined){
         $("#win-message").html("<h1>It's a draw</h1>");
         this.turn1 = (this.user1Sign === "X")? true : false;
      }else{
         $("#win-message").html("<h1>"+sign+" wins!</h1>"); 
         this.turn1 = (this.user1Sign === sign)? true : false;
      }           
   },
   //COMPUTER MOVES
   dontLetWin: function(str, currSign){      
      var numSigns = 0;
      var freei = null, freej = null;
      var harr = this.getStripes(str);
      for (var i = 0; i < harr.length; i++){
        numSigns = 0;
        freei = null; freej = null;
        harr[i].reduce(function(a,c,index){
           if(c === currSign){
              numSigns++;
           }
           if(c === ""){
              switch(str){
                 case "horizontal":{
                    freej = (a === "") ? index-1 : index;
                    freei = i;
                 }break;
                 case "diagonal":{
                    if(i === 0){
                       freej = (a === "") ? index-1 : index;
                       freei = freej;
                    }else{
                       freei = (a === "") ? index-1 : index;
                       switch(freei){
                          case 0:{
                             freej = 2;
                          }break;
                          case 1:{
                             freej = 1;
                          }break;
                          case 2:{
                             freej = 0;
                          }break;
                       }
                    }
                 }break;
                 case "vertical":{
                    freei = (a === "") ? index-1 : index;
                    freej = i;
                 }break;
              }
           }
        }, harr[0]);
         if(numSigns === 2 && (freei !== null || freej !== null)){        
            this.placeMark("#r-"+freei+" .t-"+freej);
            return;
         }
         if(i === harr.length-1){
            switch(str){
               case "horizontal":{
                  return this.dontLetWin("diagonal", currSign);
               }break;
               case "diagonal":{
                  return this.dontLetWin("vertical", currSign);
               }break;
               case "vertical":{
                  if(currSign === this.user2Sign){
                     return this.dontLetWin("horizontal", this.user1Sign);
                  }else{
                     return;
                  }             
               }break;
            }
         }
      }
   },
   randomCell: function(){
      var harr = [];
      for(var i = 0; i < this.arr.length; i++){
         for(var j = 0; j < this.arr.length; j++){
            if(this.arr[i][j] === ""){
               harr.push("#r-"+i+" .t-"+j);
            }
         }
      }
      var rand = Math.round(Math.random() * (harr.length-1));
      this.placeMark(harr[rand]);
   },
   putInLastCell: function(){
      for(var i=0; i<this.arr.length; i++){
         for(var j=0; j<this.arr.length; j++){
            if(this.arr[i][j] === ""){
               this.placeMark("#r-"+i+" .t-"+j);
               return;
            }            
         }
      }
   },
   placeCenterCorner: function(){
      var r1, r2, h;
      if(this.centerCorners > 0){
         do{         
            r1 = Math.round(Math.random() * 2 - 0);
            if(r1 === 1) r2 = 1;
            else{ 
               h = Math.round(Math.random() * 2 - 0);
               r2 = (h === 1) ? 0 : h;
            }         
         }while(this.arr[r1][r2] === this.user1Sign ||
                this.arr[r1][r2] === this.user2Sign);
      
          this.placeMark("#r-"+r1+" .t-"+r2);
      }else{
         this.randomCell();
      }
   },
   computerTurn: function(){
      if(this.freeCells === 1){
         this.putInLastCell();
      }
      else{
         var num = this.freeCells;
         this.dontLetWin("horizontal", this.user2Sign);
      }      
      if(this.freeCells === num--){
         this.placeCenterCorner();
      }
      this.turn1 = true;
      if(game.checkWinner(game.user2Sign, "horizontal")){
         return;
      }
      var timer = setTimeout(function(){
         $("#turn-1").css("opacity", "1");
         $("#turn-2").css("opacity", "0");
      }, 700);  
      //}      
   }
}//END
//GAME-PROCESS
$("#game-table").click(function(){
   var target  = event.target;
   if(target.tagName === 'TD'){
      game.placeMark(target); 
      if(game.turn1){
         game.turn1 = false;          
         game.checkWinner(game.user1Sign, "horizontal");
            $("#turn-2").css("opacity", "1");
            $("#turn-1").css("opacity", "0");
         if(game.playWithComputer){
            var timer = setTimeout(function(){
               game.computerTurn();               
            },500);
         }         
      }else if(!game.playWithComputer && !game.turn1){        
         game.turn1 = true;         
         game.checkWinner(game.user2Sign, "horizontal");
         if(game.freeCells !== 9){
            $("#turn-1").css("opacity", "1");
            $("#turn-2").css("opacity", "0");
         }
      }      
   }
});
//MENU
$("#one-player, #two-players").click(function(){
   if(this.id.slice(0,3) === "one"){
      game.playWithComputer = true;
      $("#turn-1 h3").html("Your Turn!");
      $("#turn-2 h3").html("Computer Turn!");
      $("#p1 #player-n-1").html("You");
      $("#p2 #player-n-2").html("Computer");
      $("#second-pick h2").html("Would you like to be X or O?");
   }else{
      game.playWithComputer = false;      
      $("#second-pick h2").html("Player-1 will be:");
   }   
   $("#first-pick").css("display", "none");
   $("#second-pick").css("display", "block");
});
$("#X, #O").click(function(){     
   game.user1Sign = ""+this.id;   
   game.user2Sign = (game.user1Sign === "X") ? "O" : "X";
   $("#second-pick").css("display", "none");
   $("#game-table").css("display", "block");
   $("#reset").css("display", "inline");
   $("#turns").css("opacity", "1");
   $("#turn-1 h3").html(game.user1Sign+" Turn!");
   $("#turn-2 h3").html(game.user2Sign+" Turn!");
   $("#show-points").css("visibility", "visible");  
   if(!game.playWithComputer){
      $("#p1 #player-n-1").html("Player-"+game.user1Sign);
      $("#p2 #player-n-2").html("Player-"+game.user2Sign);
   }   
   if(game.user1Sign === "X"){
      game.turn1 = true;
      $("#turn-1").css("opacity", "1");
      $("#turn-2").css("opacity", "0");      
   }else{
      game.turn1 = false;
      $("#turn-1").css("opacity", "0");
      $("#turn-2").css("opacity", "1");
      if(game.playWithComputer){
         game.computerTurn();
      }
   }
});
$("#back").click(function(){
   $("#second-pick").css("display", "none");
   $("#first-pick").css("display", "block");
});
$("#reset").click(function(){
   $(".mark").remove();//it isn't in html-the inner class of table cell
   game.arr = [["","",""],["","",""],["","",""]];
   game.freeCells = 9;
   game.centerCorners = 5;   
   game.user1Wins = game.user2Wins = 0;
   $("#second-pick, #game-table, #reset").css("display", "none");
   $("#turns, #turn-1, #turn-2").css("opacity", "0");
   $("#wins-num-1, #wins-num-2").html("0");
   $("#first-pick").css("display", "block");
   $("#show-points").css("visibility", "hidden");
   $("#win-message").css("display", "none");
});
$("#win-message").click(function(){
   $("#turns").css("visibility", "visible");
   $("#win-message").css("display", "none");
   $(".mark").remove();//it isn't in html-the inner class of table cell
   game.arr = [["","",""],["","",""],["","",""]];
   game.freeCells = 9;
   game.centerCorners = 5;  
   if(game.turn1 === true){
      $("#turn-2").css("opacity", "0");
      $("#turn-1").css("opacity", "1");
   }else if(!game.playWithComputer && !game.turn1){
      $("#turn-1").css("opacity", "0");
      $("#turn-2").css("opacity", "1");
   }
   if(game.playWithComputer && game.turn1===false){      
      game.computerTurn();
   }
});