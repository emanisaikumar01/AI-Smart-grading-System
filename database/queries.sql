USE ai_smart_grading;


-- 1. Display all users
SELECT *
FROM users;


-- 2. Display only students
SELECT *
FROM users
WHERE role = 'STUDENT';


-- 3. Display all professors
SELECT *
FROM users
WHERE role = 'PROFESSOR';


-- 4. Display all subjects
SELECT *
FROM subjects;


-- 5. Display all classes with subject names
SELECT
    c.class_id,
    c.class_name,
    c.section,
    s.subject_name
FROM classes c
JOIN subjects s
    ON c.subject_id = s.subject_id;


-- 6. Display assignments
SELECT
    assignment_id,
    title,
    total_marks,
    due_date,
    status
FROM assignments;


-- 7. Display questions for an assignment
SELECT
    question_number,
    question_text,
    max_marks
FROM questions
WHERE assignment_id = 1;


-- 8. Display student submissions
SELECT
    s.submission_id,
    u.name AS student_name,
    a.title AS assignment_name,
    s.submitted_at,
    s.status
FROM submissions s
JOIN users u
    ON s.student_id = u.user_id
JOIN assignments a
    ON s.assignment_id = a.assignment_id;


-- 9. Display student answers
SELECT
    u.name AS student_name,
    q.question_number,
    sa.answer_text
FROM student_answers sa
JOIN submissions s
    ON sa.submission_id = s.submission_id
JOIN users u
    ON s.student_id = u.user_id
JOIN questions q
    ON sa.question_id = q.question_id;


-- 10. Display AI evaluation
SELECT
    q.question_number,
    ae.ai_score,
    ae.confidence_score,
    ae.ai_feedback
FROM ai_evaluations ae
JOIN student_answers sa
    ON ae.answer_id = sa.answer_id
JOIN questions q
    ON sa.question_id = q.question_id;


-- 11. Display final grades
SELECT
    u.name AS student_name,
    q.question_number,
    g.ai_score,
    g.teacher_score,
    g.final_score,
    g.teacher_feedback
FROM grades g
JOIN student_answers sa
    ON g.answer_id = sa.answer_id
JOIN submissions s
    ON sa.submission_id = s.submission_id
JOIN users u
    ON s.student_id = u.user_id
JOIN questions q
    ON sa.question_id = q.question_id;


-- 12. Calculate average final score
SELECT
    AVG(final_score) AS average_score
FROM grades;


-- 13. Calculate total marks obtained
SELECT
    SUM(final_score) AS total_marks_obtained
FROM grades;


-- 14. Count total students
SELECT
    COUNT(*) AS total_students
FROM users
WHERE role = 'STUDENT';


-- 15. Find teacher-overridden grades
SELECT
    g.grade_id,
    g.ai_score,
    g.teacher_score,
    g.final_score
FROM grades g
WHERE g.is_overridden = TRUE;