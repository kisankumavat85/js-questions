const STATE = {
  FULFILLED: "fulfilled",
  REJECTED: "rejected",
  PENDING: "pending",
}

class MyPromise {
  #thenCbs = []
  #catchCbs = []
  #state = STATE.PENDING
  #value
  #resolveBind = this.#resolve.bind(this)
  #rejectBind = this.#reject.bind(this)

  constructor(cb) {
    try {
      cb(this.#resolveBind, this.#rejectBind)
    } catch (e) {
      this.#reject(e)
    }
  }

  #runCallbacks() {
    if (this.#state === STATE.FULFILLED) {
      this.#thenCbs.forEach(callback => {
        callback(this.#value)
      })

      this.#thenCbs = []
    }

    if (this.#state === STATE.REJECTED) {
      this.#catchCbs.forEach(callback => {
        callback(this.#value)
      })

      this.#catchCbs = []
    }
  }

  #resolve(value) {
    queueMicrotask(() => {
      if (this.#state !== STATE.PENDING) return

      if (value instanceof MyPromise) {
        value.then(this.#resolveBind, this.#rejectBind)
        return
      }

      this.#value = value
      this.#state = STATE.FULFILLED
      this.#runCallbacks()
    })
  }

  #reject(value) {
    queueMicrotask(() => {
      if (this.#state !== STATE.PENDING) return

      if (value instanceof MyPromise) {
        value.then(this.#resolveBind, this.#rejectBind)
        return
      }

      if (this.#catchCbs.length === 0) {
        throw new UncaughtPromiseError(value)
      }

      this.#value = value
      this.#state = STATE.REJECTED
      this.#runCallbacks()
    })
  }

  then(thenCb, catchCb) {
    return new MyPromise((resolve, reject) => {
      this.#thenCbs.push(result => {
        if (thenCb == null) {
          resolve(result)
          return
        }

        try {
          resolve(thenCb(result))
        } catch (error) {
          reject(error)
        }
      })

      this.#catchCbs.push(result => {
        if (catchCb == null) {
          reject(result)
          return
        }

        try {
          resolve(catchCb(result))
        } catch (error) {
          reject(error)
        }
      })

      this.#runCallbacks()
    })
  }

  catch(cb) {
    return this.then(undefined, cb)
  }

  finally(cb) {
    return this.then(
      result => {
        cb()
        return result
      },
      result => {
        cb()
        throw result
      }
    )
  }

  static resolve(value) {
    return new Promise(resolve => {
      resolve(value)
    })
  }

  static reject(value) {
    return new Promise((resolve, reject) => {
      reject(value)
    })
  }

  static all(promises) {
    const results = []
    let completedPromises = 0
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i]
        promise
          .then(value => {
            completedPromises++
            results[i] = value
            if (completedPromises === promises.length) {
              resolve(results)
            }
          })
          .catch(reject)
      }
    })
  }

  static allSettled(promises) {
    const results = []
    let completedPromises = 0
    return new MyPromise(resolve => {
      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i]
        promise
          .then(value => {
            results[i] = { status: STATE.FULFILLED, value }
          })
          .catch(reason => {
            results[i] = { status: STATE.REJECTED, reason }
          })
          .finally(() => {
            completedPromises++
            if (completedPromises === promises.length) {
              resolve(results)
            }
          })
      }
    })
  }

  static race(promises) {
    return new MyPromise((resolve, reject) => {
      promises.forEach(promise => {
        promise.then(resolve).catch(reject)
      })
    })
  }

  static any(promises) {
    const errors = []
    let rejectedPromises = 0
    return new MyPromise((resolve, reject) => {
      for (let i = 0; i < promises.length; i++) {
        const promise = promises[i]
        promise.then(resolve).catch(value => {
          rejectedPromises++
          errors[i] = value
          if (rejectedPromises === promises.length) {
            reject(new AggregateError(errors, "All promises were rejected"))
          }
        })
      }
    })
  }
}

class UncaughtPromiseError extends Error {
  constructor(error) {
    super(error)

    this.stack = `(in promise) ${error.stack}`
  }
}


const p2 = new MyPromise((resolve, r) => r(5));

p2.then((val) => {
  console.log("my then 1:", val);
  return new Promise((resolve) => {
    resolve(val + 5);
  });
}).then((val) => {
  console.log("my then 2:", val);
});

p2.then(100).then((val) => console.log("my then 4", val));
const p = new Promise((resolve) => {
  resolve(5);
});

p.then((val) => {
  console.log("then 1:", val);
  return new Promise((resolve) => {
    resolve(val + 5);
  });
}).then((val) => {
  console.log("then 2:", val);
});

p.then(100).then((val) => console.log("then 4", val));

// module.exports = MyPromise