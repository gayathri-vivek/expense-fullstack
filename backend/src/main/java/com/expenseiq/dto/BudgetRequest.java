package com.expenseiq.dto;

import lombok.*;
import jakarta.validation.constraints.*;
import java.math.BigDecimal;

@Data
public class BudgetRequest {
    @NotNull @Positive
    private BigDecimal monthlyLimit;
}
