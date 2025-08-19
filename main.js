const myLibrary = [];

function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.id = crypto.randomUUID();
}

// add shared method once on the prototype
Book.prototype.toggleRead = function () {
  this.read = this.read === "No" ? "Yes" : "No";
};

function addBookToLibrary(book) {
  myLibrary.push(book);
}

function viewBooks(library) {
  // Get container and clear it before adding cards
  const cards = document.getElementById("cards");
  cards.innerHTML = "";

  for (let i = 0; i < library.length; i++) {
    // Crea la card principale
    const card = document.createElement("div");
    card.className = "card";

    // Dettagli libro
    const bookDetails = document.createElement("div");
    bookDetails.className = "book-details";

    const titleDiv = document.createElement("div");
    titleDiv.className = "title";
    titleDiv.textContent = library[i].title;

    const authorDiv = document.createElement("div");
    authorDiv.className = "author";
    authorDiv.textContent = library[i].author;

    const pagesDiv = document.createElement("div");
    pagesDiv.className = "pages";
    pagesDiv.textContent = `Pages: ${library[i].pages}`;

    const readDiv = document.createElement("div");
    readDiv.className = "read";
    readDiv.textContent = `Read (Y/N)? ${library[i].read}`;

    // Assembla dettagli libro
    bookDetails.appendChild(titleDiv);
    bookDetails.appendChild(authorDiv);
    bookDetails.appendChild(pagesDiv);
    bookDetails.appendChild(readDiv);

    // Gruppo bottoni
    const buttonGroup = document.createElement("div");
    buttonGroup.className = "button-group";

    // Bottone "Mark as read"
    const markReadBtn = document.createElement("button");
    markReadBtn.type = "button";
    markReadBtn.className = "mark-read";
    markReadBtn.id = `markread-${library[i].id}`; // id unico!
    markReadBtn.textContent = "Mark as read";

    // Bottone "Delete book"
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete";
    deleteBtn.id = `delete-${library[i].id}`; // id unico!
    deleteBtn.textContent = "Delete book";

    buttonGroup.appendChild(markReadBtn);
    buttonGroup.appendChild(deleteBtn);

    // Assembla la card
    card.appendChild(bookDetails);
    card.appendChild(buttonGroup);

    // Inserisci la card nel contenitore cards
    cards.appendChild(card);
  }
}

const cardsContainer = document.getElementById("cards");
cardsContainer.addEventListener("click", function (e) {
  const markBtn = e.target.closest("button.mark-read");
  if (markBtn) {
    const bookId = markBtn.id.replace("markread-", "");
    const book = myLibrary.find((b) => b.id === bookId);
    if (book) {
      // use the prototype method instead of mutating inline
      book.toggleRead();
      viewBooks(myLibrary);
    }
    return;
  }

  const deleteBtn = e.target.closest("button.delete");
  if (deleteBtn) {
    const bookId = deleteBtn.id.replace("delete-", "");
    const idx = myLibrary.findIndex((b) => b.id === bookId);
    if (idx !== -1) {
      myLibrary.splice(idx, 1);
      viewBooks(myLibrary);
    }
    return;
  }
});

const sidebar = document.getElementById("add-book-form");
sidebar.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(sidebar);
  const title = (formData.get("title") || "").toString().trim();
  const author = (formData.get("author") || "").toString().trim();
  const pages = (formData.get("pages") || "").toString().trim();
  const read = (formData.get("read") || "").toString().trim();

  if (!title || !author || !pages) {
    return;
  }

  const newBook = new Book(title, author, pages, read);
  addBookToLibrary(newBook);
  viewBooks(myLibrary);
  sidebar.reset();
});

const theHobbit = new Book("The Hobbit", "Tolkien", "295", "No");
addBookToLibrary(theHobbit);

// Initial render
viewBooks(myLibrary);
