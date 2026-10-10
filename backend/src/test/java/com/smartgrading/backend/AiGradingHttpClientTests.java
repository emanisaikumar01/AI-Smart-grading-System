package com.smartgrading.backend;

import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.client.match.MockRestRequestMatchers.requestTo;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withServerError;
import static org.springframework.test.web.client.response.MockRestResponseCreators.withSuccess;

import com.smartgrading.backend.dto.EvaluationRequest;
import com.smartgrading.backend.exception.AiServiceException;
import com.smartgrading.backend.integration.HttpAiGradingClient;
import java.math.BigDecimal;
import java.util.List;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.client.MockRestServiceServer;
import org.springframework.web.client.RestClient;

class AiGradingHttpClientTests {
    @Test
    void postsTypedAnswerAndMapsPythonResult() {
        RestClient.Builder builder = RestClient.builder().baseUrl("http://localhost:8501");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        var client = new HttpAiGradingClient(builder.build());
        server.expect(requestTo("http://localhost:8501/ai/grade"))
                .andRespond(withSuccess("""
                        {"score":7.25,"confidenceScore":null,"evaluation":"similarity diagnostic",
                         "feedback":null,"similarityScore":0.8,"keywordsFound":2,"totalKeywords":3}
                        """, MediaType.APPLICATION_JSON));

        var result = client.grade(new EvaluationRequest("Question", "Expected", "a,b", "Typed answer",
                new BigDecimal("10.00"), List.of("a", "b")));

        assertEquals(new BigDecimal("7.25"), result.score());
        assertNull(result.confidenceScore());
        assertEquals("similarity diagnostic", result.evaluation());
        assertNull(result.feedback());
        assertEquals(new BigDecimal("0.8"), result.similarityScore());
        assertEquals(2, result.keywordsFound());
        server.verify();
    }

    @Test
    void mapsPythonServerFailureToGatewayError() {
        RestClient.Builder builder = RestClient.builder().baseUrl("http://localhost:8501");
        MockRestServiceServer server = MockRestServiceServer.bindTo(builder).build();
        var client = new HttpAiGradingClient(builder.build());
        server.expect(requestTo("http://localhost:8501/ai/grade"))
                .andRespond(withServerError());

        var error = assertThrows(AiServiceException.class, () -> client.grade(new EvaluationRequest(
                "Question", "Expected", "a", "Answer", BigDecimal.TEN, List.of("a"))));

        assertEquals(org.springframework.http.HttpStatus.BAD_GATEWAY, error.getStatus());
        server.verify();
    }
}
