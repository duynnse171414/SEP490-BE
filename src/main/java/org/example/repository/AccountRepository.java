package org.example.repository;

import org.example.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AccountRepository extends JpaRepository<Account, Long> {


    Account findAccountByPhone(String phone);

    List<Account> findByDeletedFalse();

    Account findByEmail(String email);

    Account findAccountById(Long id);


}
