countMap = {};
countList = [];
const countIdList = [];
countMapLen = 0;

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
    voteALL();
  })
  .catch((err) => {
    console.log("[err]", err);
  });

function voteALL() {
  db.collection("voteList")
    .get()
    .then((docList) => {
      var i = 0;
      docList.forEach((doc) => {
        const vote = doc.data();
        let countbtn = ``;
        console.log(doc.id);
        for (let i = 0; i < countMapLen; i++) {
          const count = countMap[i];
          if (doc.id == count.key) {
            countbtn += `
              <button data-id="${countIdList[i]}" class="btn btn-danger count-vote-btn" style="margin-left: 25px;margin-right: 25px;margin-top: 10px;text-align: left;width: 100%;">  
              ${count.Name}： ${count.Count}
              </button><br>`;
          }
        }
        const temp = `  
        <div>
          <br>
          <h4 class="block">${vote.title}</h4>
          <hr>
          ${countbtn}
          <br>
          <div id=${doc.id}></div>
          <br>
        </div>
        `;
        $("#main").append(temp);
        i += 1;
      });
    })
    .catch((err) => {
      console.log("[err]", err);
    });
}

$("body").delegate(".count-vote-btn", "click", function () {
  const countId = $(this).attr("data-id");
  var count = {};
  for (let i = 0; i < countMapLen; i++) {
    const docId = countIdList[i];
    var doc = countMap[i];
    if (docId == countId) {
      count = doc;
    }
  }
  count.Count += 1;
  db.doc(`countList/${countId}`)
    .update(count)
    .then(() => {
      window.location.reload();
    })
    .catch((err) => {
      console.log(err);
    });
});
