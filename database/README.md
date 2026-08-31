# AI Smart Grading System - Database

## 1. Overview

The AI Smart Grading System is designed to automatically evaluate student answers using Artificial Intelligence.

The database stores information related to students, professors, classes, subjects, assignments, questions, submissions, AI evaluations, grades, and feedback.

---

## 2. Database Technology

- Database: MySQL
- Database Name: `ai_smart_grading`

---

## 3. Database Files

| File | Purpose |
|------|---------|
| `schema.sql` | Creates the database, tables, keys, and relationships |
| `data.sql` | Inserts sample data into the database |
| `queries.sql` | Contains SQL queries for retrieving and analyzing data |
| `README.md` | Contains documentation about the database |

---

## 4. Database Tables

The database contains the following tables:

1. `users`
2. `subjects`
3. `classes`
4. `class_students`
5. `assignments`
6. `assignment_files`
7. `questions`
8. `submissions`
9. `student_answers`
10. `ai_evaluations`
11. `grades`
12. `feedback`

---

## 5. Database Structure

The main flow of the database is:

```text
USERS
  |
  +----------------+
  |                |
  v                v
PROFESSOR        STUDENT
  |                |
  v                |
CLASSES            |
  |                |
  v                |
SUBJECTS           |
  |                |
  v                |
ASSIGNMENTS       |
  |                |
  +--------+-------+
           |
      +----+----+
      |         |
      v         v
 QUESTIONS   ASSIGNMENT_FILES

STUDENT
   |
   v
SUBMISSIONS
   |
   v
STUDENT_ANSWERS
   |
   +-------------------+
   |                   |
   v                   v
AI_EVALUATIONS       GRADES
   |                   |
   +---------+---------+
             |
             v
          FEEDBACK