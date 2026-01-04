// const user = {
//   name: "Kisan",
//   lastName: "Kumavat",
//   printName() {
//     console.log(this.name + "lal");
//   },
//   printLastName: () => {
//     console.log(this);
//   },
// };

// user.printName();
// user.printLastName();

// var message = 4;
// function callback() {
//   console.log(this.message);
// }

// const object = {
//   message: 5,
//   method(fn) {
//     fn();
//   }
// };

// object.method(callback); // 4

// "use strict"

// const counter = {
//   count: 0,
//   increment () {
//     console.log("this", this);
//     this.count++;
//     console.log(this.count);
//   },
// };

// // counter.increment()

// const button = document.getElementById("myButton");
// button.addEventListener("click", counter.increment);

// const iterable = [10, 20, "aaa", 2];
// const iterator = iterable[Symbol.iterator](); // 1. Get Iterator

// let result = iterator.next(); // 2. First call

// while (!result.done) {
//   // 3. Check done
//   const num = result.value; // 4. Assign value

//   // --- Loop Body Starts ---
//   console.log(num);
//   // --- Loop Body Ends ---

//   result = iterator.next(); // 5. Get next item
// }

// console.log(iterable[Symbol.iterator]().next())

// const logUser2 = async () => {
//   const getUser = async (username) => {
//     const user = await fetch(`https://api.github.com/users/${username}`);
//     return await user.json();
//   };
//   console.log(await getUser("kisankumavat85"));
// };
// logUser2();

// // 1. getUser: Defined with a callback because we can't 'await'
// var getUser = function (username, callback) {
//   // Create the XHR object (The ancestor of fetch)
//   var xhr = new XMLHttpRequest();

//   // Configure it: GET request to the URL
//   xhr.open("GET", "https://api.github.com/users/" + username);

//   // Define what happens when the response loads
//   xhr.onload = function () {
//     // Check if the HTTP status is OK (200-299)
//     if (xhr.status >= 200 && xhr.status < 300) {
//       try {
//         // XHR returns a raw string, we must manually parse JSON
//         var data = JSON.parse(xhr.responseText);
//         // SUCCESS: Call the callback with (no error, data)
//         callback(null, data);
//       } catch (e) {
//         // Parse error
//         callback(e, null);
//       }
//     } else {
//       // HTTP Error (like 404 Not Found)
//       callback("Error: " + xhr.status, null);
//     }
//   };

//   // Define what happens if the network fails completely
//   xhr.onerror = function () {
//     callback("Network Request Failed", null);
//   };

//   // Finally, send the request
//   xhr.send();
//   console.log("21121")
// };

// // 2. logUser: Wraps the logic
// var logUser = function (username) {
//   console.log("Fetching data for " + username + "...");

//   // We pass a function inside getUser to handle the result
//   getUser(username, function (error, user) {
//     if (error) {
//       console.error("Something went wrong:", error);
//     } else {
//       console.log(user); // Here is your data
//     }
//   });
// };

// // Run it
// logUser("kisankumavat85");
// console.log("first");

// const p1 = new Promise((resolve, reject) =>
//   setTimeout(() => reject("Value 1"), 1000)
// );
// const p2 = new Promise((resolve, reject) =>
//   setTimeout(() => reject("Value 2"), 2000)
// );
// const p3 = new Promise((resolve, reject) =>
//   setTimeout(() => reject("Value 3"), 3000)
// );

// const promises = [p1, p2, p3];

// const result = Promise.any(promises);
// console.log("result", result);
// result
//   .then((val) => console.log("val", val))
//   .catch((error) => console.log("error", error));
