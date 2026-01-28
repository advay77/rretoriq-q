import type { Question } from '../types/questions'

// ================================
// TECHNICAL QUESTIONS - SUBJECT BASED
// ================================
// Structure: DBMS, C, OOPs, DS
// Each subject has 2 levels: Easy, Advanced
// Total: 4 subjects × 2 levels × ~10 questions = ~80 questions

export const technicalQuestionsSubjectBased: Question[] = [
// ====================================
// DBMS (Database Management Systems)
// ====================================

// DBMS - Easy Level (10 questions)
{
  id: "tech-dbms-easy-001",
  text: "What is a database? What are different types?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Database Concepts", "Data Management"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Organized collection of data", "Relational, NoSQL, Graph databases", "Used for data storage and retrieval"]
  }
},
{
  id: "tech-dbms-easy-002",
  text: "What is the difference between SQL and NoSQL?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Database Technologies", "Data Management"],
  metadata: {
    expectedAnswerLength: 100,
    keyPoints: ["SQL: structured, ACID properties", "NoSQL: flexible schema, horizontal scaling", "Use cases differ based on requirements"]
  }
},
{
  id: "tech-dbms-easy-003",
  text: "What is a DBMS? What is an RDBMS?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Database Concepts", "Core Concepts"],
  metadata: {
    expectedAnswerLength: 120,
    keyPoints: ["DBMS: Database Management System (software to manage databases)", "RDBMS: Relational DBMS", "RDBMS stores data in tables (rows/columns)"]
  }
},
{
  id: "tech-dbms-easy-004",
  text: "What is SQL? Why is it used?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["SQL Query", "Database Concepts"],
  metadata: {
    expectedAnswerLength: 100,
    keyPoints: ["Stands for Structured Query Language", "Used to communicate with a database", "Declarative language (what to do, not how)"]
  }
},
{
  id: "tech-dbms-easy-005",
  text: "What is a Primary Key in a database table?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Database Concepts", "Keys"],
  metadata: {
    expectedAnswerLength: 80,
    keyPoints: ["Uniquely identifies each row", "Cannot be NULL", "Only one primary key per table"]
  }
},
{
  id: "tech-dbms-easy-006",
  text: "What is a table in RDBMS? What are rows and columns?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Database Concepts", "RDBMS"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Table: collection of related data", "Rows: individual records", "Columns: attributes/fields"]
  }
},
{
  id: "tech-dbms-easy-007",
  text: "What is a query in SQL?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["SQL Query", "Database Concepts"],
  metadata: {
    expectedAnswerLength: 70,
    keyPoints: ["Request for data from database", "Uses SQL commands (SELECT, INSERT, UPDATE, DELETE)", "Can filter and manipulate data"]
  }
},
{
  id: "tech-dbms-easy-008",
  text: "What is the difference between DELETE and DROP commands?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["DDL/DML Commands", "SQL"],
  metadata: {
    expectedAnswerLength: 100,
    keyPoints: ["DELETE: removes rows from table (DML)", "DROP: removes entire table structure (DDL)", "DELETE can be rolled back, DROP cannot"]
  }
},
{
  id: "tech-dbms-easy-009",
  text: "What is a Foreign Key?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Database Concepts", "Keys", "Relationships"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Links two tables together", "References primary key of another table", "Enforces referential integrity"]
  }
},
{
  id: "tech-dbms-easy-010",
  text: "What are the basic SQL commands?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["SQL Query", "Database Management"],
  metadata: {
    expectedAnswerLength: 80,
    keyPoints: ["SELECT: retrieve data", "INSERT: add new data", "UPDATE: modify data", "DELETE: remove data"]
  }
},

// DBMS - Advanced Level (10 questions)
{
  id: "tech-dbms-advanced-001",
  text: "Explain Normalization and the different forms (1NF, 2NF, 3NF). Why is it used?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Normalization", "Database Design", "RDBMS"],
  metadata: {
    expectedAnswerLength: 180,
    keyPoints: ["Reduces data redundancy", "Minimizes update/delete anomalies", "1NF: Atomic values", "2NF: 1NF + no partial dependencies", "3NF: 2NF + no transitive dependencies"]
  }
},
{
  id: "tech-dbms-advanced-002",
  text: "What are ACID properties in a database transaction?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Transaction Management", "Database Concepts", "ACID"],
  metadata: {
    expectedAnswerLength: 160,
    keyPoints: ["Atomicity (all or nothing)", "Consistency (valid state to valid state)", "Isolation (transactions don't interfere)", "Durability (changes persist after commit)"]
  }
},
{
  id: "tech-dbms-advanced-003",
  text: "Explain the difference between Primary Key, Foreign Key, and Candidate Key.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Database Concepts", "Keys", "Constraints", "RDBMS"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["Candidate Key: Uniquely identifies a row", "Primary Key: The chosen Candidate Key", "Foreign Key: Enforces referential integrity between tables"]
  }
},
{
  id: "tech-dbms-advanced-004",
  text: "Differentiate between DROP, DELETE, and TRUNCATE commands in SQL.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["DDL/DML Commands", "SQL", "Database Management"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["DELETE: DML, removes rows (can be rolled back)", "TRUNCATE: DDL, removes all rows (cannot be rolled back, faster)", "DROP: DDL, removes the entire table structure"]
  }
},
{
  id: "tech-dbms-advanced-005",
  text: "What is a JOIN in SQL? Name and explain different types of joins.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["SQL Joins", "SQL Query", "RDBMS"],
  metadata: {
    expectedAnswerLength: 180,
    keyPoints: ["Combines rows from multiple tables", "INNER JOIN: matching rows", "LEFT/RIGHT JOIN: all from one table + matching", "FULL OUTER JOIN: all rows from both"]
  }
},
{
  id: "tech-dbms-advanced-006",
  text: "Explain indexing in databases. What are its advantages and disadvantages?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Database Performance", "Indexing", "Query Optimization"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["Data structure for faster retrieval", "Advantages: faster queries", "Disadvantages: slower writes, extra storage"]
  }
},
{
  id: "tech-dbms-advanced-007",
  text: "What is a stored procedure? How is it different from a function?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Database Programming", "SQL", "Stored Procedures"],
  metadata: {
    expectedAnswerLength: 140,
    keyPoints: ["Precompiled SQL code", "Procedure: can modify database", "Function: returns a value, cannot modify database"]
  }
},
{
  id: "tech-dbms-advanced-008",
  text: "Explain database transactions and concurrency control.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Transaction Management", "Concurrency", "Database Concepts"],
  metadata: {
    expectedAnswerLength: 160,
    keyPoints: ["Transaction: logical unit of work", "Concurrency: multiple transactions at once", "Locking mechanisms to prevent conflicts"]
  }
},
{
  id: "tech-dbms-advanced-009",
  text: "What is denormalization? When would you use it?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Database Design", "Performance Optimization", "RDBMS"],
  metadata: {
    expectedAnswerLength: 130,
    keyPoints: ["Adding redundancy to improve read performance", "Used when read operations >> write operations", "Trade-off between normalization and performance"]
  }
},
{
  id: "tech-dbms-advanced-010",
  text: "Explain the concept of database views. What are their advantages?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DBMS" as const,
  skillsEvaluated: ["Database Concepts", "Views", "SQL"],
  metadata: {
    expectedAnswerLength: 120,
    keyPoints: ["Virtual table based on query", "Simplifies complex queries", "Provides security by restricting data access"]
  }
},

// ====================================
// C Programming
// ====================================

// C - Easy Level (10 questions)
{
  id: "tech-c-easy-001",
  text: "What is a pointer? How does it differ from a normal variable?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "C" as const,
  skillsEvaluated: ["C Fundamentals", "Memory Management"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Pointer stores memory address", "Normal variable stores value", "Pointers allow direct memory manipulation"]
  }
},
{
  id: "tech-c-easy-002",
  text: "What is the difference between stack and heap memory in C?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "C" as const,
  skillsEvaluated: ["Memory Management", "C Programming"],
  metadata: {
    expectedAnswerLength: 100,
    keyPoints: ["Stack: automatic allocation, LIFO", "Heap: manual allocation (malloc/free)", "Stack faster, heap more flexible"]
  }
},
{
  id: "tech-c-easy-003",
  text: "What is a structure in C? How is it different from an array?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "C" as const,
  skillsEvaluated: ["C Fundamentals", "Data Structures"],
  metadata: {
    expectedAnswerLength: 100,
    keyPoints: ["Structure: collection of different data types", "Array: collection of same data type", "Structure uses dot notation"]
  }
},
{
  id: "tech-c-easy-004",
  text: "Explain the difference between malloc() and calloc().",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "C" as const,
  skillsEvaluated: ["Memory Management", "C Programming"],
  metadata: {
    expectedAnswerLength: 100,
    keyPoints: ["malloc: allocates uninitialized memory", "calloc: allocates and initializes to zero", "calloc takes two arguments (number, size)"]
  }
},
{
  id: "tech-c-easy-005",
  text: "What is the difference between '==' and '=' operators in C?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "C" as const,
  skillsEvaluated: ["C Fundamentals", "Operators"],
  metadata: {
    expectedAnswerLength: 70,
    keyPoints: ["'=': assignment operator", "'==': comparison operator", "Common source of bugs"]
  }
},
{
  id: "tech-c-easy-006",
  text: "What are header files in C? Give examples.",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "C" as const,
  skillsEvaluated: ["C Fundamentals", "Program Structure"],
  metadata: {
    expectedAnswerLength: 80,
    keyPoints: ["Files containing declarations", "Examples: stdio.h, stdlib.h, string.h", "Included using #include directive"]
  }
},
{
  id: "tech-c-easy-007",
  text: "What is the difference between ++i and i++?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "C" as const,
  skillsEvaluated: ["C Fundamentals", "Operators"],
  metadata: {
    expectedAnswerLength: 80,
    keyPoints: ["++i: pre-increment (increment first, then use)", "i++: post-increment (use first, then increment)", "Can affect expression results"]
  }
},
{
  id: "tech-c-easy-008",
  text: "What is a function in C? Why do we use functions?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "C" as const,
  skillsEvaluated: ["C Programming", "Code Organization"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Reusable block of code", "Improves modularity", "Reduces code duplication"]
  }
},
{
  id: "tech-c-easy-009",
  text: "Explain the concept of loops in C with examples.",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "C" as const,
  skillsEvaluated: ["Programming Logic", "Control Structures"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Repeat code block multiple times", "for, while, do-while loops", "Used for iteration"]
  }
},
{
  id: "tech-c-easy-010",
  text: "What are the basic data types in C?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "C" as const,
  skillsEvaluated: ["C Fundamentals", "Data Types"],
  metadata: {
    expectedAnswerLength: 80,
    keyPoints: ["int, float, double, char", "Size varies by compiler", "Use sizeof() to check size"]
  }
},

// C - Advanced Level (10 questions)
{
  id: "tech-c-advanced-001",
  text: "Explain pointer arithmetic in C with examples.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "C" as const,
  skillsEvaluated: ["Pointers", "Memory Management", "C Programming"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["Adding/subtracting from pointers", "Increments by data type size", "Used for array traversal", "Dangerous if misused"]
  }
},
{
  id: "tech-c-advanced-002",
  text: "What is a pointer to a pointer? Explain with an example.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "C" as const,
  skillsEvaluated: ["Pointers", "Memory Management", "C Programming"],
  metadata: {
    expectedAnswerLength: 130,
    keyPoints: ["Pointer storing address of another pointer", "Declared as **ptr", "Used in dynamic 2D arrays", "Requires careful memory management"]
  }
},
{
  id: "tech-c-advanced-003",
  text: "Explain dynamic memory allocation in C. What are memory leaks?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "C" as const,
  skillsEvaluated: ["Memory Management", "C Programming", "Debugging"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["malloc, calloc, realloc, free", "Memory leak: allocated memory not freed", "Causes program to consume more memory", "Use valgrind to detect leaks"]
  }
},
{
  id: "tech-c-advanced-004",
  text: "What is the difference between pass by value and pass by reference in C?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "C" as const,
  skillsEvaluated: ["Function Parameters", "Memory Management", "C Programming"],
  metadata: {
    expectedAnswerLength: 140,
    keyPoints: ["Pass by value: copies argument", "Pass by reference: uses pointers", "Pass by reference allows modification", "C only has pass by value, simulates reference with pointers"]
  }
},
{
  id: "tech-c-advanced-005",
  text: "Explain the concept of recursion in C with an example (factorial or Fibonacci).",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "C" as const,
  skillsEvaluated: ["Programming Logic", "Recursion", "C Programming"],
  metadata: {
    expectedAnswerLength: 130,
    keyPoints: ["Function calling itself", "Must have base case", "Stack-based execution", "Can cause stack overflow if not careful"]
  }
},
{
  id: "tech-c-advanced-006",
  text: "What are preprocessor directives in C? Explain #define, #include, #ifdef.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "C" as const,
  skillsEvaluated: ["C Fundamentals", "Preprocessor", "Compilation"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["Processed before compilation", "#define: macros", "#include: header files", "#ifdef: conditional compilation"]
  }
},
{
  id: "tech-c-advanced-007",
  text: "Explain the difference between static and dynamic arrays in C.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "C" as const,
  skillsEvaluated: ["Arrays", "Memory Management", "C Programming"],
  metadata: {
    expectedAnswerLength: 130,
    keyPoints: ["Static: fixed size at compile time", "Dynamic: size determined at runtime", "Static on stack, dynamic on heap", "Dynamic requires malloc/free"]
  }
},
{
  id: "tech-c-advanced-008",
  text: "What is a union in C? How is it different from a structure?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "C" as const,
  skillsEvaluated: ["C Fundamentals", "Data Structures", "Memory Management"],
  metadata: {
    expectedAnswerLength: 120,
    keyPoints: ["Union: all members share same memory", "Structure: each member has separate memory", "Union saves memory", "Only one member valid at a time"]
  }
},
{
  id: "tech-c-advanced-009",
  text: "Explain file handling in C. How do you open, read, write, and close files?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "C" as const,
  skillsEvaluated: ["File I/O", "C Programming"],
  metadata: {
    expectedAnswerLength: 140,
    keyPoints: ["fopen, fread, fwrite, fclose", "File modes: r, w, a, rb, wb", "FILE pointer", "Always close files after use"]
  }
},
{
  id: "tech-c-advanced-010",
  text: "What are function pointers in C? Provide an example use case.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "C" as const,
  skillsEvaluated: ["Pointers", "C Programming", "Advanced Concepts"],
  metadata: {
    expectedAnswerLength: 140,
    keyPoints: ["Pointer storing address of function", "Used for callbacks", "Syntax: return_type (*ptr_name)(params)", "Common in event-driven programming"]
  }
},

// ====================================
// OOPs (Object-Oriented Programming)
// ====================================

// OOPs - Easy Level (10 questions)
{
  id: "tech-oops-easy-001",
  text: "What is Object-Oriented Programming (OOP)?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Programming Paradigms"],
  metadata: {
    expectedAnswerLength: 100,
    keyPoints: ["Programming paradigm based on objects", "Encapsulation, Inheritance, Polymorphism, Abstraction", "Real-world modeling approach"]
  }
},
{
  id: "tech-oops-easy-002",
  text: "What is a class and an object?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Programming Fundamentals"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Class: blueprint/template", "Object: instance of class", "Class defines properties and methods"]
  }
},
{
  id: "tech-oops-easy-003",
  text: "What is encapsulation in OOP?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Encapsulation"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Bundling data and methods together", "Data hiding using access modifiers", "Protects internal state"]
  }
},
{
  id: "tech-oops-easy-004",
  text: "What is inheritance in OOP?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Inheritance"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Creating new class from existing class", "Code reusability", "Parent-child relationship"]
  }
},
{
  id: "tech-oops-easy-005",
  text: "What is polymorphism? Give a simple example.",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Polymorphism"],
  metadata: {
    expectedAnswerLength: 100,
    keyPoints: ["Many forms of same thing", "Method overloading and overriding", "Compile-time and runtime polymorphism"]
  }
},
{
  id: "tech-oops-easy-006",
  text: "What is abstraction in OOP?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Abstraction"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Hiding complex implementation", "Showing only essential features", "Using abstract classes/interfaces"]
  }
},
{
  id: "tech-oops-easy-007",
  text: "What is a constructor? What is its purpose?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Constructors"],
  metadata: {
    expectedAnswerLength: 80,
    keyPoints: ["Special method to initialize object", "Called when object is created", "Same name as class"]
  }
},
{
  id: "tech-oops-easy-008",
  text: "What is the difference between public, private, and protected access modifiers?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Access Control"],
  metadata: {
    expectedAnswerLength: 110,
    keyPoints: ["Public: accessible everywhere", "Private: only within class", "Protected: within class and subclasses"]
  }
},
{
  id: "tech-oops-easy-009",
  text: "What is method overloading?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Polymorphism"],
  metadata: {
    expectedAnswerLength: 80,
    keyPoints: ["Multiple methods with same name", "Different parameters", "Compile-time polymorphism"]
  }
},
{
  id: "tech-oops-easy-010",
  text: "What is the difference between a class and an interface?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Interfaces"],
  metadata: {
    expectedAnswerLength: 100,
    keyPoints: ["Class can have implementation", "Interface only has method signatures", "Class supports single inheritance, interface supports multiple"]
  }
},

// OOPs - Advanced Level (10 questions)
{
  id: "tech-oops-advanced-001",
  text: "Explain the difference between method overloading and method overriding.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Polymorphism"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["Overloading: same name, different parameters, compile-time", "Overriding: redefining parent method, runtime", "Overloading in same class, overriding in subclass"]
  }
},
{
  id: "tech-oops-advanced-002",
  text: "What is the difference between abstract class and interface?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Abstraction", "Interfaces"],
  metadata: {
    expectedAnswerLength: 160,
    keyPoints: ["Abstract class: partial implementation", "Interface: no implementation (Java 7)", "Abstract class: single inheritance", "Interface: multiple inheritance"]
  }
},
{
  id: "tech-oops-advanced-003",
  text: "Explain the concept of multiple inheritance and its problems. How does Java handle it?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Inheritance", "Language Specific"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["Inheriting from multiple classes", "Diamond problem", "Java uses interfaces to avoid", "C++ supports directly"]
  }
},
{
  id: "tech-oops-advanced-004",
  text: "What is the 'this' keyword? What is the 'super' keyword?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Language Specific"],
  metadata: {
    expectedAnswerLength: 130,
    keyPoints: ["'this': refers to current object", "'super': refers to parent class", "Used to access members and constructors"]
  }
},
{
  id: "tech-oops-advanced-005",
  text: "Explain the concept of composition vs inheritance in OOP design.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Design", "Design Principles"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["Composition: has-a relationship", "Inheritance: is-a relationship", "Composition more flexible", "Favor composition over inheritance"]
  }
},
{
  id: "tech-oops-advanced-006",
  text: "What is the difference between static and non-static methods?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Memory Management"],
  metadata: {
    expectedAnswerLength: 120,
    keyPoints: ["Static: belongs to class, not object", "Non-static: requires object instance", "Static cannot access non-static directly"]
  }
},
{
  id: "tech-oops-advanced-007",
  text: "Explain the concept of immutability. Why are String objects immutable in Java?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Language Specific", "Memory Management"],
  metadata: {
    expectedAnswerLength: 140,
    keyPoints: ["Object whose state cannot change", "String pool for memory efficiency", "Thread safety", "Security"]
  }
},
{
  id: "tech-oops-advanced-008",
  text: "What are design patterns in OOP? Name a few common ones.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Design", "Design Patterns"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["Reusable solutions to common problems", "Singleton, Factory, Observer", "Creational, Structural, Behavioral"]
  }
},
{
  id: "tech-oops-advanced-009",
  text: "Explain the SOLID principles in object-oriented design.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Design", "Design Principles", "Best Practices"],
  metadata: {
    expectedAnswerLength: 180,
    keyPoints: ["S: Single Responsibility", "O: Open/Closed", "L: Liskov Substitution", "I: Interface Segregation", "D: Dependency Inversion"]
  }
},
{
  id: "tech-oops-advanced-010",
  text: "What is the difference between shallow copy and deep copy?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "OOPs" as const,
  skillsEvaluated: ["OOP Concepts", "Memory Management"],
  metadata: {
    expectedAnswerLength: 130,
    keyPoints: ["Shallow: copies references", "Deep: copies actual objects", "Shallow faster but shares references", "Deep independent copies"]
  }
},

// ====================================
// DS (Data Structures)
// ====================================

// DS - Easy Level (10 questions)
{
  id: "tech-ds-easy-001",
  text: "What is a data structure? Why are data structures important?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Programming Fundamentals"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Way of organizing and storing data", "Efficient access and modification", "Different structures for different needs"]
  }
},
{
  id: "tech-ds-easy-002",
  text: "Explain the difference between array and linked list.",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Memory Management"],
  metadata: {
    expectedAnswerLength: 120,
    keyPoints: ["Array: contiguous memory, O(1) access", "Linked list: non-contiguous, O(n) access", "Array fixed size, linked list dynamic"]
  }
},
{
  id: "tech-ds-easy-003",
  text: "What is a stack? What are its basic operations?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Stack"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["LIFO (Last In First Out)", "Push, Pop, Peek operations", "Used in recursion, undo functionality"]
  }
},
{
  id: "tech-ds-easy-004",
  text: "What is a queue? What are its basic operations?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Queue"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["FIFO (First In First Out)", "Enqueue, Dequeue, Front operations", "Used in scheduling, breadth-first search"]
  }
},
{
  id: "tech-ds-easy-005",
  text: "What is the difference between linear and non-linear data structures?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Classification"],
  metadata: {
    expectedAnswerLength: 100,
    keyPoints: ["Linear: elements in sequence (array, linked list)", "Non-linear: hierarchical (tree, graph)", "Linear: single level, Non-linear: multiple levels"]
  }
},
{
  id: "tech-ds-easy-006",
  text: "What is an algorithm? What makes a good algorithm?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Algorithms", "Problem Solving"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Step-by-step procedure", "Correctness, efficiency", "Time and space complexity"]
  }
},
{
  id: "tech-ds-easy-007",
  text: "What is the difference between linear search and binary search?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Algorithms", "Search Techniques"],
  metadata: {
    expectedAnswerLength: 100,
    keyPoints: ["Linear: sequential O(n)", "Binary: divide and conquer O(log n)", "Binary requires sorted array"]
  }
},
{
  id: "tech-ds-easy-008",
  text: "What is Big O notation? Why is it important?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Algorithms", "Complexity Analysis"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Describes algorithm efficiency", "Time and space complexity", "Helps compare algorithms"]
  }
},
{
  id: "tech-ds-easy-009",
  text: "What is a hash table (or hash map)?",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Hashing"],
  metadata: {
    expectedAnswerLength: 100,
    keyPoints: ["Key-value pairs", "O(1) average lookup", "Uses hash function"]
  }
},
{
  id: "tech-ds-easy-010",
  text: "What is recursion? Give a simple example.",
  type: "Technical" as const,
  difficulty: "Easy" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Algorithms", "Recursion"],
  metadata: {
    expectedAnswerLength: 90,
    keyPoints: ["Function calling itself", "Must have base case", "Example: factorial, Fibonacci"]
  }
},

// DS - Advanced Level (10 questions)
{
  id: "tech-ds-advanced-001",
  text: "Explain different types of linked lists (singly, doubly, circular).",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Linked Lists"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["Singly: one direction", "Doubly: bidirectional", "Circular: last connects to first", "Trade-offs in memory and operations"]
  }
},
{
  id: "tech-ds-advanced-002",
  text: "What is a binary tree? What is a binary search tree (BST)?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Trees"],
  metadata: {
    expectedAnswerLength: 140,
    keyPoints: ["Binary tree: max 2 children", "BST: left < root < right", "BST enables O(log n) search", "Used in databases and file systems"]
  }
},
{
  id: "tech-ds-advanced-003",
  text: "Explain tree traversal methods (inorder, preorder, postorder).",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Trees", "Algorithms"],
  metadata: {
    expectedAnswerLength: 140,
    keyPoints: ["Inorder: left-root-right", "Preorder: root-left-right", "Postorder: left-right-root", "Different use cases for each"]
  }
},
{
  id: "tech-ds-advanced-004",
  text: "What is a graph? Explain adjacency matrix and adjacency list representations.",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Graphs"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["Nodes and edges", "Matrix: 2D array", "List: array of lists", "Matrix faster for dense, list for sparse"]
  }
},
{
  id: "tech-ds-advanced-005",
  text: "Explain common sorting algorithms and their time complexities (Bubble, Selection, Merge, Quick).",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Algorithms", "Sorting", "Complexity Analysis"],
  metadata: {
    expectedAnswerLength: 180,
    keyPoints: ["Bubble/Selection: O(n²)", "Merge: O(n log n), stable", "Quick: O(n log n) average", "Trade-offs in time, space, stability"]
  }
},
{
  id: "tech-ds-advanced-006",
  text: "What is dynamic programming? Explain with an example (Fibonacci or Knapsack).",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Algorithms", "Dynamic Programming", "Optimization"],
  metadata: {
    expectedAnswerLength: 160,
    keyPoints: ["Optimization technique", "Breaks problem into subproblems", "Stores results (memoization)", "Avoids redundant calculations"]
  }
},
{
  id: "tech-ds-advanced-007",
  text: "Explain the difference between DFS (Depth First Search) and BFS (Breadth First Search).",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Algorithms", "Graph Traversal"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["DFS: explores depth first, uses stack", "BFS: explores level by level, uses queue", "DFS for paths, BFS for shortest path", "Different time/space trade-offs"]
  }
},
{
  id: "tech-ds-advanced-008",
  text: "What is a heap? What is the difference between min-heap and max-heap?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Heap", "Priority Queue"],
  metadata: {
    expectedAnswerLength: 130,
    keyPoints: ["Complete binary tree", "Min-heap: parent < children", "Max-heap: parent > children", "Used in priority queues, heap sort"]
  }
},
{
  id: "tech-ds-advanced-009",
  text: "Explain collision resolution techniques in hash tables (chaining, open addressing).",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Hashing", "Problem Solving"],
  metadata: {
    expectedAnswerLength: 150,
    keyPoints: ["Chaining: linked list at each bucket", "Open addressing: probe for next slot", "Linear probing, quadratic probing", "Trade-offs in performance"]
  }
},
{
  id: "tech-ds-advanced-010",
  text: "What is the time complexity of common operations in different data structures?",
  type: "Technical" as const,
  difficulty: "Advanced" as const,
  subject: "DS" as const,
  skillsEvaluated: ["Data Structures", "Complexity Analysis"],
  metadata: {
    expectedAnswerLength: 160,
    keyPoints: ["Array: access O(1), insert O(n)", "Linked List: access O(n), insert O(1)", "BST: average O(log n)", "Hash Table: average O(1)"]
  }
},
]
