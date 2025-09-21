import Stripe from 'stripe';
import express from 'express';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const app = express();

app.post('/webhook', express.raw({type:'application/json'}), (req,res)=>{
  const sig = req.headers['stripe-signature'];
  let event;
  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err){
    console.error(err);
    return res.sendStatus(400);
  }
  if(event.type === 'checkout.session.completed'){
    const session = event.data.object;
    // Update user profile in Supabase
    console.log('Checkout completed for', session.customer_email);
  }
  res.send();
});

app.listen(3000, ()=>console.log('Webhook listening'));