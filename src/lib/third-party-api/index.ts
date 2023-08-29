import { defaultHeader, newsletterBaseApi } from "../utils";

export interface IndexPostRequest {
  id_: string;
  urls: string[];
  target_audience: string;
  artifacts: string[];
}

export const indexPostRequest = async (data: IndexPostRequest) => {
  const response = await fetch(newsletterBaseApi, {
    method: "POST",
    headers: defaultHeader,
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.json();
};

export const indexMockRequest = {
  id_: "check",
  urls: [
    "https://cdotimes.com/2023/04/26/the-tucker-lemon-show/",
    "https://cdotimes.com/2023/04/25/how-to-improve-customer-experience/",
  ],
  target_audience: "analyst",
  artifacts: [
    "heading",
    "summary",
    "attention",
    "factual",
    "mcq",
    "open",
    "cliffhanger",
  ],
};

export const indexMockResponse = {
  "0": {
    attention:
      "What will be the impact of AI on society? How can we mitigate risks and maximize benefits?",
    cliffhanger:
      "Join us next week on the Tucker Lemon Show as we explore another hot topic: climate change and the role of individual responsibility. Can we find common ground to build a sustainable future? Don't miss the discussion between Tucker Carlson and Don Lemon, exclusively on TheCDOTimes.com.",
    factual: {
      answer: "What are the potential consequences of unregulated AI?",
      question: "What are the potential consequences of unregulated AI?",
    },
    heading: "The Tucker Lemon Show: Navigating the AI Revolution",
    mcq: {
      answer:
        "Don Lemon believes that AI has the potential to revolutionize various aspects of society from healthcare to transportation. We should focus on harnessing its potential for the greater good rather than jumping to dystopian conclusions.",
      options: [
        "AI will displace millions of workers, leading to economic turmoil and social unrest.",
        "Unregulated AI could be used to suppress dissent and control human freedoms.",
        "AI will create new job opportunities as well as change the employment landscape.",
        "AI poses a cybersecurity threat and could lead to AI-powered weapons on battlefields.",
      ],
      question:
        "What is Don Lemon's perspective on the potential impact of AI?",
    },
    open: "What should be the priority in regulating AI development and implementation: caution or optimism? How can we strike a balance?",
    summary:
      "Don Lemon and Tucker Carlson discuss the impact of artificial intelligence on society, including potential opportunities and challenges. They explore different perspectives and ideas while finding common ground.",
  },
  "1": {
    attention:
      "Are you struggling to improve your organization's customer experience and loyalty in today's highly competitive business landscape? Read on to learn how the customer journey mapping process can help you gain deeper insights about your customers' experiences and create a better customer experience.",
    cliffhanger:
      "Continuous improvement of the customer journey mapping process is vital to ensure a consistently exceptional customer experience. Are you ready to take your organization's customer experience to the next level?",
    factual: {
      answer:
        "What is customer journey mapping and why is it beneficial for organizations?",
      question:
        "What is customer journey mapping and why is it beneficial for organizations?",
    },
    heading:
      "How to Improve Customer Experience Using Customer Journey Mapping",
    mcq: {
      answer:
        "Businesses can create customer journey maps tailored to specific user needs, enabling targeted solutions.",
      options: [
        "Businesses can prioritize resources and efforts based on customer needs",
        "Empathy and connection with the customers",
        "Effective communication between different departments",
        "Continuous improvement of customer journey mapping",
      ],
      question:
        "What is the key benefit of identifying the job to be done for each persona in customer journey mapping efforts?",
    },
    open: "Have you ever used customer journey mapping to enhance customer satisfaction and loyalty in your organization? Share your experience with us!",
    summary:
      "Customer journey mapping is a technique that organizations can use to visualize and understand their customer's experiences as they interact with the brand across multiple touchpoints. This method helps identify areas for improvement, uncover pain points and create a better customer experience. This article provides a step-by-step guide on how to leverage the customer journey mapping approach to enhance customer satisfaction and loyalty.",
  },
};
