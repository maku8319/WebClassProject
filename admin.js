countMap = {};
countList = [];
const countIdList = [];
countMapLen = 0;
lockVoteId = "";

var $createModal = $("#createModal");
var $createTitle = $("#createTitle");

var $createCountModal = $("#createCountModal");
var $createName = $("#createName");

$createModal.submit(function (e) {
  // prevent default behavior of browser
  e.preventDefault();
  console.log("New vote Form Submitted !");
  const vote = {
    title: $createTitle.val(),
  };
  db.collection("voteList")
    .add(vote)
    .then(() => {
      // refresh page
      window.location.reload();
    })
    .catch((err) => console.log(err));
});

db.collection("countList")
  .get()
  .then((doc) => {
    doc.forEach((m) => {
      const countId = countMapLen;
      const count = m.data();
      countMap[countId] = count;
      countIdList[countMapLen] = m.id;
      countMapLen += 1;
      countList.push(count);
    });
    votes();
  })
  .catch((err) => {
    console.log("[err]", err);
  });

function votes() {
  db.collection("voteList")
    .get()
    .then((docList) => {
      docList.forEach((doc) => {
        const vote = doc.data();
        let countbtn = ``;
        console.log(doc.id);
        for (let i = 0; i < countMapLen; i++) {
          const count = countMap[i];
          if (doc.id == count.key) {
            countbtn += `
            <div style="display:flex">
                <button  class="btn btn-danger " style="margin-left: 25px;margin-right: 25px;margin-top: 10px;text-align: left;width: 100%;">  
                ${count.Name}： ${count.Count}
                </button><br>
                <button data-id="${countIdList[i]}" class="btn btn-danger delete-count-btn">Delete Option</button>
            </div>
            `;
          }
        }
        const temp = `  
        <div style="width:200%">
          <br>
          <button data-id="${doc.id}" class="btn btn-danger delete-btn">Delete Vote</button>
          <h4 class="block">${vote.title}</h4>
          <hr>
          <button
            class="btn btn-success create-count-btn"
            data-id="${doc.id}"
            data-toggle="modal"
            data-target="#createCountModal"
            style="margin-top: 25px"
            >
            Create New Count
            </button>
          ${countbtn}
          <br>
          <div id=${doc.id}></div>
          <br>
        </div>
        `;
        $("#main").append(temp);
      });
    })
    .catch((err) => {
      console.log("[err]", err);
    });
}

$("body").delegate(".delete-btn", "click", function () {
  //console.log("this", this);
  const voteId = $(this).attr("data-id");
  db.doc(`voteList/${voteId}`)
    .delete()
    .then(() => {
      window.location.reload();
    })
    .catch((err) => console.log(err));
});

$("body").delegate(".delete-count-btn", "click", function () {
  const countId = $(this).attr("data-id");
  db.doc(`countList/${countId}`)
    .delete()
    .then(() => {
      window.location.reload();
    })
    .catch((err) => console.log(err));
});

$("body").delegate(".create-count-btn", "click", function () {
  lockVoteId = $(this).attr("data-id");
  $createCountModal.submit(function (e) {
    // prevent default behavior of browser
    e.preventDefault();
    console.log("New vote Form Submitted !");
    const count = {
      Name: $createName.val(),
      Count: 0,
      key: lockVoteId,
    };
    db.collection("countList")
      .add(count)
      .then(() => {
        // refresh page
        window.location.reload();
      })
      .catch((err) => console.log(err));
  });
});
firebase.auth().onAuthStateChanged((user) => {
  if (user) {
    // sign in
    console.log("sign in user", user);
    if (user.email == "admin@gmail.com") {
      $("#loader").fadeOut();
    } else {
      alert("沒有權限遊覽管理者頁面");
      window.location = "index.html";
    }
  } else {
    // sign out
    alert("沒有權限遊覽管理者頁面");
    window.location = "index.html";
  }
});
