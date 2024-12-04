// backend/seedSnippets.js
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Snippet from './models/snippetModel.js';

dotenv.config();

// Connect to the database
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
  seedSnippets();
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// Define default snippets
const defaultSnippets = [
    {
      author: 'CodeGalaxy',
      title: 'Hello World in JavaScript',
      description: 'A simple Hello World example in JavaScript.',
      language: 'JavaScript',
      code: `console.log('Hello, World!');`,
    },
    {
      author: 'CodeGalaxy',
      title: 'FizzBuzz in Python',
      description: 'The classic FizzBuzz problem implemented in Python.',
      language: 'Python',
      code: `
  for i in range(1, 101):
      if i % 15 == 0:
          print('FizzBuzz')
      elif i % 3 == 0:
          print('Fizz')
      elif i % 5 == 0:
          print('Buzz')
      else:
          print(i)
      `,
    },
    {
      author: 'CodeGalaxy',
      title: 'Hello World in Java',
      description: 'A simple Hello World example in Java.',
      language: 'Java',
      code: `
  public class HelloWorld {
      public static void main(String[] args) {
          System.out.println("Hello, World!");
      }
  }
      `,
    },
    {
      author: 'CodeGalaxy',
      title: 'Bubble Sort in C++',
      description: 'An implementation of the Bubble Sort algorithm in C++.',
      language: 'C++',
      code: `
  #include <iostream>
  #include <vector>
  using namespace std;
  
  void bubbleSort(vector<int>& arr) {
      for (size_t i = 0; i < arr.size() - 1; ++i) {
          for (size_t j = 0; j < arr.size() - i - 1; ++j) {
              if (arr[j] > arr[j + 1]) {
                  swap(arr[j], arr[j + 1]);
              }
          }
      }
  }
  
  int main() {
      vector<int> arr = {64, 34, 25, 12, 22, 11, 90};
      bubbleSort(arr);
      for (int num : arr) {
          cout << num << " ";
      }
      return 0;
  }
      `,
    },
    {
      author: 'CodeGalaxy',
      title: 'Factorial in Ruby',
      description: 'Calculating the factorial of a number in Ruby.',
      language: 'Ruby',
      code: `
  def factorial(n)
    return 1 if n <= 1
    n * factorial(n - 1)
  end
  
  puts factorial(5)
      `,
    },
    {
      author: 'CodeGalaxy',
      title: 'Palindrome Check in PHP',
      description: 'A function to check if a string is a palindrome in PHP.',
      language: 'PHP',
      code: `
  <?php
  function isPalindrome($string) {
      $cleaned = preg_replace("/[^A-Za-z0-9]/", '', strtolower($string));
      return $cleaned === strrev($cleaned);
  }
  
  echo isPalindrome('Racecar') ? 'Yes' : 'No';
  ?>
      `,
    },
    {
      author: 'CodeGalaxy',
      title: 'Prime Numbers in Go',
      description: 'Generate prime numbers up to 100 in Go.',
      language: 'Go',
      code: `
  package main
  
  import "fmt"
  
  func main() {
      for num := 2; num <= 100; num++ {
          isPrime := true
          for i := 2; i*i <= num; i++ {
              if num%i == 0 {
                  isPrime = false
                  break
              }
          }
          if isPrime {
              fmt.Println(num)
          }
      }
  }
      `,
    },
    {
      author: 'CodeGalaxy',
      title: 'Simple Calculator in Swift',
      description: 'A simple calculator to add two numbers in Swift.',
      language: 'Swift',
      code: `
  import Foundation
  
  func add(a: Int, b: Int) -> Int {
      return a + b
  }
  
  print("Sum: \\(add(a: 5, b: 3))")
      `,
    },
    {
      author: 'CodeGalaxy',
      title: 'Fibonacci in Rust',
      description: 'Generate the first 10 Fibonacci numbers in Rust.',
      language: 'Rust',
      code: `
  fn fibonacci(n: u32) -> u32 {
      match n {
          0 => 0,
          1 => 1,
          _ => fibonacci(n - 1) + fibonacci(n - 2),
      }
  }
  
  fn main() {
      for i in 0..10 {
          println!("{}", fibonacci(i));
      }
  }
      `,
    },
    {
      author: 'CodeGalaxy',
      title: 'Todo App Example in TypeScript',
      description: 'A basic todo list representation in TypeScript.',
      language: 'TypeScript',
      code: `
  interface Todo {
      id: number;
      task: string;
      completed: boolean;
  }
  
  const todos: Todo[] = [
      { id: 1, task: 'Learn TypeScript', completed: false },
      { id: 2, task: 'Build a project', completed: false },
  ];
  
  console.log(todos);
      `,
    },
    {
      author: 'CodeGalaxy',
      title: 'Palindrome Check in Kotlin',
      description: 'A function to check if a string is a palindrome in Kotlin.',
      language: 'Kotlin',
      code: `
  fun isPalindrome(input: String): Boolean {
      val sanitized = input.replace(Regex("[^A-Za-z0-9]"), "").lowercase()
      return sanitized == sanitized.reversed()
  }
  
  fun main() {
      println(isPalindrome("Racecar")) // true
  }
      `,
    },
    {
      author: 'CodeGalaxy',
      title: 'Select Statement in SQL',
      description: 'A simple SQL query to select all rows from a table.',
      language: 'SQL',
      code: `
  SELECT * FROM Users WHERE active = 1;
      `,
    },
  ];
  

async function seedSnippets() {
  try {
    // Clear existing CodeGalaxy snippets to avoid duplicates
    await Snippet.deleteMany({ author: 'CodeGalaxy' });

    // Insert default snippets
    await Snippet.insertMany(defaultSnippets);
    console.log('Default snippets added successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding snippets:', error);
    process.exit(1);
  }
}