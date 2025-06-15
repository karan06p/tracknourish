import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardTitle } from "@/components/ui/card";

const faqData = [
  {
    question: "What is Tracknourish",
    answer: "Tracknourish is an app for tracking your daily meals and nutrition.",
  },
  {
    question: "Is Tracknourish free to use",
    answer: "Yes, Tracknourish is free to use. However, some advanced features may require a subscription.",
  },
  {
    question: "How do I add a new meal",
    answer: "You can add a new meal by navigating to the 'Add Meal' section, entering the meal details, and saving it to your log."
  },
  {
    question: "Can I track my nutritional progress?",
    answer: "Yes, Meal Tracker provides detailed insights into your daily nutritional intake, including calories, protein, carbs, and fats."
  },
  {
    question: "How is my data stored?",
    answer: "Your data is stored securely using modern technologies and best practices.",
  },
];

export default function FAQ() {
  return (
    <section className="py-12 bg-gray-50" id="faq">
      <Card className="w-full max-w-4xl mx-auto">
        <CardTitle className="text-center text-3xl font-bold mb-6">Frequently Asked Questions</CardTitle>
        <CardContent className="space-y-6">
          <Accordion type="single" collapsible className="w-full">
            {
              faqData.map((faq, idx) => (
                <AccordionItem value={`item-${idx}`} key={idx}>
              <AccordionTrigger className="text-lg font-medium cursor-pointer">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent>
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
              )) 
            }
          </Accordion>
        </CardContent>
      </Card>
    </section>
  );
}