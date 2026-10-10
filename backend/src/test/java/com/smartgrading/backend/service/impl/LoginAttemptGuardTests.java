package com.smartgrading.backend.service.impl;

import org.junit.jupiter.api.Test;
import java.time.*;
import static org.junit.jupiter.api.Assertions.*;

class LoginAttemptGuardTests {
    @Test void thresholdBlocksFurtherAttemptsAndCooldownExpires() {
        MutableClock clock = new MutableClock();
        LoginAttemptGuard guard = new LoginAttemptGuard(5, Duration.ofMinutes(10), Duration.ofMinutes(15), clock);
        for (int i=0;i<5;i++) { assertFalse(guard.isBlocked("person@test.local", "192.0.2.1")); guard.recordFailure("person@test.local", "192.0.2.1"); }
        assertTrue(guard.isBlocked("person@test.local", "198.51.100.2"));
        assertTrue(guard.isBlocked("other@test.local", "192.0.2.1"));
        clock.advance(Duration.ofMinutes(15));
        assertFalse(guard.isBlocked("person@test.local", "192.0.2.1"));
    }

    @Test void slidingWindowExpiresOldFailuresAndSuccessClearsOnlyAccountFailures() {
        MutableClock clock = new MutableClock();
        LoginAttemptGuard guard = new LoginAttemptGuard(5, Duration.ofMinutes(10), Duration.ofMinutes(15), clock);
        for (int i=0;i<4;i++) guard.recordFailure("person@test.local", "192.0.2.1");
        clock.advance(Duration.ofMinutes(10).plusSeconds(1));
        assertFalse(guard.isBlocked("person@test.local", "192.0.2.1"));
        guard.recordSuccess("person@test.local");
        for (int i=0;i<5;i++) guard.recordFailure("other@test.local", "192.0.2.2");
        assertTrue(guard.isBlocked("new@test.local", "192.0.2.2"));
    }

    private static final class MutableClock extends Clock {
        private Instant now = Instant.parse("2026-01-01T00:00:00Z");
        void advance(Duration duration) { now = now.plus(duration); }
        @Override public ZoneId getZone() { return ZoneOffset.UTC; }
        @Override public Clock withZone(ZoneId zone) { return this; }
        @Override public Instant instant() { return now; }
    }
}
