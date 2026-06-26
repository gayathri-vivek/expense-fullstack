package com.expenseiq.controller;

import com.expenseiq.dto.*;
import com.expenseiq.service.BudgetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/budget")
@RequiredArgsConstructor
public class BudgetController {

    private final BudgetService budgetService;

    @PostMapping
    public ResponseEntity<BudgetAlertResponse> setBudget(
            @Valid @RequestBody BudgetRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.setBudget(request, userDetails.getUsername()));
    }

    @GetMapping("/alert")
    public ResponseEntity<BudgetAlertResponse> getBudgetAlert(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(budgetService.getBudgetAlert(userDetails.getUsername()));
    }
}
