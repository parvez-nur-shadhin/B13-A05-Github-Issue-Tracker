const postContainer = document.getElementById("post-container");
const srcActive = "./assets/Open-Status.png";
const srcClosed = "./assets/Closed-Status.png";
const textActive = "Act";
const borderViolet = "border-t-[#a856f7]";
const borderGreen = "border-t-green-600";
const priorityHighBg = "bg-red-200";
const priorityHighText = "text-[red]";
const priorityLowBg = "bg-gray-200";
const priorityLowText = "text-[gray]";
const priorityMediumBg = "bg-amber-200";
const priorityMediumText = "text-amber-600";
const postCount = document.getElementById("post-count");
const spinnerContainer = document.getElementById("spinner-container");
let openList = [];
let closedList = [];

// Button Toggling
const buttonActive = (id) => {
  const allButtons = document.querySelectorAll("#all, #open, #closed");
  allButtons.forEach((btn) => {
    btn.classList.remove("btn-primary");
    btn.classList.add("btn-outline");
  });
  const passedBtn = document.getElementById(id);
  passedBtn.classList.remove("btn-outline");
  passedBtn.classList.add("btn-primary");
};
// Counting Length
const finalCount = (id) => {
  if (id === "open") {
    postCount.textContent = openList.length;
    return;
  }
  if (id === "closed") {
    postCount.textContent = closedList.length;
    return;
  }
  if (id === "all") {
    postCount.textContent = postContainer.children.length;
  }
};
// All post button click
document.getElementById("all").addEventListener("click", () => {
  buttonActive("all");
});

// Spinner
const showSpinner = () => {
  spinnerContainer.classList.remove("hidden");
  postContainer.classList.add('hidden');
};
const hideSpinner = () => {
  spinnerContainer.classList.add("hidden");
  postContainer.classList.remove('hidden');
};

// Loading All Post
const loadPost = async (id) => {
    showSpinner();
  // Fetching The Data
  const response = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await response.json();

  hideSpinner();

  // Passing the dataObject to function
  displayAllPost(data.data, id);
};
// Displaying ALl posts
const displayAllPost = (data, id) => {
  // Taking the array out of the passed object
  postContainer.innerHTML = "";
  const posts = data;
  /**
   *{
"id": 1,
"title": "Fix navigation menu on mobile devices",
"description": "The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior.",
"status": "open",
"labels": [
"bug",
"help wanted"
],
"priority": "high",
"author": "john_doe",
"assignee": "jane_smith",
"createdAt": "2024-01-15T10:30:00Z",
"updatedAt": "2024-01-15T10:30:00Z"
}
   */

  posts.forEach((post) => {
    const postCard = document.createElement("div");
    postCard.className = `p-4 bg-white rounded-sm shadow-xl border-t-4 ${post.status === "open" ? borderGreen : borderViolet}`;
    postCard.innerHTML = `
            <div class="flex justify-between items-center">
                    <img class="h-[24px] w-[24px]" src="${post.status === "open" ? srcActive : srcClosed}" alt="">
                    <!-- Priority Container -->
                    <div class="${checkPriorityClassBg(post.priority)} px-[26px] py-[6px] rounded-full">
                        <h2 class="${checkPriorityClasstext(post.priority)} font-medium">${checkPriority(post.priority)}</h2>
                    </div>
                </div>
                <h1 class="font-semibold text-[14px] mb-[8px]">${post.title}</h1>
                <p class="text-[#64748B] text-[12px]">${post.description}</p>
                <div class="border-t border-t-gray-400 py-3 mt-3">
                    <p class="text-[#64748B] text-[12px]">#${post.id} by ${post.author}</p>
                    <p class="text-[#64748B] text-[12px]">${post.createdAt}</p>
        </div>
        `;
    // Appending The postCard to the post container
    postContainer.append(postCard);
  });
  finalCount(id);
};
// priority Checker
const checkPriority = (priority) => {
  if (priority === "high") {
    return "High";
  } else if (priority === "medium") {
    return "Medium";
  } else {
    return "Low";
  }
};
// priority Class checker
const checkPriorityClassBg = (priority) => {
  if (priority === "high") {
    return priorityHighBg;
  } else if (priority === "medium") {
    return priorityMediumBg;
  } else {
    return priorityLowBg;
  }
};
// Priority Text Checker
const checkPriorityClasstext = (priority) => {
  if (priority === "high") {
    return priorityHighText;
  } else if (priority === "medium") {
    return priorityMediumText;
  } else {
    return priorityLowText;
  }
};
// Loading Open Posts
const loadOpen = async (id) => {
  buttonActive(id);
  showSpinner();
  // Fetching The Data
  const response = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await response.json();

  hideSpinner();
  // Passing the dataObject to function
  displayOpenPosts(data.data, id);
};
// displaying Open Posts
const displayOpenPosts = (datas, id) => {
  postContainer.innerHTML = "";
  let activeArr = datas.filter((data) => data.status === "open");
  openList = activeArr;
  finalCount(id);

  displayAllPost(openList);
};
// Loading closed posts
const loadClosed = async (id) => {
  buttonActive(id);
  showSpinner();
  // Fetching The Data
  const response = await fetch(
    "https://phi-lab-server.vercel.app/api/v1/lab/issues",
  );
  const data = await response.json();

  hideSpinner();

  // Passing the dataObject to function
  displayClosedPosts(data.data, id);
};
const displayClosedPosts = (datas, id) => {
  postContainer.innerHTML = "";
  let closedArr = datas.filter((data) => data.status === "closed");
  closedList = closedArr;
  finalCount(id);

  displayAllPost(closedList);
};

loadPost();
