import { fauna } from "../../../services/fauna";
import {query as q} from 'faunadb'
import { stripe } from "../../../services/stripe";

export async function saveSubscription(
  subscriptionId: string,
  customerId:string,
  createAction = false,
){
  //buscar o usuário no banco do fauna com o Id (customerID)
  const  userRef = await fauna.query(
    q.Select(
      "ref",
      q.Get(
        q.Match(
          q.Index('user_by_stripe_customer_id'),
          customerId
        )
      )
    )
  )

  const subscription = await stripe.subscriptions.retrieve(subscriptionId)

  //salvar os dados da subscription no faunaDb
  const subscriptionData={
    id: subscription.id,
    userId: userRef,
    status:subscription.status,
    price_id:subscription.items.data[0].price.id
  }

  if(createAction){
    console.log('cheguei aki')
    await fauna.query(
      q.Create(
        q.Collection('subscriptions'),
        {data: subscriptionData}
      )
    )
  }else{
    await fauna.query(
      q.Replace(
        q.Select(
          "ref",
          q.Get(
            q.Match(
              q.Index('subscription_by_id'),
              subscriptionId
            )
          )
        ),
        {data: subscriptionData}
      )
    )
  }
}