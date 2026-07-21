import { gql } from '@apollo/client';

export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($input: CreatePaymentIntentInput!) {
    createPaymentIntent(input: $input) {
      clientSecret
      paymentIntentId
      amount
      currency
    }
  }
`;
