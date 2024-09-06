//you can use this for recursive functions
function createTimer(d,a) {
    let startTime = Date.now();
    let duration=d
    let alarm=a
    return {
        get isCompleted() {
            let comp=Date.now() - startTime >= duration;
            if(typeof alarm=="function"&&comp){
                alarm()
            }
            return comp
        },
        resetTimer() {
            startTime = Date.now();
        },
        setDuration(newDuration) {
            duration = newDuration;
        },
        restart() {
            this.resetTimer();
        },
        get elapsedTime() {
            return Date.now() - startTime;
        },
        get remainingTime() {
            return Math.max(0, duration - (Date.now() - startTime));
        },
        get duration() {
            return duration;
        },
        setAlarm(f){
            alarm=f
        }
    };
}

//isCompleted çağırıldığında eğer istenilen süre tamamlandıysa true döndürür ve kendini yeniden başlatır 
function createInterval(duration,a) {
    let timer = createTimer(duration);
    let tickCount=0
    let alarm=a
    return {
        get tickCount(){
            return tickCount
        },
        get isCompleted() {
            if (timer.isCompleted) {
                timer.resetTimer();
                if(typeof alarm=="function"){
                    alarm()
                }
                tickCount++
                return true;
            }
            return false;
        },
        resetInterval() {
            timer.resetTimer();
        },
        setDuration(newDuration) {
            timer.setDuration(newDuration);
        },
        restart() {
            timer.restart();
        },
        get elapsedTime() {
            return timer.elapsedTime;
        },
        get remainingTime() {
            return timer.remainingTime;
        },
        get duration() {
            return timer.duration;
        },
        setAlarm(f){
            alarm=f
        }
    };
}

function createTicker(a){
    const cache={
        tickCount:0,
        limit:a??0,
        alarm:null,
        onTick:null,
        update(a){
            let call={count:cache.tickCount,limit:cache.limit}
            if(!a){
                cache.tickCount++
                if(typeof cache.onTick=="function")cache.onTick(call)
            }
            if(cache.tickCount>=cache.limit){
                if(typeof cache.alarm =="function")cache.alarm(call)
                cache.tickCount=0
                return true
            }else{
                return false
            }
        },
        get tick(){return cache.tickCount},
        set tick(arg){
            cache.tickCount=arg
            cache.update(1)
        },
        get isCompleted(){
            return cache.update()
        }
    }
    return cache
}

export {createInterval,createTimer,createTicker}