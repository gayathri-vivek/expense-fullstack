package com.expenseiq.dto;

import lombok.*;
import java.math.BigDecimal;

@Data
@AllArgsConstructor
public class BudgetAlertResponse {
    private BigDecimal monthlyLimit;
    private BigDecimal totalSpent;
    private BigDecimal remaining;
    private double percentageUsed;
    private boolean isExceeded;
    private boolean isNearLimit;  // true if > 80% used
    private String message;
}
