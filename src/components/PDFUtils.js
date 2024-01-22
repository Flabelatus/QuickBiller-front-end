import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const CreatePDFDoc = (data, docType, sender) => {
    console.log(sender);
    const docTable = {
        header: ['Description', 'Hour Rate', "Number of Hours"],
        jobs: data.jobs,
        costs: data.costs,
    };

    const jobs = data.jobs.map((job) => Object.values(job));
    const costs = data.costs.map((cost) => Object.values(cost));

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

    // Set up the initial position for content
    let y = 20;
    let x = 15;

    let smallOffset = 5;
    let mediumOffset = 10;
    let largeOffset = 20;

    // Add a title
    pdf.setFontSize(30);
    pdf.text(docType, 30, y, 'center');
    y += largeOffset;

    // Add recipient details
    pdf.setFontSize(14);
    pdf.text(data.company.company_name, x, y, 'left');
    y += mediumOffset;
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
    pdf.setFontSize(14);
    pdf.text(sender.company_name, x + 110, y, 'left');
    y += mediumOffset;
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
    const dueDate = new Date(currentDate.getTime() + 14 * 24 * 60 * 60 * 1000);

    pdf.setFontSize(12);
    pdf.text(`Invoice date: `, x + 110, y, 'left');
    pdf.text(currentDate.toLocaleDateString(), pageWidth - 30, y, 'right');
    y += smallOffset;
    pdf.text(`Due date: `, x + 110, y, 'left');
    pdf.text(dueDate.toLocaleDateString(), pageWidth - 30, y, 'right');

    y -= smallOffset;
    y -= mediumOffset;

    const yearAsString = currentDate.getFullYear().toString();
    const month = currentDate.getMonth() + 1; // Returns a number (0-11) for the month
    const monthAsString = month.toString();
    const paddedMonthAsString = monthAsString.padStart(2, "0");
    const lenOfDocs = String(3);
    const paddedLenOfDocs = lenOfDocs.padStart(2, "0");

    pdf.text(`Invoice number: ${yearAsString}${paddedMonthAsString}${paddedLenOfDocs}`, x, y, 'left');
    y += mediumOffset

    pdf.autoTable({
        startY: y,
        head: [docTable.header],
        body: table,
        startY: y + 15, // Adjust the position after the table
    });

    // Move down the page after the table
    y = pdf.autoTable.previous.finalY + 15;

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
