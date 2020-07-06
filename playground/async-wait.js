const { PromiseProvider } = require("mongoose")

const add = (a, b) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if(a < 0 || b < 0) {
                return reject('no negatives');
            }
            resolve(a + b);
        }, 2000)
    })
}

//promise chaining approach for add
add(1, 1).then((sum) => {
    console.log(sum);
    return add(sum, 4);//continuing the promise chain
}).then((sum2 => {
    console.log(sum2);
})).catch((e) => {//if promise is rejected
    console.log(e);
});

//using async and await the above can be written as
const doWork = async() => {
    const sum = await add(1, 10);
    const sum2 = await add(sum, 40);
    const sum3 = await add(sum2, 50);
    return sum3;
}

doWork().then((result) => {
    console.log(result);
}).catch((e) => {
    console.log(e);
})