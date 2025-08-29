import { ContactForm } from "@/components/ContactForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-primary bg-clip-text text-transparent">
            Contact Form
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A beautiful, modern contact form that submits to your webhook URL with validation and elegant feedback.
          </p>
        </div>
        <ContactForm />
      </div>
    </div>
  );
};

export default Index;
