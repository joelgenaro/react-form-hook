import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Send, CheckCircle } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  company: z.string().optional(),
  industry: z.enum(["contact", "report"], { required_error: "Please select an industry" }),
  message: z.string().min(10, "Message must be at least 10 characters"),
  webhookUrl: z.string().url("Please enter a valid webhook URL"),
});

type FormData = z.infer<typeof formSchema>;

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const selectedIndustry = watch("industry");

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    setIsSuccess(false);

    try {
      const response = await fetch(data.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          company: data.company,
          industry: data.industry,
          message: data.message,
          timestamp: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      setIsSuccess(true);
      toast({
        title: "Message sent successfully!",
        description: "Thank you for your message. We'll get back to you soon.",
      });
      reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error sending message",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <Card className="w-full max-w-2xl mx-auto shadow-elegant bg-gradient-secondary border-0">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
          <p className="text-muted-foreground mb-6">
            Thank you for reaching out. We'll get back to you soon.
          </p>
          <Button 
            onClick={() => setIsSuccess(false)}
            variant="outline"
            className="border-primary/20 hover:bg-primary/10"
          >
            Send Another Message
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl mx-auto shadow-elegant bg-gradient-secondary border-0">
      <CardHeader className="pb-6">
        <CardTitle className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent">
          Get In Touch
        </CardTitle>
        <CardDescription className="text-lg text-muted-foreground">
          Send us a message and we'll respond as soon as possible.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-8 pt-0">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Name *
              </Label>
              <Input
                id="name"
                placeholder="Your full name"
                {...register("name")}
                className="bg-background/50 border-border/50 focus:border-primary transition-smooth"
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">
                Email *
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="your.email@example.com"
                {...register("email")}
                className="bg-background/50 border-border/50 focus:border-primary transition-smooth"
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="company" className="text-sm font-medium">
              Company
            </Label>
            <Input
              id="company"
              placeholder="Your company name (optional)"
              {...register("company")}
              className="bg-background/50 border-border/50 focus:border-primary transition-smooth"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="industry" className="text-sm font-medium">
              Industry *
            </Label>
            <Select onValueChange={(value) => setValue("industry", value as "contact" | "report")}>
              <SelectTrigger className="bg-background/50 border-border/50 focus:border-primary transition-smooth">
                <SelectValue placeholder="Select industry type" />
              </SelectTrigger>
              <SelectContent className="bg-background border-border shadow-elegant z-50">
                <SelectItem value="contact">Contact</SelectItem>
                <SelectItem value="report">Report</SelectItem>
              </SelectContent>
            </Select>
            {errors.industry && (
              <p className="text-sm text-destructive">{errors.industry.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="webhookUrl" className="text-sm font-medium">
              Webhook URL *
            </Label>
            <Input
              id="webhookUrl"
              type="url"
              placeholder="https://your-webhook-endpoint.com/webhook"
              {...register("webhookUrl")}
              className="bg-background/50 border-border/50 focus:border-primary transition-smooth"
            />
            {errors.webhookUrl && (
              <p className="text-sm text-destructive">{errors.webhookUrl.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm font-medium">
              Message *
            </Label>
            <Textarea
              id="message"
              placeholder="Tell us about your project, questions, or how we can help..."
              rows={4}
              {...register("message")}
              className="bg-background/50 border-border/50 focus:border-primary transition-smooth resize-none"
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300 text-primary-foreground font-medium py-6 text-lg"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Sending Message...
              </>
            ) : (
              <>
                <Send className="mr-2 h-5 w-5" />
                Send Message
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}