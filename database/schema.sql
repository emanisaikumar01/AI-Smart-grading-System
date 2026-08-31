CREATE DATABASE IF NOT EXISTS ai_smart_grading;

USE ai_smart_grading;


-- 1. USERS
CREATE TABLE users (
    user_id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('STUDENT', 'PROFESSOR') NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 2. SUBJECTS
CREATE TABLE subjects (
    subject_id INT PRIMARY KEY AUTO_INCREMENT,
    subject_name VARCHAR(150) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- 3. CLASSES
CREATE TABLE classes (
    class_id INT PRIMARY KEY AUTO_INCREMENT,
    class_name VARCHAR(100) NOT NULL,
    section VARCHAR(50),
    subject_id INT NOT NULL,
    professor_id INT NOT NULL,

    FOREIGN KEY (subject_id)
        REFERENCES subjects(subject_id),

    FOREIGN KEY (professor_id)
        REFERENCES users(user_id)
);


-- 4. CLASS STUDENTS
CREATE TABLE class_students (
    class_id INT NOT NULL,
    student_id INT NOT NULL,

    PRIMARY KEY (class_id, student_id),

    FOREIGN KEY (class_id)
        REFERENCES classes(class_id)
        ON DELETE CASCADE,

    FOREIGN KEY (student_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE
);


-- 5. ASSIGNMENTS
CREATE TABLE assignments (
    assignment_id INT PRIMARY KEY AUTO_INCREMENT,
    class_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    description TEXT,
    instructions TEXT,
    total_marks DECIMAL(6,2) NOT NULL,
    due_date DATETIME,

    status ENUM(
        'DRAFT',
        'ACTIVE',
        'CLOSED',
        'GRADED'
    ) DEFAULT 'DRAFT',

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (class_id)
        REFERENCES classes(class_id)
        ON DELETE CASCADE
);


-- 6. ASSIGNMENT FILES
CREATE TABLE assignment_files (
    file_id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_type VARCHAR(100),
    file_path VARCHAR(500) NOT NULL,

    file_category ENUM(
        'QUESTION_PAPER',
        'MARKING_SCHEME',
        'REFERENCE'
    ) NOT NULL,

    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (assignment_id)
        REFERENCES assignments(assignment_id)
        ON DELETE CASCADE
);


-- 7. QUESTIONS
CREATE TABLE questions (
    question_id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    question_number INT NOT NULL,
    question_text TEXT NOT NULL,
    max_marks DECIMAL(6,2) NOT NULL,
    expected_answer TEXT,
    marking_criteria TEXT,

    FOREIGN KEY (assignment_id)
        REFERENCES assignments(assignment_id)
        ON DELETE CASCADE,

    UNIQUE (assignment_id, question_number)
);


-- 8. SUBMISSIONS
CREATE TABLE submissions (
    submission_id INT PRIMARY KEY AUTO_INCREMENT,
    assignment_id INT NOT NULL,
    student_id INT NOT NULL,
    file_name VARCHAR(255),
    file_path VARCHAR(500),

    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    status ENUM(
        'SUBMITTED',
        'PROCESSING',
        'GRADED',
        'REVIEWED'
    ) DEFAULT 'SUBMITTED',

    FOREIGN KEY (assignment_id)
        REFERENCES assignments(assignment_id)
        ON DELETE CASCADE,

    FOREIGN KEY (student_id)
        REFERENCES users(user_id)
        ON DELETE CASCADE,

    UNIQUE (assignment_id, student_id)
);


-- 9. STUDENT ANSWERS
CREATE TABLE student_answers (
    answer_id INT PRIMARY KEY AUTO_INCREMENT,
    submission_id INT NOT NULL,
    question_id INT NOT NULL,
    answer_text TEXT,

    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (submission_id)
        REFERENCES submissions(submission_id)
        ON DELETE CASCADE,

    FOREIGN KEY (question_id)
        REFERENCES questions(question_id)
        ON DELETE CASCADE,

    UNIQUE (submission_id, question_id)
);


-- 10. AI EVALUATIONS
CREATE TABLE ai_evaluations (
    evaluation_id INT PRIMARY KEY AUTO_INCREMENT,
    answer_id INT NOT NULL,

    ai_score DECIMAL(6,2) NOT NULL,
    confidence_score DECIMAL(5,2),

    evaluation TEXT,
    ai_feedback TEXT,

    evaluated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (answer_id)
        REFERENCES student_answers(answer_id)
        ON DELETE CASCADE
);


-- 11. GRADES
CREATE TABLE grades (
    grade_id INT PRIMARY KEY AUTO_INCREMENT,
    answer_id INT NOT NULL,

    ai_score DECIMAL(6,2),
    teacher_score DECIMAL(6,2),
    final_score DECIMAL(6,2),

    teacher_feedback TEXT,

    is_overridden BOOLEAN DEFAULT FALSE,

    graded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (answer_id)
        REFERENCES student_answers(answer_id)
        ON DELETE CASCADE
);


-- 12. FEEDBACK
CREATE TABLE feedback (
    feedback_id INT PRIMARY KEY AUTO_INCREMENT,
    answer_id INT NOT NULL,

    feedback_text TEXT NOT NULL,

    feedback_type ENUM(
        'AI',
        'TEACHER'
    ) NOT NULL,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (answer_id)
        REFERENCES student_answers(answer_id)
        ON DELETE CASCADE
);