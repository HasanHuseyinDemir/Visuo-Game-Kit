export function debounceMixin({ delay = 300 } = {}) {
    let timeoutId;
    return {
        debounce:{
            debounce(fn){
                return(...args)=>{
                    clearTimeout(timeoutId);
                    timeoutId = setTimeout(()=>fn(...args), delay);
                };
            }
        }
    };
}
