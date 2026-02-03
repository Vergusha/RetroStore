import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

export default async ({ req, res, log, error }) => {
    try {
        log('Received request to generate PDF');

        // Parse the request body
        let data;
        try {
            data = JSON.parse(req.body || '{}');
        } catch (e) {
            error('Failed to parse request body: ' + e.message);
            return res.json({ error: 'Invalid JSON body' }, 400);
        }

        log('Order data received: ' + JSON.stringify(data));

        const {
            orderId,
            orderDate,
            status,
            userName,
            userEmail,
            shippingAddress,
            shippingCity,
            shippingZip,
            shippingCountry,
            paymentMethod,
            totalAmount,
            items = []
        } = data;

        // Create PDF document
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89]); // A4 size

        const helvetica = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

        const { width, height } = page.getSize();
        let yPosition = height - 50;

        const primaryColor = rgb(0.486, 0.227, 0.929); // #7c3aed
        const textColor = rgb(0.2, 0.2, 0.2);
        const grayColor = rgb(0.4, 0.4, 0.4);
        const greenColor = rgb(0.133, 0.545, 0.133);

        // Header
        page.drawText('RETROSTORE', {
            x: 50,
            y: yPosition,
            size: 28,
            font: helveticaBold,
            color: primaryColor,
        });

        page.drawText('Order Receipt', {
            x: width - 150,
            y: yPosition,
            size: 14,
            font: helvetica,
            color: grayColor,
        });

        yPosition -= 40;

        // Divider line
        page.drawLine({
            start: { x: 50, y: yPosition },
            end: { x: width - 50, y: yPosition },
            thickness: 1,
            color: rgb(0.9, 0.9, 0.9),
        });

        yPosition -= 30;

        // Order details section
        page.drawText('Order Details', {
            x: 50,
            y: yPosition,
            size: 14,
            font: helveticaBold,
            color: textColor,
        });

        yPosition -= 25;

        const drawLabelValue = (label, value, y) => {
            page.drawText(label, {
                x: 50,
                y: y,
                size: 10,
                font: helvetica,
                color: grayColor,
            });
            page.drawText(String(value || 'N/A'), {
                x: 150,
                y: y,
                size: 10,
                font: helvetica,
                color: textColor,
            });
        };

        drawLabelValue('Order ID:', orderId, yPosition);
        yPosition -= 18;

        const formattedDate = orderDate
            ? new Date(orderDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            })
            : 'N/A';
        drawLabelValue('Date:', formattedDate, yPosition);
        yPosition -= 18;

        drawLabelValue('Status:', status ? status.charAt(0).toUpperCase() + status.slice(1) : 'N/A', yPosition);
        yPosition -= 18;

        drawLabelValue('Payment:', paymentMethod, yPosition);
        yPosition -= 35;

        // Shipping section
        page.drawText('Shipping Address', {
            x: 50,
            y: yPosition,
            size: 14,
            font: helveticaBold,
            color: textColor,
        });

        yPosition -= 25;

        const addressLines = [
            userName,
            userEmail,
            shippingAddress,
            `${shippingCity}, ${shippingZip}`,
            shippingCountry
        ].filter(Boolean);

        for (const line of addressLines) {
            page.drawText(String(line), {
                x: 50,
                y: yPosition,
                size: 10,
                font: helvetica,
                color: textColor,
            });
            yPosition -= 16;
        }

        yPosition -= 20;

        // Items table header
        page.drawText('Order Items', {
            x: 50,
            y: yPosition,
            size: 14,
            font: helveticaBold,
            color: textColor,
        });

        yPosition -= 25;

        // Table header
        page.drawRectangle({
            x: 50,
            y: yPosition - 5,
            width: width - 100,
            height: 25,
            color: rgb(0.97, 0.97, 0.97),
        });

        page.drawText('Product', { x: 55, y: yPosition + 5, size: 10, font: helveticaBold, color: textColor });
        page.drawText('Qty', { x: 350, y: yPosition + 5, size: 10, font: helveticaBold, color: textColor });
        page.drawText('Price', { x: 400, y: yPosition + 5, size: 10, font: helveticaBold, color: textColor });
        page.drawText('Total', { x: 480, y: yPosition + 5, size: 10, font: helveticaBold, color: textColor });

        yPosition -= 25;

        // Items
        for (const item of items) {
            // Truncate product name if too long
            let productName = item.productName || 'Unknown Product';
            if (productName.length > 45) {
                productName = productName.substring(0, 42) + '...';
            }

            page.drawText(productName, {
                x: 55,
                y: yPosition,
                size: 10,
                font: helvetica,
                color: textColor,
            });

            page.drawText(String(item.quantity || 0), {
                x: 355,
                y: yPosition,
                size: 10,
                font: helvetica,
                color: textColor,
            });

            page.drawText(`$${(item.price || 0).toFixed(2)}`, {
                x: 400,
                y: yPosition,
                size: 10,
                font: helvetica,
                color: textColor,
            });

            const itemTotal = (item.price || 0) * (item.quantity || 0);
            page.drawText(`$${itemTotal.toFixed(2)}`, {
                x: 480,
                y: yPosition,
                size: 10,
                font: helvetica,
                color: textColor,
            });

            yPosition -= 20;

            // Add divider line
            page.drawLine({
                start: { x: 50, y: yPosition + 8 },
                end: { x: width - 50, y: yPosition + 8 },
                thickness: 0.5,
                color: rgb(0.9, 0.9, 0.9),
            });
        }

        yPosition -= 15;

        // Total
        page.drawLine({
            start: { x: 350, y: yPosition + 5 },
            end: { x: width - 50, y: yPosition + 5 },
            thickness: 1,
            color: rgb(0.8, 0.8, 0.8),
        });

        yPosition -= 15;

        page.drawText('Total:', {
            x: 400,
            y: yPosition,
            size: 14,
            font: helveticaBold,
            color: textColor,
        });

        page.drawText(`$${(totalAmount || 0).toFixed(2)}`, {
            x: 480,
            y: yPosition,
            size: 14,
            font: helveticaBold,
            color: primaryColor,
        });

        yPosition -= 50;

        // Thank you message
        page.drawRectangle({
            x: 50,
            y: yPosition - 10,
            width: width - 100,
            height: 40,
            color: rgb(0.94, 0.99, 0.94),
            borderColor: greenColor,
            borderWidth: 1,
        });

        page.drawText('Thank you for shopping with RETROSTORE!', {
            x: 170,
            y: yPosition + 5,
            size: 12,
            font: helveticaBold,
            color: greenColor,
        });

        // Footer
        page.drawText('Questions? Contact support@retrostore.com', {
            x: 190,
            y: 50,
            size: 9,
            font: helvetica,
            color: grayColor,
        });

        // Generate PDF bytes
        const pdfBytes = await pdfDoc.save();

        // Convert to base64
        const base64 = Buffer.from(pdfBytes).toString('base64');

        log('PDF generated successfully, size: ' + pdfBytes.length + ' bytes');

        return res.text(base64, 200, {
            'Content-Type': 'text/plain',
        });

    } catch (e) {
        error('Error generating PDF: ' + e.message);
        error('Stack: ' + e.stack);
        return res.json({ error: e.message }, 500);
    }
};
