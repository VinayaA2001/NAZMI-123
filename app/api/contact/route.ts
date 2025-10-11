import { NextResponse } from "next/server";
import emailService from "@/lib/email";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    
    if (!body) {
      return NextResponse.json(
        { 
          ok: false,
          error: "Invalid JSON in request body" 
        },
        { status: 400 }
      );
    }

    // Handle different types of email requests
    const { type, data } = body;

    if (!type) {
      return NextResponse.json(
        { 
          ok: false,
          error: "Email type is required. Supported types: contact, order-confirmation, welcome, shipping, password-reset, newsletter, test" 
        },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case "contact":
        // Validate contact form data
        if (!data.name || !data.email || !data.message) {
          return NextResponse.json(
            { 
              ok: false,
              error: "Name, email, and message are required for contact form" 
            },
            { status: 400 }
          );
        }
        result = await emailService.sendContactForm(data);
        break;

      case "order-confirmation":
        // Validate order confirmation data
        if (!data.email || !data.name || !data.orderNumber || !data.totalAmount) {
          return NextResponse.json(
            { 
              ok: false,
              error: "Customer email, name, order number, and total amount are required for order confirmation" 
            },
            { status: 400 }
          );
        }
        result = await emailService.sendOrderConfirmation(data.email, data);
        break;

      case "welcome":
        // Validate welcome email data
        if (!data.email || !data.name) {
          return NextResponse.json(
            { 
              ok: false,
              error: "Email and name are required for welcome email" 
            },
            { status: 400 }
          );
        }
        result = await emailService.sendWelcomeEmail(data.email, data);
        break;

      case "shipping":
        // Validate shipping confirmation data
        if (!data.email || !data.name || !data.orderNumber) {
          return NextResponse.json(
            { 
              ok: false,
              error: "Email, name, and order number are required for shipping confirmation" 
            },
            { status: 400 }
          );
        }
        result = await emailService.sendShippingConfirmation(data.email, data);
        break;

      case "password-reset":
        // Validate password reset data
        if (!data.email || !data.name || !data.resetToken) {
          return NextResponse.json(
            { 
              ok: false,
              error: "Email, name, and reset token are required for password reset" 
            },
            { status: 400 }
          );
        }
        result = await emailService.sendPasswordReset(data.email, data.resetToken, data);
        break;

      case "newsletter":
        // Validate newsletter subscription
        if (!data.email || !data.name) {
          return NextResponse.json(
            { 
              ok: false,
              error: "Email and name are required for newsletter subscription" 
            },
            { status: 400 }
          );
        }
        // Use welcome email template for newsletter confirmation
        result = await emailService.sendWelcomeEmail(data.email, {
          ...data,
          isNewsletter: true
        });
        break;

      case "order-status":
        // Validate order status update
        if (!data.email || !data.name || !data.orderNumber || !data.status) {
          return NextResponse.json(
            { 
              ok: false,
              error: "Email, name, order number, and status are required for order status update" 
            },
            { status: 400 }
          );
        }
        // Custom email for order status updates
        result = await emailService.sendCustomEmail(
          data.email,
          `Order ${data.status} - #${data.orderNumber}`,
          data,
          'order-status'
        );
        break;

      case "test":
        // Test email service
        result = await emailService.testEmailService();
        break;

      case "custom":
        // Custom email with template
        if (!data.to || !data.subject || !data.templateData) {
          return NextResponse.json(
            { 
              ok: false,
              error: "Recipient (to), subject, and template data are required for custom emails" 
            },
            { status: 400 }
          );
        }
        result = await emailService.sendCustomEmail(
          data.to,
          data.subject,
          data.templateData,
          data.templateType || 'general'
        );
        break;

      default:
        return NextResponse.json(
          { 
            ok: false,
            error: `Unknown email type: ${type}. Supported types: contact, order-confirmation, welcome, shipping, password-reset, newsletter, order-status, test, custom` 
          },
          { status: 400 }
        );
    }

    if (result.success) {
      const responseData: any = {
        ok: true,
        message: "Email sent successfully",
        messageId: result.messageId,
        type: type
      };

      // Add preview URL for development
      if (result.previewUrl) {
        responseData.previewUrl = result.previewUrl;
        responseData.debugNote = "Check the preview URL above to view the email (development only)";
      }

      return NextResponse.json(responseData);
    } else {
      return NextResponse.json(
        {
          ok: false,
          error: result.error || "Failed to send email",
          type: type,
          details: "Check your email service configuration and try again"
        },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Email API error:", error);
    
    return NextResponse.json(
      {
        ok: false,
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error occurred"
      },
      { status: 500 }
    );
  }
}

// GET method to check email service status and get usage examples
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const detailed = searchParams.get('detailed') === 'true';
    
    const status = emailService.getServiceStatus();
    
    const responseData: any = {
      ok: true,
      service: "Nazmi Boutique Email Service",
      status: {
        configured: status.configured,
        ready: status.ready,
        testAccount: status.testAccount || false,
      },
      supportedTypes: [
        "contact",
        "order-confirmation", 
        "welcome",
        "shipping",
        "password-reset",
        "newsletter",
        "order-status",
        "test",
        "custom"
      ]
    };

    // Add usage examples if detailed info is requested
    if (detailed) {
      responseData.usageExamples = {
        contact: {
          method: "POST",
          url: "/api/email",
          body: {
            type: "contact",
            data: {
              name: "John Doe",
              email: "john@example.com",
              phone: "+91 98765 43210",
              message: "Hello, I have a question about your products."
            }
          }
        },
        orderConfirmation: {
          method: "POST",
          url: "/api/email",
          body: {
            type: "order-confirmation",
            data: {
              email: "customer@example.com",
              name: "Jane Smith",
              orderNumber: "ORD-12345",
              totalAmount: 2499,
              deliveryAddress: "123 Main St, Mumbai, 400001",
              productDetails: [
                {
                  name: "Designer Dress",
                  quantity: 1,
                  price: 1999,
                  size: "M",
                  color: "Red"
                }
              ]
            }
          }
        },
        welcome: {
          method: "POST",
          url: "/api/email",
          body: {
            type: "welcome",
            data: {
              email: "newuser@example.com",
              name: "New User"
            }
          }
        },
        test: {
          method: "POST", 
          url: "/api/email",
          body: {
            type: "test"
          }
        }
      };

      // Add service configuration info (without sensitive data)
      responseData.configuration = {
        host: process.env.EMAIL_HOST ? "Configured" : "Not configured",
        fromName: process.env.EMAIL_FROM_NAME || "Nazmi Boutique",
        testMode: !process.env.EMAIL_HOST
      };
    }

    return NextResponse.json(responseData);
    
  } catch (error) {
    console.error("Email status check error:", error);
    
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to check email service status",
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}

// Optional: Add DELETE method to clear email queue (if you implement queueing)
export async function DELETE() {
  try {
    // This would typically clear a failed email queue
    // For now, just return a placeholder response
    return NextResponse.json({
      ok: true,
      message: "Email queue cleared (placeholder)",
      note: "Email queueing not implemented yet"
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error: "Failed to clear email queue"
      },
      { status: 500 }
    );
  }
}