package controllers

import (
	"fmt"
	"strconv"
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
	count, err := strconv.Atoi(invoiceName[len(invoiceName)-2:])
	if err != nil {
		return "", err
	}

	yearInInvoice, err := strconv.Atoi(invoiceName[3:7])
	if err != nil {
		return "", err
	}

	currentYear := time.Now().Year()
	if currentYear > yearInInvoice && count > 1 {
		count = 0
	}

	zeroPaddedCount := fmt.Sprintf("%02d", count+1)
	zeroPaddedMonth := fmt.Sprintf("%02d", int(time.Now().Month()))
	q := CheckQuarter()
	fullName := fmt.Sprintf("%s_%s%s%s_%s", q, strconv.Itoa(currentYear), zeroPaddedMonth, zeroPaddedCount, clientName)

	fmt.Println(fullName)
	return fullName, nil
}
