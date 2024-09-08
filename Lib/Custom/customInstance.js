export function setCustomInstance(control) {
    return class {
        static [Symbol.hasInstance](instance) {
            return control(instance);
        }
    };
}
//EXAMPLE Even Odd Number 
/*
#2 Example
const odd=setCustomInstance(numbers.odd)
const even=setCustomInstance(numbers.even)

const MathInstances={
  odd:setCustomInstance((e)=>e%2),
  even:setCustomInstance((e)=>!(e%2))
}

4 instanceof MathInstances.even => true
 */