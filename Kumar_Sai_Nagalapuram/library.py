class Book:
    library_name="Library"
    def __init__(self, book_id, title, author):
        self.book_id=book_id
        self.title=title
        self.author=author
        self._available=True
    def display(self):
        status="Available" if self._available else "Issued"
        print(f"ID:{self.book_id}")
        print(f"Title:{self.title}")
        print(f"Author:{self.author}")
        print(f"Status:{status}")
        print("-"*30)
    @classmethod
    def change_library_name(cls, name):
        cls.change_name=name
    @staticmethod
    def library_info():
        print("Welcome to Library Management System")
class EBook(Book):
    def __init__(self, book_id, title, author, file_size):
        super().__init__(book_id, title, author)
        self.file_size=file_size
    def display(self):
        status="Available" if self._available else "Issued"
        print(f"ID:{self.book_id}")
        print(f"Title:{self.title}")
        print(f"Author:{self.author}")
        print(f"FeleSize:{self.file_size} MB")
        print(f"Status:{status}")
        print("-"*30)
class Library:
    def __init__(self):
        self.book=[]
    def add_book(self, book):
        self.book.append(book)
        print("Book added successfully")
    def display_book(self):
        for book in self.book:
            book.display()
    def search_book(self, title):
        for book in self.book:
            if book.title.lower()==title.lower():
                return book
        return None
    def issue_book(self, title):
        book=self.search_book(title)
        if book:
            if book._available:
                book._available=False
                print("Book Issued successfully")
            else:
                print("Book Already Issued")
        else:
            print("Book not Found")
    def return_book(self, title):
        book=self.search_book(title)
        if book:
            if not book._available:
                book._available=True
                print("Book returned successfully")
            else:
                print("Book is already available")
        else:
            print("Book not Found")
Book.library_info()
library=Library()
library.add_book(Book(1, "Python Basics", "John"))
library.add_book(Book(2, "Data Structure", "Sai"))
library.add_book(Book(3, "SQL Guide", "Dipika"))
library.add_book(Book(4, "Machine Learning", "Akankshya"))
library.add_book(EBook(5, "AI Fundamentals", "Aditi",10))
while True:
    print("\n1. Add Book")
    print("2. View Book")
    print("3. Search Book")
    print("4. Issue Book")
    print("5. Return Book")
    print("6. Exit")
    choice=input("Enter your choice:")
    if choice=="1":
        book_id=int(input("Enter Book ID: "))
        title=input("Enter Title: ")
        author=input("Author: ")
        library.add_book(Book(book_id,title,author))
    elif choice=="2":
        library.display_book()
    elif choice=="3":
        title=input("Entet Title: ")
        book=library.search_book(title)
        if book:
            book.display()
        else:
            print("Book not Found")
    elif choice=="4":
        title=input("Enter title to issue: ")
        library.issue_book(title)
    elif choice=="5":
        title=input("Enter title to return: ")
        library.return_book(title)
    elif choice=="6":
        print("Thank You")
        break
    else:
        print("Invalid Choice")
