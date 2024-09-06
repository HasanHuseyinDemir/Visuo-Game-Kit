export function state(val, onChange) {
    let v=val;
    return [
        () => {
            return v;
        },
        (e) => {
            if (typeof e==="function") {
                e=e({current:e});
            }
            if (v!==e) {
                if (typeof onChange==="function") {
                    onChange({before:v,current:e});
                }
                v=e;
                return v;
            }
        }
    ];
}

/*Example 

    function consoleChanges(e){
        console.log("Changed : "+e.before+" to "+e.current)
    }

    const [counter,setCounter]=state(0,consoleChanges)
    counter()//0
    setCounter(1) // newValue=1 && consoleChanges Triggered
    setCounter((e)=>e*2)//oldValue(1) multiplied by 2  -> newValue:2 and && consoleChangesTriggered

*/