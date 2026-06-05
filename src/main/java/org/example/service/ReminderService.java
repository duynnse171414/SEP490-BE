package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.exception.BadRequestException;
import org.example.exception.NotFoundException;
import org.example.exception.ReminderLimitException;
import org.example.model.request.ReminderRequest;
import org.example.model.response.QuotaResponse;
import org.example.model.response.ReminderResponse;
import org.example.repository.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
@RequiredArgsConstructor
public class ReminderService {

    private final ReminderRepository repository;
    private final ElderlyProfileRepository elderlyRepository;
    private final AccountRepository accountRepository;
    private final UserPackageRepository userPackageRepository;
    private final ReminderLogRepository reminderLogRepository;
    private final AlertNotificationRepository alertNotificationRepository;

    private static final int FREE_LIMIT = 5;
    private static final int UNLIMITED = -1;

    // ============================================================
    // HELPERS
    // ============================================================


    private Account getCurrentAccount() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || authentication.getName() == null) {
            throw new NotFoundException("No authenticated account in context");
        }
        return accountRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new NotFoundException("Account not found"));
    }


    private int resolveLimitForElderly(Long elderlyId) {
        Optional<UserPackage> activeOpt = userPackageRepository
                .findFirstByElderlyProfileIdAndStatusAndExpiredAtAfterAndDeletedFalseOrderByExpiredAtDesc(
                        elderlyId, PaymentStatus.PAID, LocalDateTime.now());

        if (activeOpt.isEmpty()) {
            return FREE_LIMIT;
        }

        String level = activeOpt.get().getServicePackage().getLevel();
        PackageLevel pkgLevel;
        try {
            pkgLevel = PackageLevel.valueOf(level.toUpperCase());
        } catch (IllegalArgumentException | NullPointerException e) {
            return FREE_LIMIT;
        }

        return switch (pkgLevel) {
            case BASIC    -> 10;
            case STANDARD -> 15;
            case PREMIUM  -> UNLIMITED;
        };
    }


    private void assertWithinLimit(Long elderlyId, String message) {
        int limit = resolveLimitForElderly(elderlyId);
        if (limit != UNLIMITED) {
            long currentCount = repository.countByElderlyIdAndDeletedFalse(elderlyId);
            if (currentCount >= limit) {
                throw new ReminderLimitException(message + " (limit = " + limit + ").");
            }
        }
    }


    private void cascadeSoftDelete(Long reminderId, boolean deleted) {
        List<ReminderLog> logs = reminderLogRepository.findByReminderId(reminderId);
        for (ReminderLog log : logs) {
            List<AlertNotification> alerts =
                    alertNotificationRepository.findByReminderLogId(log.getId());
            alerts.forEach(a -> a.setDeleted(deleted));
            alertNotificationRepository.saveAll(alerts);
            log.setDeleted(deleted);
        }
        reminderLogRepository.saveAll(logs);
    }

    // ============================================================
    // CREATE
    // ============================================================
    @Transactional
    public ReminderResponse create(ReminderRequest request) {
        if (request.getScheduleTime() == null) {
            throw new BadRequestException("scheduleTime is required");
        }

        Account account = getCurrentAccount();

        ElderlyProfile elderly = elderlyRepository.findById(request.getElderlyId())
                .orElseThrow(() -> new NotFoundException("Elderly not found"));

        repository.findByElderlyIdAndTitleAndScheduleTimeAndDeletedTrue(
                        elderly.getId(), request.getTitle(), request.getScheduleTime())
                .ifPresent(d -> {
                    throw new BadRequestException(
                            "This reminder was previously deleted (id=" + d.getId() + "). Please restore it instead of creating a new one.");
                });

        assertWithinLimit(elderly.getId(), "This elderly has reached the reminder limit. Please upgrade the package to create more");

        Reminder reminder = new Reminder();
        reminder.setElderly(elderly);
        reminder.setAccount(account);
        reminder.setTitle(request.getTitle());
        reminder.setReminderType(request.getReminderType());
        reminder.setScheduleTime(request.getScheduleTime());
        reminder.setRepeatPattern(request.getRepeatPattern());
        reminder.setActive(request.getActive() != null ? request.getActive() : true);
        reminder.setDeleted(false);

        return mapToResponse(repository.save(reminder));
    }

    // ============================================================
    // READ
    // ============================================================
    @Transactional(readOnly = true)
    public List<ReminderResponse> getAll() {
        Account account = getCurrentAccount();
        return repository.findByAccountIdAndDeletedFalse(account.getId())
                .stream().map(this::mapToResponse).toList();
    }

    @Transactional(readOnly = true)
    public ReminderResponse getById(Long id) {
        Account account = getCurrentAccount();
        Reminder reminder = repository.findByIdAndAccountIdAndDeletedFalse(id, account.getId())
                .orElseThrow(() -> new NotFoundException("Reminder not found or access denied"));
        return mapToResponse(reminder);
    }

    @Transactional(readOnly = true)
    public List<ReminderResponse> getDeletedReminders() {
        Account account = getCurrentAccount();
        return repository.findByAccountIdAndDeletedTrue(account.getId())
                .stream().map(this::mapToResponse).toList();
    }
    
    @Transactional(readOnly = true)
    public List<ReminderResponse> getByElderlyId(Long elderlyId) {
        Account account = getCurrentAccount();
        return repository.findByElderlyIdAndAccountIdAndDeletedFalse(elderlyId, account.getId())
                .stream().map(this::mapToResponse).toList();
    }

    // ============================================================
    // UPDATE
    // ============================================================
    @Transactional
    public ReminderResponse update(Long id, ReminderRequest request) {
        if (request.getScheduleTime() == null) {
            throw new BadRequestException("scheduleTime is required");
        }

        Account account = getCurrentAccount();
        Reminder reminder = repository.findByIdAndAccountIdAndDeletedFalse(id, account.getId())
                .orElseThrow(() -> new NotFoundException("Reminder not found or access denied"));

        repository.findByElderlyIdAndTitleAndScheduleTimeAndDeletedTrue(
                        reminder.getElderly().getId(), request.getTitle(), request.getScheduleTime())
                .filter(d -> !d.getId().equals(id))
                .ifPresent(d -> {
                    throw new BadRequestException(
                            "This reminder was previously deleted (id=" + d.getId()
                                    + "). Please restore it instead.");
                });

        reminder.setTitle(request.getTitle());
        reminder.setReminderType(request.getReminderType());
        reminder.setScheduleTime(request.getScheduleTime());
        reminder.setRepeatPattern(request.getRepeatPattern());
        if (request.getActive() != null) {
            reminder.setActive(request.getActive());
        }

        return mapToResponse(repository.save(reminder));
    }

    @Transactional
    public ReminderResponse toggleActive(Long id) {
        Account account = getCurrentAccount();
        Reminder reminder = repository.findByIdAndAccountIdAndDeletedFalse(id, account.getId())
                .orElseThrow(() -> new NotFoundException("Reminder not found or access denied"));

        reminder.setActive(!reminder.isActive());
        return mapToResponse(repository.save(reminder));
    }

    // ============================================================
    // DELETE / RESTORE (soft delete)
    // ============================================================
    @Transactional
    public void delete(Long id) {
        Account account = getCurrentAccount();
        Reminder reminder = repository.findByIdAndAccountIdAndDeletedFalse(id, account.getId())
                .orElseThrow(() -> new NotFoundException("Reminder not found or access denied"));

        cascadeSoftDelete(reminder.getId(), true);
        reminder.setDeleted(true);
        repository.save(reminder);
    }

    @Transactional
    public ReminderResponse restore(Long id) {
        Account account = getCurrentAccount();
        Reminder reminder = repository.findByIdAndAccountId(id, account.getId())
                .orElseThrow(() -> new NotFoundException("Reminder not found or access denied"));

        if (!reminder.isDeleted()) {
            throw new BadRequestException("Reminder has not been deleted.");
        }

        assertWithinLimit(reminder.getElderly().getId(),
                "Cannot restore: reminder limit has been reached");

        cascadeSoftDelete(reminder.getId(), false);
        reminder.setDeleted(false);
        return mapToResponse(repository.save(reminder));
    }

    // ============================================================
    // QUOTA
    // ============================================================
    @Transactional(readOnly = true)
    public QuotaResponse getQuotaByElderly(Long elderlyId) {
        Optional<UserPackage> activeOpt = userPackageRepository
                .findFirstByElderlyProfileIdAndStatusAndExpiredAtAfterAndDeletedFalseOrderByExpiredAtDesc(
                        elderlyId, PaymentStatus.PAID, LocalDateTime.now());

        int limit = resolveLimitForElderly(elderlyId);
        long used = repository.countByElderlyIdAndDeletedFalse(elderlyId);
        boolean unlimited = (limit == UNLIMITED);

        QuotaResponse quota = new QuotaResponse();
        quota.setElderlyId(elderlyId);
        quota.setUsed(used);
        quota.setLimit(limit);
        quota.setRemaining(unlimited ? -1 : Math.max(0, limit - used));
        quota.setUnlimited(unlimited);
        quota.setUpgradeRequired(!unlimited && used >= limit);

        if (activeOpt.isPresent()) {
            ServicePackage pkg = activeOpt.get().getServicePackage();
            quota.setHasActivePackage(true);
            quota.setLevel(pkg.getLevel());
            quota.setPackageName(pkg.getName());
            quota.setExpiredAt(activeOpt.get().getExpiredAt());
        } else {
            quota.setHasActivePackage(false);
            quota.setLevel("FREE");
        }

        return quota;
    }

    // ============================================================
    // MAPPER
    // ============================================================
    private ReminderResponse mapToResponse(Reminder reminder) {
        ReminderResponse response = new ReminderResponse();
        response.setId(reminder.getId());
        response.setTitle(reminder.getTitle());
        response.setReminderType(reminder.getReminderType());
        response.setScheduleTime(reminder.getScheduleTime());
        response.setRepeatPattern(reminder.getRepeatPattern());
        response.setActive(reminder.isActive());

        if (reminder.getElderly() != null) {
            response.setElderlyId(reminder.getElderly().getId());
            response.setElderlyName(reminder.getElderly().getName());
        }
        return response;
    }
}