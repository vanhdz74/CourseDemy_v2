package com.coursedemy.payment.repository;

import com.coursedemy.payment.entity.PaymentTransaction;
import com.coursedemy.payment.enums.PaymentMethod;
import com.coursedemy.payment.enums.PaymentStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PaymentTransactionRepository extends JpaRepository<PaymentTransaction, Long> {

    Optional<PaymentTransaction> findByTransactionNo(String transactionNo);

    Optional<PaymentTransaction> findByProviderTransactionId(String providerTransactionId);

    boolean existsByTransactionNo(String transactionNo);

    // For idempotency check
    Optional<PaymentTransaction> findByTransactionNoAndStatus(String transactionNo, PaymentStatus status);
}
