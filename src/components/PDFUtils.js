import jsPDF from 'jspdf';
import 'jspdf-autotable';


export const CreatePDFDoc = (data, docType, sender) => {

    const invoiceTerm = 14;

    function sumArray(arr) {
        let sum = 0;
        for (let i = 0; i < arr.length; i++) {
            sum += arr[i];
        }
        return sum;
    };

    const updatedJobs = data.jobs.map((job) => ({
        ...job,
        totalAmount: job.hourRate * job.numberOfHours,
    }));

    const updatedCosts = data.costs.map((c) => ({
        ...c,
        numberOfCosts: "N/A",
        totalAmout: parseFloat(c.costs)
    }));

    let currencyFormat = "€"

    const docTable = {
        header: ['Description', 'Hour Rate', "Number of Hours", "Total"],
    };

    console.log(updatedCosts);

    const jobs = updatedJobs.map((job) => Object.values(job));
    const costs = updatedCosts.map((cost) => Object.values(cost));

    // Invoice number calculations
    const totalJobs = sumArray(jobs.map((job) => job[job.length - 1]));
    const totalCosts = sumArray(costs.map((c) => c[c.length - 1]));
    const subTotal = totalJobs + totalCosts
    const leanVAT = totalJobs * parseInt(data.vat_percent) / 100;
    const totalInclVAT = subTotal + leanVAT;

    const table = [
        ...jobs,
        ...costs
    ];

    const pdf = new jsPDF();

    pdf.setProperties({
        title: docType,
        subject: 'Invoice for services',
        author: 'Your Name',
        keywords: 'invoice, services',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    console.log(pageWidth);

    // Set up the initial position for content
    let y = 35;
    let x = 15;

    let smallOffset = 5;
    let mediumOffset = 10;
    let largeOffset = 20;

    // Add a title
    pdf.setFontSize(30);
    pdf.text(docType, 30, y, 'center');
    y += largeOffset;

    // Add recipient details
    pdf.setFont("Helvetica", 'bold');
    pdf.setFontSize(12);
    pdf.text(data.company.company_name, x, y, 'left');
    y += mediumOffset;
    pdf.setFont("Helvetica", 'normal');
    pdf.setFontSize(11);
    pdf.text(data.company.contact_name, x, y, 'left');
    y += smallOffset;
    pdf.text(data.company.email, x, y, 'left');
    y += smallOffset;
    pdf.text(data.company.street + ", " + data.company.postcode, x, y, 'left');
    y += smallOffset;
    pdf.text(data.company.city + ", " + data.company.country, x, y, 'left');

    y = 40;

    // Add sender details
    pdf.setFontSize(12);
    pdf.setFont("Helvetica", 'bold');
    pdf.text(sender.company_name, x + 110, y, 'left');
    y += mediumOffset;
    pdf.setFont("Helvetica", 'normal');
    pdf.setFontSize(11);
    pdf.text(sender.contact_name, x + 110, y, 'left');
    y += smallOffset;
    pdf.text(sender.email, x + 110, y, 'left');
    y += smallOffset;
    pdf.text(sender.street + ", " + sender.postcode, x + 110, y, 'left');
    y += smallOffset;
    pdf.text(sender.city + ", " + sender.country, x + 110, y, 'left');
    y += mediumOffset;
    pdf.text("CoC No: " + sender.coc_no, x + 110, y, 'left');
    y += smallOffset;
    pdf.text("VAT No: " + sender.vat_no, x + 110, y, 'left');
    y += smallOffset;
    pdf.text("IBAN: " + sender.iban, x + 110, y, 'left');
    y += mediumOffset;

    // Add a date
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getTime() + invoiceTerm * 24 * 60 * 60 * 1000);

    pdf.setFontSize(12);
    pdf.text(`Invoice date: `, x + 110, y, 'left');
    pdf.text(currentDate.toLocaleDateString(), pageWidth - 30, y, 'right');
    y += smallOffset;
    pdf.text(`Due date: `, x + 110, y, 'left');
    pdf.text(dueDate.toLocaleDateString(), pageWidth - 30, y, 'right');

    const yearAsString = currentDate.getFullYear().toString();
    const month = currentDate.getMonth() + 1; // Returns a number (0-11) for the month
    const monthAsString = month.toString();
    const paddedMonthAsString = monthAsString.padStart(2, "0");
    const lenOfDocs = String(3);
    const paddedLenOfDocs = lenOfDocs.padStart(2, "0");

    pdf.setFont("Helvetica", 'bold');
    pdf.text(`Invoice number: ${yearAsString}${paddedMonthAsString}${paddedLenOfDocs}`, x, y, 'left');

    y += mediumOffset;

    const formattedTable = table.map((row, rowIndex) => {
        return row.map((cell, columnIndex) => {

            if (columnIndex === 1 || columnIndex === 3) {
                const currencyValue = parseFloat(cell);
                if (!isNaN(currencyValue)) {
                    return currencyFormat + currencyValue.toFixed(2);
                };
            };
            return cell;
        });
    });

    pdf.autoTable({
        startY: y,
        head: [docTable.header],
        body: formattedTable,
        startY: y + 15,
        headStyles: {
            fillColor: [255, 255, 255],
            textColor: [0, 0, 0]
        },
        styles: {
            fontSize: 11,
        },
        columnStyles: {
            0: { cellWidth: 60 },
        },
    });

    y = pdf.autoTable.previous.finalY + 14;

    pdf.setFontSize(11);
    pdf.setFont("Helvetica", 'normal');

    pdf.text("Subtotal", pageWidth - 80, y, 'left');
    pdf.text(`${currencyFormat}${parseFloat(subTotal).toFixed(2)}`, pageWidth - 43, y, 'left');

    y += 6;
    pdf.text(`VAT %${data.vat_percent}`, pageWidth - 80, y, 'left');
    pdf.text(`${currencyFormat}${parseFloat(leanVAT).toFixed(2)}`, pageWidth - 43, y, 'left');

    y += 6;

    const lineX1 = pageWidth - 95;
    const lineX2 = pageWidth - 15;

    pdf.line(lineX1, y, lineX2, y);

    y += 5

    pdf.setFontSize(12);
    pdf.setFont("Helvetica", 'bold');
    pdf.text(`Amount to Pay`, pageWidth - 80, y, 'left');
    pdf.text(`${currencyFormat}${parseFloat(totalInclVAT).toFixed(2)}`, pageWidth - 43, y, 'left');
    y += 15;

    let message = `We kindly ask you to proceed with the payment within ${invoiceTerm} days after you have received the invoice to the following account number of ${sender.iban} under the name of ${sender.contact_name}`
    let thankingMsg = `Thank you for your business! Should you have any questions do not hesitate to contact us.`

    const maxWidth = 210; // Maximum width for the text block
    const lines = pdf.splitTextToSize(message, maxWidth);
    const thankingMsgLine = pdf.splitTextToSize(thankingMsg, maxWidth);

    pdf.setFont("Helvetica", "normal");
    pdf.setFontSize(11);
    // pdf.text(x, pageHeight - 40, thankingMsgLine);
    pdf.text(x, pageHeight - 18, lines);

    pdf.save('invoice.pdf');

    const pdfDataUri = pdf.output('datauristring');

    // const iframe = document.createElement('iframe');
    // iframe.src = pdfDataUri;
    // iframe.style.width = '100%';
    // iframe.style.height = '600px';
    // document.body.appendChild(iframe);

    // Open a new window or tab and set the PDF as its content
    const newWindow = window.open();
    newWindow.document.open();
    newWindow.document.write(`<iframe width='100%' height='100%' src='${pdfDataUri}'></iframe>`);
    newWindow.document.close();
};