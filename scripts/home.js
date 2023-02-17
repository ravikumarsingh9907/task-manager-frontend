const addTaskBtn = document.querySelector(".add-task");
const taskDesc = document.querySelector(".task-desc");
const taskContainer = document.querySelector(".task-container");

(async function tasks() {
  const response = await fetch("http://localhost:3300/tasks", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const data = await response.json();

  if (data.error) {
    window.location.href = "./index.html";
  }

  let clutter = "";
  data.tasks.forEach((ele) => {
    if (ele.completed === true) {
      clutter += `<tr class="task-completed">
    <td style="text-decoration: line-through;"><input class="task-description" value="${ele.description}" readonly style="text-decoration: line-through;"/></td>
    <td class="task-status"><span>Completed</span>
    <i class='bx bxs-edit edit-status-btn'></i>
    </td>
    <td>
      <button type="submit" class="btn delete-btn" style="color: red;
      background-color: transparent;
      border-color: #ff0202;"  value="${ele._id}">
        Delete
      </button>
      <button type="submit" class="btn ms-1 edit-btn" style="color: green;
      background-color: transparent;
      border-color: green;" value="${ele._id}">
          Edit
        </button>
    </td>
    </tr>
    <div class="status-container hide">
        <ul style="padding-bottom: 0px;">
            <li style="border-bottom: 1px solid #8080804a;">
                <input type="radio" class="check-status" data-id="${ele._id}" checked>
                <label>Completed</label>
            </li>
            <li style="border-bottom: 1px solid #8080805c;">
                <input type="radio" class="check-status" data-id="${ele._id}">
                <label>In progress</label>
            </li>
        </ul>
    </div>`;
    } else {
      clutter += `<tr class="task-in-progress">
      <td><input class="task-description" value="${ele.description}" readonly/></td>
      <td class="task-status"><span>In progress</span>
      <i class='bx bxs-edit edit-status-btn'></i></td>
      <td>
        <button type="submit" class="btn delete-btn" style="color: red;
        background-color: transparent;
        border-color: #ff0202;" value="${ele._id}">
          Delete
        </button>
        <button type="submit" class="btn ms-1 edit-btn" style="color: green;
        background-color: transparent;
        border-color: green;" value="${ele._id}">
          Edit
        </button>
      </td>
      </tr>
      <div class="status-container hide">
        <ul style="padding-bottom: 0px;">
            <li style="border-bottom: 1px solid #8080804a;">
                <input type="radio" class="check-status" data-id="${ele._id}">
                <label>Completed</label>
            </li>
            <li style="border-bottom: 1px solid #8080805c;">
                <input type="radio" class="check-status" data-id="${ele._id}" checked> 
                <label>In Progress</label>
            </li>
        </ul>
    </div>`;
    }
  });

  taskContainer.innerHTML = clutter;

  const deleteTaskBtn = document.querySelectorAll(".delete-btn");
  const statusBtn = document.querySelectorAll(".edit-status-btn");
  const status = document.querySelectorAll(".status-container");
  const changeStatus = document.querySelectorAll(".check-status");
  const editTaskBtn = document.querySelectorAll(".edit-btn");
  const taskDescription = document.querySelectorAll(".task-description");

  statusBtn.forEach((ele, index) => {
    ele.addEventListener("click", () => {
      status[index].classList.toggle("hide");
    });
  });

  changeStatus.forEach((ele) => {
    if (ele.nextElementSibling.textContent === "Completed") {
      ele.addEventListener("click", changeStatusFun(ele.dataset.id, true));
    } else {
      ele.addEventListener("click", changeStatusFun(ele.dataset.id, false));
    }
  });

  editTaskBtn.forEach((ele, index) => {
    ele.addEventListener(
      "click",
      makeDescriptionEditable(
        ele,
        deleteTaskBtn[index],
        ele.value,
        taskDescription[index]
      )
    );
  });

  deleteTaskBtn.forEach((ele) => {
    ele.addEventListener("click", deleteOrCancelEditTask(ele.value, ele));
  });
})();

async function addTask() {
  const response = await fetch("http://localhost:3300/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({
      description: taskDesc.value,
    }),
  });

  const data = await response.json();

  if (data.error) return alert(data);

  window.location.href = "./home.html";
}

addTaskBtn.addEventListener("click", addTask);

function deleteOrCancelEditTask(id, ele) {
  return async function (e) {
    e.preventDefault();
    if (ele.textContent === "Delete") {
      const response = await fetch(`http://localhost:3300/tasks/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (data.error) return alert(data);

      alert("Task deleted");
      window.location.href = "./home.html";
    } else {
      ele.parentElement.previousElementSibling.previousElementSibling.childNodes[0].setAttribute(
        "readonly",
        true
      );
      ele.parentElement.previousElementSibling.previousElementSibling.childNodes[0].style.border =
        "none";
      ele.textContent = "Delete";
      ele.style.backgroundColor = "#00000000";
      ele.style.color = "#ff0202";
      ele.nextElementSibling.textContent = "Edit";
      ele.nextElementSibling.style.backgroundColor = "transparent";
      ele.nextElementSibling.style.color = "green";
    }
  };
}

function changeStatusFun(id, changeTo) {
  return async function (e) {
    e.preventDefault();
    const response = await fetch(`http://localhost:3300/tasks/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        completed: changeTo,
      }),
    });

    const data = await response.json();

    if (data.error) return alert(data);

    alert("Updated");
    window.location.href = "./home.html";
  };
}

function makeDescriptionEditable(ele, deleteTaskBtn, id, taskDescription) {
  return async function (e) {
    e.preventDefault();
    if (ele.textContent.trim() === "Edit") {
      console.log("Hello!");
      ele.parentElement.previousElementSibling.previousElementSibling.childNodes[0].removeAttribute(
        "readonly"
      );
      ele.parentElement.previousElementSibling.previousElementSibling.childNodes[0].style.border =
        "1px solid black";
      deleteTaskBtn.textContent = "Cancel";
      deleteTaskBtn.style.backgroundColor = "#ff0202";
      deleteTaskBtn.style.color = "white";
      ele.textContent = "Update";
      ele.style.backgroundColor = "green";
      ele.style.color = "white";
    } else if (ele.textContent.trim() === "Update") {
      const response = await fetch(`http://localhost:3300/tasks/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          description: taskDescription.value,
        }),
      });

      const data = await response.json();

      if (!data.success) alert(data);
      alert(data.success);
      window.location.href = "./home.html";
    }
  };
}
