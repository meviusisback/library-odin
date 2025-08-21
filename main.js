class Book {
  constructor(title, author, pages, read) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.read = read;
    this.id = crypto.randomUUID();
  }

  toggleRead() {
    this.read = this.read === "No" ? "Yes" : "No";
  }
}

class Library {
  constructor() {
    this.books = [];
  }

  addBook(book) {
    this.books.push(book);
  }

  removeBook(bookId) {
    const idx = this.books.findIndex((book) => book.id === bookId);
    if (idx != -1) {
      this.books.splice(idx, 1);
    }
  }

  getBook(bookId = null) {
    if (bookId) {
      return this.books.find((book) => book.id === bookId);
    }
    return this.books;
  }
}

class FormHandler {
  constructor(formElement) {
    this.form = formElement;
  }

  getFormData() {
    const formData = new FormData(this.form);
    return {
      title: formData.get("title").trim(),
      author: formData.get("author").trim(),
      pages: formData.get("pages").trim(),
      read: formData.get("read").trim(),
    };
  }

  validateForm(data) {
    return data.title && data.author && data.pages;
  }

  resetForm() {
    this.form.reset();
  }
}

class UIController {
  constructor(library, formHandler) {
    this.formElement = document.getElementById("add-book-form");
    this.cardsContainer = document.getElementById("cards");
    this.sidebar = document.getElementById("sidebar");
    this.newBookButton = document.getElementById("new-book");
    this.library = library;
    this.formHandler = formHandler;
    this.setupEventListeners();
  }

  setupEventListeners() {
    this.cardsContainer.addEventListener("click", (e) =>
      this.handleCardClick(e)
    );
    this.newBookButton.addEventListener("click", (e) => this.toggleSidebar());
    this.formElement.addEventListener("submit", (e) =>
      this.handleFormSubmit(e)
    );
  }

  handleCardClick(e) {
    const markBtn = e.target.closest("button.mark-read");
    if (markBtn) {
      const bookId = markBtn.id.replace("markread-", "");
      const book = this.library.getBook(bookId);
      if (book) {
        book.toggleRead();
        this.renderBooks(this.library.getBook());
      }
      return;
    }

    const deleteBtn = e.target.closest("button.delete");
    if (deleteBtn) {
      const bookId = deleteBtn.id.replace("delete-", "");
      this.library.removeBook(bookId);
      this.renderBooks(this.library.getBook());
      return;
    }
  }

  handleFormSubmit(event) {
    event.preventDefault();
    const formData = this.formHandler.getFormData();
    const newBook = new Book(
      formData.title,
      formData.author,
      formData.pages,
      formData.read
    );
    this.library.addBook(newBook);
    this.renderBooks(this.library.getBook());
    this.formHandler.resetForm();
    this.toggleSidebar();
  }

  toggleSidebar() {
    if (
      this.sidebar.style.display === "none" ||
      this.sidebar.style.display === ""
    ) {
      this.sidebar.style.display = "flex";
    } else {
      this.sidebar.style.display = "none";
    }
  }

  renderBooks(books) {
    this.cardsContainer.innerHTML = "";
    books.forEach((book) => {
      const card = this.createBookCard(book);
      this.cardsContainer.appendChild(card);
    });
  }

  createBookCard(book) {
    const card = document.createElement("div");
    card.className = "card";

    // Dettagli libro
    const bookDetails = document.createElement("div");
    bookDetails.className = "book-details";

    const titleDiv = document.createElement("div");
    titleDiv.className = "title";
    titleDiv.textContent = book.title;

    const authorDiv = document.createElement("div");
    authorDiv.className = "author";
    authorDiv.textContent = book.author;

    const pagesDiv = document.createElement("div");
    pagesDiv.className = "pages";
    pagesDiv.textContent = `Pages: ${book.pages}`;

    const readDiv = document.createElement("div");
    readDiv.className = "read";
    readDiv.textContent = `Read (Y/N)? ${book.read}`;

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
    markReadBtn.id = `markread-${book.id}`; // id unico!
    markReadBtn.textContent = "Mark as read";

    // Bottone "Delete book"
    const deleteBtn = document.createElement("button");
    deleteBtn.type = "button";
    deleteBtn.className = "delete";
    deleteBtn.id = `delete-${book.id}`; // id unico!
    deleteBtn.textContent = "Delete book";

    buttonGroup.appendChild(markReadBtn);
    buttonGroup.appendChild(deleteBtn);

    // Assembla la card
    card.appendChild(bookDetails);
    card.appendChild(buttonGroup);

    // Inserisci la card nel contenitore cards
    return card;
  }
}

class App {
  constructor() {
    this.library = new Library();
    this.formHandler = new FormHandler(
      document.getElementById("add-book-form")
    );
    this.uiController = new UIController(this.library, this.formHandler);
  }

  init() {
    const sampleBook = new Book("The Hobbit", "Tolkien", "295", "No");
    this.library.addBook(sampleBook);
    this.uiController.renderBooks(this.library.getBook());
  }
}

const app = new App();
app.init();
