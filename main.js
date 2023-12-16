const books = [];
const CHANGE_EVENT = "change-books";
const SAVED_EVENT = "saved-books";
const STORAGE_KEY = "BOOKSHELF_APPS";

function generateId() {
  return +new Date();
}

function generateNewBook(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function findBook(bookId) {
  for (const todoItem of books) {
    if (todoItem.id === bookId) {
      return todoItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id === bookId) {
      return index;
    }
  }
  return -1;
}

function bookIndex(newBook) {
  for (const index in books) {
    if (books[index] === newBook) {
      return index;
    }
  }
}

function makeBook(newBook) {
  const title = document.createElement("h2");
  title.innerText = newBook.title;
  const author = document.createElement("p");
  author.innerText = newBook.author;
  const year = document.createElement("p");
  year.innerText = newBook.year;

  const textContainer = document.createElement("div");
  textContainer.classList.add("inner");
  textContainer.append(title, author, year);

  const container = document.createElement("div");
  container.classList.add("item", "list-item", "shadow");
  container.append(textContainer);
  container.setAttribute("id", `book-${newBook.id}`);

  if (newBook.isComplete) {
    const undoButton = document.createElement("img");
    undoButton.setAttribute("src", "assets/undo-outline.svg");
    undoButton.classList.add("undo-button");

    undoButton.addEventListener("click", function () {
      undoBookTitleFromReaded(newBook.id);
      alert("Buku Dikembalikan ke Rak Belum selesai dibaca");
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      if (confirm("Anda Yakin Menghapus Buku Dari Bookshelf?")) {
        removeBookTitleFromReaded(newBook.id);
        alert("Buku Dihapus Dari Bookshelf");
      } else {
      }
    });

    container.append(undoButton, trashButton);
  } else {
    const checkButton = document.createElement("button");
    checkButton.classList.add("check-button");

    checkButton.addEventListener("click", function () {
      addBookTitleToReadList(newBook.id);
      alert("Buku Dipindahkan ke Rak Selesai dibaca");
    });

    const trashButton = document.createElement("button");
    trashButton.classList.add("trash-button");

    trashButton.addEventListener("click", function () {
      if (confirm("Anda Yakin Menghapus Buku Dari Bookshelf?")) {
        removeBookTitleFromReaded(newBook.id);
        alert("Buku Dihapus Dari Bookshelf");
      } else {
      }
    });
    container.append(checkButton, trashButton);
  }
  return container;
}

function addBook() {
  const title = document.getElementById("title").value;
  const author = document.getElementById("author").value;
  const year = document.getElementById("year").value;

  const generatedID = generateId();
  const newBook = generateNewBook(generatedID, title, author, year, false);
  books.push(newBook);

  document.dispatchEvent(new Event(CHANGE_EVENT));
  saveData();
}

function addBookTitleToReadList(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = true;
  document.dispatchEvent(new Event(CHANGE_EVENT));
  saveData();
}

function removeBookTitleFromReaded(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(CHANGE_EVENT));
  saveData();
}

function undoBookTitleFromReaded(bookId) {
  const bookTarget = findBook(bookId);

  if (bookTarget == null) return;

  bookTarget.isComplete = false;
  document.dispatchEvent(new Event(CHANGE_EVENT));
  saveData();
}

function resetBookList(newBook) {
  const resetAll = bookIndex(newBook);

  if (resetAll) return;

  books.splice(resetAll);
  document.dispatchEvent(new Event(CHANGE_EVENT));
  saveData();
}

const resetList = document.getElementById("btn-reset");
resetList.addEventListener("click", function () {
  const reset = books.length;
  if (reset == 0) {
    alert("Bookshelf Kosong");
  } else {
    if (confirm("Anda Yakin Menghapus Semua Data Bookshelf?")) {
      resetBookList(reset);
      alert("Semua Data Dihapus");
    }
  }
});

function totalOfBooks() {
  const totalBooks = document.getElementById("total-books");
  totalBooks.innerHTML = books.length;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function isStorageExist() {
  if (typeof Storage === undefined) {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);

  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
  document.dispatchEvent(new Event(CHANGE_EVENT));
}

function showToastMessage(message) {
  toastElement.innerText = message;
  toastElement.style.display = "block";
  setTimeout(function () {
    toastElement.style.display = "none";
  }, 3000);
}

document.addEventListener("DOMContentLoaded", function () {
  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (e) {
    e.preventDefault();
    addBook();
    alert("Buku Ditambahkan");
    e.target.reset();
  });
  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

let count = 0;
document.addEventListener(CHANGE_EVENT, function () {
  count = books.length;
  document.getElementById("total-books").innerText = count;
  const read = [];
  const unRead = [];
  const unReadBooksList = document.getElementById("books");
  unReadBooksList.innerHTML = "";

  const readBookList = document.getElementById("books-items");
  readBookList.innerHTML = "";

  const unReadBook = document.getElementById("unread-book");
  unReadBook.innerText = "";
  const readBook = document.getElementById("read-book");
  readBook.innerText = "";

  for (const bookItem of books) {
    const bookList = makeBook(bookItem);
    if (bookItem.isComplete) {
      readBookList.append(bookList);
      read.push(readBookList);
      readBook.innerText = read.length;
    } else {
      unReadBooksList.append(bookList);
      unRead.push(bookList);
      unReadBook.innerText = unRead.length;
    }
  }
  ifNoList();
  totalOfBooks();
});

document.getElementById("bookTitle").addEventListener("keyup", function () {
  const inputValue = document.getElementById("bookTitle").value;
  const listBooks = document.querySelectorAll(".list-item");

  for (let i = 0; i < listBooks.length; i++) {
    if (
      !inputValue ||
      listBooks[i].textContent.toLowerCase().indexOf(inputValue) > -1
    ) {
      listBooks[i].classList.remove("hide");
    } else {
      listBooks[i].classList.add("hide");
    }
  }
});

document.addEventListener(SAVED_EVENT, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

const toastElement = document.getElementById("toastMessage");
document.addEventListener(SAVED_EVENT, function () {
  const todoData = localStorage.getItem(STORAGE_KEY);
  if (todoData) {
    showToastMessage("Data Bookshelf berhasil disimpan!");
  } else {
    showToastMessage("Data Bookshelf kosong.");
  }
});
