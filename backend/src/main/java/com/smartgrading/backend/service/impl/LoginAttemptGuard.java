package com.smartgrading.backend.service.impl;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Clock;
import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.HexFormat;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/** Process-local PoC guard. State is bounded by expiration and never contains credentials. */
@Component
public class LoginAttemptGuard {
    private static final Logger log = LoggerFactory.getLogger(LoginAttemptGuard.class);
    private final Map<String, Window> accounts = new ConcurrentHashMap<>();
    private final Map<String, Window> ips = new ConcurrentHashMap<>();
    private final int threshold;
    private final Duration window;
    private final Duration cooldown;
    private final Clock clock;

    @org.springframework.beans.factory.annotation.Autowired
    public LoginAttemptGuard(@Value("${app.security.login.threshold:5}") int threshold,
                             @Value("${app.security.login.window:10m}") Duration window,
                             @Value("${app.security.login.cooldown:15m}") Duration cooldown) {
        this(threshold, window, cooldown, Clock.systemUTC());
    }

    LoginAttemptGuard(int threshold, Duration window, Duration cooldown, Clock clock) {
        this.threshold = threshold; this.window = window; this.cooldown = cooldown; this.clock = clock;
    }

    public synchronized boolean isBlocked(String identifier, String ip) {
        Instant now = clock.instant();
        prune(accounts, now);
        prune(ips, now);
        return blocked(accounts.get(key("account", identifier)), now) || blocked(ips.get(key("ip", ip)), now);
    }

    public synchronized void recordFailure(String identifier, String ip) {
        Instant now = clock.instant();
        record(accounts, key("account", identifier), "account", now);
        record(ips, key("ip", ip), "ip", now);
    }

    public synchronized void recordSuccess(String identifier) {
        Window removed = accounts.remove(key("account", identifier));
        if (removed != null) log.info("Login security event=account_failures_reset subject={}", fingerprint("account", identifier));
    }

    private void record(Map<String, Window> map, String key, String kind, Instant now) {
        Window w = map.computeIfAbsent(key, ignored -> new Window());
        expire(w, now);
        w.failures.addLast(now);
        if (w.failures.size() >= threshold && w.blockedUntil == null) {
            w.blockedUntil = now.plus(cooldown);
            log.warn("Login security event=temporary_lockout scope={} subject={}", kind, key.substring(key.indexOf(':') + 1));
        } else {
            log.info("Login security event=failed_authentication scope={} subject={}", kind, key.substring(key.indexOf(':') + 1));
        }
    }

    private boolean blocked(Window w, Instant now) {
        if (w == null) return false;
        if (w.blockedUntil != null) {
            if (now.isBefore(w.blockedUntil)) return true;
            w.blockedUntil = null;
            w.failures.clear();
        }
        expire(w, now);
        return false;
    }

    private void expire(Window w, Instant now) {
        Instant cutoff = now.minus(window);
        while (!w.failures.isEmpty() && !w.failures.peekFirst().isAfter(cutoff)) w.failures.removeFirst();
        if (w.failures.isEmpty()) w.blockedUntil = null;
    }

    private void prune(Map<String, Window> map, Instant now) {
        map.entrySet().removeIf(entry -> {
            Window w = entry.getValue();
            if (w.blockedUntil != null && !now.isBefore(w.blockedUntil)) { w.blockedUntil = null; w.failures.clear(); }
            expire(w, now);
            return w.failures.isEmpty() && w.blockedUntil == null;
        });
    }

    private String key(String kind, String value) { return kind + ":" + fingerprint(kind, value == null ? "" : value); }
    private static String fingerprint(String kind, String value) {
        try {
            byte[] hash = MessageDigest.getInstance("SHA-256").digest((kind + "\u0000" + value).getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(hash, 0, 12);
        } catch (Exception impossible) { throw new IllegalStateException(impossible); }
    }
    private static final class Window { final ArrayDeque<Instant> failures = new ArrayDeque<>(); Instant blockedUntil; }
}
