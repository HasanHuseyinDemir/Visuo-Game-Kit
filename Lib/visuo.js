function getPreloadedMedia(method,name){
    ///WIP : her sahnenin yada oyunun kendine has resim dosyaları olabilir ve silinebilir
    let img = //focusedGame.visual.scene.preloaded[method][name] ??
    //focusedGame.preloaded[method][name] ??
    Media.preloaded[method][name];
    if(!img){
        console.error("Visuo Error Preloaded Image : "+name+" is not found! ")
        return
    }
    return img
}

function ev(d,o){
    let output=d
    if(typeof d=="function"){
        output=output(o)
    }
    return output
}


function sharpness(ctx,a){
    ctx.imageSmoothingEnabled = a;
    ctx.mozImageSmoothingEnabled = a;
    ctx.webkitImageSmoothingEnabled = a; 
    ctx.msImageSmoothingEnabled = a;
}

const drawTypes = {
    /**içeri giren objeler içindeki visual objesidir */
    invisible(){},
    custom(cf,context,self,game){
        isF(self.visual.draw,{cf,context,self,game})
    },
    shape(cf, context,self,game) {
        let sG={self,game,scene:game.visual.scene}
        let obj = {
            shape: ev(cf.shape,sG) ?? 'rectangle',
            x: ev(cf.x,sG) ?? 0,
            y: ev(cf.y,sG) ?? 0,
            z: ev(cf.z,sG) ?? 0,
            color: ev(cf.color,sG) ?? 'black',
            width: ev(cf.width,sG) ?? 100,
            height: ev(cf.height,sG) ?? 100,
            radius: ev(cf.radius,sG) ?? 50,
            points: ev(cf.points,sG) ?? [],
            sides: ev(cf.sides,sG) ?? 3,
            angle: ev(cf.angle,sG) ?? 0,
            flipY:ev(cf.flipY,sG)??false,
            flipX:ev(cf.flipX,sG)??false,
        };
        if (shapeTypes[obj.shape]) {
            shapeTypes[obj.shape](obj, context); //DRAW FONKSIYONU
        } else {
            console.error(`Visuo Shape Error: Shape type '${obj.shape}' is not defined.`);
        }
    },
    text(cf, context,self,game) {
        let sG={self,game,scene:game.visual.scene}
        let obj = {
            text: ev(cf.text,sG) ?? 'Text',
            x: ev(cf.x,sG) ?? 0,
            y: ev(cf.y,sG) ?? 0,
            fontSize: ev(cf.fontSize,sG) ?? 20,
            fontFamily: ev(cf.fontFamily,sG) ?? 'Arial',
            color: ev(cf.color,sG) ?? 'black',
            angle: ev(cf.angle,sG) ?? 0,
            flipY:ev(cf.flipY,sG)??false,
            flipX:ev(cf.flipX,sG)??false,
        };

        context.save();
        context.font = `${obj.fontSize}px ${obj.fontFamily}`;
        const textWidth = context.measureText(obj.text).width;
        const centerX = obj.x + textWidth / 2;
        const centerY = obj.y - obj.fontSize / 2;
        context.translate(centerX, centerY);
        context.rotate(obj.angle * Math.PI / 180);
        context.scale(obj.flipX ? -1 : 1, obj.flipY ? -1 : 1);
        context.fillStyle = obj.color;
        context.fillText(obj.text, -textWidth / 2, obj.fontSize / 2);
        context.restore();
    },
    image(cf, context,self,game) {
        let sG={self,game,scene:game.visual.scene}
        let obj = {
            image: ev(cf.image,sG),
            x: ev(cf.x,sG) ?? 0,
            y: ev(cf.y,sG) ?? 0,
            width: ev(cf.width,sG), 
            height: ev(cf.height,sG),
            angle: ev(cf.angle,sG) ?? 0, 
            flipY:ev(cf.flipY,sG)??false,
            flipX:ev(cf.flipX,sG)??false,
        };
        let img=getPreloadedMedia("images",obj.image).media
        if (img) {
            context.save();
            context.translate(obj.x + (obj.width || img.width) / 2, obj.y + (obj.height || img.height) / 2); 
            context.rotate(obj.angle * Math.PI / 180);
            context.scale(obj.flipX ? -1 : 1, obj.flipY ? -1 : 1);
            
            if (obj.width && obj.height) {
                context.drawImage(img, -obj.width / 2, -obj.height / 2, obj.width, obj.height);
            } else {
                context.drawImage(img, -img.width / 2, -img.height / 2);
            }
            context.restore();
        }
    },
    spriteSheet(cf, context,self,game) {
        let sG={self,game,scene:game.visual.scene}
        let obj = {
            image: ev(cf.image,sG),
            frame: ev(cf.frame,sG) ?? 0, 
            x: ev(cf.x,sG) ?? 0,
            y: ev(cf.y,sG) ?? 0,
            width: ev(cf.width,sG)??0, 
            height: ev(cf.height,sG)??0,
            angle: ev(cf.angle,sG) ?? 0, 
            flipY:ev(cf.flipY,sG)??false,
            flipX:ev(cf.flipX,sG)??false,
        };
        let img=getPreloadedMedia("images",obj.image)
        if (img) {
            let frameX = (obj.frame % (img.width / obj.width)) * obj.width;
            let frameY = Math.floor(obj.frame / (img.width / obj.width)) * obj.height;
            context.save();
            context.translate(obj.x + obj.width / 2, obj.y + obj.height / 2); 
            context.rotate(obj.angle * Math.PI / 180); 
            context.scale(obj.flipX ? -1 : 1, obj.flipY ? -1 : 1);
            context.drawImage(img, frameX, frameY, obj.width, obj.height, -obj.width / 2, -obj.height / 2, obj.width, obj.height); 
            context.restore();
        }
    }
};

const shapeTypes = {
    rectangle(obj, context) {
        context.save(); 
        context.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
        context.rotate(obj.angle * (Math.PI / 180));
        context.fillStyle = obj.color;
        context.fillRect(-obj.width / 2, -obj.height / 2, obj.width, obj.height);
        context.restore();
    },
    polygon(obj, context) {
        if (obj.sides > 2) {
            context.save();
            context.translate(obj.x, obj.y);
            context.rotate(obj.angle * Math.PI / 180);
            context.fillStyle = obj.color;
            context.beginPath();
            let angle = (Math.PI * 2) / obj.sides;
            for (let i = 0; i < obj.sides; i++) {
                let x = obj.radius * Math.cos(angle * i);
                let y = obj.radius * Math.sin(angle * i);
                if (i === 0) {
                    context.moveTo(x, y);
                } else {
                    context.lineTo(x, y);
                }
            }
            context.closePath();
            context.fill();
            context.restore();
        } else {
            console.error("Visuo Shape Error: Polygon Must Have More Than 2 Sides");
        }
    },
    triangle(obj, context) {
        context.save();
        context.translate(obj.x + obj.width / 2, obj.y + obj.height / 2);
        context.rotate(obj.angle * Math.PI / 180);
        context.fillStyle = obj.color;
        context.beginPath();
        context.moveTo(0, -obj.height / 2);
        context.lineTo(obj.width / 2, obj.height / 2);
        context.lineTo(-obj.width / 2, obj.height / 2);
        context.closePath();
        context.fill();
        context.restore();
    },
    circle(obj, context) {
        context.save();
        context.translate(obj.x, obj.y);
        context.rotate(obj.angle * Math.PI / 180);
        context.fillStyle = obj.color;
        context.beginPath();
        context.arc(0, 0, obj.radius, 0, 2 * Math.PI);
        context.closePath();
        context.fill();
        context.restore();
    }
};

const Media={
    preloaded:{
        images:{},
        sounds:{},
    },
    preloadQueue:[],
    preloading:0,
}

async function preloadAll(target,to) {//Target>array>,to<Object>
    Media.preloading++
    const supportedImageFormats = ['jpeg','png','gif','webp'];
    const supportedAudioFormats = ['mp3','wav','ogg', 'aac','m4a','flac'];
    const t=to??Media.preloaded
    const tr=target??Media.preloadQueue
    let loadPromises = tr.map(file => {
      return new Promise((resolve, reject) => {
        let extension = file.src.split('.').pop();
        if (supportedImageFormats.includes(extension)) {
          let img = new Image();
          if(!t.images)t.images={}
          img.onload = () => {
            t.images[file.name] = {
                src:file.src,
                media:img,
            };
            tr.splice([tr.indexOf(file)],1)
            resolve();
          };
          img.onerror = () => reject(`Image file error: ${file.name}`);
          img.src = file.src;
        } else if (supportedAudioFormats.includes(extension)) {
            let audio = new Audio();
            if(!t.sounds)t.sounds={}
            audio.oncanplaythrough = () => {
            t.sounds[file.name] = {
              src:file.src,
              media:audio,
            };
            tr.splice([tr.indexOf(file)],1)
            resolve();
          };
          audio.onerror = () => reject(`Sound file error: ${file.name}`);
          audio.src = file.src;
        } else {
          reject(`This format is supported: ${file.name}`);
        }
      });
    });
  
    try {
        await Promise.all(loadPromises);
    } catch (error) {
        console.error("Preload Error\n", error);
    } finally{
        Media.preloading--
    }
}


function preload(name,src){
    if(name&&src){
      Media.preloadQueue.push({name,src})
      preloadAll()
    }else{
      console.error("Preload Error : Source is not defined")
    }
  }

function layerPriority(x){//X:<Array>
    let nS = false;
    for (let i = 0; i < x.length - 1; i++) {
        if (x[i].visual.z??0 > x[i + 1].visual.z??0) {
            nS = true;
            break;
        }
    }
    if (nS) {
        x.sort((e1, e2) => (e1.visual.z??0) - (e2.visual.z??0));
    }
}

function isF(f,arg){
    return typeof f=="function"?(
        f(arg) , true):
        false
}

function getAdjustedBounds(canvas, e) {
    function map(v,n1,n2,m1,m2){
        return (v-n1)/(n2-n1)*(m2-m1)+m1;
    }
    const rect = canvas.getBoundingClientRect();
    let x, y;
    if (document.fullscreenElement) {
        const ratio = window.innerHeight / canvas.height;
        const offset = (window.innerWidth - (canvas.width * ratio)) / 2;
        x = map(e.clientX - rect.left - offset, 0, canvas.width * ratio, 0, canvas.width);
        y = map(e.clientY - rect.top, 0, canvas.height * ratio, 0, canvas.height);
    } else {
        x = e.clientX - rect.left;
        y = e.clientY - rect.top;
    }
    return { x, y };
}

//buradaki oluşturulan game objelerine gönderir
let games = []//oluşturulan bütün oyunlar burada olacak visuo.games ile erişilebilir
let focusedGame//Burası her oyun odak değişiminde set edilir
const Controls = {
    totalDown: 0,
    pressFreq:25,
    pressRec: {

    },
}

function press() {
    if (focusedGame && Controls.totalDown > 0) {
        let p = Controls.pressRec
        Object.keys(p).forEach((x) => {
            if (p[x]) {
                control(x, 0, "press")
            }
        })
    }
    setTimeout(requestAnimationFrame(press),Controls.pressFreq)//burası visuo ayarlarından press frekansı değiştirilebilir
}
press()


function control(e, o, s) {
    let g = focusedGame
    if (g) {
        if (g.controls && g.controls[s] && g.controls[s][e]) {
            isF(g.controls[s][e], o);
        }
        if (g.visual && g.visual.scene) {
            let { scene } = g.visual
            if (g.controls && g.controls[s] && g.controls[s][e]) {
                isF(g.controls[s][e], o);
            }
            scene.objects.forEach(x => {
                if (x.controls && x.controls[s] && x.controls[s][e]) {
                    isF(x.controls[s][e], { ...o,self:x });
                }
            });
        } else {
            console.warn("Visuo Warning:Scene is not determined")
        }
    } else {
        console.warn("Visuo Warning:End-Progress")
    }
}


document.addEventListener("keydown", e => {
    if (!Controls.pressRec[e.code]) {
        Controls.totalDown++
        Controls.pressRec[e.code] = true;
        control(e.code, { game: focusedGame, scene: focusedGame.visual.scene, key: e }, "down")
    }
});

document.addEventListener("keyup", e => {
    if (Controls.pressRec[e.code]) {
        Controls.totalDown--
        Controls.pressRec[e.code] = false
        control(e.code, { game: focusedGame, scene: focusedGame.visual.scene, key: e }, "up")
    }
});


// Mouse click recorder
document.addEventListener('mousedown', function (e) {
    const bounds = getAdjustedBounds(focusedGame.visual.canvas, e);
    let o = { game: focusedGame, scene: focusedGame.visual.scene, pos: bounds }
    Controls.totalDown++
    switch (e.button) {
        case 0:
            Controls.pressRec.mouseLeft = true
            control("mouseLeft", o, "down")
            break;
        case 1:
            Controls.pressRec.mouseMiddle = true
            control("mouseMiddle", o, "down")
            break;
        case 2:
            Controls.pressRec.mouseRight = true
            control("mouseRight", o, "down")
            break;
    }
});

// Mouse release recorder
document.addEventListener('mouseup', function (e) {
    const bounds = getAdjustedBounds(focusedGame.visual.canvas, e);
    let o = { game: focusedGame, scene: focusedGame.visual.scene, pos: bounds }
    Controls.totalDown--
    switch (e.button) {
        case 0:
            Controls.pressRec.mouseLeft = false
            control("mouseLeft", o, "up")
            break;
        case 1:
            Controls.pressRec.mouseMiddle = false
            control("mouseMiddle", o, "up")
            break;
        case 2:
            Controls.pressRec.mouseRight = false
            control("mouseRight", o, "up")
            break;
    }

});

document.addEventListener('mousemove', function (e) {
    let bounds = getAdjustedBounds(focusedGame.visual.canvas, e);
    let o = { game: focusedGame, scene: focusedGame.visual.scene, pos: bounds }
    isF(focusedGame.controls.mouseMove, o)
    focusedGame.visual.scene.objects.forEach(x => {
        if (x.controls) {
            isF(x.controls.mouseMove, { ...o, self: x })
        }
    })
});

document.addEventListener('wheel', (e) => {
    let bounds = getAdjustedBounds(focusedGame.visual.canvas, e);
    let o = { game: focusedGame, scene: focusedGame.visual.scene, pos: bounds }
    if (e.deltaY < 0) {
        isF(focusedGame.controls.mouseWheelUp, o)
        focusedGame.visual.scene.objects.forEach(x => {
            if (x.controls) {
                isF(x.controls.mouseWheelUp, { ...o, self: x })
            }
        })
    }
    if (e.deltaY > 0) {
        isF(focusedGame.controls.mouseWheelDown, o)
        focusedGame.visual.scene.objects.forEach(x => {
            if (x.controls) {
                isF(x.controls.mouseWheelDown, { ...o, self: x })
            }
        })
    }
});

function ControlsInit(game,canvas) {
    canvas.addEventListener("focus", () => {
        isF(game.hooks.onFocus)
        focusedGame = game
    })
    canvas.addEventListener("blur", () => {
        isF(focusedGame.hooks.onBlur)
        Controls.pressRec={}
        if (focusedGame === game) {
            focusedGame = null
        }
    })
    canvas.addEventListener('mouseover', function (e) {
        let o = { game, scene: game.visual.scene, pos: getAdjustedBounds(canvas, e) }
        isF(game.hooks.onMouseOver, o)
        game.visual.scene.objects.forEach(x => {isF(x.onMouseOver, { ...o, self: x })})
    });
    canvas.addEventListener('mouseLeave', function (e) {
        let o = { game, scene: game.visual.scene, pos: getAdjustedBounds(canvas, e) }
        isF(game.hooks.onMouseLeave, o)
        game.visual.scene.objects.forEach(x => {isF(x.onMouseLeave, { ...o, self: x })})
    });
}

function resizeCanvas(canvasObj,obj){
    const v=canvasObj.visual.canvas
    let diff=(v.width!=obj.width)||(v.height!=obj.height)
    v.width=obj.width||v.width;
    v.height=obj.height||v.height;
    if(diff){
        let call={canvasObj,resized:obj}
        isF(canvasObj.hooks.onResize)
        if(canvasObj.scene){
            isF(canvasObj.scene.onResize,call)
        }
    }
}

function step(){
    let e=focusedGame
    let h=e.hooks
    if(Media.preloading){
        isF(h.onLoading,e.visual.scene)
        if(e.scene){
            isF(e.scene.onLoading,e)
        }
        requestAnimationFrame(step)
        return
    }
    if(e){
        let {canvas,scene}=e.visual
        let t=e.temp
        let context=canvas.getContext("2d")
        context.clearRect(0, 0, canvas.width, canvas.height);
        //[STATE] Canvas sayfada değil
        if(!canvas.isConnected){
            t.state=0;
            t.errorMsg="Game is not connected to DOM.";
            isF(e.hooks.isNotConnected,t.errorMsg)
        }
        //[STATE] Canvas çalıştırıldı ama sahne yok 
        if(t.state&&!scene){
            t.state=0;
            t.errorMsg="Scene not determined"
        }
        if(t.errorMsg){
            isF(e.hooks.onError,t.errorMsg)
        }
        //onsceneload ile odaya tekrar geçişte
        if(!scene.isInit){
            scene.isInit=true
            isF(scene.onSceneInit)
        }


        //[STATE] 
        if(!t.state){
            return
        }
        //[STATE] Burası herşey uygun ise 
        if(t.state&&scene){
            let sceneObj=scene.objects

            if(typeof sceneObj=="function"){
                sceneObj=sceneObj({game:e,scene})
            }

            sceneObj.forEach(x=>isF(x.onStep,{game:e,scene,self:x}))
                isF(h.begin,e)
                isF(scene.begin,e)
                //z değerleri sıralama
                layerPriority(scene.objects)//burası değiştirilmeli
                sceneObj.map(o=>{
                    let sO={
                        self:o,
                        game:e,
                        scene:scene
                    }
                    /**Zurnanın zırt dediği yer */
                    isF(o.visual.beforeDraw,sO)
                    if(o.visual/*cullingtest yapılması lazım objeye sahnenin kamera pozisyonuna göre*/){
                        drawTypes[o.visual.type](o.visual,context,o,e)
                        isF(o.visual.onDraw,sO)
                    }else{
                        isF(o.visual.onNotDraw,sO)
                    }
                })
                isF(scene.end,e)
                isF(h.end,e)
                   
    }}
    setTimeout(()=>{requestAnimationFrame(step)},e.settings.wait||0)
}

function createGame(obj){
    let specs={
        temp:{
            errorMsg:null,
            state:0,
            focused:0,
        },

        settings:{
            sleep:obj.sleep||null,
            prioritize:obj.prioritize||true,
            wait:obj.wait,
        },

        visual:{
            canvas:document.createElement("canvas"),
            width:obj.width||640,
            height:obj.height||480,
            scene:obj.scene||null,
        },

        preloaded:{
            images:{},
            sounds:{}
        },
        
        preload:Array.isArray(obj.preload)?obj.preload:[],

        hooks:{
            isNotConnected:obj.isNotConnected,
            begin:obj.begin,
            end:obj.end,
            onError:obj.onError,
            onLoading:obj.onLoading,
            onStop:obj.onStop,
            onResume:obj.onResume,            
            onSceneChange:obj.onSceneChange,
            onResize:obj.onResize,
            onFullscreen:obj.onFullscreen,
            onFocus:obj.onFocus,
            onBlur:obj.onBlur
        },

        actions:{
            resize(width,height){
                resizeCanvas(specs,{width,height})
            },
            play(){
                focusedGame=specs
                if(!specs.temp.state){
                    specs.temp.state=1
                    specs.temp.errorMsg=null
                    isF(specs.visual.scene.onPlay,specs)
                    step()
                }else{
                    console.warn("Already Running")//[ÇEVİR]
                }
            },
            stop(){
                specs.temp.state=0
                isF(specs.visual.scene.onStop,specs)
                if(focusedGame===specs){
                    focusedGame=null
                }
            },
            nextFrame(){
                this.play();
                this.stop();
            },
            makeSharp(){sharpness(specs.visual.canvas.getContext("2d"),false)},
            makeSmooth(){sharpness(specs.visual.canvas.getContext("2d"),true)},
            mount(query){
                document.querySelector(query).appendChild(specs.visual.canvas)
            },
            cursor:{
                set(arg){specs.visual.canvas.style.cursor=arg},
                hide(){specs.visual.canvas.style.cursor = "none"},
                show(){specs.visual.canvas.style.cursor = "default"}
            },
            searchObjectBy:{
                tag(tag){
                    return specs.visual.scene.objects.filter(e=>{
                        if(e.tags&&Array.isArray(e.tags)&&e.tags.length&&e.tags.includes(tag)&&e){
                            return e
                        }
                    })
                },
                name(name){
                    return specs.visual.scene.objects.map(e=>e.name==name)[0]
                },
                id(id){
                    return specs.visual.scene.objects.map(e=>e.id==id)[0]
                }
            },
            setScene(scene){
                specs.visual.scene=scene
                isF(scene.onSceneSelected,specs)
                scene.preloaded?scene.preloaded={images:{},sounds:{}}:0
                preloadAll(scene.preload,scene.preloaded)
            },
            dispatchEvent(event,arg){
                let events={game:specs,event,arg}
                let {scene}=specs.visual
                if(scene){
                    events.scene=scene
                    if(scene.on&&scene.on[event]){
                        isF(scene.on[event],events)
                    }
                    scene.objects.forEach(x=>{
                        if(x.on&&x.on[event]){
                            isF(x.on[event],{...events,self:x})
                        }
                    })
                }
            },
            destroyObject(obj,arg){
                let {scene}=specs.visual
                if(scene){
                    if(scene.objects.includes(obj)){
                        let os=scene.objects
                        let i=os.findIndex((e)=>e===obj)
                        if(i==-1){
                            console.error("Object not found!")
                            return
                        }else{
                            os.splice(i,1)
                            isF(obj.onDestroy,{game:specs,scene,self:obj,arg})
                        }
                    }
                }else{
                    console.error("Scene not determined!")
                }
            }
        },
        controls:obj.controls||{}
    }

    specs.actions.resize(specs.visual.width,specs.visual.height)
    games.push(specs)
    
    
    ControlsInit(specs,specs.visual.canvas)
    if(specs.preload.length){
        preloadAll(specs.preload,specs.preloaded)
    }
    if(specs.visual.scene&&Array.isArray(specs.visual.scene.preload)&&specs.visual.scene.preload.length){
        preloadAll(specs.visual.scene.preload,specs.visual.scene.preloaded)
    }
    return specs
}

export const visuo={
    createGame,
    currentGame:()=>focusedGame,
    games,
    preload,
    drawTypes,
    shapeTypes,
    sound(name){return getPreloadedMedia("sounds",name).media},
    image(name){return getPreloadedMedia("images",name).media},
}