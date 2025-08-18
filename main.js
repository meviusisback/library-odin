function Book(title, author, pages, read) {
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.info = function () {
    return `${this.title} by ${this.author}, ${this.pages} pages, ${this.read}`;
  };
}
theHobbit = new Book("The Hobbit", "Tolkien", "295", "not read yet");

console.log(theHobbit.info());

