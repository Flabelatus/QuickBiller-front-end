package controllers

import (
	"fmt"
	"strconv"
	"strings"
	"time"
)

func CheckQuarter() string {
	now := int(time.Now().Month())
	var quarter string
	switch {
	case now >= 1 && now <= 3:
		quarter = "Q1"
	case now >= 4 && now <= 6:
		quarter = "Q2"
	case now >= 7 && now <= 9:
		quarter = "Q3"
	case now >= 10 && now <= 12:
		quarter = "Q4"
	}
	return quarter
}
func GenerateNewDocName(invoiceName, clientName string) (string, error) {

	currentYear := time.Now().Year()
	currentMonth := time.Now().Month()

	var count int
	var yearInInvoice int

	if invoiceName != "" {

		invoiceNameFragments := strings.Split(invoiceName, "_")
		invoiceNumber := invoiceNameFragments[1]
		var err error

		count, err = strconv.Atoi(invoiceNumber[6:])
		if err != nil {
			return "", err
		}

		yearInInvoice, err = strconv.Atoi(invoiceNumber[:4])
		if err != nil {
			return "", err
		}

		if currentYear > yearInInvoice && count > 1 {
			count = 0
		}
	}

	count++ // Increment count

	zeroPaddedCount := fmt.Sprintf("%02d", count)
	zeroPaddedMonth := fmt.Sprintf("%02d", int(currentMonth))
	q := CheckQuarter()
	fullName := fmt.Sprintf("%s_%d%s%s_%s", q, currentYear, zeroPaddedMonth, zeroPaddedCount, clientName)

	fmt.Println(fullName)
	return fullName, nil
}
