$(function(){

    var heightNode = 10;
    var widthNode = 0;

    var LADDER = {};
    var row = 0;
    var ladder = $('#ladder');
    var ladder_canvas = $('#ladder_canvas');
    var GLOBAL_FOOT_PRINT = {};
    var GLOBAL_CHECK_FOOT_PRINT = {};
    var working = false;
    var resulting = false;
    var blankedInput = false;
    function init(){
        canvasDraw();
    }

    $('#button').on('click', function(){
        var member = $('input[name=member]').val();
        if(member < 2) {
            return alert('최소 두명 이상부터입니다.');
        }
        else if(member > 15){
            return alert('최대 15명까지만 가능합니다.');
        }
        $('#landing').css({
            'opacity': 0
        });
        widthNode = member;
        setTimeout(function(){
            $('#landing').remove();
            init();
        }, 310)
    });


    function canvasDraw(){
        ladder.css({
            'width' : (widthNode-1)*100 + 6,
            'height' : (heightNode-1)*25 + 6,
            'background-color' : '#fff'
        });

        ladder_canvas
        .attr('width', (widthNode-1)*100 + 6)
        .attr('height', (heightNode-1)*25 + 6);

        setDefaultFootPrint();
        reSetCheckFootPrint();
        setDefaultRowLine();
        setRandomNodeData();
        drawDefaultLine();
        //drawNodeLine();
        userSetting();
        resultSetting();
    }

    var userName = "";
    $(document).on('click', 'button.ladder-start', function(e){
        if(working){
            return false;
        }
        $('.dim').remove();
        working = true;
        reSetCheckFootPrint();
        var _this = $(e.target);
        _this.attr('disabled', true).css({
            'color' : '#000',
            'border' : '1px solid #F2F2F2',
            'opacity' : '0.3'
        })
        var node = _this.attr('data-node');
        var color = _this.attr('data-color');
        
        if(resulting==true){
            startLineDrawing2(node, color);
        }else{
            startLineDrawing(node, color);
        }
        
        userName = $('input[data-node="'+node+'"]').val();
    })

    function startLineDrawing(node, color){
        var node = node;
        var color = color;
        
        var x = node.split('-')[0]*1;
        var y = node.split('-')[1]*1;
        var nodeInfo = GLOBAL_FOOT_PRINT[node];

        GLOBAL_CHECK_FOOT_PRINT[node] = true;
        
        var dir = 'r'
        if(y ==heightNode ){
            reSetCheckFootPrint();
            var target = $('input[data-node="'+node+'"]');
            target.css({
                'background-color' : color
            })
            $('#' + node + "-user").text(userName)
             working = false;
            return false;
        }
        if(nodeInfo["change"] ){
            var leftNode = (x-1) + "-" +y;
            var rightNode = (x+1) + "-" +y;
            var downNode = x +"-"+ (y + 1);
            var leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
            var rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
                
            if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                var leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
                var rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
                if(  (leftNodeInfo["change"] &&  leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (rightNodeInfo["change"])&&  leftNodeInfo["draw"]  && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    //Left우선 
                    console.log("중복일때  LEFT 우선");
                    stokeLine(x, y, 'w' , 'l' , color ,3)
                     setTimeout(function(){ 
                         return startLineDrawing(leftNode, color)
                     }, 100);
                }
                else if(  (leftNodeInfo["change"] &&  !!!leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (rightNodeInfo["change"]) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    console.log('RIGHT 우선')
                    stokeLine(x, y, 'w' , 'r' , color ,3)
                    console.log("right")
                    setTimeout(function(){ 
                        return startLineDrawing(rightNode, color)
                     }, 100);
                }
                else if(  (leftNodeInfo["change"] &&  leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (!!!rightNodeInfo["change"]) ){
                    //Left우선 
                    console.log("LEFT 우선");
                    stokeLine(x, y, 'w' , 'l' , color ,3)
                     setTimeout(function(){ 
                         return startLineDrawing(leftNode, color)
                     }, 100);
                }
                 else if(  !!!leftNodeInfo["change"]  &&  (rightNodeInfo["change"]) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    //Right우선 
                    console.log("RIGHT 우선");
                    stokeLine(x, y, 'w' , 'r' , color ,3)
                     setTimeout(function(){ 
                         return startLineDrawing(rightNode, color)
                     }, 100);
                }
                else{
                    console.log('DOWN 우선')
                    stokeLine(x, y, 'h' , 'd' , color ,3)
                    setTimeout(function(){ 
                       return startLineDrawing(downNode, color)
                    }, 100);
                }
            }else{
                console.log('else')
               if(!!!GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                    /// 좌측라인
                    console.log('좌측라인')
                    if(  (rightNodeInfo["change"] && !!!rightNodeInfo["draw"] ) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                        //Right우선 
                        console.log("RIGHT 우선");
                        stokeLine(x, y, 'w' , 'r' , color ,3)
                        setTimeout(function(){ 
                            return startLineDrawing(rightNode, color)
                        }, 100);
                    }else{
                        console.log('DOWN')
                        stokeLine(x, y, 'h' , 'd' , color ,3)
                        setTimeout(function(){ 
                           return startLineDrawing(downNode, color)
                        }, 100);
                    }
                    
               }else if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && !!!GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                    /// 우측라인
                    console.log('우측라인')
                    if(  (leftNodeInfo["change"] && leftNodeInfo["draw"] ) && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ){
                        //Right우선 
                        console.log("LEFT 우선");
                        stokeLine(x, y, 'w' , 'l' , color ,3)
                        setTimeout(function(){ 
                            return startLineDrawing(leftNode, color)
                        }, 100);
                    }else{
                        console.log('DOWN')
                        stokeLine(x, y, 'h' , 'd' , color ,3)
                        setTimeout(function(){ 
                           return startLineDrawing(downNode, color)
                        }, 100);
                    }
               }
            }


        }else{
            console.log("down")
            var downNode = x +"-"+ (y + 1);
            stokeLine(x, y, 'h' , 'd' , color ,3)
            setTimeout(function(){ 
                return startLineDrawing(downNode, color)
             }, 100);
        }
    }


    function startLineDrawing2(node, color){
        var node = node;
        var color = color;
        
        var x = node.split('-')[0]*1;
        var y = node.split('-')[1]*1;
        var nodeInfo = GLOBAL_FOOT_PRINT[node];

        GLOBAL_CHECK_FOOT_PRINT[node] = true;
        
        var dir = 'r'
        if(y ==heightNode ){
            reSetCheckFootPrint();
            var target = $('input[data-node="'+node+'"]');
            target.css({
                'background-color' : color
            })
            $('#' + node + "-user").text(userName)
             working = false;
            return false;
        }
        if(nodeInfo["change"] ){
            var leftNode = (x-1) + "-" +y;
            var rightNode = (x+1) + "-" +y;
            var downNode = x +"-"+ (y + 1);
            var leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
            var rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
                
            if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                var leftNodeInfo = GLOBAL_FOOT_PRINT[leftNode];
                var rightNodeInfo = GLOBAL_FOOT_PRINT[rightNode];
                if(  (leftNodeInfo["change"] &&  leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (rightNodeInfo["change"])&&  leftNodeInfo["draw"]  && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    //Left우선 
                    console.log("중복일때  LEFT 우선");
                    stokeLine(x, y, 'w' , 'l' , color ,3)
                     setTimeout(function(){ 
                         return startLineDrawing2(leftNode, color)
                     }, 10);
                }
                else if(  (leftNodeInfo["change"] &&  !!!leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (rightNodeInfo["change"]) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    console.log('RIGHT 우선')
                    stokeLine(x, y, 'w' , 'r' , color ,3)
                    console.log("right")
                    setTimeout(function(){ 
                        return startLineDrawing2(rightNode, color)
                     }, 10);
                }
                else if(  (leftNodeInfo["change"] &&  leftNodeInfo["draw"] && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ) && (!!!rightNodeInfo["change"]) ){
                    //Left우선 
                    console.log("LEFT 우선");
                    stokeLine(x, y, 'w' , 'l' , color ,3)
                     setTimeout(function(){ 
                         return startLineDrawing2(leftNode, color)
                     }, 10);
                }
                 else if(  !!!leftNodeInfo["change"]  &&  (rightNodeInfo["change"]) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                    //Right우선 
                    console.log("RIGHT 우선");
                    stokeLine(x, y, 'w' , 'r' , color ,3)
                     setTimeout(function(){ 
                         return startLineDrawing2(rightNode, color)
                     }, 10);
                }
                else{
                    console.log('DOWN 우선')
                    stokeLine(x, y, 'h' , 'd' , color ,3)
                    setTimeout(function(){ 
                       return startLineDrawing2(downNode, color)
                    }, 10);
                }
            }else{
                console.log('else')
               if(!!!GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                    /// 좌측라인
                    console.log('좌측라인')
                    if(  (rightNodeInfo["change"] && !!!rightNodeInfo["draw"] ) && !!!GLOBAL_CHECK_FOOT_PRINT[rightNode] ){
                        //Right우선 
                        console.log("RIGHT 우선");
                        stokeLine(x, y, 'w' , 'r' , color ,3)
                        setTimeout(function(){ 
                            return startLineDrawing2(rightNode, color)
                        }, 10);
                    }else{
                        console.log('DOWN')
                        stokeLine(x, y, 'h' , 'd' , color ,3)
                        setTimeout(function(){ 
                           return startLineDrawing2(downNode, color)
                        }, 10);
                    }
                    
               }else if(GLOBAL_FOOT_PRINT.hasOwnProperty(leftNode) && !!!GLOBAL_FOOT_PRINT.hasOwnProperty(rightNode)){      
                    /// 우측라인
                    console.log('우측라인')
                    if(  (leftNodeInfo["change"] && leftNodeInfo["draw"] ) && !!!GLOBAL_CHECK_FOOT_PRINT[leftNode] ){
                        //Right우선 
                        console.log("LEFT 우선");
                        stokeLine(x, y, 'w' , 'l' , color ,3)
                        setTimeout(function(){ 
                            return startLineDrawing2(leftNode, color)
                        }, 10);
                    }else{
                        console.log('DOWN')
                        stokeLine(x, y, 'h' , 'd' , color ,3)
                        setTimeout(function(){ 
                           return startLineDrawing2(downNode, color)
                        }, 10);
                    }
               }
            }


        }else{
            console.log("down")
            var downNode = x +"-"+ (y + 1);
            stokeLine(x, y, 'h' , 'd' , color ,3)
            setTimeout(function(){ 
                return startLineDrawing2(downNode, color)
             }, 10);
        }
    }



    function userSetting(){
        var userList = LADDER[0];
        var html = '';
        for(var i=0; i < userList.length; i++){
            var color = '#'+(function lol(m,s,c){return s[m.floor(m.random() * s.length)] + (c && lol(m,s,c-1));})(Math,'0123456789ABCDEF',4);
        
            var x = userList[i].split('-')[0]*1;
            var y = userList[i].split('-')[1]*1;
            var left = x * 100 -30
            html += '<div class="user-wrap" style="left:'+left+'"><input type="text" data-node="'+userList[i]+'"><button class="ladder-start" tabindex="-1" style="background-color:'+color+'" data-color="'+color+'" data-node="'+userList[i]+'"></button>';
            html += '</div>'
        }
        ladder.append(html);
    }
    function resultSetting(){
        var resultList = LADDER[heightNode-1];
        console.log(resultList)

        var html = '';
        for(var i=0; i<resultList.length; i++){

            var x = resultList[i].split('-')[0]*1;
            var y = resultList[i].split('-')[1]*1 + 1;
            var node = x + "-" + y;
            var left = x * 100 -30
            html += '<div class="answer-wrap" style="left:'+left+'"><input type="text" data-node="'+node+'">';
            html += '<p id="'+node+'-user"></p>'
            html += '</div>'
        }

        html += '<div id="abc" align="center" style="padding-top:60px"><a href="#" id="bts" style="font-size:20px; font-weight:bold;" target="_self" rel="nofollow noopener">▶ 사다리 시작</a></div>';

        html += '<div class="button_cont" id="button_cont" align="center" style="display: none;"><a class="example_a" id="btcon" href="#" target="_self" rel="nofollow noopener">전체 결과보기</a></div>';
        
        html += '<div align="right" style="margin-top:50px"><a href="#" id="again" style="text-decoration:none; font-size:28px; font-family:Poor Story, cursive; color: #008000; text-shadow: 0 1px 1px #c0c0c0, 0 2px 0 #a8a7a6, 0 3px 0 #8b8a89, 0 4px 0px #7d7b7a, 0 5px 0px #686766, 0 6px 3px #5f5e5d;"><img src="./regame.png" style="width:26px; height:26px;"> 다시하기</a></div>';

        ladder.append(html);

        $('#bts').css({
            'text-decoration' : 'none',
            'color' : '#00bfff'
        });

        $('#btcon').css({
            'color' : '#fff',
            'font-size' : '13px',
            'text-transform': 'uppercase',
            'text-decoration': 'none',
            'background': '#ed3330',
            'padding': '20px',
            'border-radius': '5px',
            'display': 'inline-block',
            'border': 'none',
            'transition': 'all 0.4s ease 0s',
            'cursor' : 'pointer',
            'margin-top' : '50px'
        });

        $('#btcon').hover(function(){
            $(this).css({
                'background': '#434343',
                'letter-spacing': '1px',
                '-webkit-box-shadow': '0px 5px 40px -10px rgba(0,0,0,0.57)',
                '-moz-box-shadow': '0px 5px 40px -10px rgba(0,0,0,0.57)',
                'box-shadow': '5px 40px -10px rgba(0,0,0,0.57)',
                'transition': 'all 0.4s ease 0s',
                'cursor' : 'pointer'
            });
        }, function(){
            $(this).css({
            'color' : '#fff',
            'text-transform': 'uppercase',
            'text-decoration': 'none',
            'background': '#ed3330',
            'padding': '20px',
            'border-radius': '5px',
            'display': 'inline-block',
            'border': 'none',
            'transition': 'all 0.4s ease 0s',
            'cursor' : 'pointer'
            });
        });

        $('#btcon').click(function(){

            $("input").prop('readonly', true);
            
            resulting = true;
            var cnt = -1;
            var timer = setInterval(function(){
                cnt++;
                $("button:eq("+cnt+")").bind("click", function(){
                    ;
                });
    
                $("button:eq("+cnt+")").trigger("click");

                if(cnt==widthNode){
                    
                    clearInterval(timer);
                    callme();
                }
            }, 230);
                

            setTimeout(function(){
                $('#button_cont').css({
                    'opacity': '0',
                    'transition': 'all ease-in-out 0.15s'
                });
                $("#button_cont").remove();

            }, 150);
          
            
            function callme(){

            

            ladder.append('<div id="kk" class="kk" style="height:300px;"><p style="font-size:16px; font-family:NanumGothic; color:darkblue; margin-bottom:40px;">* 결과는...</p></div>');
            

            var kk = $('#kk');
            var tmp = '';
            var tmp2 = '';
            
            var dataList = [];
            var resultList = [];
            var qqq = [];   

            for(var i=0; i<widthNode; i++){
                
                resultList[i] = $('input[data-node="'+i+'-10"]').val();
                qqq[i] = $('#'+i+'-10'+"-user").text();
            }
            

            for(var i=0; i<widthNode; i++){
                tmp = '<h4 class="result">· </h4>';
                kk.append(tmp);
            }

            $('.result').css({
                'font-weight': 'bold',
                'padding': '4px'
            });
            for(var i=0; i<widthNode; i++){
                tmp2 = '<span>';
                tmp2 += qqq[i];
                tmp2 += '&nbsp;&nbsp;&nbsp;→ ';
                tmp2 += resultList[i];
                tmp2 += '</span>';
                $('h4:eq('+i+')').append(tmp2);
            }
            
        } 
            
        });

        $('#bts').click(function(){
            blankedInput = false;
            for(var i=0; i<(widthNode*2); i++){
                if(($('input:eq('+i+')').val())==''){
                    blankedInput = true;
                }
                
            }
            if(blankedInput==true){
                alert('빈칸을 모두 입력해주세요.');
            }else{
                drawNodeLine();
            $("#bts").off('click');

            setTimeout(function(){
                $('#abc').css({
                    'opacity': '0',
                    'transition': 'all ease-in-out 0.15s'
                });
                $("#abc").remove();

            }, 150);

            $("#button_cont").css({
                'display': 'block'
            });
            }
            
        });

        $('#again').click(function(){

            location.reload();
            
        });
    }

    function drawNodeLine(){

        for(var y = 0; y<heightNode; y++){
            for(var x=0; x<widthNode;x++){
                var node = x + '-' + y;
                var nodeInfo = GLOBAL_FOOT_PRINT[node];
                if(nodeInfo["change"] && nodeInfo["draw"]){
                    stokeLine(x, y, 'w', 'r', '#ddd', '2');
                }else{
                    
                }
            }
        }
    }

    function stokeLine(x, y, flag, dir, color, width){
        var canvas = document.getElementById('ladder_canvas');
        var ctx = canvas.getContext('2d');
        var moveToStart = 0, moveToEnd = 0, lineToStart = 0, lineToEnd = 0;
        var eachWidth = 100;
        var eachHeight = 25;
        if(flag == "w"){


            if(dir == "r"){
                ctx.beginPath();
                moveToStart = x * eachWidth;
                moveToEnd = y * eachHeight;
                lineToStart = (x+1) * eachWidth;
                lineToEnd = y * eachHeight;

            }else{
                ctx.beginPath();
                moveToStart = x * eachWidth;
                moveToEnd = y * eachHeight;
                lineToStart = (x-1) * eachWidth;
                lineToEnd = y * eachHeight;
            }
        }else{
            ctx.beginPath();
            moveToStart = x * eachWidth;
            moveToEnd = y * eachHeight;
            lineToStart = x * eachWidth;
            lineToEnd = (y+1) * eachHeight;
        }

        ctx.moveTo(moveToStart + 3, moveToEnd + 2);
        ctx.lineTo(lineToStart + 3, lineToEnd + 2);
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.stroke();
        ctx.closePath();
    }

    function drawDefaultLine(){
        var html='';
        html += '<table>'
        for(var y = 0; y<heightNode-1; y++){
            html += '<tr>';
            for(var x = 0; x < widthNode-1; x++){
                html += '<td style="width:98px; height:25px; border-left:3px solid #484848; border-right:3px solid #484848;"></td>';
            }
            html += '</tr>';
        }
        html += '</table>'
        ladder.append(html);
    }

    function setRandomNodeData(){
        for(var y =0; y < heightNode; y++){
            for(var x =0; x <widthNode ; x++){
                var loopNode = x + "-" + y;
                var rand = Math.floor(Math.random() * 2);
                if(rand == 0){
                    GLOBAL_FOOT_PRINT[loopNode] = {"change" : false , "draw" : false}
                }else{
                    if(x == (widthNode - 1)){
                        GLOBAL_FOOT_PRINT[loopNode] = {"change" : false , "draw" : false} ;    
                    }else{
                        GLOBAL_FOOT_PRINT[loopNode] =  {"change" : true , "draw" : true} ;  ;
                        x = x + 1;
                         loopNode = x + "-" + y;
                         GLOBAL_FOOT_PRINT[loopNode] =  {"change" : true , "draw" : false} ;  ;
                    }
                }
            }
         }
    }

    function setDefaultFootPrint(){

        for(var r = 0; r < heightNode; r++){
            for(var column = 0; column < widthNode; column++){
                GLOBAL_FOOT_PRINT[column + "-" + r] = false;
            }
        }
    }
    function reSetCheckFootPrint(){

        for(var r = 0; r < heightNode; r++){
            for(var column=0; column < widthNode; column++){
                GLOBAL_CHECK_FOOT_PRINT[column + "-" + r] = false;
            }
        }
    }


    function setDefaultRowLine(){

        for(var y = 0; y < heightNode; y++){
            var rowArr = [];
            for(var x = 0; x < widthNode; x++){
                var node = x + "-" + row;
                rowArr.push(node);

                var left = x * 100;
                var top = row * 25;
                var node = $('<div></div>')
                .attr('class', 'node')
                .attr('id', node)
                .attr('data-left', left)
                .attr('data-top', top)
                .css({
                    'position' : 'absolute',
                    'left' : left,
                    'top' : top
                });
                ladder.append(node);
            }
            LADDER[row] = rowArr;
            row++;
        }
    }


});