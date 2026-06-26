package com.expenseiq.repository;

import com.expenseiq.entity.Expense;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

    List<Expense> findByUserIdOrderByDateDesc(Long userId);

    List<Expense> findByUserIdAndDateBetweenOrderByDateDesc(
        Long userId, LocalDate start, LocalDate end
    );

    // Total spent this month
    @Query("SELECT COALESCE(SUM(e.amount), 0) FROM Expense e " +
           "WHERE e.user.id = :userId " +
           "AND MONTH(e.date) = MONTH(CURRENT_DATE) " +
           "AND YEAR(e.date) = YEAR(CURRENT_DATE)")
    BigDecimal getTotalSpentThisMonth(@Param("userId") Long userId);

    // Spending by category this month
    @Query("SELECT e.category, COALESCE(SUM(e.amount), 0) FROM Expense e " +
           "WHERE e.user.id = :userId " +
           "AND MONTH(e.date) = MONTH(CURRENT_DATE) " +
           "AND YEAR(e.date) = YEAR(CURRENT_DATE) " +
           "GROUP BY e.category")
    List<Object[]> getSpendingByCategory(@Param("userId") Long userId);

    // Monthly spending for bar chart (last 6 months)
    @Query(value = "SELECT TO_CHAR(date, 'Mon YYYY') as month, SUM(amount) as total " +
                   "FROM expenses WHERE user_id = :userId " +
                   "AND date >= CURRENT_DATE - INTERVAL '6 months' " +
                   "GROUP BY TO_CHAR(date, 'Mon YYYY'), DATE_TRUNC('month', date) " +
                   "ORDER BY DATE_TRUNC('month', date)",
           nativeQuery = true)
    List<Object[]> getMonthlySpending(@Param("userId") Long userId);
}
