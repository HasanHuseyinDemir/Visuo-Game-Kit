class Store{
    constructor(data){
        this.data=data  
    }
    
    callbackList={
        "*":[],
    }

    update(key,value){
        if(!this.batching){
            this.callbackList[key].forEach(c => c({key,value,data:this.data}));
            this.callbackList["*"].forEach(c=>c({key,value,data:this.data}))
        }
    }

    batching=false
    watching=false
    tempWatchList=[]

    get(key){
        if(this.watching){
            if(!this.tempWatchList.includes(key)){
                this.tempWatchList.push(key)
            }
        }
        return this.data[key]
    }

    set(key, value) {
        if (typeof value === 'object' && !Array.isArray(value)) {
            state[key] = new Store(value);
        } else {
            let vvalue=value
            vvalue=typeof value==="function"?value(this.data[key]):value
            const oldValue = this.get(key);
            if(!this.callbackList[key]){
                this.callbackList[key]=[]
            }
            if (oldValue !== vvalue) {
                this.data[key] = vvalue;
                this.update(key,vvalue)
            }
        }
        return value
    }

    onChange(key, callback) {
        if (!this.callbackList[key]) {
            this.callbackList[key]=[]
        }
        this.callbackList[key].push(callback);
    }

    watch(func){
        this.watching=true;
        let wList=this.tempWatchList
        func(this.data)
        if(wList.length){
            wList=[...new Set(wList)]
            wList.forEach(e=>{
                if(!Array.isArray(this.callbackList[e])){
                    this.callbackList[e]=[]
                }
                if(!this.callbackList[e].includes(func)){
                    this.callbackList[e].push(func)
                }
            })
        }
        this.tempWatchList=[]
        this.watching=false;
    }

    batch(func){
        this.watching=true
        this.batching=true
        func(this.data)
        this.watching=false
        this.batching=false
        let tw=[...new Set(this.tempWatchList)]
        tw.forEach(e=>{
            this.update(e,this.data[e])
        })
        this.tempWatchList=[]
    }
    untrack(func){
        let o=this.watching
        this.watching=false
        func(this.data)
        this.watching=o
    }
}