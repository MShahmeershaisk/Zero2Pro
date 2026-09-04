require("dotenv").config();
const mongoose = require("mongoose");
const Test = require("./models/test");

// Question bank ko 4 fixed ID ranges mein rakha gaya hai taake category ko
// naam (string match) ke bajaye seedhe number range se call kiya ja sake,
// aur random 35 nikalna bhi seedha ho (bas range ke andar se random numbers
// pick karo, string comparison ki zaroorat hi nahi):
//   qNum   1 -  100  -> Python
//   qNum 101 -  200  -> Java
//   qNum 201 -  300  -> HTML
//   qNum 301 -  400  -> JavaScript
const questions = [
  {
    "qNum": 1,
    "questionText": "Who developed the Python programming language?",
    "options": [
      "Guido van Rossum",
      "Bjarne Stroustrup",
      "Dennis Ritchie",
      "James Gosling"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 2,
    "questionText": "File extension used for Python source files?",
    "options": [
      ".p",
      ".python",
      ".py",
      ".pyt"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 3,
    "questionText": "Single-line comment symbol in Python?",
    "options": [
      "//",
      "#",
      "--",
      "/* */"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 4,
    "questionText": "Function used to display output in Python?",
    "options": [
      "System.out.println()",
      "print()",
      "console.log()",
      "echo()"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 5,
    "questionText": "What is PIP?",
    "options": [
      "Python Interpreter Program",
      "Package manager for Python modules",
      "Programming Interface Protocol",
      "Python Installation Package"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 6,
    "questionText": "Which is a built-in Python module?",
    "options": [
      "flask",
      "os",
      "requests",
      "django"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 7,
    "questionText": "Symbol used for exponentiation in Python?",
    "options": [
      "^",
      "**",
      "pow",
      "//"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 8,
    "questionText": "type(3.14) belongs to which class?",
    "options": [
      "bool",
      "float",
      "int",
      "str"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 9,
    "questionText": "Function used to take user input in Python?",
    "options": [
      "read()",
      "get()",
      "input()",
      "scan()"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 10,
    "questionText": "Default return type of input()?",
    "options": [
      "str",
      "int",
      "bool",
      "float"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 11,
    "questionText": "Are Python strings mutable?",
    "options": [
      "No, immutable",
      "Yes, mutable",
      "Only with .set()",
      "Depends on version"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 12,
    "questionText": "What does len('Harry') return?",
    "options": [
      "Error",
      "6",
      "5",
      "4"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 13,
    "questionText": "What does 'amazing'[1:6:2] output?",
    "options": [
      "aiz",
      "amz",
      "mzi",
      "mzn"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 14,
    "questionText": "How do you create an empty list?",
    "options": [
      "list = set()",
      "list = {}",
      "list = ()",
      "list = []"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 15,
    "questionText": "Which list method adds an item at the end?",
    "options": [
      "push()",
      "add()",
      "insert()",
      "append()"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 16,
    "questionText": "Key difference between list and tuple?",
    "options": [
      "Tuple allows duplicates, list does not",
      "List is mutable, tuple is immutable",
      "No difference",
      "List is ordered, tuple is unordered"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 17,
    "questionText": "Correct way to declare a single-element tuple with value 5?",
    "options": [
      "t = tuple(5)",
      "t = (5)",
      "t = (5,)",
      "t = [5]"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 18,
    "questionText": "Method that returns the index of a value in a list?",
    "options": [
      "locate()",
      "index()",
      "find()",
      "search()"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 19,
    "questionText": "What does list.pop(2) do?",
    "options": [
      "Removes and returns the item at index 2",
      "Pops 2 items",
      "Adds 2 to the list",
      "Removes value 2"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 20,
    "questionText": "What is list comprehension?",
    "options": [
      "A sorting algorithm",
      "A way to compress a file",
      "A memory leak check",
      "Concise syntax to build lists from iterables"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 21,
    "questionText": "Which data structure stores key-value pairs in Python?",
    "options": [
      "List",
      "Dictionary",
      "Set",
      "Tuple"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 22,
    "questionText": "Dictionary keys must be?",
    "options": [
      "Always numbers",
      "Mutable",
      "Lists",
      "Immutable (hashable)"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 23,
    "questionText": "Safe way to access a dict value that might be missing?",
    "options": [
      "d['name']",
      "d.find('name')",
      "d.get('name')",
      "d.value('name')"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 24,
    "questionText": "A Set in Python is best described as?",
    "options": [
      "A key-value container",
      "An ordered sequence with duplicates",
      "An unordered collection of unique elements",
      "An immutable list"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 25,
    "questionText": "Method used to add an item to a set?",
    "options": [
      "insert()",
      "push()",
      "append()",
      "add()"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 26,
    "questionText": "Python keyword that replaces 'else if'?",
    "options": [
      "elseif",
      "elif",
      "if else",
      "else if"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 27,
    "questionText": "Purpose of indentation in Python?",
    "options": [
      "Styling only",
      "Speed optimization",
      "To define code blocks / scope",
      "Comment formatting"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 28,
    "questionText": "Result of the 'and' operator when both operands are true?",
    "options": [
      "True",
      "Error",
      "False",
      "None"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 29,
    "questionText": "What does s.union(s2) do on two sets?",
    "options": [
      "Returns common items only",
      "Empties both sets",
      "Removes items",
      "Combines unique items from both sets"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 30,
    "questionText": "Result of 20 == 20.0 in Python?",
    "options": [
      "None",
      "True",
      "False",
      "TypeError"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 31,
    "questionText": "Loop best suited for a known sequence or range?",
    "options": [
      "do-while loop",
      "repeat loop",
      "while loop",
      "for loop"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 32,
    "questionText": "What does range(0, 5) generate?",
    "options": [
      "1,2,3,4,5",
      "0, 1, 2, 3, 4",
      "0,1,2,3,4,5",
      "0, 5"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 33,
    "questionText": "What does the 'pass' statement do?",
    "options": [
      "Exits the loop",
      "Raises an error",
      "Skips an iteration",
      "Nothing, it's a placeholder"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 34,
    "questionText": "Keyword used to define a function?",
    "options": [
      "func",
      "def",
      "define",
      "function"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 35,
    "questionText": "A lambda function is best described as?",
    "options": [
      "A recursive function",
      "A built-in class method",
      "A function with no arguments",
      "An anonymous single-expression function"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 36,
    "questionText": "Recursion is best described as?",
    "options": [
      "Exception handling",
      "Importing an external module",
      "A loop that never ends",
      "A function calling itself"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 37,
    "questionText": "How to set a default argument value?",
    "options": [
      "def func(x == 10):",
      "def func(x : 10):",
      "def func(val x = 10):",
      "def func(x = 10):"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 38,
    "questionText": "Keyword used to return a value from a function?",
    "options": [
      "send",
      "output",
      "return",
      "yield"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 39,
    "questionText": "Purpose of the 'global' keyword?",
    "options": [
      "Declare a class",
      "Modify a variable defined outside the local scope",
      "Print globally",
      "Make a variable accessible over the internet"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 40,
    "questionText": "What does enumerate(iterable) return?",
    "options": [
      "Pairs of (index, element)",
      "A reversed list",
      "A sorted list",
      "The length of the iterable"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 41,
    "questionText": "Keyword used to declare a class?",
    "options": [
      "class",
      "object",
      "struct",
      "define"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 42,
    "questionText": "What is __init__ in a Python class?",
    "options": [
      "A built-in module",
      "A private variable",
      "A destructor method",
      "The constructor, called on instantiation"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 43,
    "questionText": "What does 'self' represent in a class method?",
    "options": [
      "A global variable",
      "The module",
      "The instance calling the method",
      "The parent class"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 44,
    "questionText": "Correct syntax to inherit class B from class A?",
    "options": [
      "class B inherits A:",
      "class B : public A",
      "class B extends A:",
      "class B(A):"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 45,
    "questionText": "Decorator that turns a method into a property getter?",
    "options": [
      "@classmethod",
      "@getter",
      "@staticmethod",
      "@property"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 46,
    "questionText": "How are exceptions handled in Python?",
    "options": [
      "do-except block",
      "error-handle block",
      "try-catch block",
      "try-except block"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 47,
    "questionText": "Which block always runs regardless of an exception?",
    "options": [
      "catch",
      "except",
      "finally",
      "else"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 48,
    "questionText": "Keyword used to manually raise an exception?",
    "options": [
      "raise",
      "trigger",
      "error",
      "throw"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 49,
    "questionText": "A module in Python is best described as?",
    "options": [
      "A syntax rule",
      "A hardware component",
      "A file containing Python code and definitions",
      "A loop type"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 50,
    "questionText": "What does 'if __name__ == \"__main__\":' check?",
    "options": [
      "If the script has errors",
      "If a variable is named main",
      "If the script is run directly",
      "If a file exists"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 51,
    "questionText": "What does sorted([3,1,2]) return?",
    "options": [
      "[1, 2, 3]",
      "[3,2,1]",
      "[3,1,2]",
      "Error"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 52,
    "questionText": "What does range(3, 10) generate?",
    "options": [
      "4, 5, 6, 7, 8, 9, 10",
      "4, 5, 6, 7, 8, 9",
      "3, 4, 5, 6, 7, 8, 9",
      "3, 4, 5, 6, 7, 8, 9, 10"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 53,
    "questionText": "What is the type of {'a': 1} in Python?",
    "options": [
      "list",
      "set",
      "tuple",
      "dict"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 54,
    "questionText": "What does 'python'.upper() return?",
    "options": [
      "PYTHON",
      "python",
      "nohtyp",
      "Error"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 55,
    "questionText": "What does 'PROGRAMMING'.lower() return?",
    "options": [
      "Error",
      "PROGRAMMING",
      "GNIMMARGORP",
      "programming"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 56,
    "questionText": "What is the result of 5 ** 2 in Python?",
    "options": [
      "24",
      "50",
      "25",
      "26"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 57,
    "questionText": "Given L = list('abcdefgh'), what does ''.join(L[2:7:1]) output?",
    "options": [
      "gfedc",
      "cdefg",
      "cdef",
      "cdefgx"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 58,
    "questionText": "What does [1,2,3] + [4,5] return in Python?",
    "options": [
      "[1,2,3,[4,5]]",
      "[1, 2, 3, 4, 5]",
      "Error",
      "[5, 7, 8]"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 59,
    "questionText": "What does sum([1, 2, 3, 4]) return?",
    "options": [
      "9",
      "10",
      "0",
      "24"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 60,
    "questionText": "What does range(0, 3) generate?",
    "options": [
      "0, 1, 2, 3",
      "1, 2",
      "1, 2, 3",
      "0, 1, 2"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 61,
    "questionText": "What does len('Variable') return?",
    "options": [
      "9",
      "8",
      "7",
      "10"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 62,
    "questionText": "What does len('Generator') return?",
    "options": [
      "8",
      "10",
      "9",
      "11"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 63,
    "questionText": "What does len('Language') return?",
    "options": [
      "10",
      "9",
      "8",
      "7"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 64,
    "questionText": "What does max([3, 9, 2, 7]) return?",
    "options": [
      "2",
      "9",
      "7",
      "3"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 65,
    "questionText": "Given L = list('abcdefgh'), what does ''.join(L[1:8:2]) output?",
    "options": [
      "bdfh",
      "bdf",
      "hfdb",
      "bdfhx"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 66,
    "questionText": "What is the result of 2 ** 3 in Python?",
    "options": [
      "9",
      "7",
      "8",
      "16"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 67,
    "questionText": "What does len('Developer') return?",
    "options": [
      "10",
      "11",
      "9",
      "8"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 68,
    "questionText": "What is the result of 4 ** 2 in Python?",
    "options": [
      "17",
      "15",
      "16",
      "32"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 69,
    "questionText": "What does range(4, 9) generate?",
    "options": [
      "4, 5, 6, 7, 8, 9",
      "4, 5, 6, 7, 8",
      "5, 6, 7, 8, 9",
      "5, 6, 7, 8"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 70,
    "questionText": "What does [1,2,3] * 2 return in Python?",
    "options": [
      "Error",
      "[2, 4, 6]",
      "[1, 2, 3, 1, 2, 3]",
      "[1,2,3]"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 71,
    "questionText": "What does len('Programming') return?",
    "options": [
      "12",
      "10",
      "11",
      "13"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 72,
    "questionText": "What is the result of 15 % 6 in Python?",
    "options": [
      "2",
      "3",
      "6",
      "4"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 73,
    "questionText": "What does 'Data Science'.startswith('Data') return?",
    "options": [
      "Error",
      "True",
      "ecneicS ataD",
      "Data Science"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 74,
    "questionText": "What does range(2, 8) generate?",
    "options": [
      "2, 3, 4, 5, 6, 7, 8",
      "3, 4, 5, 6, 7",
      "3, 4, 5, 6, 7, 8",
      "2, 3, 4, 5, 6, 7"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 75,
    "questionText": "What does bool('') return in Python?",
    "options": [
      "False",
      "Error",
      "True",
      "''"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 76,
    "questionText": "What does len('Function') return?",
    "options": [
      "9",
      "10",
      "8",
      "7"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 77,
    "questionText": "Given L = list('abcdefgh'), what does ''.join(L[1:5:1]) output?",
    "options": [
      "bcd",
      "bcdex",
      "edcb",
      "bcde"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 78,
    "questionText": "What does 'banana'.count('a') return?",
    "options": [
      "ananab",
      "banana",
      "Error",
      "3"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 79,
    "questionText": "What does 'level'.capitalize() return?",
    "options": [
      "level",
      "Error",
      "Level_3",
      "Level"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 80,
    "questionText": "What does 10 / 3 return in Python?",
    "options": [
      "3",
      "4",
      "3.3333333333333335",
      "3.3"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 81,
    "questionText": "What does list(reversed([1,2,3])) return?",
    "options": [
      "[3, 2, 1]",
      "Error",
      "[1,2,3]",
      "[2,1,3]"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 82,
    "questionText": "What does 'Data Science'.endswith('Code') return?",
    "options": [
      "False",
      "ecneicS ataD",
      "Error",
      "Data Science"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 83,
    "questionText": "What does range(1, 6) generate?",
    "options": [
      "1, 2, 3, 4, 5",
      "1, 2, 3, 4, 5, 6",
      "2, 3, 4, 5",
      "2, 3, 4, 5, 6"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 84,
    "questionText": "What does bool(0) return in Python?",
    "options": [
      "Error",
      "False",
      "0",
      "True"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 85,
    "questionText": "What is the result of 3 ** 2 in Python?",
    "options": [
      "18",
      "10",
      "9",
      "8"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 86,
    "questionText": "What is the result of 9 % 2 in Python?",
    "options": [
      "1",
      "2",
      "0",
      "4"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 87,
    "questionText": "What is the result of 7 % 3 in Python?",
    "options": [
      "2",
      "0",
      "1",
      "4"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 88,
    "questionText": "What is the result of 10 % 4 in Python?",
    "options": [
      "3",
      "1",
      "2",
      "5"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 89,
    "questionText": "What is the type of {1, 2, 3} in Python?",
    "options": [
      "list",
      "tuple",
      "set",
      "dict"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 90,
    "questionText": "What does len('Iterator') return?",
    "options": [
      "9",
      "8",
      "10",
      "7"
    ],
    "correctAnswerIndex": 1,
    "category": "Python"
  },
  {
    "qNum": 91,
    "questionText": "What is the result of 2 ** 5 in Python?",
    "options": [
      "31",
      "33",
      "32",
      "64"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 92,
    "questionText": "What does min([3, 9, 2, 7]) return?",
    "options": [
      "3",
      "7",
      "2",
      "9"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 93,
    "questionText": "What is the result of 20 % 7 in Python?",
    "options": [
      "5",
      "7",
      "6",
      "9"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 94,
    "questionText": "What does len('Python') return?",
    "options": [
      "6",
      "5",
      "8",
      "7"
    ],
    "correctAnswerIndex": 0,
    "category": "Python"
  },
  {
    "qNum": 95,
    "questionText": "Given L = list('abcdefgh'), what does ''.join(L[0:6:2]) output?",
    "options": [
      "eca",
      "ac",
      "ace",
      "acex"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 96,
    "questionText": "Given L = list('abcdefgh'), what does ''.join(L[0:8:3]) output?",
    "options": [
      "adgx",
      "gda",
      "adg",
      "ad"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 97,
    "questionText": "What does 10 // 3 return in Python?",
    "options": [
      "4",
      "1",
      "3",
      "3.33"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 98,
    "questionText": "What does '  spaced  '.strip() return?",
    "options": [
      "Error",
      "  spaced  ",
      "spaced",
      "  decaps  "
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 99,
    "questionText": "What does 'a,b,c,d'.split(',') return?",
    "options": [
      "a,b,c,d",
      "Error",
      "d,c,b,a",
      "['a', 'b', 'c', 'd']"
    ],
    "correctAnswerIndex": 3,
    "category": "Python"
  },
  {
    "qNum": 100,
    "questionText": "What does 'hello-world'.replace('-', ' ') return?",
    "options": [
      "dlrow-olleh",
      "Error",
      "hello world",
      "hello-world"
    ],
    "correctAnswerIndex": 2,
    "category": "Python"
  },
  {
    "qNum": 101,
    "questionText": "Which of the following is NOT a primitive data type in Java?",
    "options": [
      "char",
      "int",
      "String",
      "boolean"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 102,
    "questionText": "What is the size of an int in Java?",
    "options": [
      "4 bytes",
      "2 bytes",
      "1 byte",
      "8 bytes"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 103,
    "questionText": "Which keyword declares a constant in Java?",
    "options": [
      "immutable",
      "static",
      "final",
      "const"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 104,
    "questionText": "What is the default value of a boolean instance variable in Java?",
    "options": [
      "false",
      "0",
      "null",
      "true"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 105,
    "questionText": "Which Scanner method reads an integer?",
    "options": [
      "nextInt()",
      "inputInt()",
      "readInt()",
      "getInteger()"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 106,
    "questionText": "Recommended naming convention for Java classes?",
    "options": [
      "kebab-case",
      "snake_case",
      "PascalCase",
      "camelCase"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 107,
    "questionText": "Size of a double in Java?",
    "options": [
      "2 bytes",
      "4 bytes",
      "8 bytes",
      "16 bytes"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 108,
    "questionText": "Which primitive type supports Unicode characters?",
    "options": [
      "char",
      "int",
      "short",
      "byte"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 109,
    "questionText": "What is Java bytecode?",
    "options": [
      "Platform-independent intermediate code",
      "JavaScript code",
      "Source code file",
      "Machine code for CPU"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 110,
    "questionText": "Which component executes Java bytecode?",
    "options": [
      "JDB",
      "JVM",
      "Text editor",
      "JDK compiler"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 111,
    "questionText": "Operator used for String concatenation?",
    "options": [
      "+",
      "%",
      "->",
      "&"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 112,
    "questionText": "Is String mutable in Java?",
    "options": [
      "Yes, mutable",
      "No, immutable",
      "Depends on JVM",
      "Only in loops"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 113,
    "questionText": "Method to compare strings ignoring case?",
    "options": [
      "equals()",
      "equalsIgnoreCase()",
      "sameAs()",
      "compareTo()"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 114,
    "questionText": "What does the % operator calculate?",
    "options": [
      "Power",
      "Remainder",
      "Percentage",
      "Division"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 115,
    "questionText": "What does String.trim() do?",
    "options": [
      "Reverses string",
      "Converts to lowercase",
      "Deletes the string",
      "Removes leading/trailing spaces"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 116,
    "questionText": "Which class provides a mutable sequence of characters?",
    "options": [
      "String",
      "StringBuilder",
      "CharBuffer",
      "StringList"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 117,
    "questionText": "Which statement exits a loop early?",
    "options": [
      "break",
      "continue",
      "skip",
      "exit"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 118,
    "questionText": "Which loop executes at least once?",
    "options": [
      "while",
      "for-each",
      "do-while",
      "for"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 119,
    "questionText": "What does continue do inside a loop?",
    "options": [
      "Terminates loop",
      "Skips to next iteration",
      "Restarts loop",
      "Exits program"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 120,
    "questionText": "Purpose of default in a switch statement?",
    "options": [
      "Terminates loop",
      "Runs first always",
      "Handles errors only",
      "Executes when no case matches"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 121,
    "questionText": "Correct for-each syntax over int[] arr?",
    "options": [
      "foreach (x in arr)",
      "for (int x : arr)",
      "for (int x in arr)",
      "for (arr : int x)"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 122,
    "questionText": "What is an infinite loop?",
    "options": [
      "A loop whose condition never becomes false",
      "A loop that runs 100 times",
      "A loop without variables",
      "A loop with a syntax error"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 123,
    "questionText": "Java's short-circuit logical AND operator?",
    "options": [
      "||",
      "&",
      "AND",
      "&&"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 124,
    "questionText": "Type an if condition must evaluate to in Java?",
    "options": [
      "int",
      "boolean",
      "String",
      "Object"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 125,
    "questionText": "Correct array declaration in Java?",
    "options": [
      "int[] arr = new int[5];",
      "array int arr = 5;",
      "int arr = new array(5);",
      "List arr = 5;"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 126,
    "questionText": "Index of the first element of a Java array?",
    "options": [
      "Depends on size",
      "-1",
      "1",
      "0"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 127,
    "questionText": "How to find array length of 'marks'?",
    "options": [
      "marks.length",
      "marks.length()",
      "marks.count",
      "marks.size()"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 128,
    "questionText": "What does DRY stand for?",
    "options": [
      "Do Repeat Yourself",
      "Data Realization Yield",
      "Direct Runtime Yield",
      "Don't Repeat Yourself"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 129,
    "questionText": "A Class in OOP is best described as?",
    "options": [
      "A built-in variable",
      "A database record",
      "An instance of an object",
      "A blueprint for creating objects"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 130,
    "questionText": "Which OOP pillar hides implementation details?",
    "options": [
      "Inheritance",
      "Polymorphism",
      "Encapsulation",
      "Abstraction"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 131,
    "questionText": "Keyword used to inherit a class in Java?",
    "options": [
      "extends",
      "implements",
      "super",
      "inherits"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 132,
    "questionText": "What is method overloading?",
    "options": [
      "Calling method recursively",
      "Deleting a method",
      "Same signature in subclass",
      "Same method name, different parameters, same class"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 133,
    "questionText": "What is method overriding?",
    "options": [
      "Creating methods with different parameters",
      "Static method declaration",
      "Redefining a parent method in a subclass with same signature",
      "Overloading constructors"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 134,
    "questionText": "Keyword referring to the immediate parent class object?",
    "options": [
      "this",
      "super",
      "base",
      "parent"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 135,
    "questionText": "Keyword used to define an interface?",
    "options": [
      "class",
      "interface",
      "abstract",
      "implements"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 136,
    "questionText": "Can a Java class extend multiple classes?",
    "options": [
      "Yes",
      "No",
      "Only if abstract",
      "Up to 3 classes"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 137,
    "questionText": "Access modifier limiting visibility to the same class?",
    "options": [
      "public",
      "protected",
      "default",
      "private"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 138,
    "questionText": "Which block always executes regardless of exceptions?",
    "options": [
      "catch",
      "finally",
      "throws",
      "try"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 139,
    "questionText": "Keyword to explicitly throw an exception?",
    "options": [
      "catch",
      "try",
      "throw",
      "throws"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 140,
    "questionText": "A Thread in Java is best described as?",
    "options": [
      "A file format",
      "A lightweight sub-process",
      "A database connection",
      "A hardware pin"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 141,
    "questionText": "Interface implemented to create a thread using Runnable?",
    "options": [
      "Threadable",
      "Executable",
      "Task",
      "Runnable"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 142,
    "questionText": "Root superclass of all Java classes?",
    "options": [
      "Object",
      "Class",
      "System",
      "Base"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 143,
    "questionText": "Package containing ArrayList and Scanner?",
    "options": [
      "java.net",
      "java.util",
      "java.lang",
      "java.io"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 144,
    "questionText": "ArithmeticException is what type of exception?",
    "options": [
      "Unchecked / Runtime",
      "Compile-time error",
      "Fatal error",
      "Checked"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 145,
    "questionText": "Which collection does not allow duplicate elements?",
    "options": [
      "ArrayList",
      "LinkedList",
      "HashSet",
      "Vector"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 146,
    "questionText": "Which keyword prevents a class from being subclassed?",
    "options": [
      "private",
      "static",
      "final",
      "protected"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 147,
    "questionText": "What does 'static' mean for a Java member?",
    "options": [
      "Belongs to the class, not instances",
      "Always private",
      "Runs only once ever",
      "Cannot be changed"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 148,
    "questionText": "Which loop type is best for a known, fixed number of iterations?",
    "options": [
      "for loop",
      "do-while loop",
      "while loop",
      "infinite loop"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 149,
    "questionText": "What is autoboxing in Java?",
    "options": [
      "Automatic conversion between primitives and wrapper classes",
      "Compiling code automatically",
      "Boxing arrays into lists",
      "Automatic memory cleanup"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 150,
    "questionText": "Which exception occurs on dividing an int by zero?",
    "options": [
      "ArithmeticException",
      "IOException",
      "ClassCastException",
      "NullPointerException"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 151,
    "questionText": "In Java integer arithmetic, what is the result of 18 * 5?",
    "options": [
      "91",
      "90",
      "92",
      "89"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 152,
    "questionText": "In Java integer arithmetic, what is the result of 15 % 2?",
    "options": [
      "0",
      "1",
      "3",
      "2"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 153,
    "questionText": "In Java integer arithmetic, what is the result of 18 + 5?",
    "options": [
      "25",
      "23",
      "22",
      "24"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 154,
    "questionText": "In Java integer arithmetic, what is the result of 20 % 6?",
    "options": [
      "4",
      "3",
      "2",
      "1"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 155,
    "questionText": "In Java integer arithmetic, what is the result of 18 - 5?",
    "options": [
      "12",
      "13",
      "15",
      "14"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 156,
    "questionText": "In Java integer arithmetic, what is the result of 7 + 4?",
    "options": [
      "12",
      "13",
      "10",
      "11"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 157,
    "questionText": "In Java integer arithmetic, what is the result of 18 % 5?",
    "options": [
      "2",
      "5",
      "3",
      "4"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 158,
    "questionText": "In Java integer arithmetic, what is the result of 13 % 6?",
    "options": [
      "2",
      "1",
      "3",
      "0"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 159,
    "questionText": "In Java integer arithmetic, what is the result of 12 % 7?",
    "options": [
      "4",
      "6",
      "5",
      "7"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 160,
    "questionText": "In Java integer arithmetic, what is the result of 9 % 5?",
    "options": [
      "3",
      "4",
      "6",
      "5"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 161,
    "questionText": "In Java integer arithmetic, what is the result of 25 + 4?",
    "options": [
      "31",
      "30",
      "29",
      "28"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 162,
    "questionText": "In Java integer arithmetic, what is the result of 13 / 6?",
    "options": [
      "1",
      "4",
      "2",
      "3"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 163,
    "questionText": "In Java integer arithmetic, what is the result of 20 / 6?",
    "options": [
      "3",
      "4",
      "2",
      "5"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 164,
    "questionText": "In Java integer arithmetic, what is the result of 20 + 6?",
    "options": [
      "27",
      "28",
      "26",
      "25"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 165,
    "questionText": "In Java integer arithmetic, what is the result of 13 - 6?",
    "options": [
      "9",
      "8",
      "7",
      "6"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 166,
    "questionText": "In Java integer arithmetic, what is the result of 8 + 3?",
    "options": [
      "12",
      "13",
      "11",
      "10"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 167,
    "questionText": "In Java integer arithmetic, what is the result of 10 - 3?",
    "options": [
      "6",
      "9",
      "8",
      "7"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 168,
    "questionText": "In Java integer arithmetic, what is the result of 7 / 4?",
    "options": [
      "1",
      "3",
      "2",
      "0"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 169,
    "questionText": "In Java integer arithmetic, what is the result of 7 - 4?",
    "options": [
      "4",
      "2",
      "3",
      "5"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 170,
    "questionText": "In Java integer arithmetic, what is the result of 10 * 3?",
    "options": [
      "32",
      "30",
      "31",
      "29"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 171,
    "questionText": "In Java integer arithmetic, what is the result of 18 / 5?",
    "options": [
      "4",
      "3",
      "5",
      "2"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 172,
    "questionText": "In Java integer arithmetic, what is the result of 8 - 3?",
    "options": [
      "7",
      "4",
      "5",
      "6"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 173,
    "questionText": "In Java integer arithmetic, what is the result of 9 + 5?",
    "options": [
      "16",
      "14",
      "15",
      "13"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 174,
    "questionText": "In Java integer arithmetic, what is the result of 8 * 3?",
    "options": [
      "23",
      "24",
      "26",
      "25"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 175,
    "questionText": "In Java integer arithmetic, what is the result of 25 - 4?",
    "options": [
      "22",
      "23",
      "20",
      "21"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 176,
    "questionText": "In Java integer arithmetic, what is the result of 10 + 3?",
    "options": [
      "12",
      "14",
      "15",
      "13"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 177,
    "questionText": "In Java integer arithmetic, what is the result of 15 * 2?",
    "options": [
      "30",
      "32",
      "29",
      "31"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 178,
    "questionText": "In Java integer arithmetic, what is the result of 15 - 2?",
    "options": [
      "12",
      "14",
      "13",
      "15"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 179,
    "questionText": "In Java integer arithmetic, what is the result of 12 + 7?",
    "options": [
      "20",
      "21",
      "19",
      "18"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 180,
    "questionText": "In Java integer arithmetic, what is the result of 8 / 3?",
    "options": [
      "2",
      "1",
      "4",
      "3"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 181,
    "questionText": "In Java integer arithmetic, what is the result of 13 + 6?",
    "options": [
      "19",
      "21",
      "18",
      "20"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 182,
    "questionText": "In Java integer arithmetic, what is the result of 9 - 5?",
    "options": [
      "4",
      "3",
      "6",
      "5"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 183,
    "questionText": "In Java integer arithmetic, what is the result of 25 / 4?",
    "options": [
      "8",
      "5",
      "7",
      "6"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 184,
    "questionText": "In Java integer arithmetic, what is the result of 15 / 2?",
    "options": [
      "6",
      "7",
      "9",
      "8"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 185,
    "questionText": "In Java integer arithmetic, what is the result of 12 - 7?",
    "options": [
      "7",
      "5",
      "6",
      "4"
    ],
    "correctAnswerIndex": 1,
    "category": "Java"
  },
  {
    "qNum": 186,
    "questionText": "In Java integer arithmetic, what is the result of 9 * 5?",
    "options": [
      "45",
      "44",
      "47",
      "46"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 187,
    "questionText": "In Java integer arithmetic, what is the result of 20 - 6?",
    "options": [
      "16",
      "13",
      "15",
      "14"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 188,
    "questionText": "In Java integer arithmetic, what is the result of 10 % 3?",
    "options": [
      "1",
      "2",
      "3",
      "0"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 189,
    "questionText": "In Java integer arithmetic, what is the result of 20 * 6?",
    "options": [
      "120",
      "119",
      "122",
      "121"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 190,
    "questionText": "In Java integer arithmetic, what is the result of 10 / 3?",
    "options": [
      "3",
      "5",
      "2",
      "4"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 191,
    "questionText": "In Java integer arithmetic, what is the result of 7 % 4?",
    "options": [
      "4",
      "2",
      "5",
      "3"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 192,
    "questionText": "In Java integer arithmetic, what is the result of 25 * 4?",
    "options": [
      "102",
      "101",
      "99",
      "100"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 193,
    "questionText": "In Java integer arithmetic, what is the result of 12 / 7?",
    "options": [
      "2",
      "0",
      "3",
      "1"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 194,
    "questionText": "In Java integer arithmetic, what is the result of 9 / 5?",
    "options": [
      "2",
      "3",
      "1",
      "0"
    ],
    "correctAnswerIndex": 2,
    "category": "Java"
  },
  {
    "qNum": 195,
    "questionText": "In Java integer arithmetic, what is the result of 25 % 4?",
    "options": [
      "1",
      "0",
      "2",
      "3"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 196,
    "questionText": "In Java integer arithmetic, what is the result of 7 * 4?",
    "options": [
      "30",
      "29",
      "27",
      "28"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 197,
    "questionText": "In Java integer arithmetic, what is the result of 12 * 7?",
    "options": [
      "83",
      "86",
      "85",
      "84"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 198,
    "questionText": "In Java integer arithmetic, what is the result of 8 % 3?",
    "options": [
      "2",
      "3",
      "4",
      "1"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 199,
    "questionText": "In Java integer arithmetic, what is the result of 15 + 2?",
    "options": [
      "18",
      "16",
      "19",
      "17"
    ],
    "correctAnswerIndex": 3,
    "category": "Java"
  },
  {
    "qNum": 200,
    "questionText": "In Java integer arithmetic, what is the result of 13 * 6?",
    "options": [
      "78",
      "80",
      "79",
      "77"
    ],
    "correctAnswerIndex": 0,
    "category": "Java"
  },
  {
    "qNum": 201,
    "questionText": "What does HTML stand for?",
    "options": [
      "Home Tool Markup Language",
      "High Tech Modern Language",
      "Hyper Transfer Markup Language",
      "Hyper Text Markup Language"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 202,
    "questionText": "Which declaration defines the document as HTML5?",
    "options": [
      "<meta html5>",
      "<!DOCTYPE HTML5>",
      "<html5>",
      "<!DOCTYPE html>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 203,
    "questionText": "Root element of an HTML page?",
    "options": [
      "<html>",
      "<root>",
      "<body>",
      "<page>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 204,
    "questionText": "Which tag contains metadata about the document?",
    "options": [
      "<info>",
      "<body>",
      "<head>",
      "<meta>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 205,
    "questionText": "Tag used to define the title in the browser tab?",
    "options": [
      "<head>",
      "<name>",
      "<title>",
      "<caption>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 206,
    "questionText": "Tag used to define the largest heading?",
    "options": [
      "<heading>",
      "<header>",
      "<h1>",
      "<h6>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 207,
    "questionText": "Tag used for a paragraph?",
    "options": [
      "<text>",
      "<pg>",
      "<para>",
      "<p>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 208,
    "questionText": "Tag used to create a hyperlink?",
    "options": [
      "<a>",
      "<url>",
      "<href>",
      "<link>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 209,
    "questionText": "Attribute used to specify a link's destination?",
    "options": [
      "href",
      "target",
      "link",
      "src"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 210,
    "questionText": "Tag used to embed an image?",
    "options": [
      "<img>",
      "<image>",
      "<pic>",
      "<src>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 211,
    "questionText": "Attribute that provides alternate text for an image?",
    "options": [
      "alt",
      "title",
      "desc",
      "caption"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 212,
    "questionText": "Tag used to create an unordered list?",
    "options": [
      "<li>",
      "<ul>",
      "<ol>",
      "<list>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 213,
    "questionText": "Tag used to create an ordered list?",
    "options": [
      "<list>",
      "<ul>",
      "<li>",
      "<ol>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 214,
    "questionText": "Tag used for each list item?",
    "options": [
      "<li>",
      "<item>",
      "<row>",
      "<list>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 215,
    "questionText": "Tag used to create a table?",
    "options": [
      "<table>",
      "<data>",
      "<tab>",
      "<grid>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 216,
    "questionText": "Tag used for a table row?",
    "options": [
      "<td>",
      "<th>",
      "<row>",
      "<tr>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 217,
    "questionText": "Tag used for a table data cell?",
    "options": [
      "<td>",
      "<tr>",
      "<th>",
      "<cell>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 218,
    "questionText": "Tag used for a table header cell?",
    "options": [
      "<td>",
      "<head>",
      "<th>",
      "<tr>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 219,
    "questionText": "Tag used to create a form?",
    "options": [
      "<input>",
      "<fieldset>",
      "<data>",
      "<form>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 220,
    "questionText": "Tag used to create an input field?",
    "options": [
      "<input>",
      "<form>",
      "<field>",
      "<textbox>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 221,
    "questionText": "Attribute that specifies the type of an input field?",
    "options": [
      "type",
      "format",
      "kind",
      "input-type"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 222,
    "questionText": "Tag used to create a dropdown list?",
    "options": [
      "<dropdown>",
      "<list>",
      "<select>",
      "<option>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 223,
    "questionText": "Tag used to define an option within a select element?",
    "options": [
      "<select-item>",
      "<item>",
      "<option>",
      "<choice>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 224,
    "questionText": "Tag used to create a multi-line text input?",
    "options": [
      "<memo>",
      "<textarea>",
      "<text>",
      "<input>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 225,
    "questionText": "Tag used to create a button?",
    "options": [
      "<btn>",
      "<button>",
      "<input-button>",
      "<click>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 226,
    "questionText": "Tag used to link an external CSS file?",
    "options": [
      "<style>",
      "<link>",
      "<css>",
      "<script>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 227,
    "questionText": "Tag used to embed internal CSS?",
    "options": [
      "<design>",
      "<link>",
      "<style>",
      "<css>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 228,
    "questionText": "Tag used to embed JavaScript?",
    "options": [
      "<script>",
      "<javascript>",
      "<js>",
      "<code>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 229,
    "questionText": "Tag used to define a division/section container?",
    "options": [
      "<block>",
      "<section>",
      "<span>",
      "<div>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 230,
    "questionText": "Inline container tag with no default line break?",
    "options": [
      "<inline>",
      "<div>",
      "<p>",
      "<span>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 231,
    "questionText": "Tag used for the main navigation links?",
    "options": [
      "<links>",
      "<navbar>",
      "<menu>",
      "<nav>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 232,
    "questionText": "Tag that represents an independent, self-contained content block?",
    "options": [
      "<div>",
      "<section>",
      "<article>",
      "<content>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 233,
    "questionText": "Tag used for a page or section footer?",
    "options": [
      "<foot>",
      "<footer>",
      "<end>",
      "<bottom>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 234,
    "questionText": "Tag used for a page or section header?",
    "options": [
      "<top>",
      "<title>",
      "<header>",
      "<head>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 235,
    "questionText": "Tag used to embed a video?",
    "options": [
      "<clip>",
      "<media>",
      "<movie>",
      "<video>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 236,
    "questionText": "Tag used to embed audio?",
    "options": [
      "<media>",
      "<audio>",
      "<music>",
      "<sound>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 237,
    "questionText": "Tag used to draw graphics via JavaScript?",
    "options": [
      "<canvas>",
      "<svg>",
      "<graphics>",
      "<draw>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 238,
    "questionText": "Tag used to define a line break?",
    "options": [
      "<break>",
      "<lb>",
      "<newline>",
      "<br>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 239,
    "questionText": "Tag used to create a horizontal line?",
    "options": [
      "<hline>",
      "<line>",
      "<divider>",
      "<hr>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 240,
    "questionText": "Attribute used to uniquely identify an HTML element?",
    "options": [
      "id",
      "class",
      "name",
      "key"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 241,
    "questionText": "Attribute used to apply CSS classes to an element?",
    "options": [
      "id",
      "style",
      "class",
      "group"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 242,
    "questionText": "Tag used to make text bold (semantically important)?",
    "options": [
      "<heavy>",
      "<bold>",
      "<b-text>",
      "<strong>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 243,
    "questionText": "Tag used to italicize text (semantically emphasized)?",
    "options": [
      "<slant>",
      "<i>",
      "<em>",
      "<italic>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 244,
    "questionText": "Attribute used to add inline CSS styling?",
    "options": [
      "style",
      "css",
      "design",
      "format"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 245,
    "questionText": "Tag used to define a table caption?",
    "options": [
      "<title>",
      "<label>",
      "<caption>",
      "<th>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 246,
    "questionText": "Which HTML5 tag defines a section clearly meant for sidebar content?",
    "options": [
      "<section>",
      "<sidebar>",
      "<aside>",
      "<div>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 247,
    "questionText": "Which meta tag attribute sets the character encoding?",
    "options": [
      "lang",
      "type",
      "encoding",
      "charset"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 248,
    "questionText": "Attribute used to make an input field mandatory?",
    "options": [
      "validate",
      "required",
      "mandatory",
      "must"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 249,
    "questionText": "Which tag embeds another HTML page within the current page?",
    "options": [
      "<iframe>",
      "<frame>",
      "<embed>",
      "<object>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 250,
    "questionText": "Attribute used to specify placeholder text in an input?",
    "options": [
      "hint",
      "default",
      "label",
      "placeholder"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 251,
    "questionText": "Tag used to group related form controls with a label?",
    "options": [
      "<formgroup>",
      "<section>",
      "<group>",
      "<fieldset>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 252,
    "questionText": "Which HTML tag is used to define a group of table columns for formatting?",
    "options": [
      "<datalist>",
      "<colgroup>",
      "<cite>",
      "<dl>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 253,
    "questionText": "Which HTML tag is used to define reusable HTML content not rendered immediately?",
    "options": [
      "<samp>",
      "<hgroup>",
      "<optgroup>",
      "<template>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 254,
    "questionText": "Which HTML tag is used to define the footer section of a table?",
    "options": [
      "<tfoot>",
      "<picture>",
      "<figure>",
      "<del>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 255,
    "questionText": "Which HTML tag is used to define highlighted/marked text?",
    "options": [
      "<source>",
      "<pre>",
      "<var>",
      "<mark>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 256,
    "questionText": "Which HTML tag is used to define a ruby annotation for East Asian typography?",
    "options": [
      "<hgroup>",
      "<source>",
      "<ruby>",
      "<main>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 257,
    "questionText": "Which HTML tag is used to define the body section of a table?",
    "options": [
      "<picture>",
      "<dialog>",
      "<ruby>",
      "<tbody>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 258,
    "questionText": "Which HTML tag is used to define superscript text?",
    "options": [
      "<mark>",
      "<figure>",
      "<tfoot>",
      "<sup>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 259,
    "questionText": "Which HTML tag is used to define a dialog box or interactive window?",
    "options": [
      "<noscript>",
      "<form>",
      "<dialog>",
      "<time>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 260,
    "questionText": "Which HTML tag is used to define a caption for a fieldset element?",
    "options": [
      "<legend>",
      "<small>",
      "<samp>",
      "<progress>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 261,
    "questionText": "Which HTML tag is used to define a possible line-break opportunity?",
    "options": [
      "<figcaption>",
      "<wbr>",
      "<noscript>",
      "<thead>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 262,
    "questionText": "Which HTML tag is used to define a scalar measurement within a known range?",
    "options": [
      "<source>",
      "<blockquote>",
      "<ins>",
      "<meter>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 263,
    "questionText": "Which HTML tag is used to define the base URL for all relative links on a page?",
    "options": [
      "<tfoot>",
      "<form>",
      "<base>",
      "<mark>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 264,
    "questionText": "Which HTML tag is used to define the result of a calculation?",
    "options": [
      "<output>",
      "<map>",
      "<samp>",
      "<abbr>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 265,
    "questionText": "Which HTML tag is used to define text tracks such as subtitles for media elements?",
    "options": [
      "<pre>",
      "<embed>",
      "<cite>",
      "<track>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 266,
    "questionText": "Which HTML tag is used to define the dominant content of the document body?",
    "options": [
      "<ins>",
      "<embed>",
      "<main>",
      "<object>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 267,
    "questionText": "Which HTML tag is used to define subscript text?",
    "options": [
      "<output>",
      "<object>",
      "<label>",
      "<sub>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 268,
    "questionText": "Which HTML tag is used to define self-contained media content?",
    "options": [
      "<meter>",
      "<pre>",
      "<figure>",
      "<ins>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 269,
    "questionText": "Which HTML tag is used to define a long quotation?",
    "options": [
      "<address>",
      "<details>",
      "<template>",
      "<blockquote>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 270,
    "questionText": "Which HTML tag is used to define the progress of a task?",
    "options": [
      "<progress>",
      "<noscript>",
      "<base>",
      "<ins>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 271,
    "questionText": "Which HTML tag is used to define a group of related options in a select?",
    "options": [
      "<optgroup>",
      "<label>",
      "<picture>",
      "<var>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 272,
    "questionText": "Which HTML tag is used to define multiple media resources for a video/audio element?",
    "options": [
      "<address>",
      "<dialog>",
      "<source>",
      "<colgroup>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 273,
    "questionText": "Which HTML tag is used to define sample output from a computer program?",
    "options": [
      "<area>",
      "<samp>",
      "<sup>",
      "<template>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 274,
    "questionText": "Which HTML tag is used to define the title of a work being cited?",
    "options": [
      "<label>",
      "<object>",
      "<cite>",
      "<colgroup>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 275,
    "questionText": "Which HTML tag is used to define a snippet of computer code?",
    "options": [
      "<dialog>",
      "<code>",
      "<dl>",
      "<noscript>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 276,
    "questionText": "Which HTML tag is used to define text that has been deleted from a document?",
    "options": [
      "<del>",
      "<source>",
      "<thead>",
      "<details>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 277,
    "questionText": "Which HTML tag is used to define a caption for a form control?",
    "options": [
      "<datalist>",
      "<ruby>",
      "<label>",
      "<embed>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 278,
    "questionText": "Which HTML tag is used to define smaller/fine-print text?",
    "options": [
      "<pre>",
      "<source>",
      "<label>",
      "<small>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 279,
    "questionText": "Which HTML tag is used to define the header section of a table?",
    "options": [
      "<thead>",
      "<hgroup>",
      "<meter>",
      "<datalist>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 280,
    "questionText": "Which HTML tag is used to define a caption for a figure element?",
    "options": [
      "<abbr>",
      "<figcaption>",
      "<object>",
      "<section>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 281,
    "questionText": "Which HTML tag is used to define a clickable area inside an image map?",
    "options": [
      "<track>",
      "<sub>",
      "<legend>",
      "<area>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 282,
    "questionText": "Which HTML tag is used to define a list of predefined input options?",
    "options": [
      "<datalist>",
      "<sup>",
      "<blockquote>",
      "<figure>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 283,
    "questionText": "Which HTML tag is used to define a specific date or time?",
    "options": [
      "<ins>",
      "<embed>",
      "<dl>",
      "<time>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 284,
    "questionText": "Which HTML tag is used to define multiple image sources for responsive images?",
    "options": [
      "<picture>",
      "<code>",
      "<dialog>",
      "<base>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 285,
    "questionText": "Which HTML tag is used to define text that has been inserted into a document?",
    "options": [
      "<dl>",
      "<output>",
      "<abbr>",
      "<ins>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 286,
    "questionText": "Which HTML tag is used to define embedded external content or a plugin?",
    "options": [
      "<embed>",
      "<area>",
      "<section>",
      "<details>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 287,
    "questionText": "Which HTML tag is used to define keyboard input text?",
    "options": [
      "<kbd>",
      "<progress>",
      "<var>",
      "<datalist>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 288,
    "questionText": "Which HTML tag is used to define a variable in a mathematical or programming context?",
    "options": [
      "<pre>",
      "<blockquote>",
      "<ins>",
      "<var>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 289,
    "questionText": "Which HTML tag is used to define content shown when JavaScript is disabled?",
    "options": [
      "<hgroup>",
      "<noscript>",
      "<progress>",
      "<dialog>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 290,
    "questionText": "Which HTML tag is used to define a thematic grouping of content?",
    "options": [
      "<dialog>",
      "<picture>",
      "<colgroup>",
      "<section>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 291,
    "questionText": "Which HTML tag is used to define a section for collecting user input?",
    "options": [
      "<tbody>",
      "<figure>",
      "<progress>",
      "<form>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 292,
    "questionText": "Which HTML tag is used to define contact information?",
    "options": [
      "<source>",
      "<address>",
      "<base>",
      "<dialog>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 293,
    "questionText": "Which HTML tag is used to define an image map with clickable regions?",
    "options": [
      "<address>",
      "<cite>",
      "<samp>",
      "<map>"
    ],
    "correctAnswerIndex": 3,
    "category": "HTML"
  },
  {
    "qNum": 294,
    "questionText": "Which HTML tag is used to define a visible heading for a details element?",
    "options": [
      "<ins>",
      "<var>",
      "<summary>",
      "<noscript>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 295,
    "questionText": "Which HTML tag is used to define a group of heading elements?",
    "options": [
      "<source>",
      "<picture>",
      "<hgroup>",
      "<samp>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 296,
    "questionText": "Which HTML tag is used to define an abbreviation or acronym?",
    "options": [
      "<abbr>",
      "<ins>",
      "<section>",
      "<address>"
    ],
    "correctAnswerIndex": 0,
    "category": "HTML"
  },
  {
    "qNum": 297,
    "questionText": "Which HTML tag is used to define an embedded object such as a plugin or media?",
    "options": [
      "<pre>",
      "<object>",
      "<blockquote>",
      "<del>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 298,
    "questionText": "Which HTML tag is used to define additional details the user can toggle?",
    "options": [
      "<mark>",
      "<details>",
      "<ins>",
      "<noscript>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 299,
    "questionText": "Which HTML tag is used to define a description list?",
    "options": [
      "<details>",
      "<progress>",
      "<dl>",
      "<output>"
    ],
    "correctAnswerIndex": 2,
    "category": "HTML"
  },
  {
    "qNum": 300,
    "questionText": "Which HTML tag is used to define preformatted text preserving whitespace?",
    "options": [
      "<blockquote>",
      "<pre>",
      "<kbd>",
      "<optgroup>"
    ],
    "correctAnswerIndex": 1,
    "category": "HTML"
  },
  {
    "qNum": 301,
    "questionText": "Which keyword declares a block-scoped variable that can be reassigned?",
    "options": [
      "static",
      "var",
      "let",
      "const"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 302,
    "questionText": "Which keyword declares a constant reference in JavaScript?",
    "options": [
      "const",
      "var",
      "final",
      "let"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 303,
    "questionText": "What does typeof 'hello' return?",
    "options": [
      "text",
      "string",
      "String",
      "char"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 304,
    "questionText": "What does typeof 42 return?",
    "options": [
      "integer",
      "number",
      "Number",
      "int"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 305,
    "questionText": "What does typeof undefined return?",
    "options": [
      "NaN",
      "null",
      "object",
      "undefined"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 306,
    "questionText": "Strict equality operator in JavaScript?",
    "options": [
      "==",
      "equals()",
      "=",
      "==="
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 307,
    "questionText": "Method used to add an element to the end of an array?",
    "options": [
      "append()",
      "insert()",
      "add()",
      "push()"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 308,
    "questionText": "Method used to remove the last element of an array?",
    "options": [
      "shift()",
      "remove()",
      "delete()",
      "pop()"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 309,
    "questionText": "Method used to remove the first element of an array?",
    "options": [
      "shift()",
      "remove()",
      "unshift()",
      "pop()"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 310,
    "questionText": "Method used to add an element to the start of an array?",
    "options": [
      "shift()",
      "push()",
      "prepend()",
      "unshift()"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 311,
    "questionText": "Method that creates a new array by transforming each element?",
    "options": [
      "filter()",
      "reduce()",
      "map()",
      "forEach()"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 312,
    "questionText": "Method that creates a new array with elements passing a test?",
    "options": [
      "some()",
      "filter()",
      "find()",
      "map()"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 313,
    "questionText": "Method that reduces an array to a single value?",
    "options": [
      "filter()",
      "sum()",
      "reduce()",
      "map()"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 314,
    "questionText": "Method used to convert a JSON string into an object?",
    "options": [
      "JSON.toObject()",
      "JSON.stringify()",
      "JSON.decode()",
      "JSON.parse()"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 315,
    "questionText": "Method used to convert an object into a JSON string?",
    "options": [
      "JSON.parse()",
      "JSON.stringify()",
      "JSON.encode()",
      "JSON.toString()"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 316,
    "questionText": "Keyword used to define a function?",
    "options": [
      "function",
      "def",
      "func",
      "method"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 317,
    "questionText": "Symbol used for arrow functions?",
    "options": [
      "::",
      "=>",
      "->",
      "=>>"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 318,
    "questionText": "What does 'this' refer to in a regular object method?",
    "options": [
      "The global window always",
      "The parent function",
      "Nothing, it's undefined",
      "The object the method belongs to"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 319,
    "questionText": "What is a closure in JavaScript?",
    "options": [
      "A function that remembers its outer scope",
      "A way to close the browser",
      "A function with no parameters",
      "A loop that never ends"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 320,
    "questionText": "What is hoisting in JavaScript?",
    "options": [
      "Loading scripts asynchronously",
      "Deleting unused variables",
      "Compressing code",
      "Variable and function declarations moved to the top of scope"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 321,
    "questionText": "Which method selects a single element by its id?",
    "options": [
      "document.getElement()",
      "document.querySelectorAll()",
      "document.selectId()",
      "document.getElementById()"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 322,
    "questionText": "Which method selects the first matching element via a CSS selector?",
    "options": [
      "document.querySelector()",
      "document.getElementsByClass()",
      "document.find()",
      "document.getElementById()"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 323,
    "questionText": "Which event fires when a user clicks an element?",
    "options": [
      "press",
      "click",
      "select",
      "tap"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 324,
    "questionText": "Which method adds an event listener to an element?",
    "options": [
      "bindEvent()",
      "addEventListener()",
      "attachEvent()",
      "onEvent()"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 325,
    "questionText": "What does the === operator check that == does not?",
    "options": [
      "Data type in addition to value",
      "Only value, not type",
      "Object reference only",
      "Nothing extra"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 326,
    "questionText": "What is NaN short for?",
    "options": [
      "Null and None",
      "Not a Null",
      "Not a Number",
      "No actual Number"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 327,
    "questionText": "Which array method checks if at least one element passes a test?",
    "options": [
      "every()",
      "some()",
      "filter()",
      "includes()"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 328,
    "questionText": "Which array method checks if all elements pass a test?",
    "options": [
      "filter()",
      "find()",
      "every()",
      "some()"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 329,
    "questionText": "Which method converts a string to an integer?",
    "options": [
      "Number.int()",
      "parseInt()",
      "toInt()",
      "str.toInteger()"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 330,
    "questionText": "Which method converts a value to a floating-point number?",
    "options": [
      "parseFloat()",
      "Number.float()",
      "str.toDecimal()",
      "toFloat()"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 331,
    "questionText": "What is a Promise used for in JavaScript?",
    "options": [
      "Declaring constants",
      "Styling elements",
      "Looping over arrays",
      "Handling asynchronous operations"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 332,
    "questionText": "Which keyword pauses execution of an async function until a Promise resolves?",
    "options": [
      "yield",
      "pause",
      "hold",
      "await"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 333,
    "questionText": "Keyword used to declare an asynchronous function?",
    "options": [
      "promise",
      "async",
      "defer",
      "await"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 334,
    "questionText": "What does Array.isArray([]) return?",
    "options": [
      "true",
      "false",
      "'array'",
      "undefined"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 335,
    "questionText": "Method used to join array elements into a string?",
    "options": [
      "concat()",
      "toString() only",
      "join()",
      "merge()"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 336,
    "questionText": "Method used to combine two or more arrays?",
    "options": [
      "join()",
      "concat()",
      "merge()",
      "append()"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 337,
    "questionText": "What does the spread operator (...) do with an array?",
    "options": [
      "Sorts the array",
      "Reverses the array",
      "Deletes the array",
      "Expands its elements individually"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 338,
    "questionText": "Which loop iterates over the enumerable properties of an object?",
    "options": [
      "for...of",
      "while",
      "for...in",
      "forEach"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 339,
    "questionText": "Which loop iterates over the values of an iterable like an array?",
    "options": [
      "do...while",
      "forEach only",
      "for...in",
      "for...of"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 340,
    "questionText": "What does Array.prototype.length return?",
    "options": [
      "The memory size",
      "The type of the array",
      "The number of elements in the array",
      "The last index of the array"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 341,
    "questionText": "What is the result of typeof null in JavaScript?",
    "options": [
      "object",
      "null",
      "number",
      "undefined"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 342,
    "questionText": "Which method removes whitespace from both ends of a string?",
    "options": [
      "strip()",
      "clean()",
      "trim()",
      "trimAll()"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 343,
    "questionText": "Method used to check if a string contains a substring?",
    "options": [
      "hasSubstring()",
      "indexOfBool()",
      "includes()",
      "contains()"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 344,
    "questionText": "Which method converts a string to uppercase?",
    "options": [
      "upper()",
      "toUpper()",
      "capitalize()",
      "toUpperCase()"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 345,
    "questionText": "What is the correct way to write a comment in JavaScript?",
    "options": [
      "' comment",
      "# comment",
      "// comment",
      "<!-- comment -->"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 346,
    "questionText": "What does the ternary operator ?: do?",
    "options": [
      "Loops through an array",
      "Declares a constant",
      "Provides a shorthand for if-else",
      "Defines a class"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 347,
    "questionText": "Which value is returned by a function with no explicit return statement?",
    "options": [
      "0",
      "null",
      "NaN",
      "undefined"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 348,
    "questionText": "What is the purpose of the 'use strict' directive?",
    "options": [
      "Speeds up loops",
      "Disables comments",
      "Enforces stricter parsing and error handling",
      "Enables new CSS features"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 349,
    "questionText": "Which built-in object is used to work with dates in JavaScript?",
    "options": [
      "Date",
      "Calendar",
      "Clock",
      "Time"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 350,
    "questionText": "Which method schedules a function to run after a delay, once?",
    "options": [
      "setTimeout()",
      "wait()",
      "delay()",
      "setInterval()"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 351,
    "questionText": "Which method repeatedly executes a function at fixed time intervals?",
    "options": [
      "loop()",
      "repeat()",
      "setInterval()",
      "setTimeout()"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 352,
    "questionText": "Given const s = \"hello\", what does s.length return?",
    "options": [
      "4",
      "0",
      "6",
      "5"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 353,
    "questionText": "Given const a = [1,2,3,4], what does a.filter(x => x % 2 === 0) return?",
    "options": [
      "[1,2,3,4]",
      "[]",
      "[2,4]",
      "[1,3]"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 354,
    "questionText": "What does String(123) return?",
    "options": [
      "NaN",
      "undefined",
      "'123'",
      "123"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 355,
    "questionText": "What is the result of 9 % 5 in JavaScript?",
    "options": [
      "7",
      "4",
      "3",
      "5"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 356,
    "questionText": "What is the result of 20 % 6 in JavaScript?",
    "options": [
      "3",
      "1",
      "2",
      "5"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 357,
    "questionText": "What does Object.values({a:1, b:2}) return?",
    "options": [
      "[1, 2]",
      "{a:1,b:2}",
      "Error",
      "['a', 'b']"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 358,
    "questionText": "What is the result of 5 + '3' in JavaScript?",
    "options": [
      "53",
      "8",
      "'35'",
      "NaN"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 359,
    "questionText": "What is the result of typeof function(){} in JavaScript?",
    "options": [
      "function",
      "object",
      "method",
      "undefined"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 360,
    "questionText": "What does 'hello'.indexOf('l') return?",
    "options": [
      "0",
      "3",
      "-1",
      "2"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 361,
    "questionText": "What is the result of '5' == 5 in JavaScript?",
    "options": [
      "false",
      "undefined",
      "NaN",
      "true"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 362,
    "questionText": "What is the result of [] + {} in JavaScript?",
    "options": [
      "undefined",
      "NaN",
      "'[object Object]'",
      "0"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 363,
    "questionText": "What is the result of 3 * '3' in JavaScript?",
    "options": [
      "9",
      "6",
      "NaN",
      "'33'"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 364,
    "questionText": "What is Boolean('') in JavaScript?",
    "options": [
      "false",
      "undefined",
      "true",
      "NaN"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 365,
    "questionText": "What does Object.keys({a:1, b:2}) return?",
    "options": [
      "[1, 2]",
      "Error",
      "['a', 'b']",
      "{a:1,b:2}"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 366,
    "questionText": "What is the result of 10 % 4 in JavaScript?",
    "options": [
      "5",
      "3",
      "2",
      "1"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 367,
    "questionText": "What is the result of 15 % 2 in JavaScript?",
    "options": [
      "2",
      "1",
      "0",
      "4"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 368,
    "questionText": "Given const a = [3,1,4,1,5,9,2,6], what does a.length return?",
    "options": [
      "7",
      "8",
      "0",
      "9"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 369,
    "questionText": "What does Number('abc') return?",
    "options": [
      "'abc'",
      "NaN",
      "0",
      "undefined"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 370,
    "questionText": "What is the result of null === undefined in JavaScript?",
    "options": [
      "false",
      "TypeError",
      "NaN",
      "true"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 371,
    "questionText": "What does Math.min(3, 7, 2) return?",
    "options": [
      "7",
      "3",
      "2",
      "0"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 372,
    "questionText": "What is the result of 7 % 3 in JavaScript?",
    "options": [
      "2",
      "0",
      "4",
      "1"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 373,
    "questionText": "What is the result of [] + [] in JavaScript?",
    "options": [
      "0",
      "''(empty string)",
      "[]",
      "NaN"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 374,
    "questionText": "What does Array.from('abc') return?",
    "options": [
      "Error",
      "'abc'",
      "['abc']",
      "['a', 'b', 'c']"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 375,
    "questionText": "What does Math.floor(4.9) return?",
    "options": [
      "4.9",
      "4",
      "0",
      "5"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 376,
    "questionText": "Given const a = [1,2,3], what does a.map(x => x * 2) return?",
    "options": [
      "[1,4,9]",
      "[2,4,6]",
      "[1,2,3]",
      "[2,3,4]"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 377,
    "questionText": "What does Math.round(4.6) return?",
    "options": [
      "4.6",
      "4",
      "5",
      "6"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 378,
    "questionText": "What is the result of '5' + 3 in JavaScript?",
    "options": [
      "35",
      "NaN",
      "8",
      "53"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 379,
    "questionText": "What does \"JavaScript\".toLowerCase() return?",
    "options": [
      "Javascript",
      "java script",
      "JAVASCRIPT",
      "javascript"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 380,
    "questionText": "What does Math.max(3, 7, 2) return?",
    "options": [
      "2",
      "0",
      "3",
      "7"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 381,
    "questionText": "What is the result of '5' - 3 in JavaScript?",
    "options": [
      "'53'",
      "2",
      "8",
      "NaN"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 382,
    "questionText": "What is Boolean(0) in JavaScript?",
    "options": [
      "undefined",
      "false",
      "NaN",
      "true"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 383,
    "questionText": "What does 'hello'.charAt(1) return?",
    "options": [
      "h",
      "l",
      "e",
      "o"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 384,
    "questionText": "What is the result of true + true in JavaScript?",
    "options": [
      "'truetrue'",
      "2",
      "1",
      "true"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 385,
    "questionText": "What does [1,2,3].indexOf(2) return?",
    "options": [
      "2",
      "1",
      "0",
      "-1"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 386,
    "questionText": "What is the result of 10 / 'abc' in JavaScript?",
    "options": [
      "Error",
      "Infinity",
      "NaN",
      "0"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 387,
    "questionText": "Which method returns a shallow copy of part of an array without modifying it?",
    "options": [
      "copy()",
      "slice()",
      "subarray()",
      "splice()"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 388,
    "questionText": "What does !false evaluate to?",
    "options": [
      "NaN",
      "true",
      "false",
      "undefined"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 389,
    "questionText": "What does [10,2,33,4].sort() return by default?",
    "options": [
      "[33,10,4,2]",
      "[2,4,10,33] numeric sort",
      "Error",
      "[10,2,33,4] sorted as strings -> [10,2,33,4]"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 390,
    "questionText": "Given const a = [1,2,3,4], what does a.reduce((s,x)=>s+x,0) return?",
    "options": [
      "11",
      "9",
      "6",
      "10"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 391,
    "questionText": "What is the result of '5' === 5 in JavaScript?",
    "options": [
      "undefined",
      "true",
      "false",
      "NaN"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 392,
    "questionText": "What does [1,2,3].reverse() return?",
    "options": [
      "[1,2,3]",
      "[2,1,3]",
      "[3, 2, 1]",
      "Error"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 393,
    "questionText": "What does 5 > 3 && 2 < 4 evaluate to?",
    "options": [
      "undefined",
      "false",
      "NaN",
      "true"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 394,
    "questionText": "What is the output of console.log(typeof NaN)?",
    "options": [
      "number",
      "object",
      "undefined",
      "NaN"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 395,
    "questionText": "What does Number('42') return?",
    "options": [
      "NaN",
      "undefined",
      "42",
      "'42'"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 396,
    "questionText": "What does 5 > 3 || 2 > 4 evaluate to?",
    "options": [
      "false",
      "undefined",
      "true",
      "NaN"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  },
  {
    "qNum": 397,
    "questionText": "What does 'JS'.repeat(3) return?",
    "options": [
      "JSJS",
      "JSJSJS",
      "3JS",
      "JS3"
    ],
    "correctAnswerIndex": 1,
    "category": "JavaScript"
  },
  {
    "qNum": 398,
    "questionText": "What is the result of null == undefined in JavaScript?",
    "options": [
      "true",
      "false",
      "TypeError",
      "NaN"
    ],
    "correctAnswerIndex": 0,
    "category": "JavaScript"
  },
  {
    "qNum": 399,
    "questionText": "What does Math.ceil(4.1) return?",
    "options": [
      "4",
      "0",
      "4.1",
      "5"
    ],
    "correctAnswerIndex": 3,
    "category": "JavaScript"
  },
  {
    "qNum": 400,
    "questionText": "What is Boolean('0') in JavaScript?",
    "options": [
      "false",
      "NaN",
      "true",
      "undefined"
    ],
    "correctAnswerIndex": 2,
    "category": "JavaScript"
  }
];

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDB connected");

  const existing = await Test.findOne({ title: "Full Stack Programming Quiz" });
  if (existing) {
    existing.questions = questions;
    await existing.save();
    console.log("Updated existing quiz with", questions.length, "questions");
  } else {
    await Test.create({ title: "Full Stack Programming Quiz", questions });
    console.log("Created quiz with", questions.length, "questions");
  }

  await mongoose.disconnect();
  console.log("Done. Disconnected.");
}

seed().catch((err) => {
  console.error("Seeding failed:", err);
  process.exit(1);
});