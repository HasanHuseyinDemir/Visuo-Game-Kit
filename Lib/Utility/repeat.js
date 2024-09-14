export function repeat(action, times) {
    for (let i=0;i<times;i++) {
        action(i);
    }
}

// EXAMPLE
/*repeat(i=>{
    console.log(`count is : ${i}`);
}, 5);*/

export function repeatUntil(condition, action) {
    while (!condition()) {
        action();
    }
}

/*EXAMPLE
let counter=0;
repeatUntil(
    ()=>counter>=5,
    ()=>{
        console.log(`Counter: ${counter}`);
        counter++;
    }
);*/

