USE ai_smart_grading;


-- USERS
INSERT INTO users
(name, email, password, role)
VALUES
('Dr. John Smith', 'john@college.com', 'password123', 'PROFESSOR'),
('Rahul Kumar', 'rahul@college.com', 'password123', 'STUDENT'),
('Priya Sharma', 'priya@college.com', 'password123', 'STUDENT'),
('Ananya Reddy', 'ananya@college.com', 'password123', 'STUDENT');


-- SUBJECTS
INSERT INTO subjects
(subject_name, description)
VALUES
('Database Management Systems',
 'Study of databases, SQL, normalization and database design'),

('Artificial Intelligence',
 'Introduction to AI and intelligent systems');


-- CLASSES
INSERT INTO classes
(class_name, section, subject_id, professor_id)
VALUES
('CSE 3rd Year', 'A', 1, 1),
('CSE 3rd Year', 'B', 2, 1);


-- STUDENTS IN CLASSES
INSERT INTO class_students
(class_id, student_id)
VALUES
(1, 2),
(1, 3),
(1, 4);


-- ASSIGNMENTS
INSERT INTO assignments
(
    class_id,
    title,
    description,
    instructions,
    total_marks,
    due_date,
    status
)
VALUES
(
    1,
    'DBMS Mid-Term Assignment',
    'Assignment on database concepts and SQL',
    'Answer all questions clearly.',
    50,
    '2026-09-15 23:59:00',
    'ACTIVE'
);


-- ASSIGNMENT FILES
INSERT INTO assignment_files
(
    assignment_id,
    file_name,
    file_type,
    file_path,
    file_category
)
VALUES
(
    1,
    'DBMS_Question_Paper.pdf',
    'application/pdf',
    '/uploads/DBMS_Question_Paper.pdf',
    'QUESTION_PAPER'
),

(
    1,
    'DBMS_Marking_Scheme.pdf',
    'application/pdf',
    '/uploads/DBMS_Marking_Scheme.pdf',
    'MARKING_SCHEME'
);


-- QUESTIONS
INSERT INTO questions
(
    assignment_id,
    question_number,
    question_text,
    max_marks,
    expected_answer,
    marking_criteria
)
VALUES
(
    1,
    1,
    'What is normalization in DBMS?',
    10,
    'Normalization is the process of organizing data to reduce redundancy and improve data integrity.',
    'Definition, purpose, advantages and normal forms.'
),

(
    1,
    2,
    'Explain the difference between primary key and foreign key.',
    10,
    'A primary key uniquely identifies records while a foreign key establishes a relationship between tables.',
    'Definition and comparison with examples.'
),

(
    1,
    3,
    'What is a JOIN in SQL?',
    10,
    'JOIN combines rows from two or more tables based on a related column.',
    'Definition, syntax and example.'
);


-- STUDENT SUBMISSIONS
INSERT INTO submissions
(
    assignment_id,
    student_id,
    file_name,
    file_path,
    status
)
VALUES
(
    1,
    2,
    'Rahul_DBMS_Answer.pdf',
    '/uploads/Rahul_DBMS_Answer.pdf',
    'GRADED'
);


-- STUDENT ANSWERS
INSERT INTO student_answers
(
    submission_id,
    question_id,
    answer_text
)
VALUES
(
    1,
    1,
    'Normalization is the process of organizing data in a database to reduce redundancy and improve data integrity.'
),

(
    1,
    2,
    'A primary key uniquely identifies a record. A foreign key connects one table with another table.'
),

(
    1,
    3,
    'JOIN is used to combine data from multiple tables using a related column.'
);


-- AI EVALUATIONS
INSERT INTO ai_evaluations
(
    answer_id,
    ai_score,
    confidence_score,
    evaluation,
    ai_feedback
)
VALUES
(
    1,
    9,
    0.95,
    'The answer correctly explains the main purpose of normalization.',
    'Good answer. Include examples of normal forms for a more complete response.'
),

(
    2,
    8,
    0.91,
    'The answer correctly differentiates primary and foreign keys.',
    'Good explanation. An example would improve the answer.'
),

(
    3,
    9,
    0.94,
    'The answer correctly explains the purpose of JOIN.',
    'Good answer. Include an SQL example for better clarity.'
);


-- GRADES
INSERT INTO grades
(
    answer_id,
    ai_score,
    teacher_score,
    final_score,
    teacher_feedback,
    is_overridden
)
VALUES
(
    1,
    9,
    9,
    9,
    'Excellent explanation.',
    FALSE
),

(
    2,
    8,
    9,
    9,
    'Good explanation with correct concept.',
    TRUE
),

(
    3,
    9,
    9,
    9,
    'Correct answer.',
    FALSE
);


-- FEEDBACK
INSERT INTO feedback
(
    answer_id,
    feedback_text,
    feedback_type
)
VALUES
(
    1,
    'Good answer. Include examples of normal forms.',
    'AI'
),

(
    1,
    'Excellent explanation.',
    'TEACHER'
),

(
    2,
    'Good explanation with correct concept.',
    'TEACHER'
);