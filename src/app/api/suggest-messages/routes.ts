/* eslint-disable @typescript-eslint/no-unused-vars */
// import OpenAI from 'openai';
// import { NextResponse } from 'next/server';

// const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// export async function POST() {
//   try {
//     const prompt =
//       "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

//     const response = await openai.chat.completions.create({
//       model: 'gpt-3.5-turbo-instruct',
//       max_tokens: 400,
//       stream: true,
//       prompt,
//     });

//     const text = response.choices?.[0]?.message?.content ?? '';

//     return NextResponse.json({ success: true, text });
//   } catch (error) {
//     console.error('Error in suggest-messages:', error);
//   const err = error as { status?: number; message?: string; name?: string };
//   const status = err?.status ?? 500;
//   const message = err?.message ?? 'Server error';
//   const name = err?.name ?? 'Error';
//     return NextResponse.json({ success: false, message, name }, { status });
//   }
// }


import { streamText } from 'ai';
import OpenAI from 'openai';
import { NextResponse } from 'next/server';
import {StreamingTextResponse, OpenAIStream} from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});


export const runtime = 'edge';

export async function POST(req: Request) {
  // try {
  //   const prompt =
  //     "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";

  //   //Use the model name string, not the openai instance
  //   const result = await streamText({
  //     model: 'gpt-3.5-turbo-instruct', // ✅ fixed
  //               // pass your configured OpenAI client
  //     messages: [
  //       { role: 'system', content: 'You are a creative assistant.' },
  //       { role: 'user', content: prompt },
        
  //     ],
    
      
  //   });

  //   // ✅ Correct output method name
  //   return result.toTextStreamResponse();
  // } catch (error) {
  //   console.error('Error in suggest-messages:', error);
  //   return NextResponse.json({ error: String(error) }, { status: 500 });
  // }
  try {

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment.";


  const {message} =await req.json();
  
  const response = await openai.chat.completions.create({ 
    model: 'gpt-3.5-turbo',
      max_tokens: 400,
      stream: true,
      messages: [
        { role: 'user', content: prompt }
      ],
    })

      const stream = OpenAIStream(response);
      
      return new StreamingTextResponse(stream);

  } catch (error) {
    if(error instanceof OpenAI.APIError){
      const {name,status, message, headers} = error
      return NextResponse.json({ name, status, message}, { status });

    }else{
      console.error('Error in suggest-messages:', error);
      throw error
      return NextResponse.json({ error: String(error) }, { status: 500 });
      
    }
  }
}
