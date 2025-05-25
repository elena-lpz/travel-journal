console.log("hello World");

// const colours = ["#ff99c8", "#fcf6bd", "#d0f4de", "#a9def9", "#e4c1f9"];
// const colours = [
//   {
//     backgroundColour: "#ff99c8",
//   },
//   {
//     backgroundColour: "#fcf6bd",
//   },
//   {
//     backgroundColour: "#d0f4de",
//   },
//   {
//     backgroundColour: "#a9def9",
//   },
//   {
//     backgroundColour: "#e4c1f9",
//   },
// ];

// const colourClasses = [
//   "bg-pink",
//   "bg-yellow ",
//   "bg-green",
//   "bg-blue",
//   "bg-purple",
// ];

const colourClasses = [
  { className: "bg-pink trip-info" },
  { className: "bg-yellow trip-info" },
  { className: "bg-green trip-info" },
  { className: "bg-blue trip-info" },
  { className: "bg-purple trip-info" },
  { className: "bg-orange trip-info" },
];

// select the form from the dom

const travelForm = document.querySelector("#travel-form");
// console.log(movieForm);

//the user can submit the form -> event
//event handler
function handleSubmit(event) {
  //prevent the default behaviour of the form --> send the data to the url.
  event.preventDefault();
  //create an object template to store our input
  const formData = new FormData(travelForm);
  //collect the input values and add them to our object instance
  const formValues = Object.fromEntries(formData);
  //prepare the formValues Object to be sent to the server,

  //we are going to use fetch to connect to our POST route in the server
  fetch("https://travel-journal-ojly.onrender.com/newTrip", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formValues),
  });

  renderData();
  travelForm.reset();
  closeModal();
  showAlert(
    "Your entry has been submitted, please refresh the page.",
    "fa-check",
    3000
  );
  // const tripsSection = document.getElementById("trips-section");
  // tripsSection.innerHTML = "";
}

// alert function, not fully reusable, this was originally inside handleSubmit
// function showAlert() {
//   const alertMessageContainer = document.createElement("section");
//   const alertMessage = document.createElement("h1");
//   const checkIcon = document.createElement("i");

//   alertMessage.classList.add("alert-message");
//   document.body.appendChild(alertMessageContainer);
//   alertMessageContainer.appendChild(alertMessage);
//   alertMessage.textContent = `Your entry has been submited`;
//   alertMessage.appendChild(checkIcon);
//   checkIcon.classList.add("fa-solid", "fa-check");

//   setTimeout(() => {
//     alertMessageContainer.remove();
//   }, 3000);
// }

//reusable alert function

function showAlert(message, iconClass, duration) {
  const alertMessageContainer = document.createElement("section");
  const alertMessage = document.createElement("h1");
  const icon = document.createElement("i");

  alertMessage.classList.add("alert-message");
  icon.classList.add("fa-solid", iconClass);

  alertMessage.textContent = message;
  alertMessage.appendChild(icon);

  alertMessageContainer.appendChild(alertMessage);
  document.body.appendChild(alertMessageContainer);

  setTimeout(() => {
    alertMessageContainer.remove();
  }, duration);
}

//event listener
travelForm.addEventListener("submit", handleSubmit);

// Get the trip data from the server and display it (render it) on the page
async function getTrips() {
  const response = await fetch(
    "https://travel-journal-ojly.onrender.com/trips"
  );
  // console.log(Response);
  const trips = await response.json();
  // console.log(trips);
  return trips;
}

function getRandomColour(colourClasses) {
  const randomIndex = Math.floor(Math.random() * colourClasses.length);
  return randomIndex;
}

// Something really funny (no one was laughing) happened here, I originally had it set so that my entries would take 1 colour from the array each. I was happy with it until I realised I could not see more than 5 entries at a time, I needed to delete 1 entry so that the colour would become "available" again. It took me a while to figure out what was happening. I ideally would have liked for the colours to not be random so that they dont repeat, but I could not figure out how to restart the array. It's probably a very simple thing to do but oh well, I'll come back to it in the future

//create all elements
async function createTripElements(arrayofData) {
  const tripsData = await getTrips();
  //create new elements
  arrayofData.forEach((item) => {
    const randomColourIndex = getRandomColour(colourClasses);
    const tripDestination = document.createElement("h2");
    const tripDate = document.createElement("p");
    const tripStayLength = document.createElement("p");
    const tripFavouriteExp = document.createElement("p");
    const tripVisitAagin = document.createElement("p");
    const tripGeneralThoughts = document.createElement("p");
    const tripContainer = document.createElement("div");
    const tripTitleContainer = document.createElement("div");
    const deleteIcon = document.createElement("i");
    const deleteTrip = document.createElement("button");

    //update content values

    tripDestination.textContent = item.destination;
    //need to format date before updating text content
    const date = new Date(item.date_of_visit);
    const formattedDate = date.toLocaleDateString("en-GB");
    tripDate.textContent = `When: ${formattedDate}`;
    // tripDate.textContent = item.date_of_visit;
    tripStayLength.textContent = `Length of stay: ${item.stay_length} day(s)`;
    tripFavouriteExp.textContent = `Favourite experience: ${item.favourite_experience}`;
    tripVisitAagin.textContent = `Would visit again: ${item.visit_again}`;
    tripGeneralThoughts.textContent = `General thoughts: ${item.general_thoughts}`;
    tripContainer.classList.add("trip-info");
    tripTitleContainer.classList.add("trip-title");
    deleteIcon.classList.add("fa-solid", "fa-trash-can");
    deleteTrip.classList.add("delete-button");

    tripContainer.setAttribute(
      "class",
      colourClasses[randomColourIndex].className
    );

    //append to the DOM
    const tripsSection = document.getElementById("trips-section");
    tripsSection.prepend(tripContainer); //using prepend instead so that the newer trips appear at the top
    tripTitleContainer.append(tripDestination, deleteTrip);
    tripContainer.append(
      tripTitleContainer,
      tripDate,
      tripStayLength,
      tripFavouriteExp,
      tripVisitAagin,
      tripGeneralThoughts
    );
    deleteTrip.appendChild(deleteIcon);

    // tripTitleContainer.appendChild(deleteTrip);
    // tripContainer.appendChild(tripTitleContainer);
    // tripContainer.appendChild(tripDate);
    // tripContainer.appendChild(tripStayLength);
    // tripContainer.appendChild(tripFavouriteExp);
    // tripContainer.appendChild(tripVisitAagin);
    // tripContainer.appendChild(tripGeneralThoughts);

    deleteTrip.addEventListener("click", async () => {
      await deleteData(item.id);
      // if (window.confirm("Are you sure want to delete this entry?")) {
      deleteTrip.parentElement.parentElement.remove();
      showAlert("Your entry has been deleted", "fa-check", 3000);
    });
  });
}
//https://developer.mozilla.org/en-US/docs/Web/API/Window/confirm
// https://stackoverflow.com/questions/9139075/how-to-show-a-confirm-message-before-delete

//render data
async function renderData() {
  const tripsData = await getTrips();
  // console.log(tripsData);
  createTripElements(tripsData);
}
renderData();

//modal for our form
const addEntry = document.getElementById("add-button");

addEntry.addEventListener("click", () => {
  travelForm.classList.remove("hidden");
});

// Deletes data by id
async function deleteData(id) {
  const response = await fetch(
    `https://travel-journal-ojly.onrender.com/trips/${id}`,
    {
      method: "DELETE",
    }
  );
  const trips = await response.json();
  return trips;
}

// const tripTitle = document.getElementById("trip-title");
// tripTitle.addEventListener("click", (event) => {
//   deleteData(Number(event.target.id));
//   const tripsSection = document.getElementById("trips-section");
//   tripsSection.innerHTML = "";
//   renderData();
// });

///https://www.tutorialspoint.com/how-to-add-fade-out-effect-using-pure-javascript

//  const element = document.querySelector('.fade-out-element');
//          function fadeOut(el) {
//             var opacity = 1; // Initial opacity
//             var interval = setInterval(function() {
//                if (opacity > 0) {
//                   opacity -= 0.1;
//                   el.style.opacity = opacity;
//                } else {
//                   clearInterval(interval); // Stop the interval when opacity reaches 0
//                   el.style.display = 'none'; // Hide the element
//                }
//             }, 50);
//          }
//          fadeOut(element);

//https://stackoverflow.com/questions/15907079/css3-transition-fade-out-effect

const openButton = document.getElementById("open-button");
const tripsSection = document.getElementById("trips-section");
const tripsView = document.getElementById("trips-view");
const introSection = document.getElementById("intro-section");

// openButton.addEventListener("click", () => {
//   tripsSection.classList.remove("hidden");
//   tripsView.classList.remove("hidden");
//   introSection.classList.add("hidden");
// });

// wanted to make the transition a bit smoother. Still not 100% happy as the info I get from the DB takes a bit too long to load but it's a bit better

// Originally I did not have a loading screen but a start screen with a button "open" - it was a bit annoying especially when refreshing the page so decided to go for a timed loading screen instead

// openButton.addEventListener("click", () => {
//   console.log("button clicked");
//   introSection.classList.remove("visible");
//   introSection.classList.add("hidden");

//   tripsSection.classList.remove("hidden");
//   tripsSection.classList.add("visible");

//   tripsView.classList.remove("hidden");
//   tripsView.classList.add("visible");

//   document.body.style.overflow = "auto";
// });

const addButton = document.getElementById("add-button");
const closeButton = document.getElementById("close-button");
const formModal = document.getElementById("form-modal");

addButton.addEventListener("click", () => {
  formModal.classList.remove("hidden");
  travelForm.classList.remove("hidden");
  travelForm.classList.add("visible");
  document.body.style.overflow = "hidden"; // stops the bg from scrolling behind the modal
});

closeButton.addEventListener("click", () => {
  closeModal();
});

// I'm going to use this again when submitting so I created a function I can resuse
function closeModal() {
  formModal.classList.add("hidden");
  travelForm.classList.remove("visible");
  travelForm.classList.add("hidden");
  document.body.style.overflow = "auto"; // makes scrolling work again
}

//loading screen

setTimeout(function () {
  document.querySelector(".loadingScreen").style.display = "none";
  document.body.style.overflow = "auto";
}, 6000);
