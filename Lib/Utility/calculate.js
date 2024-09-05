function angleBetweenPoints(point1, point2) {
    const dx = point2.x - point1.x;
    const dy = point2.y - point1.y;
    const angleInRadians = Math.atan2(dy, dx);
    const angleInDegrees = angleInRadians * (180 / Math.PI);
    return angleInDegrees;//deg
}

function collisionDetectRect(o1, o2) {
    let ob1 = {
        x: ev(o1.x) ?? 0,
        y: ev(o1.y) ?? 0,
        width: ev(o1.width) ?? 0,
        height: ev(o1.height) ?? 0
    }
    let ob2 = {
        x: ev(o2.x) ?? 0,
        y: ev(o2.y) ?? 0,
        width: ev(o2.width) ?? 0,
        height: ev(o2.height) ?? 0
    }

    if (ob1.x < ob2.x + ob2.width &&
        ob1.x + ob1.width > o2.x &&
        ob1.y < ob2.y + ob2.height &&
        ob1.y + ob1.height > ob2.y) { return true } else {
        return false
    }
}
function collisionDetectCircle(c1, c2) {
    const dx = c1.x - c2.x;
    const dy = c1.y - c2.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radiusSum = c1.radius || c1.width/2 + c2.radius || c2.width/2;
    return distance <= radiusSum;
}

function collisionTest(a,b){
    if(a.shape=="circle"&&b.shape=="circle"){
        return collisionDetectCircle(a,b)
    }else{
        return collisionDetectRect(a,b)
    }
}

function lerp(a1, a2, t) {
    if (a1.length !== a2.length) {
        console.error("Array lengths must match.");
    }
    return arr1.map((val, index) => val + t * (arr2[index] - val));
}

function distanceBetween(obj1, obj2) {
    const dx = obj2.x - obj1.x;
    const dy = obj2.y - obj1.y;
    return Math.sqrt(dx * dx + dy * dy);
}

export {distanceBetween,lerp,collisionDetectCircle,collisionDetectRect,angleBetweenPoints,collisionTest}