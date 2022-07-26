import { Types } from 'mongoose';
import Client from '../../src/credentials/credentialModel';

const { ObjectId } = Types;
let authPromise;

export default async function getClientAuth() {
  if (!authPromise) authPromise = createClientAuth();
  return await authPromise;
}

async function createClientAuth() {
  const client = await Client.findOrCreate(
    {
      clientId: 'aa883860-862e-4a49-b149-f56371e87ebb',
    },
    {
      name: 'Apollo',
      clientSecret: '0beec7b5ea3f0fdbc95d0dd47f3c5bc275da8a33',
      userId: new ObjectId(),
    }
  );

  return {
    username: client.clientId,
    password: 'foo',
  };
}
