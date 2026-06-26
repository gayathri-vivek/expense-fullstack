package com.expenseiq.service;

import com.expenseiq.dto.*;
import com.expenseiq.entity.*;
import com.expenseiq.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class ExpenseService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public ExpenseResponse addExpense(ExpenseRequest request, String email) {
        User user = getUser(email);

        Expense expense = Expense.builder()
                .title(request.getTitle())
                .amount(request.getAmount())
                .category(request.getCategory())
                .date(request.getDate())
                .note(request.getNote())
                .user(user)
                .build();

        Expense saved = expenseRepository.save(expense);
        return mapToResponse(saved);
    }

    public List<ExpenseResponse> getAllExpenses(String email) {
        User user = getUser(email);
        return expenseRepository.findByUserIdOrderByDateDesc(user.getId())
                .stream().map(this::mapToResponse).toList();
    }

    public void deleteExpense(Long id, String email) {
        User user = getUser(email);
        Expense expense = expenseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Expense not found"));

        if (!expense.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        expenseRepository.delete(expense);
    }

    public Map<String, Object> getChartData(String email) {
        User user = getUser(email);

        // Pie chart — by category
        List<Object[]> categoryData = expenseRepository.getSpendingByCategory(user.getId());
        Map<String, Object> byCategory = new LinkedHashMap<>();
        for (Object[] row : categoryData) {
            byCategory.put((String) row[0], row[1]);
        }

        // Bar chart — monthly last 6 months
        List<Object[]> monthlyData = expenseRepository.getMonthlySpending(user.getId());
        List<String> months = new ArrayList<>();
        List<Object> totals = new ArrayList<>();
        for (Object[] row : monthlyData) {
            months.add((String) row[0]);
            totals.add(row[1]);
        }

        return Map.of(
            "byCategory", byCategory,
            "monthly", Map.of("labels", months, "data", totals)
        );
    }

    private ExpenseResponse mapToResponse(Expense e) {
        ExpenseResponse res = new ExpenseResponse();
        res.setId(e.getId());
        res.setTitle(e.getTitle());
        res.setAmount(e.getAmount());
        res.setCategory(e.getCategory());
        res.setDate(e.getDate());
        res.setNote(e.getNote());
        res.setCreatedAt(e.getCreatedAt());
        return res;
    }
}
