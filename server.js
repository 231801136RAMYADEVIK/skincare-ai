import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const API_KEY = process.env.GROQ_API_KEY;
const PORT = process.env.PORT || 5000;

console.log("🔑 API KEY:", API_KEY ? "Loaded ✅" : "Missing ❌");

app.get("/", (req,res)=>{
  res.send("Backend working");
});

app.post("/chat", async (req,res)=>{

  try{
    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method:"POST",
        headers:{
          Authorization:`Bearer ${API_KEY}`,
          "Content-Type":"application/json"
        },
        body:JSON.stringify({
          model: "llama-3.1-8b-instant",  // ✅ FINAL MODEL
          messages:[
            {
              role:"system",
              content:"You are a skincare expert. Give safe and simple advice."
            },
            {
              role:"user",
              content:req.body.message
            }
          ]
        })
      }
    );

    const data = await response.json();

    if(!data.choices){
      return res.json({
        reply:data?.error?.message || "⚠️ API error"
      });
    }

    res.json({
      reply:data.choices[0].message.content
    });

  }catch(err){
    console.log(err);
    res.json({reply:"⚠️ Server error"});
  }

});

app.listen(PORT,()=>{
  console.log("🚀 Server running on http://127.0.0.1:"+PORT);
});