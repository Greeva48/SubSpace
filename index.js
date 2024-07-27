const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(cors());

const HASURA_URL = 'http://localhost:8080/v1/graphql';
const HASURA_ADMIN_SECRET = 'myadminsecretkey';

// Endpoint to handle new transaction
app.post('/api/transactions', async (req, res) => {
  const { amount, type, name, cardNumber, expiryDate, cvv } = req.body;

  try {
    const response = await axios.post(HASURA_URL, {
      query: `
        mutation($amount: Int!, $type: String!, $name: String!, $cardNumber: String!, $expiryDate: date!, $cvv: String!) {
          insert_transactions(objects: {amount: $amount, type: $type, name: $name, card_number: $cardNumber, expiry_date: $expiryDate, cvv: $cvv}) {
            returning {
              id
            }
          }
        }
      `,
      variables: {
        amount,
        type,
        name,
        cardNumber,
        expiryDate,
        cvv,
      },
    }, {
      headers: {
        'x-hasura-admin-secret': HASURA_ADMIN_SECRET,
      },
    });

    res.json({ message: 'Transaction submitted successfully', data: response.data });
  } catch (error) {
    console.error('Error submitting transaction:', error);
    res.status(500).json({ message: 'Transaction submission failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
