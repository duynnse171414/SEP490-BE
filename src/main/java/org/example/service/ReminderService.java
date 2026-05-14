package org.example.service;

import lombok.RequiredArgsConstructor;
import org.example.entity.*;
import org.example.exception.NotFoundException;
import org.example.exception.ReminderLimitException;
import org.example.model.request.ReminderRequest;
import org.example.model.response.ReminderResponse;
import org.example.repository.*;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReminderService {
    @Autowired
    ReminderRepository repository;
    @Autowired
    ElderlyProfileRepository elderlyRepository;
    @Autowired
    CaregiverProfileRepository caregiverRepository;

    @Autowired
    AccountRepository accountRepository;

    @Autowired
    ModelMapper modelMapper;

    @Autowired
    UserPackageRepository userPackageRepository;

    private static final int FREE_LIMIT = 5;
    private static final int UNLIMITED = -1;

    /**
     * Trả về limit reminder cho elderly:
     *  - Chưa mua gói còn hạn → 5
     *  - BASIC    → 5
     *  - STANDARD → 15
     *  - PREMIUM  → unlimited (-1)
     */
    private int resolveLimitForElderly(Long elderlyId) {

        Optional<UserPackage> activeOpt = userPackageRepository
                .findFirstByElderlyProfileIdAndStatusAndExpiredAtAfterAndDeletedFalseOrderByExpiredAtDesc(
                        elderlyId,
                        PaymentStatus.PAID,        // ⚠️ đổi cho đúng enum
                        LocalDateTime.now());

        if (activeOpt.isEmpty()) {
            return FREE_LIMIT;
        }

        String level = activeOpt.get().getServicePackage().getLevel();
        PackageLevel pkgLevel;
        try {
            pkgLevel = PackageLevel.valueOf(level.toUpperCase());
        } catch (Exception e) {
            // Level lạ → fallback về free để khỏi block user
            return FREE_LIMIT;
        }

        return switch (pkgLevel) {
            case BASIC    -> 5;
            case STANDARD -> 15;
            case PREMIUM  -> UNLIMITED;
        };
    }

    // CREATE
    public ReminderResponse create(ReminderRequest request) {

        ElderlyProfile elderly = elderlyRepository.findById(request.getElderlyId())
                .orElseThrow(() -> new RuntimeException("Elderly not found"));

        CaregiverProfile caregiver = caregiverRepository.findById(request.getCaregiverId())
                .orElseThrow(() -> new RuntimeException("Caregiver not found"));

        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        Account account = accountRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        if (request.getScheduleTime() == null) {
            throw new RuntimeException("scheduleTime is required");
        }

        // ✅ CHECK 1: Reminder đã từng tồn tại và bị xóa mềm
        Optional<Reminder> deletedDuplicate = repository
                .findByElderlyIdAndTitleAndScheduleTimeAndDeletedTrue(
                        elderly.getId(),
                        request.getTitle(),
                        request.getScheduleTime());

        if (deletedDuplicate.isPresent()) {
            throw new RuntimeException(
                    "This reminder was previously deleted (id=" + deletedDuplicate.get().getId() +
                            "). Please restore instead of creating a new one."
            );
        }

        // ✅ CHECK 2: Limit theo gói của elderly
        int limit = resolveLimitForElderly(elderly.getId());
        if (limit != UNLIMITED) {
            long currentCount = repository.countByElderlyIdAndDeletedFalse(elderly.getId());
            if (currentCount >= limit) {
                throw new ReminderLimitException(
                        "Elderly, this has reached its limit. " + limit + " reminders. " +
                                "Please upgrade your package to create more."
                );
            }
        }

        Reminder reminder = new Reminder();
        reminder.setElderly(elderly);
        reminder.setCaregiver(caregiver);
        reminder.setAccount(account);
        reminder.setTitle(request.getTitle());
        reminder.setReminderType(request.getReminderType());
        reminder.setScheduleTime(request.getScheduleTime());
        reminder.setRepeatPattern(request.getRepeatPattern());
        reminder.setActive(request.getActive() != null ? request.getActive() : true);
        reminder.setDeleted(false);

        repository.save(reminder);
        return mapToResponse(reminder);
    }

    // GET ALL
    public List<ReminderResponse> getAll() {

        // 🔥 LẤY USER ĐANG LOGIN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Account account = accountRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // ✅ CHỈ LẤY REMINDER CỦA ACCOUNT NÀY
        return repository.findByAccountIdAndDeletedFalse(account.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ID
    public ReminderResponse getById(Long id) {

        // 🔥 LẤY USER ĐANG LOGIN
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = authentication.getName();

        Account account = accountRepository.findByEmail(username)
                .orElseThrow(() -> new RuntimeException("Account not found"));

        // ✅ CHỈ LẤY REMINDER CỦA ACCOUNT NÀY
        Reminder reminder = repository.findByIdAndAccountIdAndDeletedFalse(id, account.getId())
                .orElseThrow(() -> new RuntimeException("Reminder not found or access denied"));

        return mapToResponse(reminder);
    }

    // Lấy danh sách reminder đã xóa (cho UI thùng rác)
    public List<ReminderResponse> getDeletedReminders() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Account account = accountRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        return repository.findByAccountIdAndDeletedTrue(account.getId())
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }
    // UPDATE
    public ReminderResponse update(Long id, ReminderRequest request) {

        Reminder reminder = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        if (request.getScheduleTime() == null) {
            throw new RuntimeException("scheduleTime is required");
        }

        // ✅ Thêm: check trùng với reminder đã deleted (trừ chính nó)
        Optional<Reminder> deletedDuplicate = repository
                .findByElderlyIdAndTitleAndScheduleTimeAndDeletedTrue(
                        reminder.getElderly().getId(),
                        request.getTitle(),
                        request.getScheduleTime());

        if (deletedDuplicate.isPresent() && !deletedDuplicate.get().getId().equals(id)) {
            throw new RuntimeException(
                    "This reminder was previously deleted (id=" + deletedDuplicate.get().getId() +
                            "). Please restore instead of creating a new one."
            );
        }

        reminder.setTitle(request.getTitle());
        reminder.setReminderType(request.getReminderType());
        reminder.setScheduleTime(request.getScheduleTime());
        reminder.setRepeatPattern(request.getRepeatPattern());

        if (request.getActive() != null) {
            reminder.setActive(request.getActive());
        }

        repository.save(reminder);
        return mapToResponse(reminder);
    }

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

        if (reminder.getCaregiver() != null) {
            response.setCaregiverId(reminder.getCaregiver().getId());
            response.setCaregiverName(reminder.getCaregiver().getRelationship());
        }

        return response;
    }

    // GET BY CAREGIVER ID
    public List<ReminderResponse> getByCaregiverId(Long caregiverId) {
        return repository.findByCaregiverIdAndDeletedFalse(caregiverId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    // GET BY ELDERLY ID
    public List<ReminderResponse> getByElderlyId(Long elderlyId) {
        return repository.findByElderlyIdAndDeletedFalse(elderlyId)
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<ReminderResponse> getByAccount(Long accountId) {

        Account account = accountRepository.findById(accountId)
                .orElseThrow(() -> new NotFoundException("Account not found"));


        return repository.findByAccountIdAndDeletedFalse(accountId)
                .stream()
                .map(profile -> {
                    ReminderResponse response =
                            modelMapper.map(profile, ReminderResponse.class);
                    response.setAccountId(profile.getAccount().getId());
                    return response;
                })
                .collect(Collectors.toList());
    }

    public ReminderResponse toggleActive(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Account account = accountRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Reminder reminder = repository.findByIdAndAccountIdAndDeletedFalse(id, account.getId())
                .orElseThrow(() -> new RuntimeException("Reminder not found or access denied"));

        // Flip trạng thái
        reminder.setActive(!reminder.isActive());
        repository.save(reminder);
        return mapToResponse(reminder);
    }

    public void delete(Long id) {
        Reminder reminder = repository.findByIdAndDeletedFalse(id)
                .orElseThrow(() -> new RuntimeException("Reminder not found"));

        reminder.setDeleted(true);
        // ❌ Không set active=false ở đây
        // → Giữ nguyên active để khi restore về đúng trạng thái cũ
        repository.save(reminder);
    }

    public ReminderResponse restore(Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Account account = accountRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Account not found"));

        Reminder reminder = repository.findByIdAndAccountId(id, account.getId())
                .orElseThrow(() -> new RuntimeException("Reminder not found or access denied"));

        if (!reminder.isDeleted()) {
            throw new RuntimeException("Reminder has not been deleted.");
        }

        // Check limit trước khi restore
        int limit = resolveLimitForElderly(reminder.getElderly().getId());
        if (limit != UNLIMITED) {
            long currentCount = repository.countByElderlyIdAndDeletedFalse(
                    reminder.getElderly().getId());
            if (currentCount >= limit) {
                throw new ReminderLimitException(
                        "Cannot be recovered: limit has been reached " + limit + " reminders."
                );
            }
        }

        reminder.setDeleted(false);
        // ✅ active giữ nguyên như lúc xóa → restore về đúng trạng thái cũ
        repository.save(reminder);
        return mapToResponse(reminder);
    }


    public Map<String, Object> getQuotaByElderly(Long elderlyId) {

        Optional<UserPackage> activeOpt = userPackageRepository
                .findFirstByElderlyProfileIdAndStatusAndExpiredAtAfterAndDeletedFalseOrderByExpiredAtDesc(
                        elderlyId, PaymentStatus.PAID, LocalDateTime.now());

        int limit = resolveLimitForElderly(elderlyId);
        long used = repository.countByElderlyIdAndDeletedFalse(elderlyId);

        Map<String, Object> result = new HashMap<>();
        result.put("elderlyId", elderlyId);
        result.put("used", used);
        result.put("limit", limit);                            // -1 = unlimited
        result.put("remaining", limit == UNLIMITED ? -1 : Math.max(0, limit - used));
        result.put("unlimited", limit == UNLIMITED);

        if (activeOpt.isPresent()) {
            ServicePackage pkg = activeOpt.get().getServicePackage();
            result.put("hasActivePackage", true);
            result.put("level", pkg.getLevel());
            result.put("packageName", pkg.getName());
            result.put("expiredAt", activeOpt.get().getExpiredAt());
        } else {
            result.put("hasActivePackage", false);
            result.put("level", "FREE");
        }

        result.put("upgradeRequired",
                limit != UNLIMITED && used >= limit);

        return result;
    }
}