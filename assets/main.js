console.log("front end start");

const selectedArticleIds = new Set();

function refresh() {
  console.log("refresh");
  const trs = document.querySelectorAll("table tbody tr");
  console.log("trs: ", trs);
  for (const tr of trs) {
    const id = tr.getAttribute("data-id");
    if (selectedArticleIds.has(id)) {
      tr.classList.add("selected");
    } else {
      tr.classList.remove("selected");
    }
  }
  const suppressBtn = document.querySelector("button.suppress");
  console.log("suppressBtn: ", suppressBtn);
  suppressBtn.hidden = selectedArticleIds.size === 0;
}

addEventListener("DOMContentLoaded", () => {
  refresh();
  const trs = document.querySelectorAll("table tbody tr");
  console.log("trs: ", trs);

  for (const tr of trs) {
    tr.addEventListener("click", function (event) {
      console.log("click", this);
      const id = this.getAttribute("data-id");
      console.log("id: ", id);
      if (selectedArticleIds.has(id)) {
        selectedArticleIds.delete(id);
      } else {
        selectedArticleIds.add(id);
      }
      refresh();
    });
  }

  const suppressBtn = document.querySelector("button.suppress");
  suppressBtn.addEventListener("click", async () => {
    for (const id of selectedArticleIds) {
      console.log("id: ", id);

      await fetch(`/api/articles/${id}`, {
        method: "DELETE",
      });
    }
    location.reload();
  });
});
