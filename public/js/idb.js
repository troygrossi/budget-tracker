let db;
const request = indexedDB.open('budget_tracker', 1);

request.onupgradeneeded = function(event) {
    db = event.target.result;
    db.createObjectStore('budget_data', { autoIncrement: true });
  };

request.onsuccess = function(event) {
    db = event.target.result;
    if (navigator.onLine) {
        getIndexedData();
    }
  };
  request.onerror = function(event) {
    console.log(event.target.errorCode);
  };

// what does this do?
function saveRecord(record) {
    const transaction = db.transaction(['budget_data'], 'readwrite');
    const budgetStore = transaction.objectStore('budget_data');
    budgetStore.add(record);
  };


  function getIndexedData(){
      const transaction = db.transaction(['budget_data'], 'readwrite');
      const budgetStore = transaction.objectStore('budget_data');
      const getAll = budgetStore.getAll();
      getAll.onsuccess = function(){
        if(getAll.result.length > 0){
            fetch('/api/transaction', {
                method: 'Post',
                body: JSON.stringify(getAll.result),
                headers:{'Content-Type': 'application/json'},
            }).then(()=>{
                const transaction = db.transaction(['budget_data'], 'readwrite');
                const budgetStore = transaction.objectStore('budget_data');
                budgetStore.clear();
            }).catch((err)=>{
                console.log(err);
            });
        }
    };
  };
  window.addEventListener('online', getIndexedData);



