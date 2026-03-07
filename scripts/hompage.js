// Pulling The Elements and Creating Essential Variables
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
const issueDetailsModal = document.getElementById("issue-details-modal");
const modalTitle = document.getElementById("modal-title");
const modalStatus = document.getElementById("modal-status");
const modalName = document.getElementById("modal-name");
const modalDate = document.getElementById("modal-date");
const modalDescription = document.getElementById("modal-description");
const modalAssignee = document.getElementById("modal-assignee");
const modalPriority = document.getElementById("modal-priority");
const modalLabelContainer = document.getElementById("modal-label-container");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

// Arrays
let openList = [];
let closedList = [];

// Creating Labels
const createLabels = (labels) => {
  const elements = labels.map((label) => {
    if (label === "bug") {
      return `<button class="btn btn-xs btn-soft btn-error"><i class="fa-solid fa-bug" style="color: rgb(255, 0, 0);"></i> Bug</button>`;
    }
    if (label === "enhancement") {
      return `<button class="btn btn-xs btn-soft btn-success"><i class="fa-solid fa-wand-magic" style="color: rgb(0, 195, 51);"></i> Enhancement</button>`;
    }
    if (label === "help wanted") {
      return `<button class="btn btn-xs btn-soft btn-warning"><i class="fa-solid fa-life-ring" style="color: rgb(255, 212, 59);"></i> Help Wanted</button>`;
    }
    if (label === "documentation") {
      return `<button class="btn btn-xs btn-soft btn-info"><i class="fa-brands fa-readme" style="color: rgb(7, 146, 255);"></i> Documentation</button>`;
    }
    if (label === "good first issue") {
      return `<button class="btn btn-xs btn-soft btn-secondary"><i class="fa-solid fa-circle-exclamation" style="color: #e7c297;"></i> Good First Issue</button>`;
    }
  });

  return elements.join(" ");
};

//  Modal
const openingModal = async (id) => {
  const response = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`,
  );
  const data = await response.json();

  const dataObject = data.data;
  modalTitle.textContent = dataObject.title;
  modalStatus.textContent = dataObject.status;
  modalName.textContent = dataObject.author;
  modalDate.textContent = dataObject.createdAt;
  modalDescription.textContent = dataObject.description;
  modalAssignee.textContent = dataObject.assignee
    ? dataObject.assignee
    : "No Assignee Found";
  modalPriority.textContent = dataObject.priority;
  modalLabelContainer.innerHTML = `${createLabels(dataObject.labels)}`;
  modalStatus.className = `text-[12px] font-medium ${dataObject.status === "open" ? "bg-green-600" : "bg-[#a856f7]"} text-white px-2 rounded-full`;

  issueDetailsModal.showModal();
};
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
  if (id === "search-btn") {
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
  postContainer.classList.add("hidden");
};
const hideSpinner = () => {
  spinnerContainer.classList.add("hidden");
  postContainer.classList.remove("hidden");
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

  if (posts.length === 0) {
    postContainer.innerHTML = `
    <div class="text-center p-10 col-span-1 md:col-span-3 lg:col-span-4 mx-auto">
        <h1 class="text-2xl">Nothing To Show!!!</h1>
    </div>
        `;
    return true;
  }

  posts.forEach((post) => {
    const postCard = document.createElement("div");
    postCard.className = `p-4 bg-white rounded-sm shadow-xl border-t-4 ${post.status === "open" ? borderGreen : borderViolet}`;
    postCard.innerHTML = `
            <div class="flex justify-between items-center mb-[12px]">
                    <img class="h-[24px] w-[24px]" src="${post.status === "open" ? srcActive : srcClosed}" alt="">
                    <!-- Priority Container -->
                    <div class="${checkPriorityClassBg(post.priority)} px-[20px] py-[3px] rounded-full">
                        <h2 class="${checkPriorityClasstext(post.priority)} text-[12px] font-medium">${checkPriority(post.priority)}</h2>
                    </div>
                </div>
                <h1 onclick="openingModal('${post.id}')" class="font-semibold text-[14px] mb-[8px] cursor-pointer">${post.title}</h1>
                <p class="text-[#64748B] text-[12px]">${post.description}</p>
                <div class="flex flex-1 justify-start items-center flex-wrap pt-3 pb-3 gap-3">
                    ${createLabels(post.labels)}
                </div>
                <div class="border-t border-t-gray-400 py-3 mt-3">
                    <p class="text-[#64748B] text-[12px]">#${post.id} by ${post.author}</p>
                    <p class="text-[#64748B] text-[12px]">${post.createdAt}</p>
        </div>
        `;
    // Appending The postCard to the post container
    postContainer.append(postCard);
  });
  if (id !== "search-btn") {
    finalCount(id);
  }
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

document.getElementById("search-btn").addEventListener("click", async () => {
  const inputValue = searchInput.value.trim().toLowerCase();

  const response = await fetch(
    `https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${inputValue}`,
  );
  const data = await response.json();
  const id = "search-btn";

  displayAllPost(data.data, id);

  let isEmpty  = displayAllPost(data.data, id);
  if(isEmpty) {
    postCount.textContent = 0;
  }
  else {
    finalCount(id);
  }
});

loadPost();
