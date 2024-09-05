export const random={
    pick(array){
        let pickIndex=rand.int(0,array.length-1)
        return array[pickIndex]
    },
    bool(){
        return !!rand.int(0,1);
    },
    int(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    float(min, max) {
        return Math.random() * (max - min) + min;
    },
    hex() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
    }
}