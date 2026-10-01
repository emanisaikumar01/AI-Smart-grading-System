import unittest
from unittest.mock import patch

from fastapi.testclient import TestClient

from ai.api import app


class GradingApiTests(unittest.TestCase):
    def setUp(self):
        self.client = TestClient(app)
        self.payload = {
            "questionText": "Explain photosynthesis.",
            "studentAnswer": "Plants use sunlight and water.",
            "expectedAnswer": "Plants use sunlight, water and carbon dioxide.",
            "markingCriteria": "plants, sunlight, water",
            "keywords": ["plants", "sunlight", "water"],
            "maxMarks": 10,
        }

    def test_health(self):
        response = self.client.get("/health")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {"status": "UP"})

    @patch("ai.api.calculate_marks", return_value=(6.75, 2))
    @patch("ai.api.compare_answers", return_value=0.72)
    def test_grade_returns_actual_function_results(self, compare, calculate):
        response = self.client.post("/ai/grade", json=self.payload)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {
            "score": 6.75,
            "confidenceScore": None,
            "evaluation": "Semantic similarity: 0.7200; keywords matched: 2/3.",
            "feedback": None,
            "similarityScore": 0.72,
            "keywordsFound": 2,
            "totalKeywords": 3,
        })
        compare.assert_called_once_with(self.payload["studentAnswer"], self.payload["expectedAnswer"])
        calculate.assert_called_once_with(0.72, self.payload["studentAnswer"], self.payload["keywords"], 10.0)

    def test_rejects_empty_keyword_list(self):
        response = self.client.post("/ai/grade", json={**self.payload, "keywords": []})
        self.assertEqual(response.status_code, 422)

    def test_grading_failure_does_not_return_a_score(self):
        with patch("ai.api.compare_answers", side_effect=RuntimeError("model error")):
            response = self.client.post("/ai/grade", json=self.payload)
        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.json(), {"detail": "AI grading failed"})


if __name__ == "__main__":
    unittest.main()
