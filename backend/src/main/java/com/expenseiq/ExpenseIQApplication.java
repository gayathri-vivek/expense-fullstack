package com.expenseiq;

import java.util.TimeZone;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class ExpenseIQApplication {
    private static final String APPLICATION_TIME_ZONE = "UTC";

    public static void main(String[] args) {
        System.setProperty("user.timezone", APPLICATION_TIME_ZONE);
        TimeZone.setDefault(TimeZone.getTimeZone(APPLICATION_TIME_ZONE));
        SpringApplication.run(ExpenseIQApplication.class, args);
    }
}
