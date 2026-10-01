package com.smartgrading.backend.integration;

import com.smartgrading.backend.dto.EvaluationRequest;
import com.smartgrading.backend.exception.AiServiceException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.client.ResourceAccessException;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientResponseException;

@Component
public class HttpAiGradingClient implements AiGradingClient {
    private final RestClient client;

    public HttpAiGradingClient(RestClient aiRestClient) { this.client = aiRestClient; }

    @Override
    public AiGradingResult grade(EvaluationRequest request) {
        final AiGradingResult result;
        try {
            result = client.post().uri("/ai/grade").body(request).retrieve().body(AiGradingResult.class);
        } catch (ResourceAccessException ex) {
            if (hasCause(ex, java.net.SocketTimeoutException.class)) {
                throw new AiServiceException(HttpStatus.GATEWAY_TIMEOUT, "AI grading service timed out");
            }
            throw new AiServiceException(HttpStatus.SERVICE_UNAVAILABLE, "AI grading service is unavailable");
        } catch (RestClientResponseException ex) {
            if (ex.getStatusCode().is4xxClientError()) {
                throw new AiServiceException(HttpStatus.UNPROCESSABLE_ENTITY, "AI grading service rejected the grading request");
            }
            throw new AiServiceException(HttpStatus.BAD_GATEWAY, "AI grading service failed to process the request");
        } catch (RuntimeException ex) {
            throw new AiServiceException(HttpStatus.BAD_GATEWAY, "AI grading service returned an invalid response");
        }
        if (!valid(result)) {
            throw new AiServiceException(HttpStatus.BAD_GATEWAY, "AI grading service returned an incomplete response");
        }
        return result;
    }

    private boolean valid(AiGradingResult r) {
        return r != null && r.score() != null
                && r.evaluation() != null && r.similarityScore() != null
                && r.keywordsFound() != null && r.totalKeywords() != null
                && r.keywordsFound() >= 0 && r.totalKeywords() > 0
                && r.keywordsFound() <= r.totalKeywords();
    }

    private boolean hasCause(Throwable error, Class<? extends Throwable> type) {
        for (Throwable cause = error; cause != null; cause = cause.getCause()) if (type.isInstance(cause)) return true;
        return false;
    }
}
