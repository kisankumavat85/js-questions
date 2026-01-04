const PENDING = "pending";
const FULFILLED = "fulfilled";
const REJECTED = "rejected";

// Microtask scheduler
function runMicrotask(fn) {
  if (typeof queueMicrotask === "function") {
    queueMicrotask(fn);
  } else {
    // Fallback (not true microtask, but best possible)
    Promise.resolve().then(fn);
  }
}

class MyPromise {
  constructor(executor) {
    this.state = PENDING;
    this.value = undefined;

    this.onFulfilledQueue = [];
    this.onRejectedQueue = [];

    const resolve = (val) => {
      if (this.state !== PENDING) return;

      // Handle promise resolution procedure
      if (val instanceof MyPromise) {
        return val.then(resolve, reject);
      }

      this.state = FULFILLED;
      this.value = val;

      runMicrotask(() => {
        this.onFulfilledQueue.forEach((fn) => fn(val));
      });
    };

    const reject = (err) => {
      if (this.state !== PENDING) return;

      this.state = REJECTED;
      this.value = err;

      runMicrotask(() => {
        this.onRejectedQueue.forEach((fn) => fn(err));
      });
    };

    try {
      executor(resolve, reject);
    } catch (err) {
      reject(err);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      const fulfilledHandler = (val) => {
        try {
          if (typeof onFulfilled === "function") {
            const result = onFulfilled(val);
            resolve(result);
          } else {
            resolve(val);
          }
        } catch (err) {
          reject(err);
        }
      };

      const rejectedHandler = (err) => {
        try {
          if (typeof onRejected === "function") {
            const result = onRejected(err);
            resolve(result);
          } else {
            reject(err);
          }
        } catch (error) {
          reject(error);
        }
      };

      if (this.state === PENDING) {
        this.onFulfilledQueue.push(fulfilledHandler);
        this.onRejectedQueue.push(rejectedHandler);
      }

      if (this.state === FULFILLED) {
        runMicrotask(() => fulfilledHandler(this.value));
      }

      if (this.state === REJECTED) {
        runMicrotask(() => rejectedHandler(this.value));
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

const p = new Promise((resolve) => {
  resolve(5);
});

const p2 = new MyPromise((resolve) => resolve(5));

p2.then((val) => {
  console.log("my then 1:", val);
  return new Promise((resolve) => {
    resolve(val + 5);
  });
}).then((val) => {
  console.log("my then 2:", val);
});

p2.then(100).then((val) => console.log("my then 4", val));

p.then((val) => {
  console.log("then 1:", val);
  return new Promise((resolve) => {
    resolve(val + 5);
  });
}).then((val) => {
  console.log("then 2:", val);
});

p.then(100).then((val) => console.log("then 4", val));

// module.exports = MyPromise;
