package org.example.repository;

import org.example.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AccountRepository extends JpaRepository<Account, Long> {


    Account findAccountByPhone(String phone);



    Account findByEmail(String email);

    Account findAccountById(Long id);


}
