//? book class : represents a book class
class Book {
    constructor(title, author,isbn){
        this.title = title;
        this.author = author;
        this.isbn = isbn;
    }
}

//?UI Class: handles Ui tasks
class UI {
    static displaybooks (){

    const book = Store.getBooks();

    book.forEach((books)=>UI.addBooktoList(books));
    }

   static addBooktoList(books){
        const  list = document.querySelector('#book-list');

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>${books.title}</td>
            <td>${books.author}</td>
            <td>${books.isbn}</td>
            <td><a href="#" class = "btn btn-danger btn-sm delete">X</a></td>
        `;
    list.appendChild(row)
   } 

   static showAlert(message,classname)  {
        const div = document.createElement('div');
        div.className = `alert alert-${classname}`;
        div.appendChild(document.createTextNode(message));
        const container = document.querySelector('.container');
        const form = document.querySelector("#book-form");
        container.insertBefore(div, form);

        //*hiding the alert message after few sec's
        setTimeout(() => {document.querySelector('.alert').remove()},1000)
   } 
    
   static clearFields(){
        document.querySelector('#title').value = '';
        document.querySelector('#Author').value = '';
        document.querySelector('#ISBN').value = '';
   }

   static deleteBook(el){
        if(el.classList.contains('delete')){
            el.parentElement.parentElement.remove();
        }
   }
}



//?Repository class : handles storage tasks
class Store {
    static  getBooks() {
        let books ;
        if(localStorage.getItem('books') === null) {
            books = [];
        } else {
            books = JSON.parse(localStorage.getItem('books'));
        }

        return books;
    }
    static addBooks(book) {
        const books = Store.getBooks();

        books.push(book);

        localStorage.setItem('books', JSON.stringify(books));
    }
    static  removebooks(isbn) {
        const books = Store.getBooks();

        books.forEach((book,index) => {
            if(book.isbn === isbn) {
                books.splice(index, 1);
            }
        });

        localStorage.setItem('books', JSON.stringify(books));
    }
}


//?events to display list
document.addEventListener('DOMContentLoaded',UI.displaybooks())


//?event to add book to list
document.querySelector('#book-form').addEventListener('submit',(event) => {

    //*prevent actual submit event
    event.preventDefault();

    //* get form values
    const title = document.querySelector('#title').value;
    
    const author = document.querySelector('#Author').value;

    const isbn = document.querySelector('#ISBN').value;

    //*validation of empty code
    if(title === '' || author === '' || isbn === '') {
       UI.showAlert('Please enter all the information','warning')
    } else {

    //*instantiation of new book
    
    const newBook = new Book(title,author,isbn);

    console.log(newBook);

    //*addingbook to Ui
    UI.addBooktoList(newBook);

    //*add book to repoitiry
    Store.addBooks(newBook);

    //*showing the success message to user upon book addition
    UI.showAlert('Book added','success');

    //*clear fields 
    UI.clearFields();

    } 

});


//?event to remove book from list

document.querySelector('#book-list').addEventListener('click', (event) => {
    UI.deleteBook(event.target);
    Store.removebooks(event.target.parentElement.previousElementSibling.textContent);
    UI.showAlert('book removed', 'danger');
})