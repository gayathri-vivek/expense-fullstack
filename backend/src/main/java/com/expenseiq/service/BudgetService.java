package com.expenseiq.service;

import com.expenseiq.dto.*;
import com.expenseiq.entity.*;
import com.expenseiq.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;

@Service
@RequiredArgsConstructor
public class BudgetService {

    private final BudgetRepository budgetRepository;
    private final UserRepository userRepository;
    private final ExpenseRepository expenseRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public BudgetAlertResponse setBudget(BudgetRequest request, String email) {
        User user = getUser(email);

        Budget budget = budgetRepository.findByUserId(user.getId())
                .orElse(Budget.builder().user(user).build());

        budget.setMonthlyLimit(request.getMonthlyLimit());
        budgetRepository.save(budget);

        return buildAlert(user.getId(), request.getMonthlyLimit());
    }

    public BudgetAlertResponse getBudgetAlert(String email) {
        User user = getUser(email);

        Budget budget = budgetRepository.findByUserId(user.getId())
                .orElseThrow(() -> new RuntimeException("No budget set"));

        return buildAlert(user.getId(), budget.getMonthlyLimit());
    }

    private BudgetAlertResponse buildAlert(Long userId, BigDecimal limit) {
        BigDecimal spent = expenseRepository.getTotalSpentThisMonth(userId);
        BigDecimal remaining = limit.subtract(spent);
        double percentage = spent.divide(limit, 4, RoundingMode.HALF_UP)
                                 .multiply(BigDecimal.valueOf(100))
                                 .doubleValue();

        boolean exceeded = spent.compareTo(limit) > 0;
        boolean nearLimit = percentage >= 80 && !exceeded;

        String message;
        if (exceeded) {
            message = "⚠️ Budget exceeded! You have spent ₹" + spent + " out of ₹" + limit;
        } else if (nearLimit) {
            message = "🔔 Warning! You have used " + String.format("%.1f", percentage) + "% of your budget";
        } else {
            message = "✅ You are within your budget. ₹" + remaining + " remaining";
        }

        return new BudgetAlertResponse(limit, spent, remaining, percentage, exceeded, nearLimit, message);
    }
}
