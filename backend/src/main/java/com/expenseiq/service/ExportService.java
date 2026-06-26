package com.expenseiq.service;

import com.expenseiq.entity.*;
import com.expenseiq.repository.*;
import com.itextpdf.text.*;
import com.itextpdf.text.pdf.*;
import com.opencsv.CSVWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.*;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportService {

    private final ExpenseRepository expenseRepository;
    private final UserRepository userRepository;

    private User getUser(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public byte[] exportToCsv(String email) throws IOException {
        User user = getUser(email);
        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(user.getId());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        try (CSVWriter writer = new CSVWriter(new OutputStreamWriter(out))) {
            // Header
            writer.writeNext(new String[]{"Title", "Amount", "Category", "Date", "Note"});
            // Rows
            for (Expense e : expenses) {
                writer.writeNext(new String[]{
                    e.getTitle(),
                    e.getAmount().toString(),
                    e.getCategory(),
                    e.getDate().toString(),
                    e.getNote() != null ? e.getNote() : ""
                });
            }
        }
        return out.toByteArray();
    }

    public byte[] exportToPdf(String email) throws Exception {
        User user = getUser(email);
        List<Expense> expenses = expenseRepository.findByUserIdOrderByDateDesc(user.getId());

        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document doc = new Document(PageSize.A4);
        PdfWriter.getInstance(doc, out);
        doc.open();

        // Title
        Font titleFont = new Font(Font.FontFamily.HELVETICA, 18, Font.BOLD);
        Paragraph title = new Paragraph("ExpenseIQ - Expense Report", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(10);
        doc.add(title);

        // Subtitle
        Font subFont = new Font(Font.FontFamily.HELVETICA, 11, Font.NORMAL, BaseColor.GRAY);
        Paragraph sub = new Paragraph("Generated for: " + user.getName() + " (" + user.getEmail() + ")", subFont);
        sub.setAlignment(Element.ALIGN_CENTER);
        sub.setSpacingAfter(20);
        doc.add(sub);

        // Table
        PdfPTable table = new PdfPTable(5);
        table.setWidthPercentage(100);
        table.setWidths(new float[]{3f, 2f, 2f, 2f, 3f});

        Font headerFont = new Font(Font.FontFamily.HELVETICA, 10, Font.BOLD, BaseColor.WHITE);
        BaseColor headerBg = new BaseColor(37, 99, 235); // blue

        for (String h : new String[]{"Title", "Amount (₹)", "Category", "Date", "Note"}) {
            PdfPCell cell = new PdfPCell(new Phrase(h, headerFont));
            cell.setBackgroundColor(headerBg);
            cell.setPadding(8);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            table.addCell(cell);
        }

        Font rowFont = new Font(Font.FontFamily.HELVETICA, 9);
        boolean alternate = false;
        for (Expense e : expenses) {
            BaseColor rowBg = alternate ? new BaseColor(239, 246, 255) : BaseColor.WHITE;
            for (String val : new String[]{
                e.getTitle(), e.getAmount().toString(), e.getCategory(),
                e.getDate().toString(), e.getNote() != null ? e.getNote() : "-"
            }) {
                PdfPCell cell = new PdfPCell(new Phrase(val, rowFont));
                cell.setBackgroundColor(rowBg);
                cell.setPadding(6);
                table.addCell(cell);
            }
            alternate = !alternate;
        }

        doc.add(table);
        doc.close();
        return out.toByteArray();
    }
}
