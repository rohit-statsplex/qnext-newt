import { defaultHeader, newsletterBaseApi } from "../utils";

export type ParsePostRequest = {
  id_: string;
  urls: string[];
  target_audience: string;
  artifacts: string[];
};

export type ParsePostResponse = {
  // artifacts?: string[] | null;
  error_code?: number;
  error_info?: string;
  // id_: string;
  // target_audience?: string;
  url: string;
  title: string;
  text: string;
}[];

export const transformParse = (data: ParsePostResponse) =>
  data.map((d) => ({
    title: !d.error_info ? d.title : "",
    text: !d.error_info ? d.text : "",
    url: !d.error_info ? d.url : "",
    error_info: d.error_info,
    error_code: d.error_code,
  }));

export const parsePostRequest = async (params: ParsePostRequest) => {
  try {
    const response = await fetch(`${newsletterBaseApi}/parse`, {
      method: "POST",
      headers: defaultHeader,
      body: JSON.stringify(params),
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    return response.json();
  } catch (error) {
    console.error("generate api:", error);
  }
};

export const parseDefaultRequest = {
  id_: "check",
  urls: [""],
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

export const parseMockResponse = [
  {
    artifacts: [
      "heading",
      "summary",
      "attention",
      "factual",
      "mcq",
      "open",
      "cliffhanger",
    ],
    authors: ["Carsten Krause"],
    id_: "check",
    images:
      "https://cdotimes.com/wp-content/uploads/2023/04/The-Tucker-Lemon-Show-Final.png",
    target_audience: "analyst",
    text: "So I thought since Don Lemmon and Tucker Carlson have now extra time on their hands after been let go by Fox and CNN that I thought it would be great to get them come together and discuss trending business and digital topics from both sides of the spectrum. The idea being that it is best for us to come together and discuss our opposing views and to find common ground. I would be happy to host them at The CDOTIMES.com and have them discuss trending topics which I think would be quite entertaining and insightful. Here is what I had ChatGPT come up with for this fictional show – Enjoy!\n\n“Episode: Navigating the AI Revolution: Opportunities and Challenges Ahead\n\n[Dynamic music intro with visuals of Don Lemon and Tucker Carlson]\n\nVoiceover: In a world where the digital space is filled with noise, two renowned journalists find themselves at a crossroads. Don Lemon and Tucker Carlson, once the faces of CNN and Fox News, have been set free, with extra time on their hands and a wealth of experience to share.\n\nCarsten Krause (on-screen): I thought it was time to bring these two titans of television together to discuss trending business and digital topics from both sides of the spectrum. The idea is simple: it’s best for us to come together, discuss our opposing views, and find common ground.\n\n[Cut to a montage of Don Lemon and Tucker Carlson in heated, yet respectful, discussions on various topics]\n\nVoiceover: Get ready for a show that will challenge your perspective and redefine the way we approach controversial issues. Welcome to the Tucker Lemon Show, where we prove that conversation can bridge the gap and bring us closer as a nation.\n\nCarsten Krause (on-screen): I’m thrilled to host Don and Tucker at TheCDOTimes.com, where their lively debates promise to be not only entertaining but also insightful. This is the beginning of a groundbreaking journey!\n\n[The intro concludes with the show’s logo and a preview of upcoming topics]\n\nVoiceover: Don’t miss the premiere episode of the Tucker Lemon Show, only on TheCDOTimes.com. Witness the power of conversation and join us as we explore the impact of artificial intelligence, climate change, and much more!\n\n[Outro music fades, end of intro]\n\n[Opening theme music plays, with the show’s logo displayed on screen]\n\nCarsten Krause (voiceover): Welcome to the Tucker Lemon Show, aired exclusively on TheCDOTimes.com, where we bring America together by discussing opposing viewpoints on critical issues. I’m your chairman, Carsten Krause. On today’s episode, we have Tucker Carlson and Don Lemon discussing the impact of artificial intelligence on society. Get ready for an engaging conversation that will challenge your perspective!\n\n[Theme music fades out]\n\n[Cut to the studio, Carsten sits between Tucker and Don]\n\nCarsten: Good evening, Tucker and Don. Today’s topic is artificial intelligence and its potential impact on society. Tucker, would you like to start with your thoughts?\n\nTucker: Thank you, Carsten. I believe artificial intelligence is a force we must be cautious of. There’s a train of thought that AI could be used by a select few to control the masses, eventually leading to a dystopian society where human freedoms are suppressed. This is a critical issue that we need to address before it’s too late.\n\nDon: While I appreciate your concerns, Tucker, I think it’s important to approach this topic with a rational and evidence-based perspective. AI has the potential to revolutionize various aspects of society, from healthcare to transportation. We should focus on harnessing its potential for the greater good rather than jumping to dystopian conclusions.\n\nTucker: If we don’t regulate AI, we’re handing over control to powerful corporations that could manipulate our lives for profit. What about surveillance, Don? AI-powered surveillance systems could lead to a loss of privacy and even be used to suppress dissent.\n\nDon: I understand your concerns, Tucker, but we must also consider the countless lives that could be improved or saved by AI advancements in healthcare and other fields. Let’s not throw away these opportunities based on fear alone.\n\nTucker: But what about job loss, Don? Many people fear that AI will displace millions of workers, leading to economic turmoil and social unrest.\n\nDon: It’s true that AI will change the employment landscape, but history shows us that technological advancements create new job opportunities as well. Our focus should be on education and retraining programs to help people adapt to these changes.\n\nTucker (with a zinger): I guess you’d be fine with AI replacing journalists too, then? Maybe we should start with our own jobs and see how that feels.\n\nDon (smirking): As long as the AI can fact-check conspiracy theories, I’m all for it.\n\n[The audience reacts with laughter, and the conversation continues]\n\nDon: We can’t forget the potential for AI in combating climate change and other global issues. AI can analyze vast amounts of data to help us find sustainable solutions.\n\nTucker: But what if AI falls into the hands of malicious actors? Cybersecurity threats could multiply, and we could be looking at a future where AI-powered weapons are deployed on battlefields.\n\nDon: It’s important to strike a balance between innovation and caution, Tucker. Investing in robust cybersecurity measures and international cooperation can help mitigate these risks.\n\nTucker: You might be a bit too trusting, Don. We’ve seen what happens when powerful technology falls into the wrong hands.\n\nDon (with a zinger): And we’ve also seen what happens when we let fear dictate our actions. Let’s not forget that progress comes with a healthy dose of optimism.\n\n[As the discussion continues, both Tucker and Don acknowledge the valid points raised by the other, demonstrating a commitment to finding common ground]\n\nCarsten: As we approach the end of the show, it’s time for your final verdicts. Tucker, what do you think we should do about AI’s impact on society?\n\nTucker: We must be cautious and vigilant, Carsten. I believe we need strict regulations to ensure that AI doesn’t fall into the wrong hands and threaten our way of life. The potential consequences are simply too dire to ignore.\n\nDon: I agree that regulation is important, but I think we should focus on promoting responsible AI development and implementation. If we approach AI with a balance of optimism and caution, we can harness its power for the betterment of society.\n\nCarsten: Thank you both for your thoughtful insights. I believe this kind of open and honest dialogue is what will bring Americans together to tackle the challenges of the future.\n\n[Closing theme music plays]\n\nCarsten (voiceover): Join us next week on the Tucker Lemon Show as we explore another hot topic: climate change and the role of individual responsibility. Can we find common ground to build a sustainable future? Don’t miss the discussion between Tucker Carlson and Don Lemon, exclusively on TheCDOTimes.com.”\n\nAgain, this obviously was a fictional episode, the statements were made up by ChatGPT and we have no affiliation with Tucker Carlson or Don Lemon.\n\nHowever, even though the conversation was fictional the challenges of how to drive successful digital transformation versus failed implementations are real.\n\nTo navigate through this evermore complex space, identifying approaches on how to successfully make digital transformation leveraging digital technology, data and artificial intelligence work for your organization we are here for you.\n\nDo you need help with your digital transformation initiatives? We provide fr",
    title: "The Tucker Lemon Show (Fictional Show)",
    url: "https://cdotimes.com/2023/04/26/the-tucker-lemon-show/",
    user_data: {
      artifacts: [
        "heading",
        "summary",
        "attention",
        "factual",
        "mcq",
        "open",
        "cliffhanger",
      ],
      id_: "check",
      target_audience: "analyst",
      urls: [
        "https://cdotimes.com/2023/04/26/the-tucker-lemon-show/",
        "https://cdotimes.com/2023/04/25/how-to-improve-customer-experience/",
      ],
    },
  },
  {
    artifacts: [
      "heading",
      "summary",
      "attention",
      "factual",
      "mcq",
      "open",
      "cliffhanger",
    ],
    authors: ["Carsten Krause"],
    id_: "check",
    images:
      "https://cdotimes.com/wp-content/uploads/2023/04/customer-experience.jpg",
    target_audience: "analyst",
    text: "The Customer Journey Mapping Process – A Detailed Guide:\n\nWeather digital of physical – customer journey mapping is a powerful technique that helps organizations visualize and understand their customers’ experiences as they interact with the brand across various touchpoints. The primary goal of this approach is to identify areas for improvement, uncover pain points, and create an enhanced customer experience.\n\nIn today’s highly competitive business landscape, understanding customer needs and expectations is vital to success. One effective way of gaining such insights is through customer journey mapping, a visual representation of the experiences customers have while interacting with a brand or product. By considering personas, or fictional representations of target customers, businesses can better understand the needs, goals, and pain points of their audience, leading to improved customer experiences and ultimately, better business performance.\n\nThe Importance of Identifying the Job to be Done when Selecting Customer Journey Mapping Topics by Persona\n\nTo maximize the effectiveness of customer journey mapping by persona, it is crucial to identify the job to be done, or the problem a customer is trying to solve with a given product or service. This article delves into the importance of this identification process and how it can greatly influence the success of customer journey mapping efforts.\n\nTargeted insights:\n\n\n\nIdentifying the job to be done helps businesses create customer journey maps tailored to specific user needs, enabling the development of targeted solutions. By understanding the customer’s underlying motivations and goals, businesses can more effectively address pain points and create opportunities for delight and satisfaction.\n\nPrioritization:\n\n\n\nBy understanding the job to be done for each persona, businesses can prioritize their resources and efforts. This enables companies to focus on the most critical aspects of the customer journey, leading to efficient use of time, energy, and resources. By concentrating on the most pressing customer needs, businesses can make the most significant impact on customer satisfaction and loyalty.\n\nEmpathy and connection:\n\n\n\nIdentifying the job to be done encourages teams to think from the customer’s perspective, leading to increased empathy and understanding. By understanding the customer’s point of view, businesses can create stronger connections with their audience and develop products or services that resonate with their needs, fostering loyalty and trust.\n\nEffective communication:\n\n\n\nRecognizing the job to be done facilitates clearer communication between different departments within a business. By providing a shared understanding of customer needs, teams can collaborate more effectively, ensuring that marketing, sales, product development, and customer support are all working towards the same goals.\n\nContinuous improvement:\n\n\n\nIdentifying the job to be done allows businesses to measure the success of their customer journey mapping efforts. By continually evaluating the customer journey and the effectiveness of the solutions implemented, companies can identify areas for further improvement, leading to ongoing optimization and increased customer satisfaction.\n\nHere is a step-by-step guide to the customer journey mapping process:\n\nDefine your objectives:\n\n\n\nBegin by outlining the specific goals you want to achieve with the customer journey mapping process. These objectives may include improving customer satisfaction, increasing customer retention, or identifying opportunities for upselling and cross-selling.\n\nIdentify your customer personas:\n\n\n\nDevelop detailed customer personas representing different segments of your target audience. Personas should be based on demographic data, psychographic information, and behavioral patterns. These personas will help you understand your customers’ needs, motivations, and preferences, allowing you to create a more tailored and relevant customer experience.\n\nMap the customer touchpoints:\n\n\n\nIdentify all the touchpoints at which your customers interact with your brand, both online and offline. Touchpoints can include social media, websites, mobile apps, email, in-store interactions, and customer support channels. It’s crucial to capture every interaction, as each one contributes to the overall customer experience.\n\nVisualize the customer journey:\n\n\n\nCreate a visual representation of the customer journey, showcasing the sequence of touchpoints and the actions taken by the customers at each stage. This map should also highlight the emotional states, expectations, and potential pain points experienced by the customers throughout the journey.\n\nAnalyze the journey and identify pain points:\n\n\n\nWith the customer journey map in place, analyze each touchpoint to identify areas where customers may experience frustration, confusion, or dissatisfaction. These pain points represent opportunities for improvement and should be prioritized based on their impact on the overall customer experience.\n\nDevelop and implement solutions:\n\n\n\nBrainstorm and design solutions to address the identified pain points, ensuring that these improvements align with your customer personas and their needs. Solutions may include process optimizations, new product features, or enhanced support services. Remember to involve cross-functional teams in the solution development process to ensure a holistic approach to customer experience improvement.\n\nMeasure the impact:\n\n\n\nMonitor the changes you have implemented to determine their impact on customer satisfaction, retention, and loyalty. Use a combination of quantitative (e.g., customer satisfaction scores, Net Promoter Score) and qualitative (e.g., customer feedback, testimonials) metrics to assess the effectiveness of your improvements.\n\nIterate and continuously improve:\n\n\n\nCustomer journey mapping is an ongoing process, as customer needs and preferences can evolve over time. Regularly update your journey maps and continue to identify and address pain points to ensure a consistently exceptional customer experience.\n\nExample journey mapping we recently did for a restaurant chain for different personas resulting in an actionable improvement roadmap:\n\nThe CDO TIMES Bottom Line:\n\nBy leveraging the customer journey mapping approach, organizations can gain a deeper understanding of their customers’ experiences, identify pain points, and develop targeted solutions to enhance customer satisfaction and loyalty. This process enables companies to continuously improve their offerings and stay ahead in the competitive market landscape.\n\n",
    title: "How to Improve Customer Experience",
    url: "https://cdotimes.com/2023/04/25/how-to-improve-customer-experience/",
    user_data: {
      artifacts: [
        "heading",
        "summary",
        "attention",
        "factual",
        "mcq",
        "open",
        "cliffhanger",
      ],
      id_: "check",
      target_audience: "analyst",
      urls: [
        "https://cdotimes.com/2023/04/26/the-tucker-lemon-show/",
        "https://cdotimes.com/2023/04/25/how-to-improve-customer-experience/",
      ],
    },
  },
];
