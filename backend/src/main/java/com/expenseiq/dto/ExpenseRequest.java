package com.expenseiq.dto;

import jakarta.validation.constraints.*;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDate;

@Data
public class ExpenseRequest {
    @NotBlank private String title;
    @NotNull @Positive private BigDecimal amount;
    @NotBlank private String category;
    @NotNull private LocalDate date;
    private String note;
}
