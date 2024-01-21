import { PDFDocument, StandardFonts } from 'pdf-lib';


export async function CreateForm(data, docType) {

    if (docType === "Quote") {

    } else {

    };

    const pdfDoc = await PDFDocument.create()

    const y_pos = 650;
    const selfYPose = 620;
    const offset = 15;

    const page = pdfDoc.addPage([550, 750])
    const form = pdfDoc.getForm()
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    page.drawText(docType, { x: 50, y: 700, size: 35 })

    const companyTitle = data.company.company_name;
    const name = data.company.contact_name;
    const addressStreet = data.company.street + ", " + data.company.postcode;
    const addressCountry = data.company.city + ", " + data.company.country;
    const textSize = 12;

    page.drawText(companyTitle, { x: 50, y: y_pos, size: textSize, font: boldFont })
    page.drawText(name, { x: 50, y: y_pos - offset, size: 11 })
    page.drawText(addressStreet, { x: 50, y: y_pos - offset * 2, size: 11 })
    page.drawText(addressCountry, { x: 50, y: y_pos - offset * 3, size: 11 })

    const selfCompanyTitle = "Javid Jooshesh Studio";
    const selfName = "Javid Jooshesh";
    const selfAddressStreet = "Hooidrift 129B, 3023 KL";
    const selfAddressCountry = "Rotterdam, Netherlands";
    const selfKvKNo = "Coc No: 7654231";
    const selfBTW = "VAT No: NL82843652";
    const selfIBAN = "IBAN: NL 98 ABNA 0580990869";

    page.drawText(selfCompanyTitle, { x: 350, y: selfYPose, size: textSize, font: boldFont })
    page.drawText(selfName, { x: 350, y: selfYPose - offset, size: 11 })
    page.drawText(selfAddressStreet, { x: 350, y: selfYPose - offset * 2, size: 11 })
    page.drawText(selfAddressCountry, { x: 350, y: selfYPose - offset * 3, size: 11 })
    page.drawText(selfKvKNo, { x: 350, y: selfYPose - ((offset * 4) + 10), size: 11 })
    page.drawText(selfBTW, { x: 350, y: selfYPose - ((offset * 5) + 10), size: 11 })
    page.drawText(selfIBAN, { x: 350, y: selfYPose - ((offset * 6) + 10), size: 11 })

    const docNo = "Invoice Number: 20240101";
    page.drawText(docNo, { x: 50, y: selfYPose - ((offset * 9) + 10), size: 12, font: boldFont });

    const docDate = "Invoice date: 01-01-2024";
    const dueDate = "Due date: 15-01-2024";
    page.drawText(docDate, { x: 350, y: selfYPose - ((offset * 9) + 10), size: 12 });
    page.drawText(dueDate, { x: 350, y: selfYPose - ((offset * 10) + 10), size: 12 });

    // Meta data
    pdfDoc.setTitle('20240101_Company');
    pdfDoc.setAuthor('Javid Jooshesh');
    pdfDoc.setSubject('Invoice document-Q1 2024');
    pdfDoc.setProducer('QuickBiller');
    pdfDoc.setCreator('Javid Jooshesh');
    pdfDoc.setCreationDate(new Date('2024-01-01T01:58:37.228Z'));

    form.flatten();
    const pdfBytes = await pdfDoc.save()

    // Create a blob from the bytes
    const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

    // Create a URL for the blob
    const pdfUrl = URL.createObjectURL(pdfBlob);

    // Open the PDF in a new tab (optional)
    window.open(pdfUrl, '_blank');

    const anchor = document.createElement('a');
    anchor.href = pdfUrl;
    anchor.download = "Invoice_20240101_Company.pdf";
    anchor.click();
};

