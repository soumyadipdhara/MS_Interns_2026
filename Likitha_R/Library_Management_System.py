class Book:
    total_books = 0 
    def __init__(self, book_id, title, author):
        self._book_id = book_id     
        self._title = title
        self._author = author
        self._available = True
        Book.total_books += 1
    def display(self):
        status = "Available" if self._available else "Issued"
        print(f"ID: {self._book_id} | Title: {self._title} | Author: {self._author} | Status: {status}")
    def issue(self):
        if self._available:
            self._available = False
            print(f" Book '{self._title}' issued successfully.")
        else:
            print(f" Book '{self._title}' is already issued.")

    def return_book(self):
        if not self._available:
            self._available = True
            print(f" Book '{self._title}' returned successfully.")
        else:
            print(f" Book '{self._title}' was not issued.")

    def is_available(self):
        return self._available

    @classmethod
    def get_total_books(cls):
        return cls.total_books

    @staticmethod
    def library_info():
        print(" Library is open from 9 AM to 5 PM.")

class EBook(Book):
    def __init__(self, book_id, title, author, file_size):
        super().__init__(book_id, title, author)
        self.file_size = file_size

    # Overriding display method (polymorphism)
    def display(self):
        status = "Available" if self._available else "Issued"
        print(f"[E-Book] ID: {self._book_id} | Title: {self._title} | Author: {self._author} | Size: {self.file_size}MB | Status: {status}")

class Library:
    def __init__(self):
        self.books = []

    def add_book(self, book):
        self.books.append(book)
        print(f"'{book._title}' added to library.")

    def display_books(self):
        print("\nLibrary Books:")
        if not self.books:
            print("No books available.")
            return
        for book in self.books:
            book.display()

    def search_book(self, title):
        print(f"\n Searching for '{title}'...")
        found = False
        for book in self.books:
            if book._title.lower() == title.lower():
                book.display()
                found = True
        if not found:
            print("Book not found.")

    def issue_book(self, title):
        for book in self.books:
            if book._title.lower() == title.lower():
                book.issue()
                return
        print(" Book not found.")

    def return_book(self, title):
        for book in self.books:
            if book._title.lower() == title.lower():
                book.return_book()
                return
        print(" Book not found.")

library = Library()


library.add_book(Book(1, "Python Basics", "elijah"))
library.add_book(Book(2, "Data Structures", "klaus"))
library.add_book(Book(3, "Algorithms", "Elena Gilbert"))
library.add_book(EBook(4, "Machine Learning", "Stepehn ", 5))
library.add_book(EBook(5, "Deep Learning", "Damon ", 8))


def menu():
    while True:
        print("\n======  Library Menu ======")
        print("1. Add Book")
        print("2. View Books")
        print("3. Search Book")
        print("4. Issue Book")
        print("5. Return Book")
        print("6. Total Books")
        print("7. Library Info")
        print("8. Exit")

        choice = input("Enter your choice: ")

        if choice == '1':
            b_id = int(input("Enter Book ID: "))
            title = input("Enter Title: ")
            author = input("Enter Author: ")
            book = Book(b_id, title, author)
            library.add_book(book)

        elif choice == '2':
            library.display_books()

        elif choice == '3':
            title = input("Enter title to search: ")
            library.search_book(title)

        elif choice == '4':
            title = input("Enter title to issue: ")
            library.issue_book(title)

        elif choice == '5':
            title = input("Enter title to return: ")
            library.return_book(title)

        elif choice == '6':
            print(f"📊 Total Books: {Book.get_total_books()}")

        elif choice == '7':
            Book.library_info()

        elif choice == '8':
            print("Exiting program")
            break

        else:
            print(" Invalid choice. Try again.")

menu()